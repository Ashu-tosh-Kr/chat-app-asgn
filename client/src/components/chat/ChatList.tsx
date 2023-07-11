import { Flex, List } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";

type Props = {};

export default function ChatList({}: Props) {
  return (
    <Flex w="30%" borderLeftRadius={"lg"} flexDir={"column"}>
      <ChatListHeader />
      <SearchBar />
      <List />
    </Flex>
  );
}
