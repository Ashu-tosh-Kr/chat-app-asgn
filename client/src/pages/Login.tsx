import { Stack, Button, Icon } from "@chakra-ui/react";
import AuthScreen from "../components/auth/AuthWrapper";
import { useForm } from "react-hook-form";
import InputField from "../components/formComponents/InputField";
import { useLogin } from "../api/auth/authHooks";
import { UserLogin } from "../types";

export default function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserLogin>();

  const { mutate } = useLogin();

  const onSubmit = (data: UserLogin) => {
    mutate(data);
  };

  return (
    <AuthScreen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <InputField
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid E-mail Address",
              },
            })}
            error={errors.email}
            type="email"
            placeholder={"Enter Email"}
            leftIcon={
              <Icon viewBox="0 0 22 18">
                <path
                  d="M21.7307 0.269271C21.5932 0.1375 21.4271 0.0515625 21.2552 0.0171875C21.1922 0.00572917 21.1349 0 21.0719 0H0.928125H0.922396C0.6875 0 0.446875 0.0859375 0.269271 0.269271C0.0859375 0.446875 0 0.6875 0 0.922396V0.928125V16.4828C0 16.4885 0 16.4885 0 16.4943C0 16.7292 0.0916667 16.9641 0.269271 17.1417C0.406771 17.2792 0.572917 17.3594 0.744792 17.3938C0.807813 17.4052 0.865104 17.4109 0.928125 17.4109H21.0661C21.3068 17.4109 21.5531 17.3078 21.725 17.1359C21.8969 16.9641 22 16.7234 22 16.4771V0.928125C22 0.922396 22 0.922396 22 0.916667C22 0.681771 21.9083 0.452604 21.7307 0.269271ZM11.2578 8.61094C11.1146 8.74271 10.8911 8.74271 10.7422 8.60521L3.28854 1.83333H18.7115L11.2578 8.61094ZM1.83333 2.99063L7.79167 8.40469L1.83333 14.3057V2.99063ZM9.14948 9.63646L9.50469 9.96302C9.79115 10.2266 10.1234 10.387 10.4729 10.4786C10.5188 10.4901 10.5589 10.5073 10.599 10.513C10.6448 10.5245 10.6964 10.5188 10.7479 10.5245C10.8339 10.5359 10.9141 10.5474 11 10.5474C11.0115 10.5474 11.0286 10.5417 11.0401 10.5417C11.5615 10.5302 12.0771 10.3411 12.4896 9.96302L12.8505 9.63646L18.8547 15.5833H3.14531L9.14948 9.63646ZM14.2083 8.40469L20.1667 2.99063V14.3057L14.2083 8.40469Z"
                  fill="currentColor"
                />
              </Icon>
            }
          />
          <InputField
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password}
            placeholder={"Enter Password"}
            type="password"
            leftIcon={
              <Icon viewBox="0 0 22 24">
                <path
                  d="M16.8559 15.0532C16.3507 15.0532 15.9374 15.4688 15.9374 15.9767C15.9374 16.4846 16.3507 16.9002 16.8559 16.9002C17.3612 16.9002 17.7745 16.4846 17.7745 15.9767C17.7745 15.4688 17.3612 15.0532 16.8559 15.0532ZM14.3299 15.9767C14.3299 16.4846 13.9165 16.9002 13.4113 16.9002C12.9061 16.9002 12.4927 16.4846 12.4927 15.9767C12.4927 15.4688 12.9061 15.0532 13.4113 15.0532C13.9165 15.0532 14.3299 15.4688 14.3299 15.9767ZM12.5846 22.7183C12.5846 23.2262 12.9979 23.6418 13.5031 23.6418H18.3257C20.3511 23.6418 22 21.9841 22 19.9478V12.375C22 10.3387 20.3511 8.68097 18.3257 8.68097H17.2234V5.42561C17.2234 2.43344 14.7524 0 11.7119 0C8.6714 0 6.20042 2.43344 6.20042 5.42561V8.68097H5.09812C3.07265 8.68097 1.4238 10.3387 1.4238 12.375V13.3447C1.4238 13.8526 1.83716 14.2682 2.34238 14.2682C2.8476 14.2682 3.26096 13.8526 3.26096 13.3447V12.375C3.26096 11.3545 4.08309 10.528 5.09812 10.528H18.3257C19.3407 10.528 20.1628 11.3545 20.1628 12.375V19.9478C20.1628 20.9682 19.3407 21.7948 18.3257 21.7948H13.5031C12.9979 21.7948 12.5846 22.2104 12.5846 22.7183ZM15.3862 8.68097H8.03758V5.42561C8.03758 3.45392 9.68643 1.84701 11.7119 1.84701C13.7374 1.84701 15.3862 3.45392 15.3862 5.42561V8.68097ZM0.165344 19.6938C0.197495 19.74 0.307726 19.897 0.376619 19.9847C0.684343 20.3726 1.40543 21.2822 2.40668 22.0903C3.69269 23.12 5.01545 23.6418 6.3382 23.6418C7.66096 23.6418 8.98372 23.12 10.2697 22.0903C11.271 21.2868 11.9921 20.3772 12.2998 19.9847C12.3687 19.897 12.4789 19.74 12.5111 19.6938C12.7315 19.3752 12.7315 18.9504 12.5111 18.6318C12.4789 18.5856 12.3687 18.4286 12.2998 18.3409C11.9921 17.953 11.271 17.0433 10.2697 16.2353C8.98372 15.2056 7.66096 14.6838 6.3382 14.6838C5.01545 14.6838 3.69269 15.2056 2.40668 16.2353C1.40543 17.0387 0.684343 17.9484 0.376619 18.3409C0.307726 18.4286 0.197495 18.5856 0.165344 18.6318C-0.0551147 18.9504 -0.0551147 19.3752 0.165344 19.6938ZM2.08518 19.1628C3.54572 17.4174 4.97411 16.5308 6.3382 16.5308C7.7023 16.5308 9.13069 17.4174 10.5912 19.1628C9.13069 20.9082 7.7023 21.7948 6.3382 21.7948C4.97411 21.7948 3.54572 20.9082 2.08518 19.1628ZM6.29228 17.4081C7.25679 17.4081 8.03758 18.1931 8.03758 19.1628C8.03758 20.1325 7.25679 20.9174 6.29228 20.9174C5.32777 20.9174 4.54697 20.1325 4.54697 19.1628C4.54697 18.1931 5.32777 17.4081 6.29228 17.4081Z"
                  fill="currentColor"
                />
              </Icon>
            }
          />
          <Button mt={2} type="submit">
            Sign in
          </Button>
        </Stack>
      </form>
    </AuthScreen>
  );
}
