import { Outlet, Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/layout";

export const RequireAuth = () => {
  if (!localStorage.getItem("user")) return <Navigate to="/login" />;
  return (
    <Flex //adding custom scollbar using the css prop
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
          height: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#4586FA",
          borderRadius: "24px",
        },
      }}
      // overflow={'scroll'}
      flexDir={"column"}
      justify="space-around"
    >
      <Outlet />
    </Flex>
  );
};
