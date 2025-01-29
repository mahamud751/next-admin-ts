import { FC, useState } from "react";
import {
  Create,
  CreateProps,
  ImageField,
  ImageInput,
  SimpleForm,
  TextInput,
  useNotify,
} from "react-admin";

import { labTestUploadDataProvider } from "@/dataProvider";
import { useDocumentTitle } from "@/hooks";

const LabCollectionProcessCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga |Lab Collection Process Create");
  const notify = useNotify();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const onSave = async (data) => {
    const payload = {
      ...data,
      title: { en: title, bn: title },
      description: { en: description, bn: description },
      subTitle: { en: subTitle, bn: subTitle },
    };

    try {
      await labTestUploadDataProvider.create("misc/api/v1/admin/lab-steps", {
        data: payload,
      });
      props.history.push("/misc/api/v1/admin/lab-steps");
      notify("Successfully  Create!", { type: "success" });
    } catch (err: any) {
      notify(err.message || "Failed!", { type: "warning" });
    }
  };
  return (
    <Create {...props}>
      <SimpleForm
        // redirect="list"
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

        <ImageInput
          source="attachedFiles-imageUrl"
          label="Pictures (3000*3000 px)"
          //   accept="image/*"
          maxSize={10000000}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};

export default LabCollectionProcessCreate;
