import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { decolor, drawImage, selectColor } from "../util/image";
import { Canvas } from "./canvas";

interface DecolorProps {
  img: FileWithPath;
  pwColor: PWColor;
  setPWColor: Dispatch<SetStateAction<PWColor>>;
  nextStep(): void;
}

export function Decolor({ img, pwColor, setPWColor, nextStep }: DecolorProps) {
  const theme = useMantineTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const image = new Image();
    image.src = URL.createObjectURL(img);
    if (canvas && ctx) {
      image.onload = () => {
        const loc = drawImage(ctx, image);

        const imageData = ctx.getImageData(loc[0], loc[1], loc[2], loc[3]);
        const data = imageData.data;

        canvas.onclick = (ev) =>
          setPWColor({
            path: selectColor(canvas, ctx, ev),
            wall: pwColor.wall,
          });
        canvas.oncontextmenu = (ev) => {
          ev.preventDefault();
          setPWColor({
            path: pwColor.path,
            wall: selectColor(canvas, ctx, ev),
          });
        };

        if (pwColor.path && pwColor.wall) {
          decolor(pwColor.path, pwColor.wall, 0xff, data);
        }

        ctx.putImageData(imageData, loc[0], loc[1]);
      };
    }
  }, [pwColor]);

  return (
    <>
      <Canvas canvasRef={canvasRef} />
      <Text size="xl" align="center">
        Select the walkable path using left click and the wall using right
        click.
      </Text>
      <Text size="md" color="dimmed" align="center">
        Use the clear button to reset the image and do this until there is a
        clear distinction between the path (blue) and the walls (grey).
        <br />
        <strong>The lines do not need to be perfect.</strong>
      </Text>
      <Group position="center" mt={theme.spacing.sm}>
        <Button
          variant="outline"
          onClick={() =>
            setPWColor({
              path: undefined,
              wall: undefined,
            })
          }
        >
          Clear
        </Button>
        <Button
          disabled={!(pwColor.path && pwColor.wall)}
          variant="gradient"
          onClick={nextStep}
        >
          Next
        </Button>
      </Group>
    </>
  );
}
