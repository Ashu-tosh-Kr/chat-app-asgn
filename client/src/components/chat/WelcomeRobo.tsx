import Robot from "../../assets/robot.gif";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import Logo from "../../assets/logo.png";

export default function Welcome() {
  const userName = JSON.parse(localStorage.getItem("user") as string).username;

  return (
    <Flex
      flexDir={"column"}
      justify={"center"}
      align={"center"}
      color={"brand.200"}
      w="70%"
      pos={"relative"}
    >
      <Box
        backgroundImage="url(/chat-bg.png)"
        opacity={0.1}
        left={0}
        top={0}
        backgroundAttachment={"fixed"}
        position={"absolute"}
        w={"full"}
        h={"full"}
        overflow={"hidden"}
      />
      <Image h={"20rem"} src={Robot} alt="" />
      <Heading>
        <Image
          src={Logo}
          alt={"Logo"}
          width={25}
          height={25}
          display={"inline-block"}
          mr={1}
        />
        Welcome,{" "}
        <Text display="inline" color={"White"}>
          {userName}!
        </Text>
      </Heading>
      <h3>Please select a chat to Start messaging.</h3>
    </Flex>
  );
}
