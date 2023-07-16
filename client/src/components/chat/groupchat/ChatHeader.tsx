import { Flex, Text } from "@chakra-ui/react";

type Props = {};

export default function ChatHeader({}: Props) {
  return (
    <Flex
      px={4}
      py={3}
      justify={"space-between"}
      align={"center"}
      h={16}
      zIndex={10}
      bg={"brand.500"}
      boxShadow={"lg"}
      borderTopRightRadius={"lg"}
    >
      <Flex gap={2}>
        <Flex flexDir={"column"}>
          <Text fontWeight={"bold"}>#Everybody</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
