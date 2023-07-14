import { useState } from "react";
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useChatContext } from "../../pages/Chat";
import { VideoCallType, VoiceCallType } from "../../types";
import { MdOutlineCallEnd } from "react-icons/md";

type Props = {
  data: VideoCallType | VoiceCallType;
};

export default function CallContainer({ data }: Props) {
  const { currentChatUser, setVideoCall, setVoiceCall } = useChatContext();
  const [callAccepted, setCallAccepted] = useState();

  const endCall = () => {
    setVideoCall(undefined);
    setVoiceCall(undefined);
  };

  return (
    <Flex
      h="100vh"
      w="100vw"
      color={"brand.200"}
      flexDir={"column"}
      bgColor="brand.700"
      justify={"space-evenly"}
      align={"center"}
    >
      <Box
        backgroundImage="url(/chat-bg.png)"
        opacity={0.1}
        backgroundAttachment={"fixed"}
        position={"absolute"}
        w={"100vw"}
        h={"100vh"}
      />
      <Flex
        m={10}
        flexDir={"column"}
        justify={"space-between"}
        align={"center"}
      >
        <Heading>{currentChatUser?.username}</Heading>
        <Text>
          {callAccepted && data?.callType !== "video"
            ? "On Going Call"
            : "Calling"}
        </Text>
      </Flex>
      {(!callAccepted || data?.callType === "voice") && (
        <Avatar
          src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${currentChatUser?.username}`}
          h={"20rem"}
          w={"20rem"}
          name={currentChatUser?.username}
        />
      )}
      <Flex
        bg={"red.400"}
        justify={"center"}
        align={"center"}
        borderRadius={"50%"}
        h={16}
        w={16}
        zIndex={1}
        fontSize={"2xl"}
        onClick={endCall}
        cursor={"pointer"}
      >
        <MdOutlineCallEnd />
      </Flex>
    </Flex>
  );
}
