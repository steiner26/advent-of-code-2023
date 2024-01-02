class Coordinate {
  static UP = new Coordinate(0, -1, 'UP');
  static DOWN = new Coordinate(0, 1, 'DOWN');
  static LEFT = new Coordinate(-1, 0, 'LEFT');
  static RIGHT = new Coordinate(1, 0, 'RIGHT');
  static order = ['RIGHT', 'UP', 'LEFT', 'DOWN'];

  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name ?? `${x},${y}`;
  }

  add(other) {
    return new Coordinate(this.x + other.x, this.y + other.y);
  }

  angle(direction) {
    const indexThis = Coordinate.order.indexOf(this.name);
    const indexOther = Coordinate.order.indexOf(
      typeof direction === 'string' ? direction : direction.name,
    );

    if (indexThis === -1 || indexOther === -1) {
      return null;
    }

    return (indexOther - indexThis + 4) % 4;
  }

  rotate(angle) {
    const newIndex = (Coordinate.order.indexOf(this.name) + angle) % 4;
    return Coordinate[Coordinate.order[newIndex]];
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

module.exports = Coordinate;
