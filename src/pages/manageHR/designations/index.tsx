import {
    Box,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { useEffect, useState } from "react";
import { SimpleForm, Title } from "react-admin";

import AroggaButton from "../../../components/AroggaButton";
import CreateUpdateDialog from "../../../components/manageHR/designations/CreateUpdateDialog";
import { useDocumentTitle, useRequest } from "../../../hooks";
import {
    buildTreeFromList,
    capitalizeFirstLetterOfEachWord,
    flattenTree,
    isJSONParsable,
} from "../../../utils/helpers";

const DesignationsPage = () => {
    useDocumentTitle("Arogga | Designation List");

    const classes = useStyles();

    const [designations, setDesignations] = useState([]);
    const [singleDesignationData, setSingleDesignationData] = useState({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [dragLeaveId, setDragLeaveId] = useState(null);

    const {
        data,
        isSuccess,
        refetch: fetchDesignations,
    } = useRequest(
        "/v1/rank?_page=1&_perPage=5000",
        {},
        { isPreFetching: true }
    );

    const { refetch: updateDesignation } = useRequest(
        "",
        {
            method: "POST",
        },
        {
            successNotify: "Successfully updated!",
            onFinally: () => fetchDesignations(),
        }
    );

    useEffect(() => {
        if (!isSuccess) return;

        const tree = buildTreeFromList(data, {
            keyId: "r_id",
            keyParent: "r_parent",
        });

        setDesignations(flattenTree(tree, "r_weight"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    const handleDragStart = (e, draggedItem) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(draggedItem));
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDragLeave = (dragLeaveId) => {
        setDragLeaveId(dragLeaveId);
    };

    const handleDrop = (e, targetItemId) => {
        e.preventDefault();

        setDragLeaveId(null);

        const draggedItem = isJSONParsable(e.dataTransfer.getData("text/plain"))
            ? JSON.parse(e.dataTransfer.getData("text/plain"))
            : {};

        if (
            targetItemId === draggedItem.r_id ||
            targetItemId === draggedItem.r_parent
        )
            return;

        updateDesignation({
            endpoint: `/v1/rank/${draggedItem.r_id}`,
            body: {
                r_parent: targetItemId,
            },
        });
    };

    const handleExpandCollapse = (action, id) => {
        const newDesignations = [...designations];

        const updateExpandCollapse = (data, id) => {
            data.forEach((item) => {
                if (item.r_id === id) {
                    item.isExpand = action === "expand";
                }
                if (item.r_parent === id) {
                    item.isOpen = action === "expand";
                    updateExpandCollapse(data, item.id);
                }
            });
        };

        updateExpandCollapse(newDesignations, id);
        setDesignations(newDesignations);
    };

    return (
        <Paper className={classes.paper}>
            <Title title="Designations" />
            <Box textAlign="right" m={2}>
                <AroggaButton
                    label="Create"
                    type="success"
                    onClick={() => {
                        setAction("create");
                        setIsCreateDialogOpen(true);
                    }}
                />
            </Box>
            {!!designations?.length && (
                <TableContainer>
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Sick Leaves</TableCell>
                                <TableCell>Casual Leaves</TableCell>
                                <TableCell>Annual Leaves</TableCell>
                                <TableCell>Compensatory Leaves</TableCell>
                                <TableCell>Maternity Leaves</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {designations
                            .filter(
                                (item) => item?.r_parent === 0 || item?.isOpen
                            )
                            .map((designation) => {
                                const {
                                    r_id,
                                    r_parent,
                                    r_title,
                                    r_sick_leaves,
                                    r_casual_leaves,
                                    r_annual_leaves,
                                    r_compensatory_leaves,
                                    r_maternity_leaves,
                                    isExpand,
                                    marginLeft,
                                    hasChildren,
                                } = designation || {};

                                return (
                                    <TableRow
                                        key={r_id}
                                        onDragStart={(e) =>
                                            handleDragStart(e, {
                                                r_id,
                                                r_parent,
                                            })
                                        }
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDragLeave={() =>
                                            handleDragLeave(r_id)
                                        }
                                        onDrop={(e) => handleDrop(e, r_id)}
                                        draggable
                                        style={{
                                            backgroundColor:
                                                dragLeaveId === r_id
                                                    ? "#3ed9c9"
                                                    : "",
                                        }}
                                    >
                                        <TableCell>
                                            <DragIndicatorIcon
                                                style={{ cursor: "move" }}
                                            />
                                        </TableCell>
                                        <TableCell>{r_id}</TableCell>
                                        <TableCell>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                marginLeft={marginLeft}
                                            >
                                                {isExpand ? (
                                                    <ArrowDropDownIcon
                                                        style={{
                                                            display: hasChildren
                                                                ? ""
                                                                : "none",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleExpandCollapse(
                                                                "collapse",
                                                                r_id
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <ArrowRightIcon
                                                        style={{
                                                            display: hasChildren
                                                                ? ""
                                                                : "none",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleExpandCollapse(
                                                                "expand",
                                                                r_id
                                                            )
                                                        }
                                                    />
                                                )}
                                                {capitalizeFirstLetterOfEachWord(
                                                    r_title
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{r_sick_leaves}</TableCell>
                                        <TableCell>{r_casual_leaves}</TableCell>
                                        <TableCell>{r_annual_leaves}</TableCell>
                                        <TableCell>
                                            {r_compensatory_leaves}
                                        </TableCell>
                                        <TableCell>
                                            {r_maternity_leaves}
                                        </TableCell>
                                        <TableCell
                                            className={classes.whitespaceNowrap}
                                        >
                                            <AroggaButton
                                                label="Edit"
                                                type="success"
                                                onClick={() => {
                                                    setAction("edit");
                                                    setSingleDesignationData(
                                                        designation
                                                    );
                                                    setIsCreateDialogOpen(true);
                                                }}
                                            />
                                            <AroggaButton
                                                label="Permission"
                                                type="success"
                                                style={{ marginLeft: 5 }}
                                                onClick={() =>
                                                    window.open(
                                                        `#/designation-permission/${r_id}`,
                                                        "_blank"
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </Table>
                </TableContainer>
            )}
            {isCreateDialogOpen && (
                <SimpleForm toolbar={false}>
                    <CreateUpdateDialog
                        action={action}
                        fetchDesignations={fetchDesignations}
                        singleDesignationData={singleDesignationData}
                        isCreateDialogOpen={isCreateDialogOpen}
                        setIsCreateDialogOpen={setIsCreateDialogOpen}
                    />
                </SimpleForm>
            )}
        </Paper>
    );
};

export default DesignationsPage;

const useStyles = makeStyles(() => ({
    paper: {
        width: "100%",
        marginTop: 25,
    },
    table: {
        minWidth: 750,
    },
    whitespaceNowrap: {
        whiteSpace: "nowrap",
    },
}));
