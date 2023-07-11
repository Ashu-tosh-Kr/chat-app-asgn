import { Avatar, Flex } from "@chakra-ui/react";
import { BsThreeDotsVertical, BsFillChatLeftTextFill } from "react-icons/bs";
type Props = {};

export default function ChatListHeader({}: Props) {
  const user = JSON.parse(localStorage.getItem("user")!);

  return (
    <Flex
      h={16}
      px={4}
      py={3}
      justify={"space-between"}
      align={"center"}
      bg={"brand.500"}
    >
      <Avatar
        src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${user.username}`}
      />
      <Flex color="brand.200" gap={6}>
        <BsFillChatLeftTextFill title="New Chat" />
        <BsThreeDotsVertical title="Menu" />
      </Flex>
      {/* </Flex> */}
    </Flex>
  );
}
