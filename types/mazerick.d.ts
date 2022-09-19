type Color = Uint8ClampedArray;

interface PWColor {
  path: Color | undefined;
  wall: Color | undefined;
}

interface Morph {
  id: number;
  name: string;
  icon: TablerIcon;
  description: string;
  iterations: number;
  op: (
    width: number,
    height: number,
    data: Uint8ClampedArray,
    iterations: number
  ) => void;
}

type Coord = [number, number];

interface Path {
  start: Coord | undefined;
  end: Coord | undefined;
}
