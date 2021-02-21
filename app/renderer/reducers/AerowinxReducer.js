const AerowinxReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload
      };
    case 'SET_POSITION':
      return {
        ...state,
        position: action.payload
      };  
    case 'SET_ALWAYS_ON_TOP':
      return {
        ...state,
        alwaysOnTop: action.payload
      };
    default:
      return state;
  }
};

export default AerowinxReducer;
