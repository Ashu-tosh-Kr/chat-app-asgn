import { Box, Flex, Text } from "@chakra-ui/react";
import { useGetMessages } from "../../../api/message/messageHooks";
import { User } from "../../../types";
import { useChatContext } from "../../../pages/Chat";
import { calculateTime } from "../../../utils/CalculateTime";
import MessageStatus from "./MessageStatus";

export default function ChatBody() {
  const { currentChatUser } = useChatContext();
  const user: User = JSON.parse(localStorage.getItem("user")!);

  const { messages } = useGetMessages({
    sender: user.id,
    receiver: currentChatUser?.id!,
  });

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
        overflow={"hidden"}
      />
      <Flex
        flexDir={"column"}
        w={"full"}
        h={"full"}
        overflow={"auto"}
        justify={"end"}
        gap={1}
        zIndex={1}
        p={4}
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
