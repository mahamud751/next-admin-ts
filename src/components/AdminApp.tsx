import * as React from "react";
import { Admin, localStorageStore, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./User/UserList";
import dataProvider from "@/dataProvider";
import LoginPage from "@/app/loginPage";

import { useClarity, useCacheBuster, useKeyboardShortcut } from "@/hooks";
import { SocketServer } from "@/utils/enums";
import { logger, isJSONParsable } from "@/utils/helpers";
import { axiosInstance } from "@/utils/http";
import { initiateSocket, socket } from "@/utils/socketio";

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
  ManageB2BIcon,
  ManageDatabaseIcon,
  ManageDeliveryIcon,
  ManageFinanceIcon,
  ManageHRIcon,
  ManageLabTestIcon,
  ManagePromotionsIcon,
  ManagePurchaseIcon,
  ManageRequisitionIcon,
  ManageSiteIcon,
  ManageStockIcon,
  ManageTaxonomyIcon,
  ManageUserIcon,
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
import {
  TaxonomyCreate,
  TaxonomyEdit,
  TaxonomyList,
  TaxonomyShow,
} from "@/pages/manageTaxonomy/taxonomies";
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
import {
  LabTestPckgCreate,
  LabTestPckgEdit,
  LabTestPckgList,
  LabTestPckgShow,
} from "@/pages/manageLabTest/manageTestPackage";
import {
  LabOrderCreate,
  LabOrderEdit,
  LabOrderList,
  LabOrderListShow,
} from "@/pages/manageLabTest/manageOrders";
import {
  PharmacyCreate,
  PharmacyEdit,
  PharmacyList,
  PharmacyShow,
} from "@/pages/manageB2B/pharmacy";
import {
  VocabularyCreate,
  VocabularyEdit,
  VocabularyList,
  VocabularyShow,
} from "@/pages/manageTaxonomy/vocabularies";
import {
  NotificationCreate,
  NotificationEdit,
  NotificationList,
  NotificationShow,
} from "@/pages/managePromotion/notifications";
import {
  NotificationScheduleCreate,
  NotificationScheduleList,
  NotificationScheduleShow,
} from "@/pages/managePromotion/notificationsSchedules";
import ShowMenu from "@/layout/ShowMenu";
import Dashboard from "@/pages/dashboard";
import authProvider from "@/authProvider";
import SwitchToPage from "@/pages/switchTo";
import {
  RegionCreate,
  RegionEdit,
  RegionList,
  RegionShow,
} from "@/pages/manageSite/regions";
import {
  PagesCreate,
  PagesEdit,
  PagesList,
  PagesShow,
} from "@/pages/manageSite/pages";
import {
  BlogCreate,
  BlogEdit,
  BlogList,
  BlogShow,
} from "@/pages/manageSite/blogs";
import {
  ShipmentEdit,
  ShipmentList,
  ShipmentShow,
} from "@/pages/manageDelivery/shipments";
import DeliveryTimeBenchmarkList from "@/pages/manageDelivery/deliveryTimeBenchmarkList/DeliveryTimeBenchmarkList";
import {
  LocationCreate,
  LocationEdit,
  LocationList,
  LocationShow,
} from "@/pages/manageUser/locations";
import {
  SubAreaCreate,
  SubAreaEdit,
  SubAreaList,
  SubAreaShow,
} from "@/pages/manageUser/subArea";
import {
  ThreePlList,
  ThreePlListCreate,
  ThreePlListEdit,
  ThreePlListShow,
} from "@/pages/manageDelivery/3plList";
import {
  BagCreate,
  BagEdit,
  BagList,
  BagShow,
} from "@/pages/manageDelivery/bags";
import { UserCreate, UserEdit, UserShow } from "@/pages/manageUser/users";
import {
  BulkUserCreate,
  BulkUserList,
  BulkUserShow,
} from "@/pages/manageUser/bulkUsers";
import { CartList } from "@/pages/manageUser/carts";
import {
  AddressCreate,
  AddressEdit,
  AddressList,
  AddressShow,
} from "@/pages/manageUser/addresses";
import { FlashSalesSettingList } from "@/pages/manageFlashSales/flashSalesSetting";
import ManageReview from "./icons/ManageReview";
import {
  WarehouseCreate,
  WarehouseEdit,
  WarehouseList,
  WarehouseShow,
} from "@/pages/manageWarehouse/warehouses";
import { StockList } from "@/pages/manageWarehouse/stocks";
import { RequestStockList } from "@/pages/manageWarehouse/requestStocks";
import AuditSystemList from "@/pages/manageWarehouse/auditSystem/AuditSystemList";
import { QCDashboardList } from "@/pages/manageWarehouse/qcDashboard";
import { QualityControlList } from "@/pages/manageWarehouse/qualityControl";
import ThreePlCollectionList from "@/pages/manageFinance/threePlCollection/ThreePlCollectionList";
import ThreePlCashCollection from "@/pages/manageFinance/threePlCollection/ThreePlCashCollection";
import ThreePlViewDetailsShow from "@/pages/manageFinance/threePlCollection/ThreePlViewDetailsShow";
import {
  CollectionList,
  CollectionShow,
} from "@/pages/manageFinance/collections";
import {
  LedgerCreate,
  LedgerEdit,
  LedgerList,
  LedgerShow,
} from "@/pages/manageFinance/ledgers";
import { UserTransactionList } from "@/pages/manageFinance/userTransactions";
import {
  DailyReportCreate,
  DailyReportEdit,
  DailyReportList,
  DailyReportShow,
} from "@/pages/manageFinance/dailyReports";
import ProductReview from "@/pages/manageReview/productReview";
import DailyReports2Page from "@/pages/manageFinance/dailyReports2";
import {
  VendorCreate,
  VendorEdit,
  VendorList,
  VendorShow,
} from "@/pages/manageDatabase/vendors";
import {
  VariantCreate,
  VariantEdit,
  VariantList,
  VariantShow,
} from "@/pages/manageDatabase/variants";
import {
  GenericCreate,
  GenericEdit,
  GenericList,
  GenericShow,
} from "@/pages/manageDatabase/generics";

import {
  EmployeeCreate,
  EmployeeEdit,
  EmployeeList,
  EmployeeShow,
} from "@/pages/manageHR/employees";
import EmployeeBankList from "@/pages/manageHR/employeeBanks/EmployeeBankList";
import EmployeeBankCreate from "@/pages/manageHR/employeeBanks/EmployeeBankCreate";
import EmployeeBankEdit from "@/pages/manageHR/employeeBanks/EmployeeBankEdit";
import EmployeeBankShow from "@/pages/manageHR/employeeBanks/EmployeeBankShow";
import {
  EmployeeLeaveCreate,
  EmployeeLeaveList,
} from "@/pages/manageHR/employeeLeaves";
import {
  SalaryCreate,
  SalaryEdit,
  SalaryList,
  SalaryShow,
} from "@/pages/manageHR/salaries";
import {
  EmployeeLoanCreate,
  EmployeeLoanEdit,
  EmployeeLoanList,
  EmployeeLoanShow,
} from "@/pages/manageHR/employeeLoans";
import {
  HolidayCreate,
  HolidayEdit,
  HolidayList,
  HolidayShow,
} from "@/pages/manageHR/holidays";
import {
  ShiftCreate,
  ShiftEdit,
  ShiftList,
  ShiftShow,
} from "@/pages/manageHR/shifts";
import {
  ShiftScheduleEdit,
  ShiftScheduleList,
  ShiftScheduleShow,
} from "@/pages/manageHR/shiftSchedules";
import {
  BankCreate,
  BankEdit,
  BankList,
  BankShow,
} from "@/pages/manageHR/banks";
import {
  AttendanceEdit,
  AttendanceList,
  AttendanceShow,
} from "@/pages/manageHR/attendances";
import { JobCreate, JobEdit, JobList, JobShow } from "@/pages/manageHR/jobs";
import {
  ApplicantCreate,
  ApplicantEdit,
  ApplicantList,
  ApplicantShow,
} from "@/pages/manageHR/applicants";
import {
  PolicyCreate,
  PolicyEdit,
  PolicyList,
  PolicyShow,
} from "@/pages/manageHR/policies";
import {
  CircularCreate,
  CircularEdit,
  CircularList,
  CircularShow,
} from "@/pages/manageHR/circulars";
import {
  EmployeeInfoCreate,
  EmployeeInfoEdit,
  EmployeeInfoList,
  EmployeeInfoShow,
} from "@/pages/manageHR/employeeInfos";

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
  // console.log("userInfo", userInfo);

  const store = localStorageStore();
  store.setItem("sidebar.open", true);
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={MyLayout}
      dashboard={Dashboard}
      theme={lightTheme}
      store={store}
      disableTelemetry
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
          name="v1/variantType"
          options={{
            label: "Variants",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("variantTypeMenu") &&
            permissions?.includes("variantTypeView")
              ? VariantList
              : null
          }
          create={
            permissions?.includes("variantTypeCreate") ? VariantCreate : null
          }
          edit={permissions?.includes("variantTypeEdit") ? VariantEdit : null}
          show={permissions?.includes("variantTypeView") ? VariantShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/vendor"
          options={{
            label: "Vendors",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("vendorMenu") &&
            permissions?.includes("vendorView")
              ? VendorList
              : null
          }
          create={permissions?.includes("vendorCreate") ? VendorCreate : null}
          edit={permissions?.includes("vendorEdit") ? VendorEdit : null}
          show={permissions?.includes("vendorView") ? VendorShow : null}
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
        <Resource
          name="v1/generics"
          options={{
            label: "Generics",
            menuParent: "manageDatabase",
          }}
          list={
            permissions?.includes("genericMenu") &
            permissions?.includes("genericView")
              ? GenericList
              : null
          }
          create={permissions?.includes("genericCreate") ? GenericCreate : null}
          edit={permissions?.includes("genericEdit") ? GenericEdit : null}
          show={permissions?.includes("genericView") ? GenericShow : null}
          icon={DashIcon}
        />,
        permissions?.includes("manageSiteMenu") ? (
          <Resource
            name="manageSite"
            options={{
              label: "Manage Site",
              isMenuParent: true,
            }}
            icon={ManageSiteIcon}
          />
        ) : null,
        <Resource
          name="v1/region"
          options={{
            label: "Regions",
            menuParent: "manageSite",
          }}
          list={
            permissions?.includes("regionMenu") &&
            permissions?.includes("regionView")
              ? RegionList
              : null
          }
          create={permissions?.includes("regionCreate") ? RegionCreate : null}
          edit={permissions?.includes("regionEdit") ? RegionEdit : null}
          show={permissions?.includes("regionView") ? RegionShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/adminPages"
          options={{
            label: "Pages",
            menuParent: "manageSite",
          }}
          list={
            permissions?.includes("pageMenu") &&
            permissions?.includes("pageView")
              ? PagesList
              : null
          }
          create={permissions?.includes("pageCreate") ? PagesCreate : null}
          edit={permissions?.includes("pageEdit") ? PagesEdit : null}
          show={permissions?.includes("pageView") ? PagesShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/blogPost"
          options={{
            label: "Blogs",
            menuParent: "manageSite",
          }}
          list={
            permissions?.includes("blogMenu") &&
            permissions?.includes("blogPostView")
              ? BlogList
              : null
          }
          create={permissions?.includes("blogPostCreate") ? BlogCreate : null}
          edit={permissions?.includes("blogPostEdit") ? BlogEdit : null}
          show={permissions?.includes("blogPostView") ? BlogShow : null}
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
        permissions?.includes("manageHrMenu") ? (
          <Resource
            name="manageHr"
            options={{
              label: "Manage HR",
              isMenuParent: true,
            }}
            icon={ManageHRIcon}
          />
        ) : null,
        permissions?.includes("employeeAttendanceMenu") ? (
          <Resource
            name="employeeDashboard"
            options={{
              label: "Employee Dashboard",
              menuParent: "manageHr",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ) : null,
        permissions?.includes("employeeHierarchyMenu") ? (
          <Resource
            name="employeeHierarchy"
            options={{
              label: "Employee Hierarchy",
              menuParent: "manageHr",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ) : null,
        <Resource
          name="v1/employee"
          options={{
            label: "Employees",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("employeeMenu") &&
            permissions?.includes("employeeView")
              ? EmployeeList
              : null
          }
          create={
            permissions?.includes("employeeCreate") ? EmployeeCreate : null
          }
          edit={permissions?.includes("employeeEdit") ? EmployeeEdit : null}
          show={permissions?.includes("employeeView") ? EmployeeShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/employeeInfo"
          options={{
            label: "Employee Infos",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("employeeInfoMenu") &&
            permissions?.includes("employeeInfoView")
              ? EmployeeInfoList
              : null
          }
          create={
            permissions?.includes("employeeInfoCreate")
              ? EmployeeInfoCreate
              : null
          }
          edit={
            permissions?.includes("employeeInfoEdit") ? EmployeeInfoEdit : null
          }
          show={
            permissions?.includes("employeeInfoView") ? EmployeeInfoShow : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/employeeBank"
          options={{
            label: "Employee Banks",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("employeeBankMenu") &&
            permissions?.includes("employeeBankView")
              ? EmployeeBankList
              : null
          }
          create={
            permissions?.includes("employeeBankCreate")
              ? EmployeeBankCreate
              : null
          }
          edit={
            permissions?.includes("employeeBankEdit") ? EmployeeBankEdit : null
          }
          show={
            permissions?.includes("employeeBankView") ? EmployeeBankShow : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/employeeLeave"
          options={{
            label: "Leaves",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("employeeLeaveMenu") &&
            permissions?.includes("employeeLeaveView")
              ? EmployeeLeaveList
              : null
          }
          create={
            permissions?.includes("employeeLeaveCreate")
              ? EmployeeLeaveCreate
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/salary"
          options={{
            label: "Salaries",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("salaryMenu") &&
            permissions?.includes("salaryView")
              ? SalaryList
              : null
          }
          create={
            permissions?.includes("salaryAdjustmentCreate")
              ? SalaryCreate
              : null
          }
          edit={
            permissions?.includes("salaryAdjustmentEdit") ? SalaryEdit : null
          }
          show={permissions?.includes("salaryView") ? SalaryShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/employeeLoan"
          options={{
            label: "Loans",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("employeeLoanMenu") &&
            permissions?.includes("employeeLoanView")
              ? EmployeeLoanList
              : null
          }
          create={
            permissions?.includes("employeeLoanCreate")
              ? EmployeeLoanCreate
              : null
          }
          edit={
            permissions?.includes("employeeLoanEdit") ? EmployeeLoanEdit : null
          }
          show={
            permissions?.includes("employeeLoanView") ? EmployeeLoanShow : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/holiday"
          options={{
            label: "Holidays",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("holidayMenu") &&
            permissions?.includes("holidayView")
              ? HolidayList
              : null
          }
          create={permissions?.includes("holidayCreate") ? HolidayCreate : null}
          edit={permissions?.includes("holidayEdit") ? HolidayEdit : null}
          show={permissions?.includes("holidayView") ? HolidayShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/shift"
          options={{
            label: "Shifts",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("shiftMenu") &&
            permissions?.includes("shiftView")
              ? ShiftList
              : null
          }
          create={permissions?.includes("shiftCreate") ? ShiftCreate : null}
          edit={permissions?.includes("shiftEdit") ? ShiftEdit : null}
          show={permissions?.includes("shiftView") ? ShiftShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/shiftSchedule"
          options={{
            label: "Shift Schedules",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("shiftScheduleMenu") &&
            permissions?.includes("shiftScheduleView")
              ? ShiftScheduleList
              : null
          }
          edit={
            permissions?.includes("shiftScheduleEdit")
              ? ShiftScheduleEdit
              : null
          }
          show={
            permissions?.includes("shiftScheduleView")
              ? ShiftScheduleShow
              : null
          }
          icon={DashIcon}
        />,
        permissions?.includes("departmentMenu") && (
          <Resource
            name="departments"
            options={{
              label: "Departments",
              menuParent: "manageHr",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ),
        permissions?.includes("rankMenu") && (
          <Resource
            name="designations"
            options={{
              label: "Designations",
              menuParent: "manageHr",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ),
        <Resource
          name="v1/bank"
          options={{
            label: "Banks",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("bankMenu") &&
            permissions?.includes("bankView")
              ? BankList
              : null
          }
          create={permissions?.includes("bankCreate") ? BankCreate : null}
          edit={permissions?.includes("bankEdit") ? BankEdit : null}
          show={permissions?.includes("bankView") ? BankShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/employeeAttendance"
          options={{
            label: "Attendances",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("employeeAttendanceMenu") &&
            permissions?.includes("employeeAttendanceView")
              ? AttendanceList
              : null
          }
          edit={
            permissions?.includes("employeeAttendanceEdit")
              ? AttendanceEdit
              : null
          }
          show={
            permissions?.includes("employeeAttendanceView")
              ? AttendanceShow
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/job"
          options={{ label: "Jobs", menuParent: "manageHr" }}
          list={
            permissions?.includes("jobMenu") && permissions?.includes("jobView")
              ? JobList
              : null
          }
          create={permissions?.includes("jobCreate") ? JobCreate : null}
          edit={permissions?.includes("jobEdit") ? JobEdit : null}
          show={permissions?.includes("jobView") ? JobShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/jobApplications"
          options={{
            label: "Applicants",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("jobApplicationMenu") &&
            permissions?.includes("jobApplicationView")
              ? ApplicantList
              : null
          }
          create={
            permissions?.includes("jobApplicationCreate")
              ? ApplicantCreate
              : null
          }
          edit={
            permissions?.includes("jobApplicationEdit") ? ApplicantEdit : null
          }
          show={
            permissions?.includes("jobApplicationView") ? ApplicantShow : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/policy"
          options={{
            label: "Policies",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("policyMenu") &&
            permissions?.includes("policyView")
              ? PolicyList
              : null
          }
          create={permissions?.includes("policyCreate") ? PolicyCreate : null}
          edit={permissions?.includes("policyEdit") ? PolicyEdit : null}
          show={permissions?.includes("policyView") ? PolicyShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/circular"
          options={{
            label: "Circulars",
            menuParent: "manageHr",
          }}
          list={
            permissions?.includes("circularMenu") &&
            permissions?.includes("circularView")
              ? CircularList
              : null
          }
          create={
            permissions?.includes("circularCreate") ? CircularCreate : null
          }
          edit={permissions?.includes("circularEdit") ? CircularEdit : null}
          show={permissions?.includes("circularView") ? CircularShow : null}
          icon={DashIcon}
        />,
        permissions?.includes("manageTaxonomyMenu") ? (
          <Resource
            name="manageTaxonomy"
            options={{
              label: "Manage Taxonomy",
              isMenuParent: true,
            }}
            icon={ManageTaxonomyIcon}
          />
        ) : null,
        <Resource
          name="v1/vocabulary"
          options={{
            label: "Vocabularies",
            menuParent: "manageTaxonomy",
          }}
          list={
            permissions?.includes("vocabularyMenu") &&
            permissions?.includes("vocabularyView")
              ? VocabularyList
              : null
          }
          create={
            permissions?.includes("vocabularyCreate") ? VocabularyCreate : null
          }
          edit={permissions?.includes("vocabularyEdit") ? VocabularyEdit : null}
          show={permissions?.includes("vocabularyView") ? VocabularyShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/taxonomy"
          options={{
            label: "Taxonomy Terms",
            menuParent: "manageTaxonomy",
          }}
          list={
            permissions?.includes("taxonomyMenu") &&
            permissions?.includes("taxonomyView")
              ? TaxonomyList
              : null
          }
          create={
            permissions?.includes("taxonomyCreate") ? TaxonomyCreate : null
          }
          edit={permissions?.includes("taxonomyEdit") ? TaxonomyEdit : null}
          show={permissions?.includes("taxonomyView") ? TaxonomyShow : null}
          icon={DashIcon}
        />,
        permissions?.includes("manageUserMenu") ? (
          <Resource
            name="manageUser"
            options={{
              label: "Manage User",
              isMenuParent: true,
            }}
            icon={ManageUserIcon}
          />
        ) : null,
        <Resource
          name="v1/users"
          options={{
            label: "Users",
            menuParent: "manageUser",
          }}
          list={
            permissions?.includes("userMenu") &&
            permissions?.includes("userView")
              ? UserList
              : null
          }
          create={permissions?.includes("userCreate") ? UserCreate : null}
          edit={permissions?.includes("userEdit") ? UserEdit : null}
          show={permissions?.includes("userView") ? UserShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/bulkUserCreateRequest"
          options={{
            label: "Bulk Users",
            menuParent: "manageUser",
          }}
          list={
            permissions?.includes("bulkUserCreateRequestMenu") &&
            permissions?.includes("bulkUserCreateRequestView")
              ? BulkUserList
              : null
          }
          create={
            permissions?.includes("bulkUserCreateRequestCreate")
              ? BulkUserCreate
              : null
          }
          show={
            permissions?.includes("bulkUserCreateRequestView")
              ? BulkUserShow
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/userCart"
          options={{
            label: "Carts",
            menuParent: "manageUser",
          }}
          list={
            permissions?.includes("userCartMenu") &&
            permissions?.includes("userCartView")
              ? CartList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/userLocations"
          options={{
            label: "Addresses",
            menuParent: "manageUser",
          }}
          list={
            permissions?.includes("userLocationMenu") &&
            permissions?.includes("userLocationView")
              ? AddressList
              : null
          }
          create={
            permissions?.includes("userLocationCreate") ? AddressCreate : null
          }
          edit={permissions?.includes("userLocationEdit") ? AddressEdit : null}
          show={permissions?.includes("userLocationView") ? AddressShow : null}
          icon={DashIcon}
        />,

        permissions?.includes("prescriptionMenu") ? (
          <Resource
            name="prescriptions"
            options={{
              label: "Prescriptions",
              menuParent: "manageUser",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ) : null,
        permissions?.includes("permissionMenu") ? (
          <Resource
            name="permissions"
            options={{
              label: "Role Permissions",
              menuParent: "manageUser",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ) : null,
        permissions?.includes("permissionMenu") ? (
          <Resource
            name="permissions-list"
            options={{
              label: "Permissions List",
              menuParent: "manageUser",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ) : null,
        permissions?.includes("manageB2BMenu") ? (
          <Resource
            name="manageB2B"
            options={{
              label: "Manage B2B",
              isMenuParent: true,
            }}
            icon={ManageB2BIcon}
          />
        ) : null,
        <Resource
          name="v1/pharmacy"
          options={{
            label: "B2B",
            menuParent: "manageB2B",
          }}
          list={
            permissions?.includes("pharmacyMenu") &&
            permissions?.includes("pharmacyView")
              ? PharmacyList
              : null
          }
          create={
            permissions?.includes("pharmacyCreate") ? PharmacyCreate : null
          }
          edit={permissions?.includes("pharmacyEdit") ? PharmacyEdit : null}
          show={permissions?.includes("pharmacyView") ? PharmacyShow : null}
          icon={DashIcon}
        />,
        permissions?.includes("manageDeliveryMenu") ? (
          <Resource
            name="manageDelivery"
            options={{
              label: "Manage Delivery",
              isMenuParent: true,
            }}
            icon={ManageDeliveryIcon}
          />
        ) : null,

        permissions?.includes("zoneMenuView") && (
          <Resource
            name="zone"
            options={{
              label: "Zone",
              menuParent: "manageDelivery",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ),
        <Resource
          name="v1/location"
          options={{
            label: "Locations",
            menuParent: "manageDelivery",
          }}
          list={
            permissions?.includes("locationMenu") &&
            permissions?.includes("locationView")
              ? LocationList
              : null
          }
          create={
            permissions?.includes("locationCreate") ? LocationCreate : null
          }
          edit={permissions?.includes("locationEdit") ? LocationEdit : null}
          show={permissions?.includes("locationView") ? LocationShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/subArea"
          options={{
            label: "Sub Area",
            menuParent: "manageDelivery",
          }}
          list={
            permissions?.includes("subAreaMenu") &&
            permissions?.includes("subAreaView")
              ? SubAreaList
              : null
          }
          create={permissions?.includes("subAreaCreate") ? SubAreaCreate : null}
          edit={permissions?.includes("subAreaEdit") ? SubAreaEdit : null}
          show={permissions?.includes("subAreaView") ? SubAreaShow : null}
          icon={DashIcon}
        />,
        permissions?.includes("tplCompanyView") && (
          <Resource
            name="v1/tplCompany"
            options={{
              label: "3PL List",
              menuParent: "manageDelivery",
            }}
            list={ThreePlList}
            create={ThreePlListCreate}
            edit={ThreePlListEdit}
            show={ThreePlListShow}
            icon={DashIcon}
          />
        ),
        <Resource
          name="v1/shipmentBag"
          options={{
            label: "Bags",
            menuParent: "manageDelivery",
          }}
          list={
            permissions?.includes("shipmentBagMenu") &&
            permissions?.includes("shipmentBagView")
              ? BagList
              : null
          }
          create={permissions?.includes("shipmentBagCreate") ? BagCreate : null}
          edit={permissions?.includes("shipmentBagEdit") ? BagEdit : null}
          show={permissions?.includes("shipmentBagView") ? BagShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/shipment"
          options={{
            label: "Shipment",
            menuParent: "manageDelivery",
          }}
          list={
            permissions?.includes("shipmentMenu") &&
            permissions?.includes("shipmentView")
              ? ShipmentList
              : null
          }
          show={permissions?.includes("shipmentView") ? ShipmentShow : null}
          edit={permissions?.includes("shipmentEdit") ? ShipmentEdit : null}
          icon={DashIcon}
        />,

        permissions?.includes("viewDeliveryCompanyPerformance") && (
          <Resource
            name="v1/deliveryTimeBenchmark"
            options={{
              label: "3PL Delivery Time",
              menuParent: "manageDelivery",
            }}
            list={DeliveryTimeBenchmarkList}
            icon={DashIcon}
          />
        ),
        permissions?.includes("manageWarehouseMenu") ? (
          <Resource
            name="manageWarehouse"
            options={{
              label: "Manage Warehouse",
              isMenuParent: true,
            }}
            icon={ManageStockIcon}
          />
        ) : null,
        <Resource
          name="v1/warehouse"
          options={{
            label: "Warehouses",
            menuParent: "manageWarehouse",
          }}
          list={
            permissions?.includes("warehouseMenu") &&
            permissions?.includes("warehouseView")
              ? WarehouseList
              : null
          }
          create={
            permissions?.includes("warehouseCreate") ? WarehouseCreate : null
          }
          edit={permissions?.includes("warehouseEdit") ? WarehouseEdit : null}
          show={permissions?.includes("warehouseView") ? WarehouseShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/stock"
          options={{
            label: "Stocks",
            menuParent: "manageWarehouse",
          }}
          list={
            permissions?.includes("stockMenu") &&
            permissions?.includes("stockView")
              ? StockList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/productRequestStock"
          options={{
            label: "Request Stocks",
            menuParent: "manageWarehouse",
          }}
          list={
            permissions?.includes("productRequestStockMenu") &&
            permissions?.includes("productRequestStockView")
              ? RequestStockList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/stockAudit"
          options={{
            label: "Audit System",
            menuParent: "manageWarehouse",
          }}
          list={
            permissions?.includes("stockAuditMenu") &&
            permissions?.includes("stockAuditView")
              ? AuditSystemList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/qualityControl"
          options={{
            label: "QC List",
            menuParent: "manageWarehouse",
          }}
          list={
            permissions?.includes("qualityControlMenu") &&
            permissions?.includes("qualityControlView")
              ? QualityControlList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/qcDashboard"
          options={{
            label: "QC Logistics",
            menuParent: "manageWarehouse",
          }}
          list={
            permissions?.includes("qcDashboardMenu") &&
            permissions?.includes("qcDashboardView")
              ? QCDashboardList
              : null
          }
          icon={DashIcon}
        />,
        permissions?.includes("managePromotionsMenu") && (
          <Resource
            name="promotions"
            options={{
              label: "Manage Promotion",
              isMenuParent: true,
            }}
            icon={ManagePromotionsIcon}
          />
        ),
        <Resource
          name="v1/notification"
          options={{
            label: "Notifications",
            menuParent: "promotions",
          }}
          list={
            permissions?.includes("notificationMenu") &&
            permissions?.includes("notificationView")
              ? NotificationList
              : null
          }
          create={
            permissions?.includes("notificationCreate")
              ? NotificationCreate
              : null
          }
          edit={
            permissions?.includes("notificationEdit") ? NotificationEdit : null
          }
          show={
            permissions?.includes("notificationView") ? NotificationShow : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/NotificationSchedule"
          options={{
            label: "Notifications Schedules",
            menuParent: "promotions",
          }}
          list={
            permissions?.includes("notificationScheduleMenu") &&
            permissions?.includes("notificationScheduleView")
              ? NotificationScheduleList
              : null
          }
          create={
            permissions?.includes("notificationScheduleCreate")
              ? NotificationScheduleCreate
              : null
          }
          show={
            permissions?.includes("notificationScheduleView")
              ? NotificationScheduleShow
              : null
          }
          icon={DashIcon}
        />,
        permissions?.includes("promotionalMessageMenu") && (
          <Resource
            name="promotional-messages"
            options={{
              label: "Promotional Messages",
              menuParent: "promotions",
            }}
            list={ShowMenu}
            icon={DashIcon}
          />
        ),
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
        permissions?.includes("manageFinanceMenu") ? (
          <Resource
            name="manageFinance"
            options={{
              label: "Manage Finance",
              isMenuParent: true,
            }}
            icon={ManageFinanceIcon}
          />
        ) : null,
        <Resource
          name="v1/tplCollection"
          options={{
            label: "3PL Collections",
            menuParent: "manageFinance",
          }}
          list={
            permissions?.includes("view3PLCollection") ||
            permissions?.includes("viewAll3PLCollection")
              ? ThreePlCollectionList
              : null
          }
          create={
            permissions?.includes("submit3PLCollection") &&
            ThreePlCashCollection
          }
          show={ThreePlViewDetailsShow}
          icon={DashIcon}
        />,

        <Resource
          name="v1/cashCollection"
          options={{
            label: "Collections",
            menuParent: "manageFinance",
          }}
          list={
            permissions?.includes("collectionMenu") &&
            permissions?.includes("collectionView")
              ? CollectionList
              : null
          }
          show={permissions?.includes("collectionView") ? CollectionShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/ledger"
          options={{
            label: "Ledgers",
            menuParent: "manageFinance",
          }}
          list={
            permissions?.includes("ledgerMenu") &&
            permissions?.includes("ledgerView")
              ? LedgerList
              : null
          }
          create={permissions?.includes("ledgerCreate") ? LedgerCreate : null}
          edit={permissions?.includes("ledgerEdit") ? LedgerEdit : null}
          show={permissions?.includes("ledgerView") ? LedgerShow : null}
          icon={DashIcon}
        />,
        <Resource
          name="v1/userTransaction"
          options={{
            label: "User Transactions",
            menuParent: "manageFinance",
          }}
          list={
            permissions?.includes("userTransactionMenu") &&
            permissions?.includes("userTransactionView")
              ? UserTransactionList
              : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="v1/daily-report"
          options={{
            label: "Daily Reports",
            menuParent: "manageFinance",
          }}
          list={
            permissions?.includes("dailyReportMenu") &&
            permissions?.includes("dailyReportView")
              ? DailyReportList
              : null
          }
          create={
            permissions?.includes("dailyReportCreate")
              ? DailyReportCreate
              : null
          }
          edit={
            permissions?.includes("dailyReportEdit") ? DailyReportEdit : null
          }
          show={
            permissions?.includes("dailyReportView") ? DailyReportShow : null
          }
          icon={DashIcon}
        />,
        <Resource
          name="daily-reports-2"
          options={{
            label: "Daily Reports 2",
            menuParent: "manageFinance",
          }}
          list={DailyReports2Page}
          icon={DashIcon}
        />,
        permissions?.includes("dailyReportMenu") &&
          permissions?.includes("dailyReportView") && (
            <Resource
              name="daily-reports-2"
              options={{
                label: "Daily Reports 2",
                menuParent: "manageFinance",
              }}
              list={ShowMenu}
              icon={DashIcon}
            />
          ),

        permissions?.includes("manageFlashSaleMenu") ? (
          <Resource
            name="manageFlashSale"
            options={{
              label: "Manage Flash Sale",
              isMenuParent: true,
            }}
            icon={ManageFinanceIcon}
          />
        ) : null,
        permissions?.includes("flashSalesMenu") && (
          <Resource
            name="flashSales"
            options={{
              label: "Flash Sales Setting",
              menuParent: "manageFlashSale",
            }}
            list={FlashSalesSettingList}
            icon={DashIcon}
          />
        ),
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
          name="lab-order/api/v1/admin/orders"
          options={{
            label: "Orders",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labOrdersMenu") &&
            permissions?.includes("labOrdersView")
              ? LabOrderList
              : null
          }
          create={
            permissions?.includes("labOrdersCreate") ? LabOrderCreate : null
          }
          edit={permissions?.includes("labOrdersEdit") ? LabOrderEdit : null}
          show={
            permissions?.includes("labOrdersView") ? LabOrderListShow : null
          }
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
          name="misc/api/v1/admin/lab-items"
          options={{
            label: "Lab Tests",
            menuParent: "manageLabTest",
          }}
          list={
            permissions?.includes("labLabItemsMenu") &&
            permissions?.includes("labLabItemsView")
              ? LabTestPckgList
              : null
          }
          create={
            permissions?.includes("labLabItemsCreate")
              ? LabTestPckgCreate
              : null
          }
          edit={
            permissions?.includes("labLabItemsEdit") ? LabTestPckgEdit : null
          }
          show={
            permissions?.includes("labLabItemsView") ? LabTestPckgShow : null
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
          name="switch-to"
          options={{
            label: "Lab Zones",
            menuParent: "manageLabTest",
          }}
          list={SwitchToPage}
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

        permissions?.includes("productReviewView") ? (
          <Resource
            name="manageReview"
            options={{
              label: "Manage Review",
              isMenuParent: true,
            }}
            icon={ManageReview}
          />
        ) : null,

        <Resource
          name="productReview/pending"
          options={{
            label: "Product Review",
            menuParent: "manageReview",
          }}
          list={ProductReview}
          icon={DashIcon}
        />,
      ]}
    </Admin>
  );
};

export default AdminApp;
