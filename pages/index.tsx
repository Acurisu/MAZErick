import { Stack, Title } from "@mantine/core";
import type { NextPage } from "next";
import { Wrapper } from "../components/wrapper";

const Home: NextPage = () => {
  return (
    <Stack justify="center" align="center">
      <Title>MAZErick</Title>
      <Wrapper />
    </Stack>
  );
};

export default Home;
