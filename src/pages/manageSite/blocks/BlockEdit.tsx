import { FC, useCallback } from "react";
import {
    Edit,
    SimpleForm,
    useMutation,
    useNotify,
    useRedirect,
} from "react-admin";

import SaveDeleteToolbar from "../../../components/SaveDeleteToolbar";
import BlockForm from "../../../components/manageSite/blocks/BlockForm";
import { useDocumentTitle } from "../../../hooks";
import { blockOnSave } from "./utils/blockOnSave";

const BlockEdit: FC<any> = ({ permissions, ...rest }) => {
    useDocumentTitle("Arogga | Block Edit");

    const redirect = useRedirect();
    const notify = useNotify();
    const [mutate, { loading }] = useMutation();

    const onSave = useCallback(
        async (values) => {
            blockOnSave({
                notify,
                redirect,
                mutate,
                values,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [mutate]
    );

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
                toolbar={
                    <SaveDeleteToolbar
                        isSave
                        isSaveDisabled={loading}
                        isDelete={permissions?.includes("blockDelete")}
                    />
                }
                save={onSave}
            >
                <BlockForm />
            </SimpleForm>
        </Edit>
    );
};

export default BlockEdit;
