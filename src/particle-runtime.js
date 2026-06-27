(function () {
  function clear(particles) {
    particles.length = 0;
  }

  function createBurst(pos, color, options = {}, spriteInfo = {}, random = Math.random) {
    const count = options.count || 14;
    const particleType = options.particleType;
    const particleSprite = options.particleSprite || (options.food ? "attack" : null);
    const particleTier = options.particleTier || 1;
    const imageSrc = spriteInfo.src;
    const foodParticles = Boolean(options.food && imageSrc);
    const particles = [];
    for (let i = 0; i < count; i += 1) {
      const angle = random() * Math.PI * 2;
      const speedScale = options.speedScale || 1;
      const lifeScale = options.lifeScale || 1;
      const minSpeed = (options.speedMin || (foodParticles ? 95 : 45)) * speedScale;
      const maxSpeed = (options.speedMax || (foodParticles ? 250 : 135)) * speedScale;
      const speed = minSpeed + random() * Math.max(0, maxSpeed - minSpeed);
      const size = options.size || (foodParticles ? (options.sizeMin || 20) + random() * ((options.sizeMax || 38) - (options.sizeMin || 20)) : 6);
      const life = (options.life || (foodParticles ? 0.62 + random() * 0.24 : 0.45)) * lifeScale;
      particles.push({
        x: pos.x + (random() - 0.5) * (options.spread || 10),
        y: pos.y + (random() - 0.5) * (options.spread || 10),
        vx: foodParticles ? Math.cos(angle) * speed : (random() - 0.5) * 120,
        vy: foodParticles ? Math.sin(angle) * speed - 32 : (random() - 0.7) * 120,
        age: 0,
        life,
        maxLife: life,
        color,
        imageSrc,
        imageCacheKind: spriteInfo.cacheKind,
        particleType,
        particleTier,
        particleSprite,
        foodParticles,
        suppressFallback: Boolean(options.suppressFallback),
        size,
        rotation: random() * Math.PI * 2,
        spin: (random() < 0.5 ? -1 : 1) * (5 + random() * 8),
        gravity: foodParticles ? 70 + random() * 45 : 220,
      });
    }
    return particles;
  }

  function update(particles, step) {
    particles.forEach((particle) => {
      particle.life -= step;
      particle.age = (particle.age || 0) + step;
      particle.x += particle.vx * step;
      particle.y += particle.vy * step;
      particle.rotation += (particle.spin || 0) * step;
      particle.vx *= Math.max(0, 1 - step * (particle.foodParticles ? 1.4 : 0.35));
      particle.vy *= Math.max(0, 1 - step * (particle.foodParticles ? 1.1 : 0.1));
      particle.vy += (particle.gravity || 220) * step;
    });
    return particles.filter((particle) => particle.life > 0);
  }

  function frame(particle) {
    const alpha = Math.max(0, particle.life / (particle.maxLife || 0.45));
    return {
      alpha,
      size: (particle.size || 24) * (0.75 + alpha * 0.35),
    };
  }

  window.FoodAnimalsParticleRuntime = {
    clear,
    createBurst,
    frame,
    update,
  };
})();
