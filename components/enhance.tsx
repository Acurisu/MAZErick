import {
  Group,
  Text,
  createStyles,
  useMantineTheme,
  Center,
  Container,
  Button,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { UseListStateHandlers } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { decolor, drawImage } from "../util/image";
import { Canvas } from "./canvas";

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.dark[5]}`,
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
    backgroundColor: theme.colors.dark[5],
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  itemMuted: {
    backgroundColor: theme.colors.muted[6],
    border: `1px solid ${theme.colors.muted[6]}`,
  },
}));

interface EnhanceProps {
  img: FileWithPath;
  pwColor: PWColor;
  morphs: Morph[];
  morphHandlers: UseListStateHandlers<Morph>;
  nextStep(): void;
  prevStep(): void;
}

export function Enhance({
  img,
  pwColor,
  morphs,
  morphHandlers,
  nextStep,
  prevStep,
}: EnhanceProps) {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();

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

        if (!pwColor.path || !pwColor.wall || !data) {
          console.error("Step 1 must be completed first");
          return;
        }

        decolor(pwColor.path, pwColor.wall, 0xff, data);
        for (let morph of morphs) {
          morph.op(loc[2], loc[3], data, morph.iterations);
        }

        ctx.putImageData(imageData, loc[0], loc[1]);
      };
    }
  }, [morphs]);

  const items = morphs.map((item, index) => (
    <Draggable key={item.name} index={index} draggableId={item.name}>
      {(provided, snapshot) => (
        <div
          onClick={() => {
            morphHandlers.applyWhere(
              (it) => it.id == item.id,
              (it) => {
                return { ...it, iterations: it.iterations + 1 };
              }
            );
          }}
          onContextMenu={(ev) => {
            morphHandlers.applyWhere(
              (it) => it.id == item.id,
              (it) => {
                ev.preventDefault();
                return { ...it, iterations: Math.max(0, it.iterations - 1) };
              }
            );
          }}
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
            [classes.itemMuted]: item.iterations != 0,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Center sx={{ width: 60 }}>{item.icon}</Center>
          <Group position="apart" sx={{ width: "100%" }}>
            <div>
              <Text>{item.name}</Text>
              <Text color="dimmed" size="sm">
                {item.description}
              </Text>
            </div>
            <div>
              <Text size="sm">Iterations</Text>
              <Text color="dimmed" size="xs" align="center">
                {item.iterations}
              </Text>
            </div>
          </Group>
        </div>
      )}
    </Draggable>
  ));

  return (
    <>
      <Canvas canvasRef={canvasRef} />
      <Text size="xl" align="center">
        Drag and drop different morphological operators to make the distinction
        more clear.
      </Text>
      <Text size="md" color="dimmed" align="center">
        Left click to increase and right click to decrease the amount of
        iterations. <br />
        <strong>Make sure that there are no gaps between walls.</strong>
      </Text>

      <Group position="center" my={theme.spacing.sm}>
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button variant="gradient" onClick={nextStep}>
          Next
        </Button>
      </Group>

      <DragDropContext
        onDragEnd={({ destination, source }) =>
          morphHandlers.reorder({
            from: source.index,
            to: destination?.index || 0,
          })
        }
      >
        <Container size="xs">
          <Droppable droppableId={`dnd-list`} direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Container>
      </DragDropContext>
    </>
  );
}
