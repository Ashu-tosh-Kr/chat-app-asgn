const Card = {
  baseStyle: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    alignItems: 'center',
    borderRadius: '10px',
    gap: 6,
    pos: 'relative',
    minW: 'max(27vw, 22.5rem)',
    outline: '1px solid #E2E8F8',
    maxW: '98vw'
  },

  variants: {
    elevated: {
      padding: 8,
      boxShadow: '0px 3px 6px #00000029'
    },
    flattened: {
      padding: 8
      // border: '1px solid #E2E8F8',
    },
    hollow: {
      border: '0.5rem solid white',
      bgColor: '#F6F7FC'
    }
  },

  defaultProps: {
    variant: 'elevated'
  }
};
export default Card;
