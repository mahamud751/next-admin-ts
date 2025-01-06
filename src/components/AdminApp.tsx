import * as React from "react";
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./User/UserList";
import dataProvider from "@/dataProvider";

const AdminApp = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="vendors" list={<UserList />} />
  </Admin>
);

export default AdminApp;
