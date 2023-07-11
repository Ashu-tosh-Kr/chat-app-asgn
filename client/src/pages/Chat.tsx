import { Box, Divider, Flex } from "@chakra-ui/react";
import ChatSidebar from "../components/chat/sidebar/ChatSidebar";
import WelcomeRobo from "../components/chat/WelcomeRobo";
import ChatContainer from "../components/chat/chatbox/ChatContainer";
import { createContext, useContext, useState } from "react";
import { User } from "../types";

const ChatContext = createContext<{
  currentChatUser?: User;
  setCurrentChatUser: (user: User) => void;
}>({ currentChatUser: undefined, setCurrentChatUser: () => {} });
export const useChatContext = () => useContext(ChatContext);

export default function Chat() {
  const [currentChatUser, setCurrentChatUser] = useState<User>();
  return (
    <Flex
      bg={"brand.600"}
      p={8}
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
      <ChatContext.Provider value={{ currentChatUser, setCurrentChatUser }}>
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
          {currentChatUser === undefined ? <WelcomeRobo /> : <ChatContainer />}
        </Flex>
      </ChatContext.Provider>
    </Flex>
  );
}
