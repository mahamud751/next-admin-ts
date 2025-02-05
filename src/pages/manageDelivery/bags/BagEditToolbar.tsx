import BagDialog from "@/components/manageDelivery/bags/BagDialog";
import { FC, useCallback, useState } from "react";
import { SaveButton, Toolbar } from "react-admin";
import { useWatch } from "react-hook-form";

type BagEditToolbarProps = {
  record: any;
  isChecked: boolean;
  toShiftScheduleTitle: string;
  toDeliveryman: string;
  [key: string]: any;
};

const BagEditToolbar: FC<BagEditToolbarProps> = ({
  record,
  isChecked,
  toShiftScheduleTitle,
  toDeliveryman,
  ...rest
}) => {
  const values = useWatch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const ConfirmButton = ({ handleSubmitWithRedirect, ...rest }: any) => {
    const handleClick = useCallback(() => {
      if (
        record?.sb_shift_type !== values?.sb_shift_type ||
        record?.sb_shift_schedule_id !== values?.sb_shift_schedule_id ||
        record?.sb_deliveryman_id !== values?.sb_deliveryman_id
      ) {
        setIsDialogOpen(true);
      } else {
        handleSubmitWithRedirect("list");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSubmitWithRedirect, record?.sb_deliveryman_id]);

    const disabled = () => {
      if (
        isChecked ||
        !values?.sb_shift_schedule_id ||
        (record?.sb_shift_type === values?.sb_shift_type &&
          record?.sb_shift_schedule_id === values?.sb_shift_schedule_id &&
          record?.sb_deliveryman_id === values?.sb_deliveryman_id)
      )
        return true;

      return false;
    };

    return (
      <>
        <SaveButton
          handleSubmitWithRedirect={handleClick}
          disabled={disabled()}
          {...rest}
        />
        <BagDialog
          record={record}
          isChecked={isChecked}
          isDialogOpen={isDialogOpen}
          toShiftScheduleTitle={toShiftScheduleTitle}
          toDeliveryman={toDeliveryman}
          handleDialogClose={() => setIsDialogOpen(false)}
          handleSubmitWithRedirect={handleSubmitWithRedirect}
        />
      </>
    );
  };

  return (
    <Toolbar {...rest}>
      <ConfirmButton />
    </Toolbar>
  );
};

export default BagEditToolbar;
