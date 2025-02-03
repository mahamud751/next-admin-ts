import { FC } from "react";
import { Create, CreateProps, SimpleForm } from "react-admin";

import NotificationForm from "../../../components/managePromotion/notifications/NotificationForm";
import { useDocumentTitle } from "../../../hooks";

const NotificationCreate: FC<CreateProps> = ({ ...rest }) => {
  useDocumentTitle("Arogga | Notification Create");

  return (
    <Create {...rest} redirect="list">
      <SimpleForm>
        <NotificationForm />
      </SimpleForm>
    </Create>
  );
};

export default NotificationCreate;
