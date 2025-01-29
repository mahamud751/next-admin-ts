import { FC, useState } from "react";
import { Button, ListActionsProps, TopToolbar } from "react-admin";

import ProductCategoryDialog from "./ProductCategoryDialog";

const ProductCategoryAction: FC<ListActionsProps> = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <TopToolbar>
      <Button
        label="Create Category"
        variant="contained"
        onClick={() => setIsDialogOpen(true)}
      />
      <ProductCategoryDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </TopToolbar>
  );
};

export default ProductCategoryAction;
