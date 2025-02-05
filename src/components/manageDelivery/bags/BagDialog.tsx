import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useEffect } from "react";
import { useWatch } from "react-hook-form";

import { ReferenceField, TextField } from "react-admin";
import { useRequest } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";

type BagDialogProps = {
  record: any;
  isChecked: boolean;
  isDialogOpen: boolean;
  toShiftScheduleTitle?: string;
  toDeliveryman?: string;
  handleDialogClose: () => void;
  handleSubmitWithRedirect?: () => void;
};

const BagDialog: FC<BagDialogProps> = ({
  record,
  isChecked,
  isDialogOpen,
  toShiftScheduleTitle,
  toDeliveryman,
  handleDialogClose,
  handleSubmitWithRedirect,
}) => {
  const classes = useAroggaStyles();

  const values = useWatch();

  const { isLoading, refetch: shipmentBagMove } = useRequest(
    "/v1/bags/shipmentBagMove",
    {
      method: "POST",
      body: {
        sb_id: record?.sb_id,
        new_sb_id: values?.new_sb_id,
        sbd: values?.selectedIds?.map((sbd_shipment_id) => ({
          sbd_shipment_id,
        })),
      },
    },
    {
      onSuccess: () => handleDialogClose(),
    }
  );

  const { data: toZoneData, refetch: toZoneDataRefetch } = useRequest(
    `/v1/zone/${values?.sb_zone_id}`,
    {
      method: "GET",
    },
    {}
  );

  useEffect(() => {
    if (values) {
      toZoneDataRefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="md">
      <DialogTitle>
        {isChecked
          ? "Are you sure you want to move shipments to this bag?"
          : "Are you sure you want to assign this bag to this delivery man?"}
      </DialogTitle>
      <DialogContent>
        {isChecked ? (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>From Zone</TableCell>
                  <TableCell>Fron Bag</TableCell>
                  <TableCell>To Zone</TableCell>
                  <TableCell>To Bag</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <ReferenceField
                      source="sb_zone_id"
                      reference="v1/zone"
                      link={false}
                    >
                      <TextField source="z_name" />
                    </ReferenceField>
                  </TableCell>
                  <TableCell>{record?.sb_id}</TableCell>
                  <TableCell>{toZoneData?.z_name}</TableCell>
                  <TableCell>{values?.new_sb_id}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box mt={2} />
            <Typography>
              {/* TODO: */}
              Shipment IDS: {values?.selectedIds?.join(", ")}
            </Typography>
          </>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Zone</TableCell>
                <TableCell>Bag No</TableCell>
                <TableCell>From Shift Type</TableCell>
                <TableCell>To Shift Type</TableCell>
                <TableCell>From Shift Schedule</TableCell>
                <TableCell>To Shift Schedule</TableCell>
                <TableCell>From Delivery Man</TableCell>
                <TableCell>To Delivery Man</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={classes.whitespaceNowrap}>
                  {record?.sb_zone_id}
                </TableCell>
                <TableCell>{record?.sb_id}</TableCell>
                <TableCell className={classes.capitalize}>
                  {record?.sb_shift_type}
                </TableCell>
                <TableCell className={classes.capitalize}>
                  {values?.sb_shift_type}
                </TableCell>
                <TableCell>{record?.sb_shift_title}</TableCell>
                <TableCell>{toShiftScheduleTitle}</TableCell>
                <TableCell>{record?.sb_deliveryman_name}</TableCell>
                <TableCell>{toDeliveryman}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={handleDialogClose}
        onConfirm={() => {
          if (isChecked) {
            shipmentBagMove();
          } else {
            handleDialogClose();
            // @ts-ignore
            handleSubmitWithRedirect("list");
          }
        }}
      />
    </Dialog>
  );
};

export default BagDialog;
