import { Box, Flex } from "@chakra-ui/react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import InputField from "../../formComponents/InputField";
import { useForm } from "react-hook-form";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useSendMessage } from "../../../api/message/messageHooks";
import { MessageSend, User } from "../../../types";
import { useChatContext } from "../../../pages/Chat";

export default function MessageBar() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Pick<MessageSend, "message">>();
  const { socket } = useChatContext();

  const { mutate } = useSendMessage(socket);
  const { currentChatUser } = useChatContext();
  const user: User = JSON.parse(localStorage.getItem("user")!);

  const onSubmit = (data: Pick<MessageSend, "message">) => {
    mutate({
      message: data.message,
      sender: user.id,
      receiver: currentChatUser?.id!,
    });
    reset();
  };

  return (
    <Flex
      bg={"brand.500"}
      h={20}
      px={4}
      align={"center"}
      gap={6}
      pos={"relative"}
      fontSize={"2xl"}
    >
      <Flex gap={6}>
        <Box color={"yellow.400"}>
          <BsEmojiSmileFill cursor={"pointer"} title="Emoji" />
        </Box>
        <ImAttachment cursor={"pointer"} title="Attach File" />
      </Flex>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%", display: "flex", gap: "1rem" }}
      >
        <InputField
          w="full"
          register={register("message", {
            required: "Can send empty message",
          })}
          error={errors.message}
          type="text"
          placeholder={"Tyep a message..."}
          _focus={{
            bg: "brand.700",
            borderColor: "brand.300",
            borderWidth: "2px",
          }}
        />
        <button type={"submit"}>
          <MdSend cursor={"pointer"} title="Send Message" />
        </button>
      </form>
      <FaMicrophone cursor={"pointer"} title="Send Message" />
    </Flex>
  );
}
