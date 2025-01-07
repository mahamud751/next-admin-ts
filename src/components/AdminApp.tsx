import * as React from "react";
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./User/UserList";
import dataProvider from "@/dataProvider";
import LoginPage from "@/app/loginPage";
import { VendorCreate } from "./User/VendorCreate";

const AdminApp = () => (
  <Admin dataProvider={dataProvider} loginPage={LoginPage}>
    <Resource
      name="v1/purchaseRequisition"
      options={{ label: "Vendors" }}
      list={<UserList />}
      create={VendorCreate}
    />
  </Admin>
);

export default AdminApp;
