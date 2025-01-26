import { Layout } from "react-admin";

import { TreeMenu } from "../lib";
import MyAppBar from "./AppBar";

const MyLayout = (props) => (
  <Layout {...props} menu={TreeMenu} appBar={MyAppBar} />
);

export default MyLayout;
