import { useQuery } from "react-query";
import useErrorHandler from "../../utils/errorHandler";
import API from "./userApi";
import { User } from "../../types";

export const useAllUsers = () => {
  const errorHandler = useErrorHandler();

  const {
    data: allUsers,
    isLoading,
    isSuccess,
    error,
  } = useQuery<{
    [key: string]: User[];
  }>(
    "allUsers",
    async () => {
      const api = new API();
      const res = await api.allUsers();
      return res.data;
    },
    {
      onError: (error) => {
        errorHandler(error);
      },
    }
  );
  return { allUsers, isLoading, isSuccess, error };
};

export const useCurrentUser = () => {
  const errorHandler = useErrorHandler();

  const {
    data: curUser,
    isLoading,
    isSuccess,
    error,
  } = useQuery(
    "curUser",
    async () => {
      const api = new API();
      const res = await api.currentUser();
      return res.data;
    },
    {
      onError: (error) => {
        errorHandler(error);
      },
    }
  );
  return { curUser, isLoading, isSuccess, error };
};
