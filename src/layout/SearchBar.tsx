import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  InputAdornment,
  TextField,
  useMediaQuery,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

import { useGetCurrentUser } from "../hooks";
import useKeyboardSearchShortcut from "../hooks/useKeyboardSearchShortcut";
import { logger } from "../utils/helpers";

// Replacing makeStyles with styled or sx prop for Material UI v6
const SearchBar = () => {
  const theme = useTheme();
  const searchInputRef = useRef(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { permissions } = useGetCurrentUser();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    open && searchInputRef.current && searchInputRef.current.focus();
  }, [open]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchSelection = (_, value) => {
    if (value) {
      const resource = value?.resource?.trim().toLowerCase();
      const selectedMenu = menus.find(
        (menu) => menu?.resource.toLowerCase() === resource
      );

      if (selectedMenu) {
        const hasPermission = permissions?.includes(
          selectedMenu?.permissionmenu
        );
        if (hasPermission || !selectedMenu.resource) {
          globalThis.location.assign(
            `${globalThis.location.pathname}#/${resource}`
          );
          handleClose();
        } else {
          logger("Permission error!");
        }
      } else {
        logger("Menu not found for the selected resource!");
      }
    }
  };

  const allowedMenus = menus.filter((menu) =>
    permissions?.includes(menu?.permissionmenu)
  );

  useKeyboardSearchShortcut(handleClickOpen);

  return (
    <>
      <div
        style={{
          width: 200,
          marginLeft: 0,
          marginRight: 5,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.action.hover,
        }}
      >
        <Button
          sx={{
            width: 200,
            color: "inherit",
            textTransform: "none",
          }}
          onClick={handleClickOpen}
        >
          <SearchIcon sx={{ marginRight: "10px" }} />
          Search menu...
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="responsive-dialog-resource"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ width: 400 }}>
              <Autocomplete
                id="free-solo-2-demo"
                open={open}
                onChange={handleSearchSelection}
                options={allowedMenus}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Menu"
                    margin="normal"
                    variant="outlined"
                    inputRef={searchInputRef}
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    autoFocus
                  />
                )}
                disableClearable
                freeSolo
              />
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;

