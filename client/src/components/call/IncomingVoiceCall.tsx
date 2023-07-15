import { useChatContext } from "../../pages/Chat";
import { IncomingVoiceCallType } from "../../types";
import { Avatar, Button, Flex, Text } from "@chakra-ui/react";

type Props = {
  incomingVoiceCall: NonNullable<IncomingVoiceCallType>;
};

export default function IncomingVoiceCall({ incomingVoiceCall }: Props) {
  const { setCurrentChatUser, setVoiceCall, setIncomingVoiceCall, socket } =
    useChatContext();
  const acceptCall = () => {
    setCurrentChatUser({
      username: incomingVoiceCall.name,
      id: incomingVoiceCall.id,
    });
    setVoiceCall({
      ...incomingVoiceCall,
      type: "in-coming",
    });
    socket.current?.emit("accept-incoming-call", { id: incomingVoiceCall.id });
    setIncomingVoiceCall(undefined);
  };
  const rejectCall = () => {
    socket.current?.emit("reject-video-call", { from: incomingVoiceCall.id });
    setIncomingVoiceCall(undefined);
  };
  return (
    <Flex
      h={24}
      w={80}
      position={"fixed"}
      bottom={8}
      mb={0}
      right={6}
      zIndex={50}
      borderRadius={"lg"}
      gap={5}
      align={"center"}
      justify={"start"}
      p={4}
      bg={"brand.700"}
      boxShadow={"xl"}
      color={"brand.200"}
      border={"2px solid brand.200"}
      py={14}
    >
      <Avatar
        src={incomingVoiceCall.profilePicture}
        name={incomingVoiceCall.name}
      />
      <Flex flexDir={"column"}>
        <Text>{incomingVoiceCall.name}</Text>
        <Text>Incoming Voice Call</Text>
        <Flex gap={2}>
          <Button color={"white"} bg={"green.400"} onClick={acceptCall}>
            Accept
          </Button>
          <Button color={"white"} bg={"red.400"} onClick={rejectCall}>
            Reject
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
