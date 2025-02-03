import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useRequest } from "@/hooks";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type ShippingDialogProps = {
  open: boolean;
  hasSubArea: any;
  formValues: any;
  subAreaId: any;
  handleShippingDialogClose: () => void;
  setIsLocationEditBtnClick: (isLocationEditBtnClick: boolean) => void;
  [key: string]: any;
};

const ShippingDialog: FC<ShippingDialogProps> = ({
  open,
  hasSubArea,
  formValues,
  subAreaId,
  currentSubArea,
  handleShippingDialogClose,
  setIsLocationEditBtnClick,
  ...rest
}) => {
  const classes = useStyles();
  const values = useWatch();
  const { isLoading, refetch } = useRequest(
    `/lab-order/api/v1/admin/orders/${rest.record?.id}/location`,

    {
      method: "PUT",
      body: {
        userLocationId: values?.userLocation?.id,
        division: values?.userLocation?.division,
        district: values?.userLocation?.district,
        area: values?.userLocation?.area,
        name: values?.userLocation?.name,
        mobileNumber: values?.userLocation?.mobileNumber,
        type: values?.userLocation?.type,
        address: values?.userLocation?.address,
        ...(subAreaId?.sa_id && {
          subareaId: values?.userLocation?.subareaId,
        }),
      },
    },
    {
      isRefresh: true,
      onSuccess: () => {
        handleShippingDialogClose();
        setIsLocationEditBtnClick(false);
      },
      onError: () => {
        handleShippingDialogClose();
      },
    }
  );

  return (
    <Dialog open={open} onClose={handleShippingDialogClose}>
      <DialogTitle>Are you sure this address is correct?</DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell className={classes.headingLabel}>Division</TableCell>
              <TableCell>{values?.userLocation?.division}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.headingLabel}>City</TableCell>
              <TableCell>{values?.userLocation?.district}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.headingLabel}>Area</TableCell>
              <TableCell>{values?.userLocation?.area}</TableCell>
            </TableRow>
            {hasSubArea ? (
              <TableRow>
                <TableCell>Sub Area</TableCell>
                <TableCell>
                  {currentSubArea?.sa_title}({currentSubArea?.sa_zone})
                </TableCell>
              </TableRow>
            ) : null}

            <TableRow>
              <TableCell className={classes.headingLabel}>
                Home Address
              </TableCell>
              <TableCell>{values?.userLocation?.address}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={handleShippingDialogClose}
        onConfirm={refetch}
      />
    </Dialog>
  );
};

const useStyles = makeStyles({
  headingLabel: {
    fontWeight: 600,
  },
});

export default ShippingDialog;
