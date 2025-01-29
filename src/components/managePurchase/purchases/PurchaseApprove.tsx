import { Button } from "@mui/material";
import { useState } from "react";
import { Confirm, useNotify, useRedirect } from "react-admin";
import { useWatch } from "react-hook-form";

import { useRequest } from "@/hooks";
import { isEmpty } from "@/utils/helpers";

const PurchaseApprove = () => {
  const redirect = useRedirect();
  const notify = useNotify();
  const values = useWatch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isLoading, refetch } = useRequest(
    `/v3/productPurchase/approved/${values.id}`,
    { method: "POST" },
    {
      onSuccess: () => {
        setIsDialogOpen(false);
        redirect("list", "/v1/productPurchase");
      },
    }
  );

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          const attachedFiles = values?.attachedFiles_pp_files;

          if (
            isEmpty(attachedFiles) ||
            (!isEmpty(attachedFiles) &&
              attachedFiles?.some((item) => item.hasOwnProperty("rawFile")))
          ) {
            return notify(
              "Before approving the purchase, you must upload attached files or any unsaved files!",
              { type: "warning" }
            );
          }

          setIsDialogOpen(true);
        }}
        style={{
          textTransform: "none",
        }}
      >
        Approve
      </Button>
      <Confirm
        title="Purchase Approval"
        content="Are you sure you want to approve this purchase?"
        isOpen={isDialogOpen}
        loading={isLoading}
        onConfirm={refetch}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default PurchaseApprove;
