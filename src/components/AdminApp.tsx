import * as React from "react";
import { Admin, localStorageStore, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./User/UserList";
import dataProvider from "@/dataProvider";
import LoginPage from "@/app/loginPage";
import { VendorCreate } from "./User/VendorCreate";
import { useClarity, useCacheBuster, useKeyboardShortcut } from "@/hooks";
import { SocketServer } from "@/utils/enums";
import { logger, isJSONParsable } from "@/utils/helpers";
import { axiosInstance } from "@/utils/http";
import { initiateSocket, socket } from "@/utils/socketio";
import authProvider from "@/app/authProvider";
import MyLayout from "@/layout";
import {
  PurchaseRequisitionList,
  PurchaseRequisitionCreate,
} from "./manageRequisition/purchaseRequisition";
import { lightTheme } from "@/layout/themes";
import {
  ApprovalCapCreate,
  ApprovalCapEdit,
  ApprovalCapList,
  ApprovalCapShow,
} from "./manageRequisition/purchaseRequisition/approvalCap";

const AdminApp = () => {
  useClarity();
  useCacheBuster({});
  useKeyboardShortcut();

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_SOCKET_SERVER === SocketServer.ON) {
      initiateSocket(
        {
          userId: userInfo?.u_id,
          userName: userInfo?.u_name,
        },
        userInfo?.expressToken
      );

      socket.on("connect", () => {
        logger("Socket Connected", false);

        axiosInstance
          .post("/users/signup", {
            userId: userInfo?.u_id,
            userName: userInfo?.u_name,
          })
          .catch((err) => logger(err));
      });

      socket.on("disconnect", () => logger("Socket Disconnected", false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localUser = localStorage.getItem("user-info");

  const userInfo = isJSONParsable(localUser) ? JSON.parse(localUser) : {};
  console.log(userInfo);
  const store = localStorageStore();
  store.setItem("sidebar.open", true);
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={MyLayout}
      dashboard={UserList}
      theme={lightTheme}
      store={store}
    >
      {(permissions) => [
        permissions?.includes("manageRequisitionMenu") ? (
          <Resource
            name="manageRequisition"
            options={{
              label: "Manage Requisition",
              isMenuParent: true,
            }}
          />
        ) : null,
        <Resource
          name="v1/purchaseRequisition"
          options={{
            label: "Purchase Requisition",
            menuParent: "manageRequisition",
          }}
          //@ts-ignore
          list={<PurchaseRequisitionList />}
          create={PurchaseRequisitionCreate}
        />,
        <Resource
          name="v1/approvalCap"
          options={{
            label: "Cap Approvals",
            menuParent: "manageRequisition",
          }}
          //@ts-ignore
          list={<ApprovalCapList />}
          create={ApprovalCapCreate}
          edit={ApprovalCapEdit}
          show={ApprovalCapShow}
        />,
      ]}
    </Admin>
  );
};

export default AdminApp;