const menus = [
  {
    resource: "productCategory",
    label: "Product Categories",
    permissionmenu: "productCategoryMenu",
  },
  {
    resource: "v1/product",
    label: "Products",
    permissionmenu: "productMenu",
  },
  {
    resource: "v1/suggestedProduct",
    label: "Suggested Products",
    permissionmenu: "suggestedProductMenu",
  },
  {
    resource: "v1/productUnit",
    label: "Product Units",
    permissionmenu: "productUnitMenu",
  },
  {
    resource: "v1/productDiscount",
    label: "Discounts",
    permissionmenu: "productDiscountMenu",
  },
  {
    resource: "v1/variantType",
    label: "Variants",
    permissionmenu: "variantTypeMenu",
  },
  { resource: "v1/vendor", label: "Vendors", permissionmenu: "vendorMenu" },
  {
    resource: "v1/productBrand",
    label: "Brands",
    permissionmenu: "productBrandMenu",
  },
  {
    resource: "v1/generics",
    label: "Generics",
    permissionmenu: "genericMenu",
  },
  { resource: "v1/region", label: "Regions", permissionmenu: "regionMenu" },
  { resource: "v1/block", label: "Blocks", permissionmenu: "blockMenu" },
  { resource: "v1/adminPages", label: "Pages", permissionmenu: "pageMenu" },
  { resource: "v1/blogPost", label: "Blogs", permissionmenu: "blogMenu" },
  { resource: "v1/menu", label: "Menus", permissionmenu: "menuMenu" },
  {
    resource: "v1/vocabulary",
    label: "Vocabularies",
    permissionmenu: "vocabularyMenu",
  },
  {
    resource: "v1/taxonomy",
    label: "Taxonomy Terms",
    permissionmenu: "taxonomyMenu",
  },
  { resource: "v1/users", label: "Manage User", permissionmenu: "userMenu" },
  {
    resource: "v1/users/create",
    label: "Users",
    permissionmenu: "userCreate",
  },
  {
    resource: "v1/userCart",
    label: "Carts",
    permissionmenu: "userCartMenu",
  },
  {
    resource: "v1/userLocations",
    label: "Addresses",
    permissionmenu: "userLocationMenu",
  },
  {
    resource: "v1/subArea",
    label: "Sub Area",
    permissionmenu: "subAreaMenu",
  },
  {
    resource: "prescriptions",
    label: "Prescriptions",
    permissionmenu: "prescriptionMenu",
  },
  {
    resource: "v1/location",
    label: "Locations",
    permissionmenu: "locationMenu",
  },
  {
    resource: "v1/notification",
    label: "Notifications",
    permissionmenu: "notificationMenu",
  },
  {
    resource: "v1/pharmacy",
    label: "Pharmacy",
    permissionmenu: "pharmacyMenu",
  },
  {
    resource: "v1/productOrder",
    label: "Orders",
    permissionmenu: "productOrderMenu",
  },
  {
    resource: "v1/productOrderItem",
    label: "Order Products",
    permissionmenu: "productOrderItemMenu",
  },
  {
    resource: "v1/pendingReorder",
    label: "Pending Reorders",
    permissionmenu: "pendingReOrderMenu",
  },
  { resource: "v1/issue", label: "Issues", permissionmenu: "issueMenu" },
  {
    resource: "v1/productPurchase",
    label: "Purchases",
    permissionmenu: "productPurchaseMenu",
  },
  {
    resource: "v1/productPurchaseItem",
    label: "Purchase Items",
    permissionmenu: "productPurchaseItemMenu",
  },
  {
    resource: "v1/purchaseOrder",
    label: "Purchase Orders",
    permissionmenu: "purchaseOrderMenu",
  },
  {
    resource: "v1/procurementStatus",
    label: "Procurements",
    permissionmenu: "procurementMenu",
  },
  {
    resource: "v1/employee",
    label: "Employees",
    permissionmenu: "employeeMenu",
  },
  {
    resource: "v1/employeeInfo",
    label: "Employee Infos",
    permissionmenu: "employeeInfoMenu",
  },
  {
    resource: "v1/employeeBank",
    label: "Employee Banks",
    permissionmenu: "employeeBankMenu",
  },
  {
    resource: "v1/employeeLeave",
    label: "Leaves",
    permissionmenu: "employeeLeaveMenu",
  },
  { resource: "v1/salary", label: "Salaries", permissionmenu: "salaryMenu" },
  {
    resource: "v1/employeeLoan",
    label: "Loans",
    permissionmenu: "employeeLoanMenu",
  },
  {
    resource: "v1/holiday",
    label: "Holidays",
    permissionmenu: "holidayMenu",
  },
  { resource: "v1/shift", label: "Shifts", permissionmenu: "shiftMenu" },
  {
    resource: "v1/shiftSchedule",
    label: "Shift Schedules",
    permissionmenu: "shiftScheduleMenu",
  },
  { resource: "v1/bank", label: "Banks", permissionmenu: "bankMenu" },
  {
    resource: "v1/employeeAttendance",
    label: "Attendances",
    permissionmenu: "employeeAttendanceMenu",
  },
  { resource: "v1/job", label: "Jobs", permissionmenu: "jobMenu" },
  {
    resource: "v1/jobApplications",
    label: "Applicants",
    permissionmenu: "jobApplicationMenu",
  },
  {
    resource: "v1/shipmentBag",
    label: "Bags",
    permissionmenu: "shipmentBagMenu",
  },
  {
    resource: "employeeDashboard",
    label: "Employee Dashboard",
    permissionmenu: "employeeAttendanceMenu",
  },
  {
    resource: "employeeHierarchy",
    label: "Employee Hierarchy",
    permissionmenu: "employeeHierarchyMenu",
  },
  {
    resource: "departments",
    label: "Departments",
    permissionmenu: "departmentMenu",
  },
  {
    resource: "designations",
    label: "Designations",
    permissionmenu: "rankMenu",
  },
  {
    resource: "permissions",
    label: "Permissions",
    permissionmenu: "permissionMenu",
  },
  {
    resource: "permissions-list",
    label: "Role Permissions",
    permissionmenu: "permissionMenu",
  },
  {
    resource: "trial-balance",
    label: "Trial Balance",
    permissionmenu: "trialBalanceMenu",
  },
  {
    resource: "balance-sheet",
    label: "Balance Sheet",
    permissionmenu: "balanceSheetMenu",
  },
  {
    resource: "accountingBalanceMovement",
    label: "Balance Movement",
    permissionmenu: "accountingBalanceMovementMenu",
  },
  {
    resource: "income-statement",
    label: "Income Statement",
    permissionmenu: "incomeStatementMenu",
  },
  {
    resource: "promotional-messages",
    label: "Promotional Messages",
    permissionmenu: "promotionalMessageMenu",
  },
  {
    resource: "v1/shipment",
    label: "Lab Report Shipments",
    permissionmenu: "shipmentMenu",
  },
  {
    resource: "v1/warehouse",
    label: "Manage Warehouse",
    permissionmenu: "warehouseMenu",
  },
  { resource: "v1/stock", label: "Stocks", permissionmenu: "stockMenu" },
  {
    resource: "v1/productRequestStock",
    label: "Request Stocks",
    permissionmenu: "productRequestStockMenu",
  },
  {
    resource: "v1/stockAudit",
    label: "Audit System",
    permissionmenu: "stockAuditMenu",
  },
  {
    resource: "v1/qualityControl",
    label: "QC List",
    permissionmenu: "qualityControlMenu",
  },
  {
    resource: "v1/qcDashboard",
    label: "QC Logistics",
    permissionmenu: "qcDashboardMenu",
  },
  {
    resource: "v1/shelving",
    label: "Shelving",
    permissionmenu: "shelvingMenu",
  },
  {
    resource: "v1/tplCollection",
    label: "3PL Collections",
    permissionmenu: "view3PLCollection",
  },
  {
    resource: "v1/cashCollection",
    label: "Collections",
    permissionmenu: "collectionMenu",
  },
  { resource: "v1/ledger", label: "Ledgers", permissionmenu: "ledgerMenu" },
  {
    resource: "v1/userTransaction",
    label: "User Transactions",
    permissionmenu: "userTransactionMenu",
  },
  {
    resource: "v1/daily-report",
    label: "Daily Reports",
    permissionmenu: "dailyReportMenu",
  },
  {
    resource: "v1/daily-report-2",
    label: "Daily Reports 2",
    permissionmenu: "dailyReportMenu",
  },
  {
    resource: "v1/accountingHead",
    label: "Accounting Heads",
    permissionmenu: "accountingHeadMenu",
  },
  {
    resource: "v1/accountingTransaction",
    label: "Transactions",
    permissionmenu: "accountingTransactionMenu",
  },
  { resource: "v1/asset", label: "Assets", permissionmenu: "assetMenu" },
  { resource: "v1/opEx", label: "OpEx", permissionmenu: "opExMenu" },
  {
    resource: "v1/expenseEntry",
    label: "Expense Entry",
    permissionmenu: "expenseEntryMenu",
  },
  {
    resource: "v1/expenseHeadMapping",
    label: "Expense Head Mapping",
    permissionmenu: "expenseHeadMappingMenu",
  },
  {
    resource: "v1/purchaseRequisition",
    label: "Purchase Requisition",
    permissionmenu: "purchaserequisitionMenu",
  },
  {
    resource: "v1/approvalCap",
    label: "Cap Approvals",
    permissionmenu: "approvalCapMenu",
  },
  {
    resource: "v1/supplier",
    label: "Suppliers",
    permissionmenu: "supplierMenu",
  },
  {
    resource: "v1/requisitionPayment",
    label: "Payments",
    permissionmenu: "requisitionPaymentMenu",
  },
  {
    resource: "v1/quotationItemMapping",
    label: "Quotation Item Mapping",
    permissionmenu: "quotationItemMappingMenu",
  },
  {
    resource: "v1/revision",
    label: "Revision",
    permissionmenu: "revisionMenu",
  },
  {
    resource: "v1/contentHistory",
    label: "Content History",
    permissionmenu: "contentHistoryMenu",
  },
  {
    resource: "v1/currencyRate",
    label: "Currency Rates",
    permissionmenu: "currencyRateMenu",
  },
  {
    resource: "settings",
    label: "Settings",
    permissionmenu: "settingsMenu",
  },
  {
    resource: "system-status",
    label: "System Status",
    permissionmenu: "viewSystemStatus",
  },
  {
    resource: "live-info",
    label: "Live Info",
    permissionmenu: "liveInfoMenu",
  },
  {
    resource: "sa-settings",
    label: "SA Settings",
    permissionmenu: "superAdmin",
  },
];
