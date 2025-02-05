import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useState } from "react";
import {
  Button,
  Confirm,
  Datagrid,
  FunctionField,
  ImageField,
  Link,
  RaRecord as Record,
  ReferenceField,
  ReferenceManyField,
  TextField,
} from "react-admin";

import { useRequest } from "@/hooks";
import { getQuantityLabel, getReadableSKU } from "@/utils/helpers";
import { useAroggaStyles } from "@/utils/useAroggaStyles";
import AroggaDateField from "@/components/common/AroggaDateField";

const ShelvingExpand = (props) => {
  const classes = useAroggaStyles();

  const [isShelvedDialogOpen, setIsShelvedDialogOpen] = useState(false);
  const [shelvingId, setShelvingId] = useState(null);

  const { isLoading, refetch } = useRequest(
    `/v1/qualityControlAction/${shelvingId}/shelvedAction`,
    {},
    {
      isRefresh: true,
      successNotify: "Successfully shelved!",
      onSuccess: () => setIsShelvedDialogOpen(false),
    }
  );

  return (
    <>
      <ReferenceManyField
        reference="v1/shelving"
        target="_qc_id"
        filter={{ _qc_id: props?.record?.s_qc_id }}
        sort={{ field: "s_id", order: "DESC" }}
      >
        <Datagrid>
          <TextField source="s_id" label="ID" />
          <FunctionField
            label="Product"
            sortBy="product_name"
            render={({ product_id, product_name }: Record) => (
              <Link to={`/v1/product/${product_id}/show`}>{product_name}</Link>
            )}
          />
          <ReferenceField
            source="product_variant_id"
            label="Variant"
            reference="v1/productVariant"
            link={false}
          >
            <FunctionField
              render={(record: Record) => getReadableSKU(record?.pv_attribute)}
            />
          </ReferenceField>
          <TextField
            source="form"
            label="Form"
            className={classes.capitalize}
          />
          <TextField source="strength" label="Strength" />
          <ReferenceField
            source="product_id"
            label="Cold"
            reference="v1/product"
            link={false}
          >
            <FunctionField
              render={(record: Record) => {
                if (!record?.p_cold) return;
                return <AcUnitIcon />;
              }}
            />
          </ReferenceField>
          <FunctionField
            label="Brand"
            render={({ brand_id, brand }: Record) => (
              <Link to={`/v1/productBrand/${brand_id}/show`}>{brand}</Link>
            )}
          />
          <FunctionField
            source="ppi_qty"
            label="Qty"
            className={classes.whitespaceNowrap}
            render={({
              ppi_qty: qty,
              label: salesUnit,
              product_base_unit: baseUnit,
              multiplier: salesUnitMultiplier,
            }: Record) =>
              getQuantityLabel({
                qty,
                salesUnit,
                baseUnit,
                salesUnitMultiplier,
              })
            }
          />
          <TextField source="sd_rack_no" label="Rack No" />
          <ImageField
            source="images"
            label="Images"
            src="src"
            title="title"
            className="small__img"
          />
          <AroggaDateField source="s_shelved_at" label="Shelved At" />
          <ReferenceField
            source="s_shelved_by"
            label="Shelved By"
            reference="v1/users"
            link="show"
          >
            <TextField source="u_name" />
          </ReferenceField>
          {process.env.REACT_APP_NODE_ENV === "development" && (
            <FunctionField
              label="Action"
              render={({ s_id, s_shelved_by }: Record) => {
                if (s_shelved_by) return;

                return (
                  <Button
                    label="Shelve"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShelvingId(s_id);
                      setIsShelvedDialogOpen(true);
                    }}
                  />
                );
              }}
            />
          )}
        </Datagrid>
      </ReferenceManyField>
      <Confirm
        title={`Shelved #${shelvingId}`}
        content="Are you sure you want to shelved?"
        isOpen={isShelvedDialogOpen}
        loading={isLoading}
        onConfirm={refetch}
        onClose={() => setIsShelvedDialogOpen(false)}
      />
    </>
  );
};

export default ShelvingExpand;
