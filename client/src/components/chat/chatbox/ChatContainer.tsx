import { Flex } from "@chakra-ui/react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import MessageBar from "./MessageBar";

type Props = {};

export default function ChatContainer({}: Props) {
  return (
    <Flex w="70%" color={"brand.200"} flexDir={"column"}>
      <ChatHeader />
      <ChatBody />
      <MessageBar />
    </Flex>
  );
}
