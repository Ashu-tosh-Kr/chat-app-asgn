import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function AuthWrapper({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Flex
      flexDir={"column"}
      color={"brand.200"}
      bg={"brand.700"}
      w="100vw"
      h="100vh"
    >
      <Flex
        flexDir={"column"}
        justifyContent="center"
        alignItems="center"
        minH={"calc(100vh - 60px)"}
        gap={10}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"}>to enjoy chatting ✌️</Text>
        </Stack>

        <Flex
          rounded={"lg"}
          boxShadow={"lg"}
          height={10}
          overflow="hidden"
          borderWidth="2px"
          borderStyle="solid"
          borderColor="brand.300"
          borderRadius={30}
        >
          <Button
            w="50%"
            height="100%"
            borderRadius={0}
            px={12}
            // onClick={_onSetLogin}

            backgroundColor={
              location.pathname == "/login" ? "brand.300" : "transparent"
            }
            fontWeight="300"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            w="50%"
            height="100%"
            borderRadius={0}
            px={10}
            // onClick={_onSetSignup}
            onClick={() => navigate("/signup")}
            backgroundColor={
              location.pathname == "/signup" ? "brand.300" : "transparent"
            }
            fontWeight="300"
          >
            Sign Up
          </Button>
        </Flex>
        {children}
      </Flex>
    </Flex>
  );
}
