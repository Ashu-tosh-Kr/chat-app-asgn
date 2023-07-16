import { Divider, Flex, Text, useBoolean } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import ContactsList from "./ContactsList";
import { useChatContext } from "../../../pages/Chat";

type Props = {};

export default function ChatSidebar({}: Props) {
  const { setGroupChat } = useChatContext();
  const [isContactOpen, setContactOpen] = useBoolean();
  return (
    <Flex w="30%" borderLeftRadius={"lg"} flexDir={"column"}>
      {isContactOpen ? (
        <ContactsList setContactOpen={setContactOpen} />
      ) : (
        <>
          <ChatListHeader setContactOpen={setContactOpen} />
          <>
            <Flex
              position={"relative"}
              cursor={"pointer"}
              align={"center"}
              _hover={{ bg: "brand.700" }}
              gap={2}
              my={2}
              onClick={() => setGroupChat(true)}
            >
              <Flex
                flexDir={"column"}
                justify={"space-between"}
                color={"brand.200"}
                m={4}
              >
                <Text>#Everybody</Text>
              </Flex>
            </Flex>
            <Divider borderColor={"brand.500"} />
          </>
          <SearchBar />
          <ChatList />
        </>
      )}
    </Flex>
  );
}
