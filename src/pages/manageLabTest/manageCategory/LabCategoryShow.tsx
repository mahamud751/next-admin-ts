import { FC } from "react";
import {
  ImageField,
  Show,
  ShowProps,
  SimpleShowLayout,
  TextField,
  TranslatableFields,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LabCategoryShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga |Lab Category Show");

  const classes = useAroggaStyles();
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ColumnShowLayout md={6} simpleShowLayout={false}>
          <TextField source="id" label="Id" />
          <TranslatableFields locales={["en", "bn"]}>
            <TextField source="name" />
          </TranslatableFields>
          <TextField
            source="sectionTag"
            label="Section Tag"
            className={classes.capitalize}
          />
          <TextField source="status" label="Status" />
          <ImageField
            source="imageUrl"
            className="small__img"
            title="title"
            label="Pictures"
          />
        </ColumnShowLayout>
      </SimpleShowLayout>
    </Show>
  );
};

export default LabCategoryShow;
