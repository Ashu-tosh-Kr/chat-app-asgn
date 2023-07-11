import {
  FormErrorMessage,
  FormControl,
  Textarea,
  FormLabel
} from '@chakra-ui/react';

const TextAreaField = ({ name, error, label, required, register }) => {
  return (
    <>
      <FormControl isRequired={required} isInvalid={error}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Textarea
          backgroundColor="#E2E8F833"
          h="9rem"
          {...register}
          isInvalid={error}
        />
        <FormErrorMessage mt={0} fontSize="xs">
          {error?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
export default TextAreaField;
