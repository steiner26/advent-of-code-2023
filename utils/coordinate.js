class Coordinate {
  static UP = Coordinate(0, -1);
  static DOWN = Coordinate(0, 1);
  static LEFT = Coordinate(-1, 0);
  static RIGHT = Coordinate(1, 0);

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return Coordinate(this.x + other.x, this.y + other.y);
  }
}

module.exports = Coordinate;
