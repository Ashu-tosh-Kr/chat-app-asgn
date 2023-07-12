import { useMutation, useQuery, useQueryClient } from "react-query";
import useErrorHandler from "../../utils/errorHandler";
import API from "./messageApi";
import { Message, MessageSend } from "../../types";
import { Socket } from "socket.io-client";

export const useSendMessage = (
  socket: React.MutableRefObject<Socket | null>
) => {
  const errorHandler = useErrorHandler();
  const queryClient = useQueryClient();
  const { mutate, isLoading, isSuccess, error } = useMutation(
    async (values: MessageSend) => {
      const api = new API();
      queryClient.setQueryData(["getMessages", values.receiver], (old: any) => {
        if (!old) return { messages: [values] };
        return {
          messages: [
            ...old.messages,
            {
              ...values,
              type: "text",
              createdAt: new Date(),
              id: Math.random(),
            },
          ],
        };
      });
      const res = await api.sendMessage(values);
      return res.data;
    },
    {
      onSuccess: (message) => {
        socket.current?.emit("message-sent", message);
      },
      onError: (error) => {
        errorHandler(error);
      },
      onSettled: (message) => {
        queryClient.invalidateQueries(["getMessages", message.receiver]);
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
    isRefetching,
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
  return { messages, isLoading, isSuccess, error, isRefetching };
};
