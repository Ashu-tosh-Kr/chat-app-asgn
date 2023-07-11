import { Box, Divider, Flex } from "@chakra-ui/react";
import ChatSidebar from "../components/chat/sidebar/ChatSidebar";
import WelcomeRobo from "../components/chat/WelcomeRobo";
import ChatContainer from "../components/chat/chatbox/ChatContainer";

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
    >
      <Box
        backgroundImage="url(/chat-bg.png)"
        opacity={0.1}
        backgroundAttachment={"fixed"}
        position={"absolute"}
        w={"full"}
        h={"full"}
      />
      <Flex
        boxShadow={"lg"}
        w="100%"
        h="100%"
        bg={"brand.700"}
        borderRadius={"lg"}
        overflow={"hidden"}
        zIndex={1}
      >
        <ChatSidebar />
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
