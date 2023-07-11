import Robot from "../../assets/robot.gif";
import { Flex, Heading, Image, Text } from "@chakra-ui/react";

export default function Welcome() {
  const userName = JSON.parse(localStorage.getItem("user") as string).username;

  return (
    <Flex
      flexDir={"column"}
      justify={"center"}
      align={"center"}
      color={"brand.200"}
      w="70%"
    >
      <Image h={"20rem"} src={Robot} alt="" />
      <Heading>
        Welcome,
        <Text display="inline" color={"White"}>
          {userName}!
        </Text>
      </Heading>
      <h3>Please select a chat to Start messaging.</h3>
    </Flex>
  );
}
