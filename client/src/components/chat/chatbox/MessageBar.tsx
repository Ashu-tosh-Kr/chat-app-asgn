import { Box, Flex, useBoolean } from "@chakra-ui/react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import InputField from "../../formComponents/InputField";
import { useForm } from "react-hook-form";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import {
  useSendImageMessage,
  useSendMessage,
} from "../../../api/message/messageHooks";
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

  const { mutate } = useSendMessage(socket);
  const { mutateImage } = useSendImageMessage(socket);
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

  //image upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("selectedImage", e.target.files?.[0]);

    if (e.target.files?.[0]) {
      const formData = new FormData();
      formData.append("image", e.target.files?.[0]!);

      formData.append("sender", user.id);
      formData.append("receiver", currentChatUser?.id!);

      mutateImage(formData);
    }
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
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e)}
        />
        <ImAttachment
          onClick={() => document.getElementById("imageInput")!.click()}
          cursor={"pointer"}
          title="Attach File"
        />
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
