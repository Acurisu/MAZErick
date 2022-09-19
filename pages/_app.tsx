import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";

function Mazerick({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        colorScheme: "dark",
        colors: {
          vibrant: [
            "#89dff0",
            "#6cd4ed",
            "#4ec8e9",
            "#31bae6",
            "#1aa8dc",
            "#168ebf",
            "#1374a2",
            "#0f5c85",
            "#0b4567",
            "#08304a",
          ],
          muted: [
            "#ad95a6",
            "#a587a2",
            "#9a799d",
            "#8a6b95",
            "#77608a",
            "#64567f",
            "#524c73",
            "#424267",
            "#383f5b",
            "#2f3b4e",
          ],
        },
        primaryColor: "vibrant",
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default Mazerick;
