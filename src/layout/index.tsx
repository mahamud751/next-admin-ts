import { Layout } from "react-admin";

import MyAppBar from "./AppBar";
import { lightTheme } from "./themes";
import { TreeMenu } from "@/lib";

const MyLayout = (props) => (
  <Layout {...props} theme={lightTheme} appBar={MyAppBar} />
);

export default MyLayout;
