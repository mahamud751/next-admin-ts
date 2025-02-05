import { FC, useCallback } from "react";
import {
    Create,
    SimpleForm,
    Toolbar,
    useMutation,
    useNotify,
    useRedirect,
} from "react-admin";

import BlockForm from "../../../components/manageSite/blocks/BlockForm";
import { useDocumentTitle } from "../../../hooks";
import { blockOnSave } from "./utils/blockOnSave";

const BlockCreate: FC<any> = (props) => {
    useDocumentTitle("Arogga | Block Create");

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
        <Create {...props}>
            <SimpleForm
                submitOnEnter={false}
                toolbar={loading ? null : <Toolbar alwaysEnableSaveButton />}
                save={onSave}
            >
                <BlockForm />
            </SimpleForm>
        </Create>
    );
};

export default BlockCreate;
