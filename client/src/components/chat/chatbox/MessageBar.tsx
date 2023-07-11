import { Box, Flex } from "@chakra-ui/react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import InputField from "../../formComponents/InputField";
import { useForm } from "react-hook-form";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
type Props = {};

export default function MessageBar({}: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
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
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <InputField
          w="full"
          register={register("message", {
            required: "Can send empty message",
          })}
          error={errors.email}
          type="text"
          placeholder={"Tyep a message..."}
          _focus={{
            bg: "brand.700",
            borderColor: "brand.300",
            borderWidth: "2px",
          }}
        />
      </form>
      <MdSend cursor={"pointer"} title="Send Message" />
      <FaMicrophone cursor={"pointer"} title="Send Message" />
    </Flex>
  );
}
