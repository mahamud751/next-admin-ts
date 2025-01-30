import { FC } from "react";
import { List, ListProps } from "react-admin";

import { useDocumentTitle, useExport } from "@/hooks";
import ProductCategoryAction from "./ProductCategoryAction";
import ProductCategoryDatagrid from "./ProductCategoryDatagrid";
import ProductCategoryFilter from "./ProductCategoryFilter";

const ProductCategoryList: FC<ListProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Product Category List");

  const exporter = useExport(rest);

  return (
    <List
      {...rest}
      title="List of Product Category"
      perPage={25}
      filter={{
        _parent_id: 0,
        _get_product_count: 1,
        _v_machine_name: "product_category",
      }}
      filters={<ProductCategoryFilter children={""} />}
      actions={<ProductCategoryAction />}
      sort={{ field: "t_id", order: "DESC" }}
      exporter={exporter}
    >
      <ProductCategoryDatagrid />
    </List>
  );
};

export default ProductCategoryList;
