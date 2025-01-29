import { FC, useEffect, useState } from "react";
import {
  Edit,
  EditProps,
  ImageField,
  ImageInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useNotify,
} from "react-admin";
import { useParams } from "react-router-dom";

import { labTestUploadDataProvider } from "@/dataProvider";
import { useDocumentTitle, useRequest } from "@/hooks";

const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);
interface Params {
  id: string;
}

const LabCollectionProcessEdit: FC<EditProps> = ({ permissions, ...rest }) => {
  const notify = useNotify();
  const { id } = useParams<Params>();
  const { data: Order } = useRequest(
    `/misc/api/v1/admin/lab-steps/${id}`,
    {},
    {
      isPreFetching: true,
      isSuccessNotify: false,
    }
  );
  const [title, setTitle] = useState(Order?.title?.en);
  const [description, setDescription] = useState(Order?.description?.en);
  const [subTitle, setSubTitle] = useState(Order?.subTitle?.en);

  useEffect(() => {
    setTitle(Order?.title?.en || null);
    setDescription(Order?.description?.en || null);
    setSubTitle(Order?.subTitle?.en || null);
  }, [Order]);
  useDocumentTitle("Arogga | Collection Process |  Edit");
  const onSave = async (data) => {
    const payload = {
      ...data,
      title: { en: title, bn: title },
      description: { en: description, bn: description },
      subTitle: { en: subTitle, bn: subTitle },
    };

    try {
      await labTestUploadDataProvider.update(
        `misc/api/v1/admin/lab-steps/${Order?.id}`,
        {
          data: payload,
        }
      );
      rest.history.push("/misc/api/v1/admin/lab-steps");
      notify("Successfully  Updated!", { type: "success" });
    } catch (err: any) {
      notify(err.message || "Failed!", { type: "warning" });
    }
  };
  return (
    <Edit
      mutationMode={
        process.env.REACT_APP_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
    >
      <SimpleForm
        // submitOnEnter={false}
        toolbar={<CustomToolbar />}
        save={onSave}
      >
        <TextInput
          source="title[en]"
          variant="outlined"
          label="Title(EN)"
          minRows={2}
          multiline
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextInput
          source="subTitle[en]"
          variant="outlined"
          label="Sub Title(EN)"
          minRows={2}
          multiline
          onChange={(e) => setSubTitle(e.target.value)}
        />
        <TextInput
          source="description[en]"
          variant="outlined"
          label="Description(EN)"
          minRows={4}
          multiline
          onChange={(e) => setDescription(e.target.value)}
        />

        <SelectInput
          variant="outlined"
          source="status"
          choices={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "InActive" },
          ]}
        />
        <ImageInput
          source="attachedFiles-imageUrl"
          label="Pictures (1800*945 px)"
          //   accept="image/*"
          maxSize={5000000}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};

export default LabCollectionProcessEdit;
