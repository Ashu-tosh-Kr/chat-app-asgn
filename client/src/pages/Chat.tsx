import { Box, Divider, Flex } from "@chakra-ui/react";
import ChatSidebar from "../components/chat/sidebar/ChatSidebar";
import WelcomeRobo from "../components/chat/WelcomeRobo";
import ChatContainer from "../components/chat/chatbox/ChatContainer";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { User, VideoCallType, VoiceCallType } from "../types";
import io, { Socket } from "socket.io-client";
import VoiceCall from "../components/call/VoiceCall";
import VideoCall from "../components/call/VideoCall";

const ChatContext = createContext<{
  currentChatUser?: User;
  setCurrentChatUser: (user: User) => void;
  socket: React.MutableRefObject<Socket | null>;
  videoCall: VideoCallType;
  setVoiceCall: (videoCall: VoiceCallType) => void;
  voiceCall: VoiceCallType;
  setVideoCall: (voiceCall: VideoCallType) => void;
}>({
  currentChatUser: undefined,
  setCurrentChatUser: () => {},
  socket: { current: null },
  videoCall: {},
  setVoiceCall: () => {},
  voiceCall: {},
  setVideoCall: () => {},
});
export const useChatContext = () => useContext(ChatContext);

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user")!);
  const [currentChatUser, setCurrentChatUser] = useState<User>();
  const [videoCall, setVideoCall] = useState<VideoCallType>();
  // const [incomingVideoCall, setIncomingVideoCall] = useState<VideoCallType>();
  // const [incomingVoiceCall, setIncomingVoiceCall] = useState<VideoCallType>();
  const [voiceCall, setVoiceCall] = useState<VoiceCallType>();

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
      value={{
        currentChatUser,
        setCurrentChatUser,
        socket,
        videoCall,
        voiceCall,
        setVoiceCall,
        setVideoCall,
      }}
    >
      {videoCall && <VideoCall />}
      {voiceCall && <VoiceCall />}
      {!videoCall && !voiceCall && (
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
            {currentChatUser === undefined ? (
              <WelcomeRobo />
            ) : (
              <ChatContainer />
            )}
          </Flex>
        </Flex>
      )}
    </ChatContext.Provider>
  );
}
