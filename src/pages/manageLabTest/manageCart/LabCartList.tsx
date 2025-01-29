import { Dialog, DialogContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FC, useState } from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  ListProps,
  NumberField,
  TextField,
} from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import LabCartFilter from "./LabCartFilter";
import CartDeleteModal from "@/components/manageLabTest/cart/CartDeleteModal";

const LabCartList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Lab Test | Carts List");
  const exporter = useExport(rest);
  const [openDialog, setOpenDialog] = useState(false);
  const [qcId, setQcId] = useState<number | null>(null);
  const handleOpenDialog = (id: number) => {
    setQcId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <List
        {...rest}
        title="List of Lab Carts"
        filters={<LabCartFilter children={""} />}
        perPage={25}
        exporter={exporter}
        // bulkActionButtons={false}
      >
        <Datagrid rowClick="edit">
          <TextField source="userId" label="User ID" />
          <TextField source="name" label="Name" />
          <FunctionField
            render={(record) => {
              return (
                <>
                  {record?.mobileNumber ? (
                    <TextField source="mobileNumber" label="Mobile" />
                  ) : (
                    <TextField source="email" label="Email" />
                  )}
                </>
              );
            }}
            label="Mobile/Email"
          />
          <DateField
            source="createdAt"
            label="Create Date & Time"
            showTime={true}
          />
          <DateField source="updatedAt" label="Updated" showTime={true} />
          <TextField source="itemCount" label="Count" />
          <NumberField source="totalAmount" label="Total" />
          <FunctionField
            render={(record) => {
              return (
                <div
                  style={{
                    width: 93,
                    backgroundColor:
                      (record.cartStatus === "current"
                        ? "#4CAF50"
                        : "#FFB547") + "10",
                    color:
                      record.cartStatus === "current" ? "#4CAF50" : "#FFB547",
                    borderRadius: 42,
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    textTransform: "capitalize",
                  }}
                >
                  {record.cartStatus}
                </div>
              );
            }}
            label="Status"
          />
          <FunctionField
            label="Action"
            render={(record: any) => (
              <>
                {record.cartStatus === "current" && (
                  <>
                    {/* @ts-ignore */}
                    <DeleteIcon
                      style={{ color: "red" }}
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        //@ts-ignore
                        handleOpenDialog(record.id);
                      }}
                    />
                  </>
                )}
              </>
            )}
          />
        </Datagrid>
      </List>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent style={{ maxWidth: "850px" }}>
          <CartDeleteModal handleCloseDialog={handleCloseDialog} qcId={qcId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LabCartList;
