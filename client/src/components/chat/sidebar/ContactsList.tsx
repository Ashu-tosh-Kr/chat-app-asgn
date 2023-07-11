import { Box, Flex, Text } from "@chakra-ui/react";
import { useAllUsers } from "../../../api/user/userHooks";
import { BiArrowBack } from "react-icons/bi";
import ChatListItem from "./ChatListItem";

type Props = {
  setContactOpen: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
};

export default function ContactsList({ setContactOpen }: Props) {
  const { allUsers, isLoading } = useAllUsers();
  if (isLoading || allUsers === undefined) return <></>;

  return (
    <Flex flexDir={"column"} h="full" px={3} py={4} color={"brand.200"}>
      <Flex align={"center"} gap={4} p={2}>
        <Box fontSize={"2xl"}>
          <BiArrowBack cursor="pointer" onClick={setContactOpen.off} />
        </Box>
        <Text> New Chat</Text>
      </Flex>
      <Flex
        flexDir={"column"}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#D4D4FF",
            borderRadius: "24px",
          },
        }}
        overflowY={"auto"}
      >
        {Object.entries(allUsers).map(([initialLetter, userList]) => {
          return (
            <div key={initialLetter}>
              <Box pl={5} py={3}>
                {initialLetter}
              </Box>
              {userList.map((user) => (
                <ChatListItem user={user} isContactPage={true} key={user.id} />
              ))}
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
}
