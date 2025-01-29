import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import queryString from "query-string";
import { FC, useState } from "react";
import {
  ImageField,
  ImageInput,
  minLength,
  NumberInput,
  required,
  SimpleForm,
  TextInput,
  useNotify,
  useRefresh,
} from "react-admin";

import { useForm, useFormState, useWatch } from "react-hook-form";

import { uploadDataProvider } from "@/dataProvider";
import { useRequest } from "@//hooks";
import { logger } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDialogActions from "@/components/common/AroggaDialogActions";
import AroggaMovableImageInput from "@/components/common/AroggaMovableImageInput";

const QUERY_PARAMS = {
  _v_machine_name: "product_category",
  _fields: "t_id,t_parent_id,t_title,t_has_child,t_weight",
  _order: "ASC",
  _page: 1,
  _perPage: 50000,
};

type ProductCategoryDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  categoryId?: number;
};

const ProductCategoryDialog: FC<ProductCategoryDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  categoryId,
}) => {
  const classes = useAroggaStyles();

  return (
    <SimpleForm toolbar={null} className={classes.absolute}>
      <PCDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        categoryId={categoryId}
      />
    </SimpleForm>
  );
};

export default ProductCategoryDialog;

const PCDialog = ({ isDialogOpen, setIsDialogOpen, categoryId }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const form = useForm();
  const values = useWatch();
  const { isValidating } = useFormState();

  const [isLoading, setIsLoading] = useState(false);

  useRequest(
    `/v1/taxonomy?${queryString.stringify(
      QUERY_PARAMS
    )}&_reverse_parent=${categoryId}&_orderBy=t_parent_id`,
    {},
    {
      isPreFetching: !!categoryId,
      isWarningNotify: false,
      refreshDeps: [categoryId],
      onSuccess: ({ data }) => {
        form.setValue("tree", data?.map((item) => item.t_title)?.join(" > "));
      },
    }
  );

  const onConfirm = async () => {
    setIsLoading(true);

    try {
      await uploadDataProvider.create("v1/taxonomy", {
        data: {
          ...(categoryId && { t_parent_id: categoryId }),
          t_v_id: 36,
          t_title: values.title,
          t_weight: values.weight,
          t_description: values.description,
          attachedFiles_t_icon: values.icon,
          attachedFiles_t_banner: values.banner,
        },
      });
      refresh();
      handleOnClose();
    } catch (err) {
      logger(err);
      // @ts-ignore
      notify(err?.message || "Something went wrong! Please try again!", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnClose = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    ["title", "weight", "description", "icon", "banner"].forEach((key) =>
      form.setValue(key, undefined)
    );
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleOnClose} maxWidth="md">
      <DialogTitle>
        {categoryId ? "Create Sub Category" : "Create Category"}
      </DialogTitle>
      <DialogContent>
        {!!categoryId && (
          <TextInput
            source="tree"
            label=""
            variant="outlined"
            helperText={false}
            multiline
            disabled
            fullWidth
          />
        )}
        <TextInput
          source="title"
          label="Category Name"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(3, "Title must be at least 3 char  acters long"),
          ]}
          fullWidth
        />
        <NumberInput
          source="weight"
          label="Weight"
          variant="outlined"
          helperText={false}
          fullWidth
        />
        <TextInput
          source="description"
          label="Description"
          variant="outlined"
          helperText={false}
          validate={[
            required(),
            minLength(2, "Description must be at least 2 characters long"),
          ]}
          minRows={2}
          fullWidth
          multiline
        />

        <AroggaMovableImageInput
          source="icon"
          label="Attached Icon (64*64 px)"
        />
        <AroggaMovableImageInput
          source="banner"
          label="Attached Banner (1020*325 px)"
        />
      </DialogContent>
      <AroggaDialogActions
        isLoading={isLoading}
        onDialogClose={handleOnClose}
        onConfirm={onConfirm}
        disabled={isValidating}
      />
    </Dialog>
  );
};
