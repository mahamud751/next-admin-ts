export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
export const OPEN_SIDEBAR = "OPEN_SIDEBAR";
export const CLOSE_SIDEBAR = "CLOSE_SIDEBAR";

// Action to toggle the sidebar
export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
});

// Action to open the sidebar
export const openSidebar = () => ({
  type: OPEN_SIDEBAR,
});

// Action to close the sidebar
export const closeSidebar = () => ({
  type: CLOSE_SIDEBAR,
});
