class Coordinate {
  static UP = new Coordinate(0, -1, 'UP');
  static DOWN = new Coordinate(0, 1, 'DOWN');
  static LEFT = new Coordinate(-1, 0, 'LEFT');
  static RIGHT = new Coordinate(1, 0, 'RIGHT');

  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name ?? `${x},${y}`;
  }

  add(other) {
    return new Coordinate(this.x + other.x, this.y + other.y);
  }
}

module.exports = Coordinate;
