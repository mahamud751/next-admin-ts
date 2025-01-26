import { Layout } from "react-admin";

import { TreeMenu } from "../lib";
import MyAppBar from "./AppBar";

// import { lightTheme } from "./themes";

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

export default MyLayout;
