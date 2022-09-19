export function drawImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
): [number, number, number, number] {
  const ratio = Math.min(
    Math.min(ctx.canvas.width / image.width, ctx.canvas.height / image.height),
    1
  );

  const posX = (ctx.canvas.width - image.width * ratio) / 2;
  const posY = (ctx.canvas.height - image.height * ratio) / 2;
  let width = Math.floor(image.width * ratio);
  let height = Math.floor(image.height * ratio);

  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    posX,
    posY,
    width,
    height
  );

  return [posX, posY, ++width, ++height];
}

export function selectColor(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  event: MouseEvent
): Color {
  const bounding = canvas.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;
  return ctx.getImageData(x, y, 1, 1).data;
}

function distance2(c1: Color, c2: Color): number {
  return (
    Math.pow(c2[0] - c1[0], 2) +
    Math.pow(c2[1] - c1[1], 2) +
    Math.pow(c2[2] - c1[2], 2)
  );
}

function setValue(
  x: number,
  y: number,
  width: number,
  data: Uint8ClampedArray,
  color: Color
) {
  const i = (x + y * width) * 4;
  data[i] = color[0];
  data[i + 1] = color[1];
  data[i + 2] = color[2];
}

export function drawStar(
  x: number,
  y: number,
  width: number,
  data: Uint8ClampedArray,
  color: Color
) {
  for (let dx = -1; dx <= 1; ++dx) {
    for (let dy = -1; dy <= 1; ++dy) {
      setValue(x + dx, y + dy, width, data, color);
    }
  }

  setValue(x + 2, y, width, data, color);
  setValue(x - 2, y, width, data, color);
  setValue(x, y + 2, width, data, color);
  setValue(x, y - 2, width, data, color);
}

function getBValue(
  x: number,
  y: number,
  width: number,
  height: number,
  data: Uint8ClampedArray,
  padding: boolean
): boolean {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return padding;
  }

  const i = (x + y * width) * 4;
  return data[i] == 0x1a;
}

export function decolor(
  path: Color,
  wall: Color,
  alpha: number,
  data: Uint8ClampedArray
) {
  for (let i = 0; i < data.length; i += 4) {
    const c = data.slice(i, i + 3);
    if (distance2(path, c) < distance2(wall, c)) {
      data[i] = 0x0b;
      data[i + 1] = 0x45;
      data[i + 2] = 0x67;
      data[i + 3] = alpha;
    } else {
      data[i] = 0x1a;
      data[i + 1] = 0x1b;
      data[i + 2] = 0x1e;
      data[i + 3] = 0xff;
    }
  }
}

const KERNEL_SIZE = 3 >> 1;

export function erode(
  width: number,
  height: number,
  data: Uint8ClampedArray,
  iterations: number
) {
  while (iterations) {
    const res = new Uint8ClampedArray(data);
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        let val = true;
        for (let dy = -KERNEL_SIZE; dy <= KERNEL_SIZE; ++dy) {
          for (let dx = -KERNEL_SIZE; dx <= KERNEL_SIZE; ++dx) {
            val &&= getBValue(x + dx, y + dy, width, height, res, true);
          }
        }

        const i = (x + y * width) * 4;
        if (!val) {
          data[i] = 0x0b;
          data[i + 1] = 0x45;
          data[i + 2] = 0x67;
        }
      }
    }
    --iterations;
  }
}

export function dilate(
  width: number,
  height: number,
  data: Uint8ClampedArray,
  iterations: number
) {
  while (iterations) {
    const res = new Uint8ClampedArray(data);
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        let val = false;
        for (let dy = -KERNEL_SIZE; dy <= KERNEL_SIZE; ++dy) {
          for (let dx = -KERNEL_SIZE; dx <= KERNEL_SIZE; ++dx) {
            val ||= getBValue(x + dx, y + dy, width, height, res, false);
          }
        }

        const i = (x + y * width) * 4;
        if (val) {
          data[i] = 0x1a;
          data[i + 1] = 0x1b;
          data[i + 2] = 0x1e;
        }
      }
    }
    --iterations;
  }
}

export function open(
  width: number,
  height: number,
  data: Uint8ClampedArray,
  iterations: number
) {
  erode(width, height, data, iterations);
  dilate(width, height, data, iterations);
}

export function close(
  width: number,
  height: number,
  data: Uint8ClampedArray,
  iterations: number
) {
  dilate(width, height, data, iterations);
  erode(width, height, data, iterations);
}
