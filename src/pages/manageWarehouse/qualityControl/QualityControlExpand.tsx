import {
  ArrayField,
  BooleanField,
  Datagrid,
  ImageField,
  ReferenceManyField,
  TextField,
} from "react-admin";

import { useAroggaStyles } from "@/utils/useAroggaStyles";

const QualityControlExpand = () => {
  const classes = useAroggaStyles();

  return (
    <ReferenceManyField reference="v1/qualityControlItem" target="qc_id">
      <Datagrid
        expand={<LostDamCountExpand />}
        isRowExpandable={(row) => !!row?.qci_damaged_data?.length}
        // classes={{ expandedPanel: classes.expandedPanel }}
      >
        <TextField source="qci_id" label="ID" />
        <BooleanField source="qci_status_shelved" label="Shelved?" looseValue />
        <ImageField
          source="attachedFiles_qci_damage_picture"
          label="Damaged Images"
          src="src"
          title="title"
          className="small__img"
        />
      </Datagrid>
    </ReferenceManyField>
  );
};

export default QualityControlExpand;

const LostDamCountExpand = () => (
  <ArrayField source="qci_damaged_data" label="Lost / Dam Count">
    <Datagrid>
      <TextField source="sd_id" label="SDID" />
      <TextField source="sd_batch_no" label="Batch No" />
      <TextField source="sd_lost_count" label="Lost Count" />
      <TextField source="sd_damage_count" label="Damage Count" />
    </Datagrid>
  </ArrayField>
);
