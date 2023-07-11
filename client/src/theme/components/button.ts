const Button = {
  baseStyle: {},
  variants: {
    primary: {
      fontSize: "0.75rem",
      color: "brand.200",
      backgroundColor: "brand.300",
      boxShadow: "0px 3px 6px #00000029",
      borderRadius: "100em",
      w: "full",
      _hover: {
        _loading: {
          bg: "brand.gray",
        },
        _disabled: {
          bg: "brand.gray",
        },
      },
    },
    secondary: {
      fontSize: "0.75rem",
      color: "brand.200",
      backgroundColor: "brand.700",
      boxShadow: "0px 3px 6px #00000029",
      borderRadius: "100em",
      border: "1px",
      w: "full",
      _hover: {
        backgroundColor: "white",
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};

export default Button;
