import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";

export class Model {
  constructor(callback) {
    this.callback = callback;
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
    this.observers = [];
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        let nextState = Array.from(new Array(this.height), () =>
          Array.from(new Array(this.width), () => CELL_STATES.NONE)
        );
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            nextState[i][j] = this.state[i][j];
          }
        }
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            // TODO implement Game of life logic
            if (
              this.state[i][j] === CELL_STATES.ALIVE &&
              nbAlive !== 2 &&
              nbAlive !== 3
            ) {
              nextState[i][j] = CELL_STATES.DEAD;
            } else if (nbAlive === 3) {
              nextState[i][j] = CELL_STATES.ALIVE;
            }
          }
        }
        this.state = nextState;
        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    // TODO
    this.stop();
    this.init();
    this.updated();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[x][y] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    // TODO
    if (this.isCellAlive(x, y + 1)) {
      number++;
    }
    if (this.isCellAlive(x - 1, y + 1)) {
      number++;
    }
    if (this.isCellAlive(x + 1, y + 1)) {
      number++;
    }
    if (this.isCellAlive(x, y - 1)) {
      number++;
    }
    if (this.isCellAlive(x - 1, y - 1)) {
      number++;
    }
    if (this.isCellAlive(x + 1, y - 1)) {
      number++;
    }
    if (this.isCellAlive(x + 1, y)) {
      number++;
    }
    if (this.isCellAlive(x - 1, y)) {
      number++;
    }
    return number;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const removeIndex = this.observers.findIndex(obs => {
      return observer === obs;
    });
    if (removeIndex !== -1) {
      this.observers = this.observers.slice(removeIndex, 1);
    }
  }

  notify(data) {
    if (this.observers.length > 0) {
      this.observers.forEach(observer => observer.update(data));
    }
  }
  updated() {
    // TODO update the view
    this.callback(this);
  }
}
