import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { User } from "../../../types";
import { useChatContext } from "../../../pages/Chat";

type Props = {
  user: User;
  isContactPage: boolean;
};

export default function ChatListItem({ user, isContactPage = false }: Props) {
  const { setCurrentChatUser } = useChatContext();
  return (
    <>
      <Flex
        cursor={"pointer"}
        align={"center"}
        _hover={{ bg: "brand.700" }}
        gap={2}
        my={2}
        onClick={() => setCurrentChatUser(user)}
      >
        <Avatar
          src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${user.username}`}
          name={user.username}
        />
        <Flex flexDir={"column"} justify={"space-between"}>
          <Text>{user.username}</Text>
        </Flex>
      </Flex>
      <Divider borderColor={"brand.500"} />
    </>
  );
}
