import { FC } from "react";
import { RaRecord as Record } from "react-admin";

type BankOptionTextRendererProps = {
  record?: Record;
};

const BankOptionTextRenderer: FC<BankOptionTextRendererProps> = ({
  record,
}) => {
  return (
    <span>
      {!!record
        ? `${record.eb_account_title} ( ${record.eb_account_no} ${record.eb_card_no} )`
        : ""}
    </span>
  );
};

export default BankOptionTextRenderer;
