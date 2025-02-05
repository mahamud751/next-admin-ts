import { useState } from "react";
import { Button, TopToolbar } from "react-admin";

import MenuItemDialog from "./MenuItemDialog";

const MenuItemAction = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <TopToolbar>
            <Button
                label="Create Menu Item"
                variant="contained"
                onClick={() => setIsDialogOpen(true)}
            />
            <MenuItemDialog
                action="create"
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
            />
        </TopToolbar>
    );
};

export default MenuItemAction;
