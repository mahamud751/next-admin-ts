import { FC } from "react";
import { Edit, EditProps, SimpleForm } from "react-admin";

import { useDocumentTitle } from "@/hooks";
import SaveDeleteToolbar from "@/components/common/SaveDeleteToolbar";
import NotificationForm from "@/components/managePromotion/notifications/NotificationForm";

const NotificationEdit: FC<EditProps> = ({ hasEdit, ...rest }) => {
  useDocumentTitle("Arogga | Notification Edit");

  return (
    <Edit
      mutationMode={
        process.env.NEXT_PUBLIC_NODE_ENV === "development"
          ? "pessimistic"
          : "optimistic"
      }
      {...rest}
      redirect="list"
    >
      <SimpleForm
        toolbar={
          <SaveDeleteToolbar
            isSave
            isDelete={rest.permissions?.includes("notificationDelete")}
          />
        }
      >
        <NotificationForm />
      </SimpleForm>
    </Edit>
  );
};

export default NotificationEdit;
