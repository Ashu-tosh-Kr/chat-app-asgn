import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { User } from "../../../types";
import { useChatContext } from "../../../pages/Chat";
import { calculateTime } from "../../../utils/CalculateTime";
import { useEffect, useRef } from "react";

function calculateColor(value: string) {
  // Assign the available colors
  const colors = [
    "red.400",
    "green.400",
    "orange.400",
    "yellow.400",
    "purple.400",
  ];

  // Calculate the hash value of the input string
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash += value.charCodeAt(i);
  }

  // Map the hash value to an index within the colors array
  const index = hash % colors.length;

  // Return the color corresponding to the index
  return colors[index];
}

export default function ChatBody() {
  const { socket } = useChatContext();
  const user: User = JSON.parse(localStorage.getItem("user")!);
  const ref = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState([
    {
      id: "",
      message: "",
      createdAt: 123456789,
      type: "text",
      sender: "",
      receiver: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.current?.emit("join-everybody");
    socket.current?.on("everybody-msg-history", (data: any) => {
      setMessages(data);
      setIsLoading(false);
    });
    socket.current?.on("everybody-msg-received", (data: any) => {
      setMessages((msg) => {
        if (msg) return [...msg, data];
        else return [data];
      });
    });

    return () => {
      socket.current?.off("everybody-msg-received");
      socket.current?.off("everybody-msg-history");
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
        {messages?.map((message: any, i: number) => (
          <Flex
            flexDir={"column"}
            key={i}
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
            {message.sender !== user.id && (
              <Text color={calculateColor(message.senderName)}>
                {message.senderName}
              </Text>
            )}
            <Text color={"brand.200"}>{message.message}</Text>

            <Flex justify={"right"} align={"center"}>
              <Text color={"brand.200"} opacity={0.7} fontSize={"2xs"}>
                {calculateTime(message.createdAt)}
              </Text>
              {/* <MessageStatus message={message} /> */}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
