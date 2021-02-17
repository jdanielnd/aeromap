const AerowinxReducer = (state, action) => {
  switch (action.type) {
      case 'SET_ADDRESS':
          return {
              ...state,
              address: action.payload
          };
      default:
          return state;
  }
};

export default AerowinxReducer;
