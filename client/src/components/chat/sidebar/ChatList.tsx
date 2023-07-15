import { Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { useGetInitialContacts } from "../../../api/message/messageHooks";
import ChatListItem from "./ChatListItem";

type Props = {};

export default function ChatList({}: Props) {
  const { data, isLoading } = useGetInitialContacts();
  if (isLoading) {
    return (
      <>
        {[1, 2, 3, 4].map(() => (
          <Flex align={"center"} gap={2} padding="6">
            <SkeletonCircle borderRadius={"50%"} size="12" />
            <SkeletonText
              w="80%"
              noOfLines={2}
              spacing="4"
              skeletonHeight="2"
            />
          </Flex>
        ))}
      </>
    );
  }

  return (
    <Flex
      flexDir={"column"}
      p={2}
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
      {data.map((chatItm: any, i: number) => {
        return (
          <div key={i}>
            <ChatListItem
              user={chatItm[1].user}
              key={chatItm[0]}
              lastMsg={
                chatItm[1].messages[0].type === "text"
                  ? chatItm[1].messages[0].message
                  : chatItm[1].messages[0].type
              }
              unreadCount={chatItm[1].unreadCount}
            />
          </div>
        );
      })}
    </Flex>
  );
}
