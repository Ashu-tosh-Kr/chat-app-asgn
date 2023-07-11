import { Flex } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";

type Props = {};

export default function ChatSidebar({}: Props) {
  return (
    <Flex w="30%" borderLeftRadius={"lg"} flexDir={"column"}>
      <ChatListHeader />
      <SearchBar />
      <ChatList />
    </Flex>
  );
}
