import confetti from "canvas-confetti";

interface FireOpts {
  origin?: {
    x?: number;
    y?: number;
  };
  count?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
}

interface Fire {
  (particleRatio: number, opts: FireOpts): void;
}

export function createConfetti(defaults: FireOpts): Fire {
  return function fire(particleRatio: number, opts: FireOpts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(opts.count * particleRatio),
      })
    );
  };
}

export function fireAway(fire: Fire, count: number) {
  fire(0.25, {
    spread: 26,
    count,
    startVelocity: 55,
  });
  fire(0.2, {
    count,
    spread: 60,
  });
  fire(0.35, {
    count,
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    count,
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    count,
    spread: 120,
    startVelocity: 45,
  });
}
