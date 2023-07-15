import { useChatContext } from "../../pages/Chat";
import { IncomingVideoCallType } from "../../types";
import { Avatar, Button, Flex, Text } from "@chakra-ui/react";

type Props = {
  incomingVideoCall: NonNullable<IncomingVideoCallType>;
};

export default function IncomingVideoCall({ incomingVideoCall }: Props) {
  const { setVideoCall, setIncomingVideoCall, setCurrentChatUser, socket } =
    useChatContext();
  const acceptCall = () => {
    setCurrentChatUser({
      username: incomingVideoCall.name,
      id: incomingVideoCall.id,
    });
    setVideoCall({
      ...incomingVideoCall,
      type: "in-coming",
    });
    socket.current?.emit("accept-incoming-call", { id: incomingVideoCall.id });
    setIncomingVideoCall(undefined);
  };
  const rejectCall = () => {
    socket.current?.emit("reject-video-call", { from: incomingVideoCall.id });
    setIncomingVideoCall(undefined);
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
        src={incomingVideoCall.profilePicture}
        name={incomingVideoCall.name}
      />
      <Flex flexDir={"column"}>
        <Text>{incomingVideoCall.name}</Text>
        <Text>Incoming Video Call</Text>
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
