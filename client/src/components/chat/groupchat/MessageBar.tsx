import { Box, Flex, useBoolean } from "@chakra-ui/react";
import { BsEmojiSmileFill } from "react-icons/bs";
import InputField from "../../formComponents/InputField";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import { MessageSend, User } from "../../../types";
import { useChatContext } from "../../../pages/Chat";
import EmojiPicker from "emoji-picker-react";

export default function MessageBar() {
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useBoolean(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm<Pick<MessageSend, "message">>();
  const { socket } = useChatContext();

  const user: User = JSON.parse(localStorage.getItem("user")!);

  const onSubmit = (data: Pick<MessageSend, "message">) => {
    socket.current?.emit("everybody-msg-send", {
      message: data.message,
      sender: user.id,
      senderName: user.username,
      createdAt: Date.now(),
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
      borderBottomRightRadius={"lg"}
    >
      <>
        <Flex gap={6}>
          <Box color={"yellow.400"} position={"relative"}>
            <BsEmojiSmileFill
              onClick={setEmojiPickerOpen.toggle}
              cursor={"pointer"}
              title="Emoji"
            />
            {isEmojiPickerOpen && (
              <Box position={"absolute"} bottom={12} left={15} zIndex={5}>
                <EmojiPicker
                  onEmojiClick={(emoji) =>
                    setValue("message", getValues("message") + emoji.emoji)
                  }
                  /* @ts-expect-error */
                  theme="dark"
                />
              </Box>
            )}
          </Box>
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
      </>
    </Flex>
  );
}