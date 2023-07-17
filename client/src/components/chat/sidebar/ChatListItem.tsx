import { Avatar, Badge, Divider, Flex, Text } from "@chakra-ui/react";
import { User } from "../../../types";
import { useChatContext } from "../../../pages/Chat";

type Props = {
  user: User;
  isContactPage?: boolean;
  lastMsg?: string;
  unreadCount?: number;
};

export default function ChatListItem({
  user,
  lastMsg,
  unreadCount,
  isContactPage = false,
}: Props) {
  const { setCurrentChatUser, setGroupChat } = useChatContext();

  return (
    <>
      <Flex
        position={"relative"}
        cursor={"pointer"}
        align={"center"}
        _hover={{ bg: "brand.700" }}
        gap={2}
        my={2}
        onClick={() => {
          setCurrentChatUser(user);
          setGroupChat(false);
        }}
      >
        <Avatar
          src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${user.username}`}
          name={user.username}
        />
        <Flex flexDir={"column"} justify={"space-between"} color={"brand.200"}>
          <Text>{user.username}</Text>
          {!isContactPage && <Text fontSize={"sm"}>{lastMsg}</Text>}
        </Flex>
        {unreadCount && (
          <Badge
            position={"absolute"}
            right={2}
            bottom={2}
            colorScheme="purple"
          >
            {unreadCount}
          </Badge>
        )}
      </Flex>
      <Divider borderColor={"brand.500"} />
    </>
  );
}
