// rootReducer.ts
import { combineReducers } from "redux";
import { appReducer } from "./reducer";
import sidebarReducer from "./sidebarReducer";

const rootReducer = combineReducers({
  app: appReducer,
  admin: sidebarReducer,
});

export default rootReducer;
