import {
  Avatar,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { BsThreeDotsVertical, BsFillChatLeftTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
type Props = {
  setContactOpen: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
};

export default function ChatListHeader({ setContactOpen }: Props) {
  const user = JSON.parse(localStorage.getItem("user")!);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Flex
      h={16}
      px={4}
      py={3}
      justify={"space-between"}
      align={"center"}
      bg={"brand.500"}
      borderTopLeftRadius={"lg"}
    >
      <Popover placement="left">
        <PopoverTrigger>
          <Avatar
            cursor={"pointer"}
            src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${user.username}`}
          />
        </PopoverTrigger>
        <PopoverContent
          bg={"brand.700"}
          color={"brand.200"}
          w={28}
          onClick={handleLogout}
        >
          <PopoverBody cursor={"pointer"}>Log Out</PopoverBody>
        </PopoverContent>
      </Popover>
      <Flex color="brand.200" gap={6} position={"relative"}>
        <BsFillChatLeftTextFill
          cursor="pointer"
          onClick={setContactOpen.on}
          title="New Chat"
        />

        <BsThreeDotsVertical cursor="pointer" title="Menu" />
      </Flex>
      {/* </Flex> */}
    </Flex>
  );
}
