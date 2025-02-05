import { Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import { FC, useEffect, useState } from "react";
import { useNotify } from "react-admin";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
    MdFolder,
    MdKeyboardArrowDown,
    MdKeyboardArrowRight,
} from "react-icons/md";
import { useRequest } from "../../../hooks";
import ZoneDialog from "./ZoneDialog";

interface AreaMoveProps {
    open: boolean;
    onClose: (val: boolean) => void;
    zoneType: string;
    refetchAfterSuccess: () => void;
    totalDataCount: number;
    selectedZone: any;
}

const AreaMove: FC<AreaMoveProps> = ({
    open,
    onClose,
    zoneType,
    refetchAfterSuccess,
    totalDataCount,
    selectedZone,
}) => {
    const classes = useStyles();
    const [zoneList, setZoneList] = useState([]);
    const [updatedZoneList, setUpdatedZoneList] = useState([]);
    const notify = useNotify();

    const handleClose = () => {
        onClose(false);
    };
    // API FETCH FUNC GOES HERE
    const { isLoading: fetchZoneDataLoading, data: zoneData } = useRequest(
        `/v1/insideDhakaLocations?_type=${zoneType}&_perPage=${
            totalDataCount === 1 ? "500" : totalDataCount
        }&_page=1&_onlyArea=true`,
        {},
        {
            isSuccessNotify: false,
            isPreFetching: true,
            isWarningNotify: false,
        }
    );

    useEffect(() => {
        if (zoneData) {
            setZoneList(zoneData);
        }
    }, [zoneData]);

    const handleDrop = (result) => {
        const { source, destination, draggableId } = result;

        // If there is no destination, do nothing
        if (!destination) {
            return;
        }

        // If the item is dropped back in its original place, do nothing
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceZoneId = parseInt(source.droppableId.split("-")[1]);
        const destinationZoneId = parseInt(
            destination.droppableId.split("-")[1]
        );

        const sourceZoneIndex = zoneList.findIndex(
            (zone) => zone.z_id === sourceZoneId
        );
        const destinationZoneIndex = zoneList.findIndex(
            (zone) => zone.z_id === destinationZoneId
        );

        const sourceZone = zoneList[sourceZoneIndex];

        const destinationZone = zoneList[destinationZoneIndex];

        const [moveZone] = sourceZone.z_locations.splice(source.index, 1);
        destinationZone.z_locations.splice(destination.index, 0, moveZone);

        const newZoneList = [...zoneList];
        newZoneList[sourceZoneIndex] = sourceZone;
        newZoneList[destinationZoneIndex] = destinationZone;

        // Get location id which is set at draggableId prop
        const sourceLocationId = draggableId?.split("-")[1];

        // Check if l_id exist or not
        const locationExist = updatedZoneList
            ?.map((d: any) => d?.l_ids)
            ?.includes(sourceLocationId);
        if (locationExist) {
            const updated = updatedZoneList?.filter(
                (d: any) => d?.l_ids !== sourceLocationId
            );
            const updatedZoneListForPayload = {
                new_z_id: destinationZone?.z_id,
                z_type: zoneType,
                l_ids: sourceLocationId,
                old_z_id: sourceZone?.z_id,
            };

            return setUpdatedZoneList([...updated, updatedZoneListForPayload]);
        }

        // creating the object that will push into payload
        const updatedZoneListForPayload = {
            new_z_id: destinationZone?.z_id,
            z_type: zoneType,
            l_ids: sourceLocationId,
            old_z_id: sourceZone?.z_id,
        };

        // Updating payload state
        setUpdatedZoneList((prev) => [...prev, updatedZoneListForPayload]);
    };

    /*
        This function handle and sorts multiple
        location id in the same zone 
    */
    const groupedDataForPayload = updatedZoneList.reduce(
        (acc, { new_z_id, l_ids, z_type, old_z_id }) => {
            if (!acc[new_z_id]) {
                acc[new_z_id] = {
                    new_z_id,
                    z_type,
                    old_z_id,
                    l_ids: [parseInt(l_ids, 10)],
                };
            } else {
                acc[new_z_id].l_ids.push(parseInt(l_ids, 10));
            }
            return acc;
        },
        {}
    );

    const { isLoading, refetch: handleSubmit } = useRequest(
        `/v1/updateMultipleLocationsUnderSubArea`,
        {
            method: "POST",
            body: {
                data: JSON.stringify(Object.values(groupedDataForPayload)),
            },
        },
        {
            onSuccess: () => {
                onClose(false);
                refetchAfterSuccess();
            },
        }
    );

    const handleNoChangeSubmit = () => {
        notify(`No changes has been made`, { type: "success" });
        handleClose();
    };

    const content = (
        <div>
            {fetchZoneDataLoading && (
                <h5 style={{ textAlign: "center" }}>Loading...</h5>
            )}
            <DragDropContext onDragEnd={handleDrop}>
                <TreeView
                    defaultSelected={[selectedZone?.toString()]}
                    defaultExpanded={[selectedZone?.toString()]}
                    className={classes.root}
                    defaultCollapseIcon={<MdKeyboardArrowDown />}
                    defaultExpandIcon={<MdKeyboardArrowRight />}
                >
                    {zoneList.map((zone, i) => (
                        <Droppable
                            key={i}
                            droppableId={`zone-${zone.z_id}`}
                            type="zone"
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <TreeItem
                                        nodeId={zone.z_id.toString()}
                                        label={
                                            <div
                                                className={
                                                    classes.treeParentLabel
                                                }
                                            >
                                                <MdFolder color={"#F79009"} />
                                                <p
                                                    className={
                                                        classes.treeParentLabelText
                                                    }
                                                >
                                                    {`${zone.z_name}`}
                                                </p>
                                            </div>
                                        }
                                        key={zone.z_id}
                                    >
                                        {zone?.z_locations?.map(
                                            (location, index) => (
                                                <Draggable
                                                    key={location.rz_id}
                                                    draggableId={`area-${location.l_id}-${i}-${location?.l_sub_areas?.length}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <TreeItem
                                                                nodeId={location.l_id.toString()}
                                                                label={
                                                                    <p
                                                                        className={
                                                                            classes.treeChildLabelText
                                                                        }
                                                                    >
                                                                        {
                                                                            location.l_area
                                                                        }
                                                                    </p>
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        )}
                                        {provided.placeholder}
                                    </TreeItem>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </TreeView>
            </DragDropContext>
        </div>
    );

    const actions = (
        <Box
            style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: 10,
            }}
        >
            <Button
                size="large"
                onClick={handleClose}
                color="primary"
                variant="outlined"
                style={{
                    width: "48%",
                    marginRight: 20,
                    color: "red",
                    border: "1px solid red",
                }}
                disabled={isLoading}
            >
                Cancel
            </Button>
            <Button
                autoFocus
                size="large"
                onClick={
                    updatedZoneList?.length > 0
                        ? handleSubmit
                        : handleNoChangeSubmit
                }
                color="primary"
                variant="contained"
                style={{ width: "48%" }}
                disabled={isLoading}
            >
                Move
            </Button>
        </Box>
    );

    return (
        <ZoneDialog
            open={open}
            onClose={handleClose}
            title="Shipping Area Move to Other Zone"
            content={content}
            actions={actions}
        />
    );
};

export default AreaMove;

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    treeParentLabel: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 4,
    },
    treeParentLabelText: {
        fontSize: "14px",
        fontWeight: 700,
        margin: "4px",
    },
    treeChildLabelText: {
        fontSize: "14px",
        marginTop: "0px",
        marginBottom: "2px",
    },
});
