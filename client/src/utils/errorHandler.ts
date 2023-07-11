import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useToast } from "@chakra-ui/react";

const useErrorHandler = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const queryClient = useQueryClient();

  const errorHandler = async (error: any) => {
    //status 401: access_token has expired,
    if (error.toJSON().status === 401) {
      localStorage.clear();
      queryClient.invalidateQueries();
      navigate("/", { replace: true });
    } else {
      //trigger app re-render and show appropriate screen based on status code
      navigate(location.pathname, {
        replace: true,
        state: {
          errorStatusCode: error.toJSON().status,
          redirect: error.response?.data?.redirect,
        },
      });

      toast({
        title: error?.response?.data?.errors?.[0]?.message || error.message,
        status: "error",
      });
    }
  };

  return errorHandler;
};

export default useErrorHandler;
