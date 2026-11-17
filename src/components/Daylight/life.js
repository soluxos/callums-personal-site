// What goes on in the room from moment to moment, apart from the sun: the wind in the oak, and
// the gusts a fast scroll or a moving pointer stirs up; the blinds opening as the page arrives; birds
// going past by day; the lamp coming on at dusk. `update` moves it all on by `dt` seconds, and the
// room reads the fields it leaves behind. With `still` (reduced motion) nothing moves on its own:
// the blinds start open and the lamp just comes on.

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const random = (min, max) => min + Math.random() * (max - min);

export class Life {
  time = 0;
  age = 0;
  gust = 0;
  wind = 1;
  reveal = 0;
  still = false;
  birds = [];
  nextFlock = random(5, 9);
  lamp = 0;
  lampOn = false;
  lampFor = 0;

  // `progress` is where the page is in the day, in sections; `push` how hard the visitor is
  // scrolling or moving the pointer, 0 to 1; `windowWidth` how wide the window is.
  update(dt, { progress, push, still, windowWidth }) {
    this.still = still;
    this.age += dt;

    // A push is a gust: it rises quickly and dies away slowly.
    this.gust += (push - this.gust) * (1 - Math.exp(-dt * (push > this.gust ? 8 : 0.9)));
    if (!still) this.time += dt * (1 + 0.8 * this.gust);
    const t = this.time;
    // How far the oak's branches and leaves move. The resting breeze is a little stronger than the
    // room's original (1.4 against 1), and it rises and falls slowly so the tree is never quite still.
    this.wind = still ? 0 : 1.4 + 1.6 * this.gust + 0.22 * Math.sin(t * 0.13) + 0.14 * Math.sin(t * 0.31 + 1.7);
    this.reveal = still ? 1 : clamp(this.age / 1.6);

    this.updateBirds(dt, progress < 4.6 && !still, windowWidth / 2);
    this.updateLamp(dt, progress > 4.55, still);
  }

  // Now and then a robin crosses the window, or two, one chasing the other. Each is given where
  // it crosses the window, across it from the middle and up it, as the light sees it.
  updateBirds(dt, daytime, reach) {
    this.nextFlock -= dt;
    if (daytime && this.nextFlock <= 0) {
      this.nextFlock = random(16, 40);
      const dir = Math.random() < 0.5 ? 1 : -1;
      const count = Math.random() < 0.25 ? 2 : 1;
      const y = random(-3.8, -1.2);
      const speed = random(9, 12);
      for (let i = 0; i < count; i++) {
        this.birds.push({
          x: -dir * (reach + 2 + i * random(1.2, 2.2)),
          y: y + random(-0.5, 0.5),
          dir,
          speed: speed * random(0.95, 1.05),
          scale: random(0.55, 0.75),
          beat: random(0, 2 * Math.PI),
          rate: random(8, 10) * 2 * Math.PI,
          gliding: false,
          left: random(0.2, 0.7),
          climb: 0,
          fold: 0,
        });
      }
    }
    for (const bird of this.birds) {
      bird.x += bird.dir * bird.speed * dt;
      // Bounding flight: a burst of wingbeats that lifts it a little, then a moment with its
      // wings folded in that lets it sink.
      bird.left -= dt;
      if (bird.left <= 0) {
        bird.gliding = !bird.gliding;
        bird.left = bird.gliding ? random(0.15, 0.3) : random(0.35, 0.7);
      }
      if (bird.gliding) bird.beat += (Math.round(bird.beat / Math.PI) * Math.PI - bird.beat) * (1 - Math.exp(-dt * 14));
      else bird.beat += bird.rate * dt;
      bird.fold += ((bird.gliding ? 1 : 0) - bird.fold) * (1 - Math.exp(-dt * 16));
      bird.climb += ((bird.gliding ? -0.9 : 0.5) - bird.climb) * (1 - Math.exp(-dt * 4));
      bird.y += bird.climb * dt;
      bird.size = bird.dir * bird.scale;
    }
    this.birds = this.birds.filter((bird) => bird.dir * bird.x < reach + 3).slice(0, 4);
  }

  // The lamp comes on as dusk falls, with a flicker and a moment to warm up, and goes off again
  // if the visitor scrolls back into the day.
  updateLamp(dt, on, still) {
    if (on !== this.lampOn) {
      this.lampOn = on;
      this.lampFor = 0;
    }
    this.lampFor += dt;
    if (!on) this.lamp = Math.max(0, this.lamp - dt * 8);
    else if (still) this.lamp = 1;
    else {
      const s = this.lampFor;
      const flicker = s < 0.07 ? 0.9 : s < 0.16 ? 0.12 : s < 0.22 ? 0.75 : 1;
      this.lamp = flicker * (1 - Math.exp(-s * 10));
    }
  }
}
