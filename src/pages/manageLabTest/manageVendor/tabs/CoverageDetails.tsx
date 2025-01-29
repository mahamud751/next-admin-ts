import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    Typography,
    Paper,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FC, SetStateAction, useEffect, useState } from "react";
import {
    FunctionField,
    SaveButton,
    SelectInput,
    SimpleForm,
    Toolbar,
    useEditContext,
    useNotify,
    useRefresh,
} from "react-admin";

import { labTestUploadDataProvider } from "../../../../dataProvider";
import { useRequest } from "../../../../hooks";
import { capitalizeFirstLetterOfEachWord } from "../../../../utils/helpers";
import ClearBtn from "../../../../components/manageLabTest/Button/ClearBtn";

type UserTabProps = {
    permissions: string[];
    [key: string]: any;
};
const CoverageDetails: FC<UserTabProps> = ({ ...rest }) => {
    const classes = useStyles();
    const { record } = useEditContext();
    const refresh = useRefresh();
    const notify = useNotify();
    const [, setDialogId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const [isUpdateAddModal, setIsUpdateAddModal] = useState(false);
    const [, setQcId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [zoneStatus, setZoneStatus] = useState("all");
    const [brachStatus, setBranchStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [selectBranch, setSelectBranch] = useState<any>(null);
    const {
        data: coverageList,
        total,
        refetch: coverageRefetch,
    } = useRequest(
        `/misc/api/v1/admin/vendor/coverage?page=${
            currentPage + 1
        }&limit=${rowsPerPage}&vendorId=${record.id}&${
            filterStatus !== "all" ? `&status=${filterStatus}` : ""
        }&${zoneStatus !== "all" ? `&zone=${zoneStatus}` : ""}&${
            brachStatus !== "all" ? `&branchId=${brachStatus}` : ""
        }`,
        { method: "GET" },
        {
            isSuccessNotify: false,
            refreshDeps: [currentPage, rowsPerPage],
            isPreFetching: true,
        }
    );
    const { data: Order } = useRequest(
        `/v1/zones?onlyMainZones=1`,
        {},
        {
            isBaseUrl: true,
            isSuccessNotify: false,
            isPreFetching: true,
        }
    );
    const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
        setCurrentPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(0);
    };
    const handleOpenDialog = (id: number) => {
        setQcId(id);
        setOpenDialog(true);
        setIsUpdateAddModal(true);
        setIsUpdateModal(false);
    };
    const handleCloseDialog = () => {
        setDialogId(null);
        setOpenDialog(false);
    };
    const handleFilterStatusChange = (event) => {
        setFilterStatus(event.target.value);
        coverageRefetch();
    };
    const handleZoneStatusChange = (event) => {
        setZoneStatus(event.target.value);
        coverageRefetch();
    };
    const handleBranchStatusChange = (event) => {
        setBranchStatus(event.target.value);
        coverageRefetch();
    };

    const { data: branchList } = useRequest(
        `/misc/api/v1/admin/vendor/branch?vendorId=${record.id}`,
        { method: "GET" },
        {
            isSuccessNotify: false,
            refreshDeps: [record.id],
            isPreFetching: true,
        }
    );

    const { data: Zone } = useRequest(
        `/v1/zones?page=${
            currentPage + 1
        }&limit=${rowsPerPage}&onlyMainZones=1`,
        {},
        {
            isBaseUrl: true,
            isSuccessNotify: false,
            isPreFetching: true,

            refreshDeps: [currentPage, rowsPerPage],
        }
    );
    const [checkedItems, setCheckedItems] = useState([]);
    useEffect(() => {
        const coverageZones = coverageList?.filter(
            (item) =>
                item?.status === "active" && item?.branch?.id === selectBranch
        );
        const zones = coverageZones?.map((item) => item?.zone);

        if (isUpdateModal) {
            setCheckedItems(zones);
        } else if (isUpdateAddModal) {
            setCheckedItems(zones);
        } else {
            setCheckedItems([]);
        }
    }, [
        coverageList,
        isUpdateModal,
        isUpdateAddModal,
        branchList,
        selectBranch,
    ]);
    const handleCheckAll = () => {
        if (checkedItems.length === Zone?.zones?.length) {
            setCheckedItems([]);
        } else {
            setCheckedItems([...Zone?.zones?.map((item, i) => item)]);
        }
    };
    const handleCheckboxChange = (id) => () => {
        if (checkedItems.includes(id)) {
            setCheckedItems(checkedItems.filter((item) => item !== id));
        } else {
            setCheckedItems([...checkedItems, id]);
        }
    };

    const refetch = async (data) => {
        try {
            await labTestUploadDataProvider.create(
                "misc/api/v1/admin/vendor/coverage",
                {
                    data: {
                        branchId: data.branchId,
                        zones: [...checkedItems],
                    },
                }
            );
            notify("Successfully Zone Create!", { type: "success" });
            refresh();
        } catch (err: any) {
            let message = err.message;
            if (
                err.message ===
                "A record with the given unique attributes already exists."
            )
                message =
                    "This zone is already attacthed to the branch. Please assigned another zone";

            notify(message, {
                type: "error",
            });
        }
    };
    const CustomToolbar = (props: any) => (
        <Toolbar
            {...props}
            toolbar={<CustomToolbar />}
            style={{ background: "none" }}
        >
            <SaveButton style={{ width: 120 }} label="Confirm" />
        </Toolbar>
    );
    return (
        <>
            <div className={classes.cartDetails}>
                <div className={classes.AddBtn}>
                    <Typography variant="h5" style={{ marginBottom: 10 }}>
                        Coverage Locations
                    </Typography>
                    <div style={{ display: "flex" }}>
                        <FunctionField
                            label="Actions"
                            render={(record: any) => (
                                <Box display="flex">
                                    {/* @ts-ignore */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disableElevation
                                        className={classes.button}
                                        onClick={(e: MouseEvent) => {
                                            e.stopPropagation();
                                            handleOpenDialog(record.id);
                                        }}
                                    >
                                        Manage Coverage
                                    </Button>{" "}
                                </Box>
                            )}
                        />
                    </div>
                </div>

                <FormControl
                    className={classes.formControl}
                    style={{ marginRight: 30 }}
                >
                    <InputLabel id="demo-simple-select-label">
                        Branch
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={brachStatus}
                        onChange={handleBranchStatusChange}
                    >
                        <MenuItem value={"all"}>All</MenuItem>
                        {branchList?.map((item) => (
                            <MenuItem
                                value={item?.id}
                            >{`${item?.location?.division} - ${item?.location?.district} - ${item?.location?.area}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl
                    className={classes.formControl}
                    style={{ marginRight: 30 }}
                >
                    <InputLabel id="demo-simple-select-label">Zone</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={zoneStatus}
                        onChange={handleZoneStatusChange}
                    >
                        <MenuItem value={"all"}>All</MenuItem>
                        {Order?.zones?.map((item) => (
                            <MenuItem value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl
                    className={classes.formControl}
                    style={{ marginRight: 30 }}
                >
                    <InputLabel id="demo-simple-select-label">
                        Filter Status
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filterStatus}
                        onChange={handleFilterStatusChange}
                    >
                        <MenuItem value={"all"}>All</MenuItem>
                        <MenuItem value={"active"}>Active</MenuItem>
                        <MenuItem value={"inactive"}>Inactive</MenuItem>
                    </Select>
                </FormControl>
                {coverageList?.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>SL</TableCell>
                                    <TableCell align="left">
                                        Vendor Name
                                    </TableCell>
                                    <TableCell align="left">Address</TableCell>
                                    <TableCell align="left">Zone</TableCell>
                                    <TableCell align="left">
                                        Zone Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coverageList?.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">
                                            {capitalizeFirstLetterOfEachWord(
                                                row?.vendor?.name?.en
                                            )}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.branch?.address}
                                        </TableCell>

                                        <TableCell align="left">
                                            {row?.zone}
                                        </TableCell>

                                        <TableCell align="left">
                                            <Button
                                                disableElevation
                                                style={{
                                                    backgroundColor:
                                                        (row?.status ===
                                                        "active"
                                                            ? "#4CAF50"
                                                            : "#ED6C02") + "10",
                                                    color:
                                                        row?.status ===
                                                        "inactive"
                                                            ? "#ED6C02"
                                                            : "#4CAF50",
                                                    borderRadius: 42,
                                                    textAlign: "center",
                                                    paddingTop: 5,
                                                    paddingBottom: 5,
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {capitalizeFirstLetterOfEachWord(
                                                    row?.status
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                {/* @ts-ignore */}
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={6}
                                    count={total}
                                    rowsPerPage={rowsPerPage}
                                    page={currentPage}
                                    SelectProps={{
                                        inputProps: {
                                            "aria-label": "rows per page",
                                        },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={
                                        handleChangeRowsPerPage
                                    }
                                />
                            </TableFooter>
                        </Table>
                    </TableContainer>
                ) : (
                    <Grid
                        style={{
                            borderBottom: "1px solid #E0E0E0",
                            paddingTop: 20,
                            paddingBottom: 20,
                        }}
                        container
                        spacing={1}
                    >
                        <Grid alignItems="center" item md={2} container>
                            <Typography variant="body2" color="textSecondary">
                                No Record Found
                            </Typography>
                        </Grid>
                    </Grid>
                )}

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogContent>
                        <>
                            <div className={classes.flex}>
                                <Typography variant="h5">
                                    Manage Coverage
                                </Typography>
                                <ClearBtn
                                    handleCloseDialog={handleCloseDialog}
                                />
                            </div>

                            <Grid container className={classes.locationArea}>
                                <SimpleForm
                                    save={refetch}
                                    toolbar={<CustomToolbar />}
                                >
                                    <Grid
                                        container
                                        spacing={1}
                                        style={{ width: "100%" }}
                                    >
                                        <Grid item sm={12} md={12}>
                                            <SelectInput
                                                source="branchId"
                                                label="Branch"
                                                variant="outlined"
                                                choices={branchList?.map(
                                                    (item) => ({
                                                        id: item.id,
                                                        name: `${item?.location?.division} - ${item?.location?.district} - ${item?.location?.area}`,
                                                    })
                                                )}
                                                onChange={(e) =>
                                                    setSelectBranch(
                                                        e.target.value
                                                    )
                                                }
                                                allowEmpty
                                                fullWidth
                                            />
                                        </Grid>
                                        {selectBranch && (
                                            <>
                                                <Grid item sm={12} md={12}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleCheckAll}
                                                    >
                                                        Check All
                                                    </Button>
                                                </Grid>

                                                {Zone?.zones?.map((item, i) => (
                                                    <Grid
                                                        item
                                                        sm={3}
                                                        md={3}
                                                        key={i}
                                                    >
                                                        <div>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        onChange={handleCheckboxChange(
                                                                            item
                                                                        )}
                                                                        checked={checkedItems?.includes(
                                                                            item
                                                                        )}
                                                                        color="primary"
                                                                    />
                                                                }
                                                                label={item}
                                                            />
                                                        </div>
                                                    </Grid>
                                                ))}
                                            </>
                                        )}
                                    </Grid>
                                </SimpleForm>
                                <Grid item sm={6} md={4}></Grid>
                            </Grid>
                        </>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

const useStyles = makeStyles(() => ({
    cartDetails: {
        border: "1px solid #EAEBEC",
        borderRadius: 6,
        padding: 25,
        marginTop: 10,
        marginBottom: 10,
    },
    location: {
        padding: 5,
        width: 205,
        wordWrap: "break-word",
        border: "0.5px solid #DCE0E4",
        background: "#F4F4F4",
        color: "#6C757D",
    },
    locationArea: {
        width: "100%",
        margin: "20px 0px 20px 0px",

        background: "#FFFFFF",
        border: "1px dashed #3ECBA5",
        borderRadius: 6,
    },
    button: {
        marginRight: 10,
        textTransform: "capitalize",
    },
    flex: {
        display: "flex",
        justifyContent: "space-between",
    },
    AddBtn: {
        margin: "20px 0px",
        display: "flex",
        justifyContent: "space-between",
    },
    formControl: {
        marginBottom: 20,
        minWidth: 140,
    },
}));

export default CoverageDetails;
