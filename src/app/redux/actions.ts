// actions.ts
import { TOGGLE_SIDEBAR, SET_RESOURCES } from "./actionTypes";

export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
});

export const setResources = (resources: any[]) => ({
  type: SET_RESOURCES,
  payload: resources, // Pass resources as payload
});
