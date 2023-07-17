/* eslint react/no-children-prop: 0 */
import {
  Input,
  FormErrorMessage,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormHelperText,
} from "@chakra-ui/react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  name?: string;
  label?: string;
  required?: boolean;
  register: UseFormRegisterReturn<string>;
  error: FieldError | undefined;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helpertext?: string;
  [x: string]: any;
};

const InputField = ({
  name,
  label,
  required,
  register,
  error,
  leftIcon,
  rightIcon,
  helpertext,
  ...rest
}: Props) => {
  const inputStyle = {
    borderRadius: "100em",
    backgroundColor: "brand.700",
    border: "1px",
    borderColor: "brand.300",
    _placeholder: {
      opacity: 0.5,
      fontSize: ["0.6rem", "0.75rem", "0.75rem", "0.75rem", "0.75rem"],
    },
    _hover: {
      borderColor: "brand.300",
    },
    _focus: {
      borderColor: "brand.300",
      borderWidth: "2px",
    },
  };
  return (
    <>
      <FormControl isRequired={required} isInvalid={!!error}>
        <FormLabel mb={1} fontWeight="none" fontSize={"xs"} htmlFor={name}>
          {label}
        </FormLabel>
        <InputGroup>
          {leftIcon && (
            <InputLeftElement pointerEvents="none" children={leftIcon} />
          )}
          <Input variant="filled" {...inputStyle} {...rest} {...register} />
          {rightIcon && <InputRightElement children={rightIcon} />}
        </InputGroup>
        {!error ? (
          <FormHelperText mt={0} fontSize="xs">
            {helpertext}
          </FormHelperText>
        ) : (
          <FormErrorMessage mt={0} fontSize="xs">
            {error?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};

export default InputField;
