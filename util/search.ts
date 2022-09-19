function isPath(
  x: number,
  y: number,
  width: number,
  height: number,
  data: Uint8ClampedArray
) {
  return (
    0 <= x &&
    x < width &&
    0 <= y &&
    y < height &&
    data[(x + y * width) * 4] != 0x1a
  );
}

export function bfs(
  start: Coord,
  end: Coord,
  width: number,
  height: number,
  data: Uint8ClampedArray
) {
  var queue = [start];
  const parents: any = {};

  let node;
  while ((node = queue.shift())) {
    const cX = node[0];
    const cY = node[1];
    if (cX == end[0] && cY == end[1]) {
      let parent = parents[`${cX},${cY}`];
      while (parent[0] != start[0] || parent[1] != start[1]) {
        const i = (parent[0] + parent[1] * width) * 4;
        data[i] = 0xff;
        data[i + 1] = 0x92;
        data[i + 2] = 0x2b;
        parent = parents[`${parent[0]},${parent[1]}`];
      }
      return;
    }

    for (let dx = -1; dx <= 1; ++dx) {
      for (let dy = -1; dy <= 1; ++dy) {
        const x = cX + dx;
        const y = cY + dy;
        if (!parents[`${x},${y}`] && isPath(x, y, width, height, data)) {
          queue.push([x, y]);
          parents[`${x},${y}`] = [cX, cY];
          const i = (x + y * width) * 4;
          data[i + 3] = 0xff;
        }
      }
    }
  }
}
