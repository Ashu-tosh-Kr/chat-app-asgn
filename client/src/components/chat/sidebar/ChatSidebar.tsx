import { Flex, useBoolean } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import ContactsList from "./ContactsList";

type Props = {};

export default function ChatSidebar({}: Props) {
  const [isContactOpen, setContactOpen] = useBoolean();
  return (
    <Flex w="30%" borderLeftRadius={"lg"} flexDir={"column"}>
      {isContactOpen ? (
        <ContactsList setContactOpen={setContactOpen} />
      ) : (
        <>
          <ChatListHeader setContactOpen={setContactOpen} />
          <SearchBar />
          <ChatList />
        </>
      )}
    </Flex>
  );
}
