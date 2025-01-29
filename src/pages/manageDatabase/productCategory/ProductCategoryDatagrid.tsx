import AddBoxIcon from "@mui/icons-material/AddBox";
import { useState } from "react";
import {
  Datagrid,
  FunctionField,
  Pagination,
  RaRecord,
  ReferenceManyField,
  TextField,
} from "react-admin";

import { useNavigateFromList } from "../../../hooks";
import { useAroggaStyles } from "../../../utils/useAroggaStyles";
import ProductCategoryDialog from "./ProductCategoryDialog";

const ProductCategoryDatagrid = () => {
  const classes = useAroggaStyles();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const navigateFromList = useNavigateFromList("taxonomyView", "taxonomyEdit");

  return (
    <>
      <Datagrid
        rowClick={navigateFromList}
        isRowExpandable={(row) => !!row?.t_has_child}
        expand={
          <ReferenceManyField
            reference="productCategory"
            target="_parent_id"
            pagination={<Pagination />}
            filter={{ _get_product_count: 1 }}
            sort={{ field: "t_has_child", order: "asc" }}
          >
            <ProductCategoryDatagrid />
          </ReferenceManyField>
        }
        classes={{ expandedPanel: classes.expandedPanel }}
        optimized
      >
        <TextField source="t_id" label="ID" />
        <TextField source="t_title" label="Title" />
        <TextField source="t_product_count" label="Product Count" />
        <TextField source="t_machine_name" label="Machine Name" />
        <TextField source="t_weight" label="Weight" />
        <FunctionField
          label="Action"
          onClick={(e) => e.stopPropagation()}
          render={({ t_id }: RaRecord) => (
            <AddBoxIcon
              cursor="pointer"
              style={{ color: "#757575" }}
              onClick={() => {
                setCategoryId(t_id);
                setIsDialogOpen(true);
              }}
            />
          )}
        />
      </Datagrid>
      {!!categoryId && (
        <ProductCategoryDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          categoryId={categoryId}
        />
      )}
    </>
  );
};

export default ProductCategoryDatagrid;
