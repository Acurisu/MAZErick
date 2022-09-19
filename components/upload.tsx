import { Anchor, Group, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone/";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons";
import { Dispatch, SetStateAction } from "react";

interface UploadProps {
  setMaze: Dispatch<SetStateAction<FileWithPath | undefined>>;
}

export function Upload({ setMaze }: UploadProps) {
  const theme = useMantineTheme();

  return (
    <>
      <Text size="xl" align="center">
        Upload a maze to start solving it.
      </Text>
      <Text size="md" color="dimmed" align="center">
        Your image will be processed <strong>solely</strong> in your browser and{" "}
        <strong>not</strong> sent anywhere.
      </Text>
      <Text size="sm" color="dimmed" align="center">
        An example of a maze can be found{" "}
        <Anchor href="./maze.png">here</Anchor>.
      </Text>

      <Dropzone
        onDrop={(files) => setMaze(files[0])}
        multiple={false}
        accept={IMAGE_MIME_TYPE}
        mt={theme.spacing.sm}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 220, pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              size={50}
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                ]
              }
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size={50}
              stroke={1.5}
              color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={50} stroke={1.5} />
          </Dropzone.Idle>

          <Text size="xl" inline>
            Drag your image of a maze here
          </Text>
        </Group>
      </Dropzone>
    </>
  );
}
