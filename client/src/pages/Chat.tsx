import { Box, Divider, Flex } from "@chakra-ui/react";
import ChatList from "../components/chat/ChatList";
import WelcomeRobo from "../components/chat/WelcomeRobo";
import ChatContainer from "../components/chat/ChatContainer";

type Props = {};

export default function Chat({}: Props) {
  return (
    <Flex
      bg={"brand.600"}
      p={5}
      w="100vw"
      h="100vh"
      justify={"center"}
      align={"center"}
      zIndex={-2}
    >
      <Box
        backgroundImage="url(/chat-bg.png)"
        opacity={0.1}
        backgroundAttachment={"fixed"}
        position={"absolute"}
        w={"full"}
        h={"full"}
        zIndex={-1}
      />
      <Flex
        boxShadow={"lg"}
        w="100%"
        h="100%"
        bg={"brand.700"}
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        <ChatList />
        <Divider borderColor={"brand.500"} orientation="vertical" />
        {/* {currentChat === undefined ? ( */}
        {/* <WelcomeRobo /> */}
        {/* ) : ( */}
        <ChatContainer />
        {/* )} */}
      </Flex>
    </Flex>
  );
}
