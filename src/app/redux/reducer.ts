// reducer.ts
import { TOGGLE_SIDEBAR, SET_RESOURCES } from "./actionTypes";

const initialState = {
  ui: {
    sidebarOpen: true, // Default state (you can change it as per your need)
  },
  resources: [], // Initial state for resources
};

export const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen, // Toggle sidebar state
        },
      };
    case SET_RESOURCES:
      return {
        ...state,
        resources: action.payload, // Set resources from action payload
      };
    default:
      return state;
  }
};
