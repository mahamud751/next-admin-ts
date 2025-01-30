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
  ManagePurchaseIcon,
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
import {
  PurchaseCreate,
  PurchaseEdit,
  PurchaseList,
} from "@/pages/managePurchase/purchases";
import { ProductsUnitList } from "@/pages/manageDatabase/productUnit";
import {
  DiscountCreate,
  DiscountEdit,
  DiscountList,
  DiscountShow,
} from "@/pages/discounts";
import { SuggestedProductList } from "@/pages/manageDatabase/suggestedProducts";

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
              : null
          }
          edit={permissions?.includes("taxonomyEdit") ? TaxonomyEdit : null}
          show={permissions?.includes("taxonomyView") ? TaxonomyShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/suggestedProduct"
          options={{
            label: "Suggested Products",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("suggestedProductMenu") &&
            permissions?.includes("suggestedProductView")
              ? SuggestedProductList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/productUnit"
          options={{
            label: "Product Units",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("productUnitMenu") &&
            permissions?.includes("productView")
              ? ProductsUnitList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/productDiscount"
          options={{
            label: "Discounts",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("productDiscountMenu") &&
            permissions?.includes("productDiscountView")
              ? DiscountList
              : null
          }
          create={
            permissions?.includes("productDiscountCreate")
              ? DiscountCreate
              : null
          }
          edit={
            permissions?.includes("productDiscountEdit") ? DiscountEdit : null
          }
          show={
            permissions?.includes("productDiscountView") ? DiscountShow : null
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
              : null
          }
          create={
            permissions?.includes("productBrandCreate") ? BrandCreate : null
          }
          edit={permissions?.includes("productBrandEdit") ? BrandEdit : null}
          show={permissions?.includes("productBrandView") ? BrandShow : null}
          icon={DashIcon}
        />,
        permissions?.includes("managePurchaseMenu") ? (
          <Resource
            name="managePurchase"
            options={{
              label: "Manage Purchase",
              isMenuParent: true,
            }}
            icon={ManagePurchaseIcon}
          />
        ) : null,
        <Resource
          name="v1/productPurchase"
          options={{
            label: "Purchases",
            menuParent: "managePurchase",
          }}
          list={
            permissions?.includes("productPurchaseMenu") &&
            permissions?.includes("productPurchaseView")
              ? PurchaseList
              : null
          }
          create={
            permissions?.includes("productPurchaseCreate")
              ? PurchaseCreate
              : null
          }
          edit={
            permissions?.includes("productPurchaseEdit") ? PurchaseEdit : null
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
              : null
          }
          create={
            permissions?.includes("accountingBalanceMovementCreate")
              ? BalanceMovementCreate
              : null
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
              : null
          }
          edit={permissions?.includes("labCartEdit") ? LabCartEdit : null}
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
              : null
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
              : null
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
              : null
          }
          create={
            permissions?.includes("labSchedulesCreate")
              ? LabScheduleCreate
              : null
          }
          edit={
            permissions?.includes("labSchedulesEdit") ? LabScheduleEdit : null
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
              : null
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
              : null
          }
          create={
            permissions?.includes("labVendorCreate") ? LabVendorCreate : null
          }
          edit={permissions?.includes("labVendorEdit") ? LabVendorEdit : null}
          show={permissions?.includes("labVendorView") ? LabVendorShow : null}
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
              : null
          }
          create={
            permissions?.includes("labCategoryCreate")
              ? LabCategoryCreate
              : null
          }
          edit={
            permissions?.includes("labCategoryEdit") ? LabCategoryEdit : null
          }
          show={
            permissions?.includes("labCategoryView") ? LabCategoryShow : null
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
              : null
          }
          create={
            permissions?.includes("labCollectorCreate")
              ? LabCollectorCreate
              : null
          }
          edit={
            permissions?.includes("labCollectorEdit") ? LabCollectorsEdit : null
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
              : null
          }
          show={permissions?.includes("labZoneView") ? LabZoneShow : null}
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
              : null
          }
          show={
            permissions?.includes("labLocationView") ? LabLocationShow : null
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
              : null
          }
          show={
            permissions?.includes("labPatientsView") ? LabPatientShow : null
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
