import { useState } from "react";
import { Stepper, Text, useMantineTheme } from "@mantine/core";
import {
  IconPalette,
  IconRuler,
  IconUpload,
  IconWand,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconCircle,
  IconCircleDotted,
} from "@tabler/icons";
import { Upload } from "./upload";
import { FileWithPath } from "@mantine/dropzone";
import { Decolor } from "./decolor";
import { Enhance } from "./enhance";
import { useListState } from "@mantine/hooks";
import { close, dilate, erode, open } from "../util/image";
import { Solve } from "./solve";

const data: Morph[] = [
  {
    id: 0,
    name: "Erode",
    icon: <IconArrowsMinimize />,
    description: "Thins the walls",
    iterations: 0,
    op: erode,
  },
  {
    id: 1,
    name: "Dilate",
    icon: <IconArrowsMaximize />,
    description: "Thickens the walls",
    iterations: 0,
    op: dilate,
  },
  {
    id: 2,
    name: "Open",
    icon: <IconCircleDotted />,
    description: "Erodes then dilates",
    iterations: 0,
    op: open,
  },
  {
    id: 3,
    name: "Close",
    icon: <IconCircle />,
    description: "Dilates then erodes",
    iterations: 0,
    op: close,
  },
];

export function Wrapper() {
  const theme = useMantineTheme();
  const [active, setActive] = useState(0);
  const [maze, setMaze] = useState<FileWithPath | undefined>(undefined);
  const [pwColor, setPWColor] = useState<PWColor>({
    path: undefined,
    wall: undefined,
  });
  const [morphs, morphHandlers] = useListState(data);

  const nextStep = () =>
    setActive((current: number) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current: number) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Stepper active={active} breakpoint="sm" sx={{ width: `75vw` }}>
        <Stepper.Step
          icon={<IconUpload />}
          label="Upload"
          description="Upload the maze"
        >
          <Upload
            setMaze={(file) => {
              setMaze(file);
              nextStep();
            }}
          />
        </Stepper.Step>
        <Stepper.Step
          icon={<IconPalette />}
          label="Decolor"
          description="Define walls and path"
        >
          {maze && (
            <Decolor
              img={maze}
              pwColor={pwColor}
              setPWColor={setPWColor}
              nextStep={nextStep}
            />
          )}
        </Stepper.Step>
        <Stepper.Step
          icon={<IconRuler />}
          label="Enhance"
          description="Close gaps in edges"
        >
          {maze && (
            <Enhance
              img={maze}
              pwColor={pwColor}
              morphs={morphs}
              morphHandlers={morphHandlers}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
        </Stepper.Step>
        <Stepper.Step
          icon={<IconWand />}
          label="Solve"
          description="Find path from start to end"
        >
          {maze && (
            <Solve
              img={maze}
              pwColor={pwColor}
              morphs={morphs}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
        </Stepper.Step>
        <Stepper.Completed>
          <Text size="xl" align="center">
            Thanks for using MAZErick.
          </Text>
          <Text size="md" color="dimmed" align="center">
            Your download should begin shortly.
          </Text>
        </Stepper.Completed>
      </Stepper>
    </>
  );
}
