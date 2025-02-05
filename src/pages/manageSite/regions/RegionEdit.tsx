import { FC } from "react";
import {
  Edit,
  EditProps,
  SimpleForm,
  TransformData,
  useEditController,
} from "react-admin";

import RegionForm from "@/components/manageSite/regions/RegionForm";
import { useDocumentTitle } from "@/hooks";
import { groupBy } from "@/utils/helpers";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";

const RegionEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  useDocumentTitle("Arogga | Region Edit");

  const edit = useEditController({ ...rest });
  const transform: TransformData = ({ regionType, rt, ...rest }) => {
    const groupByRegionType = groupBy(rt, (data) => data.rt_name);

    return {
      ...rest,
      rt: regionType?.map((rt_name) => ({
        rt_id: groupByRegionType?.[rt_name]?.[0].rt_id,
        rt_name,
      })),
    };
  };
  return (
    <Edit
      mutationMode={
        process.env.NEXT_PUBLIC_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      transform={transform}
      {...rest}
    >
      <SimpleForm
        toolbar={
          <SaveDeleteToolbar
            isSave
            isDelete={permissions?.includes("regionDelete")}
          />
        }
        defaultValues={{
          regionType: edit?.record?.rt?.map(({ rt_name }) => rt_name) || [],
        }}
      >
        <RegionForm />
      </SimpleForm>
    </Edit>
  );
};

export default RegionEdit;
