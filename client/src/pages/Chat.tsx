import { Box, Divider, Flex } from "@chakra-ui/react";
import ChatSidebar from "../components/chat/sidebar/ChatSidebar";
import WelcomeRobo from "../components/chat/WelcomeRobo";
import ChatContainer from "../components/chat/chatbox/ChatContainer";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { User } from "../types";
import io, { Socket } from "socket.io-client";

const ChatContext = createContext<{
  currentChatUser?: User;
  setCurrentChatUser: (user: User) => void;
  socket: React.MutableRefObject<Socket | null>;
}>({
  currentChatUser: undefined,
  setCurrentChatUser: () => {},
  socket: { current: null },
});
export const useChatContext = () => useContext(ChatContext);

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user")!);
  const [currentChatUser, setCurrentChatUser] = useState<User>();

  // Socket
  const socket = useRef<Socket | null>(null);
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.emit("user-online", user.id);

    return () => {
      socket.current?.disconnect();
    };
  }, [user]);

  return (
    <ChatContext.Provider
      value={{ currentChatUser, setCurrentChatUser, socket }}
    >
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
        <Flex
          boxShadow={"lg"}
          w="100%"
          h="100%"
          bg={"brand.700"}
          borderRadius={"lg"}
          zIndex={1}
        >
          <ChatSidebar />
          <Divider borderColor={"brand.500"} orientation="vertical" />
          {currentChatUser === undefined ? <WelcomeRobo /> : <ChatContainer />}
        </Flex>
      </Flex>
    </ChatContext.Provider>
  );
}
