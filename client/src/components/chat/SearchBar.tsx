import { Flex, HStack, IconButton } from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import { FaSearch } from "react-icons/fa";

type Props = {};

export default function SearchBar({}: Props) {
  return (
    <Flex
      bg={"brand.500"}
      m={2}
      borderRadius={20}
      alignItems="center"
      justifyContent="space-between"
    >
      <Input
        borderStartRadius={20}
        type="text"
        bg="transparent"
        placeholder={"Search"}
        // _placeholder={{ color: "brand.300" }}
        border="none"
        minW="100px"
        _focus={{
          borderColor: "none",
        }}
        // value={text}
        // onChange={(e) => setText(e.target.value)}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     history.push(`/search?k=${text}`);
        //   }
        // }}
      />
      <HStack spacing={1}>
        <IconButton
          variant="ghost"
          borderRadius={"full"}
          aria-label="Search"
          _hover={{
            bg: "brand.200",
          }}
          // onClick={() => {
          //   history.push(`/search?k=${text}`);
          // }}
          icon={<FaSearch fontSize={16} />}
        />
      </HStack>
    </Flex>
  );
}
