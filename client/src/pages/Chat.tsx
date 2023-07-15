import { Box, Divider, Flex } from "@chakra-ui/react";
import ChatSidebar from "../components/chat/sidebar/ChatSidebar";
import WelcomeRobo from "../components/chat/WelcomeRobo";
import ChatContainer from "../components/chat/chatbox/ChatContainer";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  ChatContextType,
  IncomingVideoCallType,
  IncomingVoiceCallType,
  User,
  VideoCallType,
  VoiceCallType,
} from "../types";
import io, { Socket } from "socket.io-client";
import VoiceCall from "../components/call/VoiceCall";
import VideoCall from "../components/call/VideoCall";
import IncomingVoiceCall from "../components/call/IncomingVoiceCall";
import IncomingVideoCall from "../components/call/IncomingVideoCall";

const ChatContext = createContext<ChatContextType>({
  currentChatUser: undefined,
  setCurrentChatUser: () => {},
  socket: { current: null },
  setVoiceCall: () => {},
  setVideoCall: () => {},
  setIncomingVideoCall: () => {},
  setIncomingVoiceCall: () => {},
});
export const useChatContext = () => useContext(ChatContext);

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user")!);
  const [currentChatUser, setCurrentChatUser] =
    useState<Pick<User, "id" | "username">>();
  const [videoCall, setVideoCall] = useState<VideoCallType>();
  const [incomingVideoCall, setIncomingVideoCall] =
    useState<IncomingVideoCallType>();
  const [incomingVoiceCall, setIncomingVoiceCall] =
    useState<IncomingVoiceCallType>();
  const [voiceCall, setVoiceCall] = useState<VoiceCallType>();

  // Socket
  const socket = useRef<Socket | null>(null);
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SERVER_URL);

    socket.current.emit("user-online", user.id);

    socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
      setIncomingVoiceCall({ ...from, roomId, callType });
    });
    socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
      setIncomingVideoCall({ ...from, roomId, callType });
    });

    socket.current.on("voice-call-rejected", () => {
      setIncomingVoiceCall(undefined);
      setIncomingVideoCall(undefined);
      setVoiceCall(undefined);
      setVideoCall(undefined);
    });

    socket.current.on("video-call-rejected", () => {
      setIncomingVoiceCall(undefined);
      setIncomingVideoCall(undefined);
      setVoiceCall(undefined);
      setVideoCall(undefined);
    });

    // socket.current.on('accept-incoming-call', ({ id }) => {
    //   const sendUserSocket=
    // })
    const handleTabClose = () => {
      socket.current?.emit("user-offline", user.id);
    };
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      socket.current?.disconnect();
    };
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        currentChatUser,
        setCurrentChatUser,
        socket,
        setVoiceCall,
        setVideoCall,
        setIncomingVideoCall,
        setIncomingVoiceCall,
      }}
    >
      {incomingVideoCall && (
        <IncomingVideoCall incomingVideoCall={incomingVideoCall} />
      )}
      {incomingVoiceCall && (
        <IncomingVoiceCall incomingVoiceCall={incomingVoiceCall} />
      )}
      {videoCall && <VideoCall videoCall={videoCall} />}
      {voiceCall && <VoiceCall voiceCall={voiceCall} />}
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
            {!currentChatUser ? <WelcomeRobo /> : <ChatContainer />}
          </Flex>
        </Flex>
      )}
    </ChatContext.Provider>
  );
}
