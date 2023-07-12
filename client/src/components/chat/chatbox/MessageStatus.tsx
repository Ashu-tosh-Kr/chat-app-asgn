import { Box } from "@chakra-ui/react";
import { Message } from "../../../types";
import { BiCheckCircle } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import { VscEye } from "react-icons/vsc";

type Props = {
  message: Message;
};

export default function MessageStatus({ message }: Props) {
  const user = JSON.parse(localStorage.getItem("user")!);
  return (
    <Box display={message.sender !== user.id ? "none" : "inline"}>
      {message.messageStatus === "sent" && (
        <Box color={"grey.400"}>
          <BiCheckCircle />
        </Box>
      )}
      {message.messageStatus === "delivered" && (
        <Box color={"yellow.400"}>
          <AiFillCheckCircle />
        </Box>
      )}
      {message.messageStatus === "seen" && (
        <Box color={"green.300"}>
          <VscEye />
        </Box>
      )}
    </Box>
  );
}
