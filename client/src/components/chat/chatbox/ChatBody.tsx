import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useGetMessages } from "../../../api/message/messageHooks";
import {
  ChatContextTypeInsideChatContainer,
  Message,
  User,
} from "../../../types";
import { useChatContext } from "../../../pages/Chat";
import { calculateTime } from "../../../utils/CalculateTime";
import MessageStatus from "./MessageStatus";
import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import VoiceMessage from "./VoiceMessage";

export default function ChatBody() {
  const { currentChatUser, socket } =
    useChatContext() as ChatContextTypeInsideChatContainer;
  const user: User = JSON.parse(localStorage.getItem("user")!);
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement | null>(null);

  const { messages, isLoading } = useGetMessages({
    sender: user.id,
    receiver: currentChatUser.id,
  });

  useEffect(() => {
    socket.current?.on("message-received", (data: Message) => {
      queryClient.setQueryData(["getMessages", data.sender], (old: any) => {
        if (!old) return { messages: [data] };
        return {
          messages: [...old.messages, data],
        };
      });
    });

    return () => {
      socket.current?.off("message-received");
    };
  }, [socket.current]);

  //auto scroll to bottom
  const scrollToLast = () => {
    const lastChildElement = ref.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToLast();
  }, [messages]);

  if (isLoading)
    return (
      <Flex flexGrow={1} pos={"relative"}>
        <Box
          backgroundImage="url(/chat-bg.png)"
          opacity={0.1}
          left={0}
          top={0}
          backgroundAttachment={"fixed"}
          position={"absolute"}
          w={"full"}
          h={"full"}
        />
      </Flex>
    );

  return (
    <Flex flexGrow={1} pos={"relative"} h={"full"} overflowY={"auto"}>
      <Box
        backgroundImage="url(/chat-bg.png)"
        opacity={0.1}
        left={0}
        top={0}
        backgroundAttachment={"fixed"}
        position={"absolute"}
        w={"full"}
        h={"full"}
      />
      <Flex
        flexDir={"column"}
        w={"full"}
        h={"100%"}
        gap={1}
        zIndex={1}
        p={4}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#D4D4FF",
            borderRadius: "24px",
          },
        }}
        overflowY={"auto"}
        ref={ref}
      >
        {messages?.messages?.map((message) => (
          <Flex
            flexDir={"column"}
            key={message.id}
            alignSelf={message.sender === user.id ? "flex-end" : "flex-start"}
            bg={
              message.message === "Don't Spam! 😡"
                ? "red.800"
                : message.sender === user.id
                ? "brand.500"
                : "brand.600"
            }
            minW={"10rem"}
            borderRadius={"lg"}
            maxW={"45%"}
            wordBreak={"break-word"}
            px={2}
            pt={1}
            boxShadow={"lg"}
          >
            {message.type === "text" && (
              <Text color={"brand.200"}>{message.message}</Text>
            )}
            {message.type === "image" && (
              <Image
                h={message.message === "" ? "2rem" : "auto"}
                src={
                  message.message === ""
                    ? "./clock-svgrepo-com.svg"
                    : `${import.meta.env.VITE_SERVER_URL}/${message.message}`
                }
                borderRadius={"lg"}
              />
            )}
            {message.type === "audio" && <VoiceMessage message={message} />}
            <Flex justify={"right"} align={"center"}>
              <Text color={"brand.200"} opacity={0.7} fontSize={"2xs"}>
                {calculateTime(message.createdAt)}
              </Text>
              <MessageStatus message={message} />
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
