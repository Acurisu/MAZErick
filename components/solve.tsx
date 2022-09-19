import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useRef, useState } from "react";
import { decolor, drawImage, drawStar } from "../util/image";
import { bfs } from "../util/search";
import { Canvas } from "./canvas";

interface SolverProps {
  img: FileWithPath;
  pwColor: PWColor;
  morphs: Morph[];
  nextStep(): void;
  prevStep(): void;
}

export function Solve({
  img,
  pwColor,
  morphs,
  nextStep,
  prevStep,
}: SolverProps) {
  const theme = useMantineTheme();
  const [path, setPath] = useState<Path>({
    start: undefined,
    end: undefined,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const button = buttonRef.current;

    const image = new Image();
    image.src = URL.createObjectURL(img);
    if (canvas && ctx) {
      if (button) {
        button.onclick = () => {
          const a = document.createElement("a");
          a.download = "maze.png";
          a.href = canvas.toDataURL("image/png");
          a.click();
          nextStep();
        };
      }

      image.onload = () => {
        const loc = drawImage(ctx, image);

        const imageData = ctx.getImageData(loc[0], loc[1], loc[2], loc[3]);
        const data = imageData.data;

        if (!pwColor.path || !pwColor.wall || !data) {
          console.error("Step 1 must be completed first");
          return;
        }

        const bounding = canvas.getBoundingClientRect();

        canvas.onclick = (ev) =>
          setPath({
            start: [
              Math.floor(ev.clientX - bounding.left - loc[0]),
              Math.floor(ev.clientY - bounding.top - loc[1]),
            ],
            end: path.end,
          });
        canvas.oncontextmenu = (ev) => {
          ev.preventDefault();
          setPath({
            start: path.start,
            end: [
              Math.floor(ev.clientX - bounding.left - loc[0]),
              Math.floor(ev.clientY - bounding.top - loc[1]),
            ],
          });
        };

        decolor(pwColor.path, pwColor.wall, 0x66, data);
        for (let morph of morphs) {
          morph.op(loc[2], loc[3], data, morph.iterations);
        }

        if (path.start) {
          if (path.end) {
            bfs(path.start, path.end, loc[2], loc[3], data);
          }
          drawStar(
            path.start[0],
            path.start[1],
            loc[2],
            data,
            new Uint8ClampedArray([0x6c, 0xd4, 0xed])
          );
        }

        if (path.end) {
          drawStar(
            path.end[0],
            path.end[1],
            loc[2],
            data,
            new Uint8ClampedArray([0x6c, 0xd4, 0xed])
          );
        }

        ctx.putImageData(imageData, loc[0], loc[1]);
      };
    }
  }, [path]);

  return (
    <>
      <Canvas canvasRef={canvasRef} />
      <Text size="xl" align="center">
        Left click your start and right click your end position.
      </Text>
      <Text size="md" color="dimmed" align="center">
        Keep in mind that this operation is expensive so be patient with your
        device.
      </Text>
      <Text size="sm" color="dimmed" align="center">
        The bright path shows what is explored by the algorithm.
      </Text>

      <Group position="center" my={theme.spacing.sm}>
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button variant="gradient" ref={buttonRef}>
          Download
        </Button>
      </Group>
    </>
  );
}
