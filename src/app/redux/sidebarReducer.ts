import { TOGGLE_SIDEBAR, OPEN_SIDEBAR, CLOSE_SIDEBAR } from "./sidebarActions";

const initialState = {
  sidebarOpen: false,
};

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return { ...state, sidebarOpen: true };
    case CLOSE_SIDEBAR:
      return { ...state, sidebarOpen: false };
    case TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
};

export default sidebarReducer;
