import { Box, Flex, Text } from "@chakra-ui/react";
import { useGetMessages } from "../../../api/message/messageHooks";
import { User } from "../../../types";
import { useChatContext } from "../../../pages/Chat";
import { calculateTime } from "../../../utils/CalculateTime";
import MessageStatus from "./MessageStatus";
import { useEffect } from "react";
import { useQueryClient } from "react-query";

export default function ChatBody() {
  const { currentChatUser, socket } = useChatContext();
  const user: User = JSON.parse(localStorage.getItem("user")!);
  const queryClient = useQueryClient();

  const { messages, isLoading } = useGetMessages({
    sender: user.id,
    receiver: currentChatUser?.id!,
  });

  useEffect(() => {
    socket.current?.on("message-received", (data) => {
      console.log("data", data);

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
      >
        {messages?.messages?.map((message) => (
          <Flex
            flexDir={"column"}
            key={message.id}
            alignSelf={message.sender === user.id ? "flex-end" : "flex-start"}
            bg={message.sender === user.id ? "brand.500" : "brand.600"}
            minW={"10rem"}
            borderRadius={"lg"}
            maxW={"45%"}
            wordBreak={"break-word"}
            px={1}
            boxShadow={"lg"}
          >
            {message.type === "text" && (
              <Text color={"brand.200"} px={2} pt={2}>
                {message.message}
              </Text>
            )}
            <Flex justify={"right"} align={"center"}>
              <Text color={"brand.200"} opacity={0.7} p={1} fontSize={"2xs"}>
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
