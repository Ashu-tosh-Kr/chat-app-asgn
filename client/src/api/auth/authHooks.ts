import { useMutation } from "react-query";
import useErrorHandler from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import API from "./authApi";
import { UserLogin, UserRegister } from "../../types";

export const useLogin = () => {
  const errorHandler = useErrorHandler();
  const navigate = useNavigate();

  const { mutate, isLoading, isSuccess, error } = useMutation(
    async (values: UserLogin) => {
      const api = new API();
      const res = await api.login(values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/chat");
      },
      onError: (error) => {
        errorHandler(error);
      },
    }
  );
  return { mutate, isLoading, isSuccess, error };
};

export const useRegister = () => {
  const errorHandler = useErrorHandler();
  const navigate = useNavigate();

  const { mutate, isLoading, isSuccess, error } = useMutation(
    async (values: UserRegister) => {
      const api = new API();
      const res = await api.register(values);
      return res.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/chat");
      },
      onError: (error) => {
        errorHandler(error);
      },
    }
  );
  return { mutate, isLoading, isSuccess, error };
};
