import { useMutation, useQuery } from "react-query";
import useErrorHandler from "../../utils/errorHandler";
import API from "./messageApi";
import { Message, MessageSend } from "../../types";

export const useSendMessage = () => {
  const errorHandler = useErrorHandler();

  const { mutate, isLoading, isSuccess, error } = useMutation(
    async (values: MessageSend) => {
      const api = new API();
      const res = await api.sendMessage(values);
      return res.data;
    },
    {
      onError: (error) => {
        errorHandler(error);
      },
    }
  );
  return { mutate, isLoading, isSuccess, error };
};

export const useGetMessages = ({
  sender,
  receiver,
}: {
  sender: string;
  receiver: string;
}) => {
  const errorHandler = useErrorHandler();

  const {
    data: messages,
    isLoading,
    isSuccess,
    error,
  } = useQuery<{ messages: Message[] }>(
    ["getMessages", receiver],
    async () => {
      const api = new API();
      const res = await api.getMessages(sender, receiver);
      return res.data;
    },
    {
      onError: (error) => {
        errorHandler(error);
      },
    }
  );
  return { messages, isLoading, isSuccess, error };
};
