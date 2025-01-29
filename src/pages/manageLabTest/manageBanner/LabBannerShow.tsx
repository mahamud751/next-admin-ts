import { FC } from "react";
import {
  ImageField,
  NumberField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "../../../hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LabBannerShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga |Lab Banner Show");
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
          <TextField source="id" label="Id" />
          <NumberField source="sortOrder" label="Sort Order" />
          <ImageField
            source="bannerUrl"
            className="small__img"
            title="title"
            label="Banner Pictures"
          />
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default LabBannerShow;
