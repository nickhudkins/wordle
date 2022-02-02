import confetti from "canvas-confetti";

interface ConfettiOpts {
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

interface Confetti {
  (particleRatio: number, opts: ConfettiOpts): void;
}

export function createConfetti(defaults: ConfettiOpts): Confetti {
  return function fire(particleRatio: number, opts: ConfettiOpts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(opts.count * particleRatio),
      })
    );
  };
}

export function realisticConfetti(doConfetti: Confetti, count: number) {
  doConfetti(0.25, {
    spread: 26,
    count,
    startVelocity: 55,
  });
  doConfetti(0.2, {
    count,
    spread: 60,
  });
  doConfetti(0.35, {
    count,
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  doConfetti(0.1, {
    count,
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  doConfetti(0.1, {
    count,
    spread: 120,
    startVelocity: 45,
  });
}
