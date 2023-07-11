import {
  FormErrorMessage,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Image,
  Text,
  Box
} from '@chakra-ui/react';
import dropDown from 'assets/globals/dropdown.svg';
import { components, Select as ReactSelect } from 'chakra-react-select';
import { useController } from 'react-hook-form';
const MenuField = ({
  name,
  options,
  label,
  register,
  required,
  error,
  placeholder,
  width,
  ...rest
}) => {
  const inputStyle = {
    borderRadius: '8px',
    backgroundColor: '#E2E8F833',
    border: '1px',
    borderColor: '#E2E8F8',
    _placeholder: {
      color: '#707070',
      opacity: 0.5,
      fontSize: ['0.6rem', '0.75rem', '0.75rem', '0.75rem', '0.75rem']
    }
  };
  return (
    <>
      <FormControl isRequired={required} isInvalid={error} width={width}>
        <FormLabel mb={1} fontWeight="none" fontSize={'sm'} htmlFor={name}>
          {label}
        </FormLabel>
        <Select
          variant="filled"
          placeholder={placeholder}
          {...register}
          {...inputStyle}
          {...rest}
          isInvalid={error}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt._id}>
              {opt.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage mt={0} fontSize="xs">
          {error?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
export default MenuField;

export const MenuWithLeftIcon = ({
  register,
  error,
  leftIcon,
  placeholder,
  options
}) => {
  return (
    <FormControl isInvalid={error}>
      <HStack
        borderRadius="8px"
        border="1px"
        borderColor={error ? 'brand.red' : '#E2E8F8'}
        p={1.5}
        backgroundColor="#E2E8F833"
        position="relative"
      >
        <Image src={leftIcon} />
        <Select
          icon={<Image src={dropDown} />}
          {...register}
          _placeholder={{ color: 'brand.red' }}
          placeholder={placeholder}
          color="brand.gray"
          fontSize="0.8rem"
          variant="unstyled"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt._id}>
              {opt.name}
            </option>
          ))}
        </Select>
      </HStack>
      <FormErrorMessage fontSize={'xs'} mt={0}>
        {error?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

const Control = ({ children, ...props }) => {
  const { leftIcon, value } = props.selectProps;
  return (
    <components.Control {...props}>
      <HStack w="100%">
        {value?.icon ? (
          <Box pl={2} mr={-4}>
            {value.icon}
          </Box>
        ) : (
          leftIcon && <Image ml={2} mr={-2} src={leftIcon} />
        )}
        {children}
      </HStack>
    </components.Control>
  );
};

const Option = ({ children, ...props }) => {
  const { data } = props;
  return (
    <components.Option style={{ backgroundColor: 'red' }} {...props}>
      <HStack w="100%">
        {data?.icon}
        <Text>{children}</Text>
      </HStack>
    </components.Option>
  );
};

export const CustomSelect = ({
  name,
  label,
  control,
  isRequired,
  options,
  rules,
  ...rest
}) => {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    rules
    // shouldUnregister
  });
  return (
    <FormControl isRequired={isRequired} isInvalid={error}>
      <FormLabel mb={1} fontWeight="none" fontSize={'xs'} htmlFor={name}>
        {label}
      </FormLabel>
      <ReactSelect
        // useBasicStyles is a replacement for below commented out code
        useBasicStyles
        // chakraStyles={{
        //   dropdownIndicator: (provided) => ({
        //     ...provided,
        //     bg: 'transparent',
        //     px: 2,
        //     cursor: 'inherit'
        //   }),
        //   indicatorSeparator: (provided) => ({
        //     ...provided,
        //     display: 'none'
        //   })
        // }}
        selectedOptionStyle="check"
        selectedOptionColor="red"
        options={options}
        components={{ Control, Option }}
        styles={{
          control: (base, state) => {
            const { isDisabled } = state;
            const inputStyle = {
              borderRadius: '8px',
              backgroundColor: '#E2E8F833',
              border: '1px solid #E2E8F8'
            };
            return {
              ...base,
              ...inputStyle,
              cursor: isDisabled ? 'not-allowed' : 'default',
              color: isDisabled ? '#aaa' : 'default'
            };
          },
          option: (base, state) => {
            const { isSelected } = state;
            const inputStyle = {
              color: 'black',
              backgroundColor: isSelected ? '#dee4f4' : '#fff'
              // border: isSelected ? '1px solid #4587fa77' : 'none'
            };
            return {
              ...base,
              ...inputStyle
            };
          }
        }}
        {...field}
        {...rest}
      />

      <FormErrorMessage fontSize={'xs'} mt={0}>
        {error?.message}
      </FormErrorMessage>
    </FormControl>
  );
};
