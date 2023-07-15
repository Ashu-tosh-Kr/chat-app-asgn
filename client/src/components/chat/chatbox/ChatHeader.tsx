import { useState, useEffect } from "react";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { useChatContext } from "../../../pages/Chat";
import { ChatContextTypeInsideChatContainer } from "../../../types";

type Props = {};

export default function ChatHeader({}: Props) {
  const { socket, currentChatUser, setVoiceCall, setVideoCall } =
    useChatContext() as ChatContextTypeInsideChatContainer;
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    socket.current?.on("is-user-online", (data: string[]) => {
      if (data.includes(currentChatUser.id)) {
        setIsOnline(true);
      } else setIsOnline(false);
    });

    return () => {
      socket.current?.off("message-received");
    };
  }, [socket.current]);

  const handleVoiceCall = () => {
    setVoiceCall({
      ...currentChatUser,
      type: "out-going",
      callType: "voice",
      roomId: Date.now(),
    });
  };

  const handleVideoCall = () => {
    setVideoCall({
      ...currentChatUser,
      type: "out-going",
      callType: "video",
      roomId: Date.now(),
    });
  };
  return (
    <Flex
      px={4}
      py={3}
      justify={"space-between"}
      align={"center"}
      h={16}
      zIndex={10}
      bg={"brand.500"}
      boxShadow={"lg"}
      borderTopRightRadius={"lg"}
    >
      <Flex gap={2}>
        <Avatar
          src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${currentChatUser?.username}`}
        />
        <Flex flexDir={"column"}>
          <Text fontWeight={"bold"}>{currentChatUser?.username}</Text>
          <Text fontSize={"sm"} color={isOnline ? "green.400" : "red.400"}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </Flex>
      </Flex>
      <Flex fontSize={"2xl"} gap={6}>
        <MdCall cursor={"pointer"} onClick={handleVoiceCall} />
        <Box color={"red.400"}>
          <IoVideocam
            cursor={"pointer"}
            color={"red.50"}
            onClick={handleVideoCall}
          />
        </Box>
        <BiSearchAlt2 cursor={"pointer"} />
        <BsThreeDotsVertical cursor={"pointer"} />
      </Flex>
    </Flex>
  );
}
