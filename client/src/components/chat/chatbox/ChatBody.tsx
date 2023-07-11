import { Box, Flex } from "@chakra-ui/react";

type Props = {};

export default function ChatBody({}: Props) {
  return (
    <Flex flexGrow={1} pos={"relative"}>
      <Box
        backgroundImage="url(/chat-bg.png)"
        opacity={0.1}
        left={0}
        top={0}
        backgroundAttachment={"fixed"}
        position={"absolute"}
        w={"full"}
        h={"full"}
        overflow={"hidden"}
      />
      <Flex
        flexDir={"column"}
        w={"full"}
        h={"full"}
        overflow={"auto"}
        justify={"end"}
        gap={1}
      ></Flex>
    </Flex>
  );
}
