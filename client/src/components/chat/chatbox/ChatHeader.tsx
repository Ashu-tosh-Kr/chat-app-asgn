import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { useChatContext } from "../../../pages/Chat";

type Props = {};

export default function ChatHeader({}: Props) {
  const { currentChatUser } = useChatContext();
  return (
    <Flex
      px={4}
      py={3}
      justify={"space-between"}
      align={"center"}
      h={16}
      zIndex={10}
      bg={"brand.500"}
    >
      <Flex gap={2}>
        <Avatar
          src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${currentChatUser.username}`}
        />
        <Flex flexDir={"column"}>
          <Text fontWeight={"bold"}>{currentChatUser?.username}</Text>
          <Text fontSize={"sm"} color={"brand.300"}>
            Online/Offline
          </Text>
        </Flex>
      </Flex>
      <Flex fontSize={"2xl"} gap={6}>
        <MdCall cursor={"pointer"} />
        <Box color={"red.400"}>
          <IoVideocam cursor={"pointer"} color={"red.50"} />
        </Box>
        <BiSearchAlt2 cursor={"pointer"} />
        <BsThreeDotsVertical cursor={"pointer"} />
      </Flex>
    </Flex>
  );
}
