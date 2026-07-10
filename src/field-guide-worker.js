self.onmessage = async (event) => {
  const { id, bitmap, tolerance = 22 } = event.data || {};
  if (!id || !bitmap) return;

  try {
    const width = bitmap.width;
    const height = bitmap.height;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const keyColor = [data[0], data[1], data[2]];
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let readIndex = 0;
    let writeIndex = 0;

    const enqueue = (pixelIndex) => {
      if (visited[pixelIndex]) return;
      const dataIndex = pixelIndex * 4;
      if (
        data[dataIndex + 3] <= 0 ||
        Math.abs(data[dataIndex] - keyColor[0]) > tolerance ||
        Math.abs(data[dataIndex + 1] - keyColor[1]) > tolerance ||
        Math.abs(data[dataIndex + 2] - keyColor[2]) > tolerance
      ) {
        return;
      }
      visited[pixelIndex] = 1;
      queue[writeIndex] = pixelIndex;
      writeIndex += 1;
    };

    for (let x = 0; x < width; x += 1) {
      enqueue(x);
      enqueue((height - 1) * width + x);
    }
    for (let y = 0; y < height; y += 1) {
      enqueue(y * width);
      enqueue(y * width + width - 1);
    }

    while (readIndex < writeIndex) {
      const pixelIndex = queue[readIndex];
      readIndex += 1;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      if (x > 0) enqueue(pixelIndex - 1);
      if (x + 1 < width) enqueue(pixelIndex + 1);
      if (y > 0) enqueue(pixelIndex - width);
      if (y + 1 < height) enqueue(pixelIndex + width);
    }

    for (let index = 0; index < visited.length; index += 1) {
      if (visited[index]) data[index * 4 + 3] = 0;
    }
    context.putImageData(imageData, 0, 0);
    const blob = await canvas.convertToBlob({ type: "image/webp", quality: 0.92 });
    self.postMessage({ id, blob });
  } catch (error) {
    self.postMessage({ id, error: String(error) });
  }
};
