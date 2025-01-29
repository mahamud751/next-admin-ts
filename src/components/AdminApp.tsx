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

import { lightTheme } from "@/layout/themes";
import {
  ApprovalCapCreate,
  ApprovalCapEdit,
  ApprovalCapList,
  ApprovalCapShow,
} from "@/pages/manageRequisition/approvalCap";
import {
  DashIcon,
  ManageAccountingIcon,
  ManageDatabaseIcon,
  ManageLabTestIcon,
  ManageRequisitionIcon,
} from "./icons";

import {
  BalanceMovementCreate,
  BalanceMovementList,
} from "@/pages/manageAccounting/balanceMovement";
import {
  PurchaseRequisitionCreate,
  PurchaseRequisitionList,
} from "@/pages/manageRequisition/purchaseRequisition";
import { ProductCategoryList } from "@/pages/manageDatabase/productCategory";
import { TaxonomyEdit, TaxonomyShow } from "@/pages/manageTaxonomy/taxonomies";
import {
  LabBannerCreate,
  LabBannerEdit,
  LabBannerList,
  LabBannerShow,
} from "@/pages/manageLabTest/manageBanner";
import {
  BrandCreate,
  BrandEdit,
  BrandList,
  BrandShow,
} from "@/pages/manageDatabase/brands";
import {
  LabCategoryCreate,
  LabCategoryEdit,
  LabCategoryList,
  LabCategoryShow,
} from "@/pages/manageLabTest/manageCategory";
import {
  LabScheduleCreate,
  LabScheduleEdit,
  LabScheduleList,
} from "@/pages/manageLabTest/manageSchedule";
import {
  LabGeneralIconCreate,
  LabGeneralIconEdit,
  LabGeneralIconList,
  LabGeneralIconShow,
} from "@/pages/manageLabTest/manageGeneralIcon";
import {
  LabCollectionProcessCreate,
  LabCollectionProcessEdit,
  LabCollectionProcessList,
  LabCollectionProcessShow,
} from "@/pages/manageLabTest/manageCollectionProcess";
import {
  LabCollectorCreate,
  LabCollectorList,
  LabCollectorsEdit,
} from "@/pages/manageLabTest/manageLabCollectors";
import { LabCartEdit, LabCartList } from "@/pages/manageLabTest/manageCart";
import {
  LabPatientList,
  LabPatientShow,
} from "@/pages/manageLabTest/managePatient";
import { LabReportShipmentList } from "@/pages/manageLabTest/manageLabReportShipment";
import {
  LabVendorCreate,
  LabVendorEdit,
  LabVendorList,
  LabVendorShow,
} from "@/pages/manageLabTest/manageVendor";
import {
  LabLocationList,
  LabLocationShow,
} from "@/pages/manageLabTest/manageLocation";
import { LabZoneList, LabZoneShow } from "@/pages/manageLabTest/manageZoneMain";
import General from "@/pages/manageLabTest/manageGeneral";
import LabReport from "@/pages/manageLabTest/manageLabReport/LabReport";

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
        permissions?.includes("manageDatabaseMenu") ? (
          <Resource
            name="manageDatabase"
            options={{
              label: "Manage Database",
              isMenuParent: true,
            }}
            icon={ManageDatabaseIcon}
          />
        ) : null,
        <Resource
          name="productCategory"
          options={{
            label: "Product Categories",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("productCategoryMenu") &&
            permissions?.includes("taxonomyView")
              ? ProductCategoryList
              : undefined
          }
          edit={
            permissions?.includes("taxonomyEdit") ? TaxonomyEdit : undefined
          }
          show={
            permissions?.includes("taxonomyView") ? TaxonomyShow : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="productCategory"
          options={{
            label: "Product Categories",
            menuParent: "manageDatabase",
          }}
          list={ProductCategoryList}
          edit={
            permissions?.includes("taxonomyEdit") ? TaxonomyEdit : undefined
          }
          show={
            permissions?.includes("taxonomyView") ? TaxonomyShow : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/productBrand"
          options={{
            label: "Brands",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("productBrandMenu") &&
            permissions?.includes("productBrandView")
              ? BrandList
              : undefined
          }
          create={
            permissions?.includes("productBrandCreate")
              ? BrandCreate
              : undefined
          }
          edit={
            permissions?.includes("productBrandEdit") ? BrandEdit : undefined
          }
          show={
            permissions?.includes("productBrandView") ? BrandShow : undefined
          }
          icon={DashIcon}
        />,
        permissions?.includes("manageRequisitionMenu") ? (
          <Resource
            name="manageRequisition"
            options={{
              label: "Manage Requisition",
              isMenuParent: true,
            }}
            icon={ManageRequisitionIcon}
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
          icon={DashIcon}
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
          icon={DashIcon}
        />,
        permissions?.includes("manageAccountingMenu") ? (
          <Resource
            name="manageAccounting"
            options={{
              label: "Manage Accounting",
              isMenuParent: true,
            }}
            icon={ManageAccountingIcon}
          />
        ) : null,
        <Resource
          name="v1/accountingBalanceMovement"
          options={{
            label: "Balance Movement",
            menuParent: "manageAccounting",
          }}
          list={
            permissions?.includes("accountingBalanceMovementMenu") &&
            permissions?.includes("accountingBalanceMovementView")
              ? BalanceMovementList
              : undefined
          }
          create={
            permissions?.includes("accountingBalanceMovementCreate")
              ? BalanceMovementCreate
              : undefined
          }
          icon={DashIcon}
        />,
        permissions?.includes("manageLabTestMenu") && (
          <Resource
            name="manageLabTest"
            options={{
              label: "Manage Lab Test",
              isMenuParent: true,
            }}
            icon={ManageLabTestIcon}
          />
        ),
        <Resource
          name="lab-cart/api/v2/admin/carts"
          options={{
            label: "Carts",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labCartMenu") &&
            permissions?.includes("labCartView")
              ? LabCartList
              : undefined
          }
          edit={permissions?.includes("labCartEdit") ? LabCartEdit : undefined}
          icon={DashIcon}
        />,
        <Resource
          name="lab-reports"
          options={{
            label: "Lab Reports",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labReportMenu") &&
            permissions?.includes("labReportView")
              ? LabReport
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="lab-order/api/v1/admin/order-shipments"
          options={{
            label: "Lab Report Shipments",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labReportMenuShipmentMenu") &&
            permissions?.includes("labReportMenuShipmentView")
              ? LabReportShipmentList
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="lab-order/api/v1/admin/shared/schedule-dates"
          options={{
            label: "Schedules",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labSchedulesMenu") &&
            permissions?.includes("labSchedulesView")
              ? LabScheduleList
              : undefined
          }
          create={
            permissions?.includes("labSchedulesCreate")
              ? LabScheduleCreate
              : undefined
          }
          edit={
            permissions?.includes("labSchedulesEdit")
              ? LabScheduleEdit
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="lab-order/api/v1/admin/order-shipments"
          options={{
            label: "Lab Report Shipments",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labReportMenuShipmentMenu") &&
            permissions?.includes("labReportMenuShipmentView")
              ? LabReportShipmentList
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="misc/api/v1/admin/vendor"
          options={{
            label: "Vendors",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labVendorMenu") &&
            permissions?.includes("labVendorView")
              ? LabVendorList
              : undefined
          }
          create={
            permissions?.includes("labVendorCreate")
              ? LabVendorCreate
              : undefined
          }
          edit={
            permissions?.includes("labVendorEdit") ? LabVendorEdit : undefined
          }
          show={
            permissions?.includes("labVendorView") ? LabVendorShow : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="misc/api/v1/admin/category"
          options={{
            label: "Categories",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labCategoryMenu") &&
            permissions?.includes("labCategoryView")
              ? LabCategoryList
              : undefined
          }
          create={
            permissions?.includes("labCategoryCreate")
              ? LabCategoryCreate
              : undefined
          }
          edit={
            permissions?.includes("labCategoryEdit")
              ? LabCategoryEdit
              : undefined
          }
          show={
            permissions?.includes("labCategoryView")
              ? LabCategoryShow
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="misc/api/v1/admin/home-banner"
          options={{
            label: "Banners",
            menuParent: "manageLabTest",
          }}
          list={LabBannerList}
          create={LabBannerCreate}
          edit={LabBannerEdit}
          show={LabBannerShow}
          icon={DashIcon}
        />,
        <Resource
          name="lab-order/api/v1/admin/collectors"
          options={{
            label: "Collectors",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labCollectorMenu") &&
            permissions?.includes("labCollectorView")
              ? LabCollectorList
              : undefined
          }
          create={
            permissions?.includes("labCollectorCreate")
              ? LabCollectorCreate
              : undefined
          }
          edit={
            permissions?.includes("labCollectorEdit")
              ? LabCollectorsEdit
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="zone-main"
          options={{
            label: "Lab Zones",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labZoneMenu") &&
            permissions?.includes("labZoneView")
              ? LabZoneList
              : undefined
          }
          show={permissions?.includes("labZoneView") ? LabZoneShow : undefined}
          icon={DashIcon}
        />,
        <Resource
          name="v1/lab-location"
          options={{
            label: "Lab Locations",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labLocationMenu") &&
            permissions?.includes("labLocationView")
              ? LabLocationList
              : undefined
          }
          show={
            permissions?.includes("labLocationView")
              ? LabLocationShow
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="patient/api/v1/admin/patient"
          options={{
            label: "Patients",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labPatientsMenu") &&
            permissions?.includes("labPatientsView")
              ? LabPatientList
              : undefined
          }
          show={
            permissions?.includes("labPatientsView")
              ? LabPatientShow
              : undefined
          }
          icon={DashIcon}
        />,
        <Resource
          name="misc/api/v1/admin/lab-steps"
          options={{
            label: "Collection Process",
            menuParent: "manageLabTest",
          }}
          list={LabCollectionProcessList}
          create={LabCollectionProcessCreate}
          edit={LabCollectionProcessEdit}
          show={LabCollectionProcessShow}
          icon={DashIcon}
        />,
        <Resource
          name="misc/api/v1/admin/lab-items-details-icon"
          options={{
            label: "General Icon",
            menuParent: "manageLabTest",
          }}
          list={LabGeneralIconList}
          create={LabGeneralIconCreate}
          edit={LabGeneralIconEdit}
          show={LabGeneralIconShow}
          icon={DashIcon}
        />,
        permissions?.includes("labGeneralMenu") && (
          <Resource
            name="misc/api/v1/admin/lab-setting"
            options={{
              label: "General Setting",
              menuParent: "manageLabTest",
            }}
            list={General}
            icon={DashIcon}
          />
        ),
      ]}
    </Admin>
  );
};

export default AdminApp;
