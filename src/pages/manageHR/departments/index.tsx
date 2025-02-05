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
import { ReferenceField, SimpleForm, TextField, Title } from "react-admin";

import AroggaButton from "../../../components/AroggaButton";
import CreateUpdateDialog from "../../../components/manageHR/departments/CreateUpdateDialog";
import { useDocumentTitle, useRequest } from "../../../hooks";
import {
    buildTreeFromList,
    capitalizeFirstLetterOfEachWord,
    flattenTree,
    isJSONParsable,
} from "../../../utils/helpers";

const DepartmentsPage = () => {
    useDocumentTitle("Arogga | Department List");

    const classes = useStyles();

    const [departments, setDepartments] = useState([]);
    const [singleDepartmentData, setSingleDepartmentData] = useState({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [dragLeaveId, setDragLeaveId] = useState(null);

    const {
        data,
        isSuccess,
        refetch: fetchDepartments,
    } = useRequest(
        "/v1/taxonomiesByVocabulary/department",
        {},
        { isPreFetching: true }
    );

    const { refetch: updateDepartment } = useRequest(
        "",
        {
            method: "POST",
        },
        {
            successNotify: "Successfully updated!",
            onFinally: () => fetchDepartments(),
        }
    );

    useEffect(() => {
        if (!isSuccess) return;

        const tree = buildTreeFromList(data, {
            keyId: "t_id",
            keyParent: "t_parent_id",
        });

        setDepartments(flattenTree(tree));
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
            targetItemId === draggedItem.t_id ||
            targetItemId === draggedItem.t_parent_id
        )
            return;

        updateDepartment({
            endpoint: `/v1/taxonomy/${draggedItem.t_id}`,
            body: {
                t_parent_id: targetItemId,
            },
        });
    };

    const handleExpandCollapse = (action, id) => {
        const newDepartments = [...departments];

        const updateExpandCollapse = (data, id) => {
            data.forEach((item) => {
                if (item.t_id === id) {
                    item.isExpand = action === "expand";
                }
                if (item.t_parent_id === id) {
                    item.isOpen = action === "expand";
                    updateExpandCollapse(data, item.id);
                }
            });
        };

        updateExpandCollapse(newDepartments, id);
        setDepartments(newDepartments);
    };

    return (
        <Paper className={classes.paper}>
            <Title title="Departments" />
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
            {!!departments?.length && (
                <TableContainer>
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Machine Name</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {departments
                            .filter(
                                (item) =>
                                    item?.t_parent_id === 0 || item?.isOpen
                            )
                            .map((department) => {
                                const {
                                    t_id,
                                    t_parent_id,
                                    t_title,
                                    t_machine_name,
                                    t_created_at,
                                    isExpand,
                                    marginLeft,
                                    hasChildren,
                                } = department || {};

                                return (
                                    <TableRow
                                        key={t_id}
                                        onDragStart={(e) =>
                                            handleDragStart(e, {
                                                t_id,
                                                t_parent_id,
                                            })
                                        }
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDragLeave={() =>
                                            handleDragLeave(t_id)
                                        }
                                        onDrop={(e) => handleDrop(e, t_id)}
                                        draggable
                                        style={{
                                            backgroundColor:
                                                dragLeaveId === t_id
                                                    ? "#3ed9c9"
                                                    : "",
                                        }}
                                    >
                                        <TableCell>
                                            <DragIndicatorIcon
                                                style={{ cursor: "move" }}
                                            />
                                        </TableCell>
                                        <TableCell>{t_id}</TableCell>
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
                                                                t_id
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
                                                                t_id
                                                            )
                                                        }
                                                    />
                                                )}
                                                {capitalizeFirstLetterOfEachWord(
                                                    t_title
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{t_machine_name}</TableCell>
                                        <TableCell>{t_created_at}</TableCell>
                                        <TableCell>
                                            <ReferenceField
                                                source="t_created_by"
                                                label="Created By"
                                                reference="v1/users"
                                                link="show"
                                                record={department}
                                            >
                                                <TextField source="u_name" />
                                            </ReferenceField>
                                        </TableCell>
                                        <TableCell>
                                            <AroggaButton
                                                label="Edit"
                                                type="success"
                                                onClick={() => {
                                                    setAction("edit");
                                                    setSingleDepartmentData(
                                                        department
                                                    );
                                                    setIsCreateDialogOpen(true);
                                                }}
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
                        fetchDepartments={fetchDepartments}
                        singleDepartmentData={singleDepartmentData}
                        isCreateDialogOpen={isCreateDialogOpen}
                        setIsCreateDialogOpen={setIsCreateDialogOpen}
                    />
                </SimpleForm>
            )}
        </Paper>
    );
};

export default DepartmentsPage;

const useStyles = makeStyles(() => ({
    paper: {
        width: "100%",
        marginTop: 25,
    },
    table: {
        minWidth: 750,
    },
}));
