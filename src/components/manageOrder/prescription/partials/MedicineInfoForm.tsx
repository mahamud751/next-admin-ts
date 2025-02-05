import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { AutocompleteInput, ReferenceInput, TextInput } from "react-admin";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FieldArray } from "react-final-form-arrays";

import { medicineInputTextRenderer } from "../../../../../utils/helpers";
import MedicineOptionTextRenderer from "../../../../MedicineOptionTextRenderer";
import TaxonomiesByVocabularyInput from "../../../../TaxonomiesByVocabularyInput";
import ArrowsToDotIcon from "../../../../icons/ArrowsToDot";
import MinusSquare from "../../../../icons/MinusSquare";
import { NoteClosedIcon, NoteOpenIcon } from "../../../../icons/NoteIcon";
import SquarePlus from "../../../../icons/SquarePlus";

const MedicineInfo = () => {
    const classes = useStyles();
    const [needNote, setNeedNote] = useState({});

    const makeOnDragEndFunction = (fields) => (result) => {
        if (!result.destination) return;
        fields.move(result.source.index, result.destination.index);
    };

    const nintyDaysChoice = () => {
        return [...Array(90).keys()].map((i) => ({
            id: (i + 1).toString(),
            name: (i + 1).toString(),
        }));
    };

    const getTableBorderStyles = (index, length) => {
        if (index === length - 1) {
            return {
                borderBottom: "1px solid #CED4DA",
            };
        }
        return {};
    };

    const renderIconButtons = (name) => (
        <IconButton
            color="primary"
            component="span"
            onClick={() =>
                setNeedNote({
                    [name]: !needNote[name],
                })
            }
        >
            {needNote[name] ? (
                <NoteClosedIcon
                    color={needNote[name] ? "#7C8AA0" : "#3ECBA5"}
                />
            ) : (
                <NoteOpenIcon color={needNote[name] ? "#7C8AA0" : "#3ECBA5"} />
            )}
        </IconButton>
    );

    const renderAddRemoveButtons = (fields, index) => (
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
                marginLeft: 5,
            }}
        >
            {fields.length > 1 && (
                <MinusSquare
                    onClick={() => fields.remove(index)}
                    style={{
                        cursor: "pointer",
                        fontSize: 20,
                    }}
                />
            )}
            {index === fields.length - 1 && (
                <SquarePlus
                    color="#008069"
                    onClick={() => fields.push({})}
                    style={{
                        cursor: "pointer",
                        fontSize: 20,
                        marginTop: 5,
                    }}
                />
            )}
        </div>
    );

    return (
        <div className={classes.root}>
            <div className="medicine-info-table">
                <div className={classes.tableHeader}>
                    <div className={classes.tableHeaderItem}>Medicine Name</div>
                    <div className={classes.tableHeaderItem}>B/M or A/M</div>
                    <div className={classes.tableHeaderItem}>Dosage Time</div>
                    <div className={classes.tableHeaderItem}>Qty</div>
                    <div className={classes.tableHeaderItem}>Duration</div>
                    <div className={classes.tableHeaderItem}>Note</div>
                    <div className={classes.tableHeaderItem}></div>
                </div>
                <div className="table-body">
                    <FieldArray name="medicines">
                        {({ fields }) => (
                            <DragDropContext
                                onDragEnd={makeOnDragEndFunction(fields)}
                            >
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div ref={provided.innerRef}>
                                            {fields.map((name, index) => (
                                                <Draggable
                                                    key={name}
                                                    draggableId={name}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={[
                                                                classes.tableBody,
                                                            ]}
                                                            {...provided.draggableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            key={name}
                                                        >
                                                            <div
                                                                className={
                                                                    classes.tableBodyItem
                                                                }
                                                                style={getTableBorderStyles(
                                                                    index,
                                                                    fields.length
                                                                )}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 15,
                                                                        margin: "-1px -1px 1px -1px",
                                                                    }}
                                                                >
                                                                    <div
                                                                        {...snapshot.isDraggingOver}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            marginLeft: 10,
                                                                        }}
                                                                    >
                                                                        <ArrowsToDotIcon
                                                                            style={{
                                                                                color: "#3f51b5",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <ReferenceInput
                                                                        source={`${name}.pm_medicine_id`}
                                                                        label=""
                                                                        reference="v1/medicines"
                                                                        tooltip="Medicine Name"
                                                                        className={
                                                                            classes.input
                                                                        }
                                                                        filter={{
                                                                            _orderBy:
                                                                                "m_name",
                                                                        }}
                                                                        placeholder="Medicine Name"
                                                                    >
                                                                        <AutocompleteInput
                                                                            optionValue="m_id"
                                                                            variant="outlined"
                                                                            optionText={
                                                                                <MedicineOptionTextRenderer />
                                                                            }
                                                                            inputText={
                                                                                medicineInputTextRenderer
                                                                            }
                                                                            onSelect={() =>
                                                                                document
                                                                                    .getElementById(
                                                                                        `medicines[${index}].pm_dose_bm_am`
                                                                                    )
                                                                                    .focus()
                                                                            }
                                                                            helperText={
                                                                                false
                                                                            }
                                                                            matchSuggestion={() =>
                                                                                true
                                                                            }
                                                                            resettable
                                                                            fullWidth
                                                                        />
                                                                    </ReferenceInput>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={
                                                                    classes.tableBodyItem
                                                                }
                                                                style={getTableBorderStyles(
                                                                    index,
                                                                    fields.length
                                                                )}
                                                            >
                                                                <TaxonomiesByVocabularyInput
                                                                    fetchKey="prescription_bm_or_am"
                                                                    source={`${name}.pm_dose_bm_am`}
                                                                    inputType="autoCompleteInput"
                                                                    label="BM/AM"
                                                                    variant="outlined"
                                                                    onSelect={() =>
                                                                        document
                                                                            .getElementById(
                                                                                `medicines[${index}].pm_dose_time`
                                                                            )
                                                                            .focus()
                                                                    }
                                                                    className={
                                                                        classes.selectInput
                                                                    }
                                                                    helperText={
                                                                        false
                                                                    }
                                                                    fullWidth
                                                                    resettable
                                                                />
                                                            </div>
                                                            <div
                                                                style={getTableBorderStyles(
                                                                    index,
                                                                    fields.length
                                                                )}
                                                                className={
                                                                    classes.tableBodyItem
                                                                }
                                                            >
                                                                <TaxonomiesByVocabularyInput
                                                                    fetchKey="prescription_dosage_time"
                                                                    source={`${name}.pm_dose_time`}
                                                                    label="Doses Time"
                                                                    inputType="autoCompleteInputMui"
                                                                    variant="outlined"
                                                                    // onSelect={() =>
                                                                    // 	document
                                                                    // 		.getElementById(
                                                                    // 			`medicines[${index}].pm_dosage`
                                                                    // 		)
                                                                    // 		.focus()
                                                                    // }
                                                                    className={
                                                                        classes.selectInput
                                                                    }
                                                                    inputProps={{
                                                                        classes:
                                                                            {
                                                                                input: classes.input,
                                                                            },
                                                                    }}
                                                                    fullWidth
                                                                    resettable
                                                                />
                                                            </div>
                                                            <div
                                                                style={getTableBorderStyles(
                                                                    index,
                                                                    fields.length
                                                                )}
                                                                className={
                                                                    classes.tableBodyItem
                                                                }
                                                            >
                                                                <TextInput
                                                                    source={`${name}.pm_dosage`}
                                                                    label=""
                                                                    variant="outlined"
                                                                    helperText={
                                                                        false
                                                                    }
                                                                    className={
                                                                        classes.selectInput
                                                                    }
                                                                    onBlur={() =>
                                                                        document
                                                                            .getElementById(
                                                                                `medicines[${index}].pm_duration`
                                                                            )
                                                                            .focus()
                                                                    }
                                                                    fullWidth
                                                                />
                                                            </div>
                                                            <div
                                                                style={getTableBorderStyles(
                                                                    index,
                                                                    fields.length
                                                                )}
                                                                className={
                                                                    classes.tableBodyItem
                                                                }
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <AutocompleteInput
                                                                        source={`${name}.pm_duration`}
                                                                        label="Duration"
                                                                        className={
                                                                            classes.selectInput
                                                                        }
                                                                        variant="outlined"
                                                                        choices={nintyDaysChoice()}
                                                                        placeholder="Select"
                                                                        inputType="autoCompleteInput"
                                                                        onSelect={() =>
                                                                            document
                                                                                .getElementById(
                                                                                    `medicines[${index}].pm_duration_type`
                                                                                )
                                                                                .focus()
                                                                        }
                                                                        helperText={
                                                                            false
                                                                        }
                                                                        freeSolo
                                                                        multiple
                                                                        resettable
                                                                    />
                                                                    <TaxonomiesByVocabularyInput
                                                                        fetchKey="prescription_duration"
                                                                        source={`${name}.pm_duration_type`}
                                                                        label="D/M/Y"
                                                                        inputType="autoCompleteInput"
                                                                        createLabel="Add New"
                                                                        variant="outlined"
                                                                        className={
                                                                            classes.selectInput
                                                                        }
                                                                        helperText={
                                                                            false
                                                                        }
                                                                        resettable
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={getTableBorderStyles(
                                                                    index,
                                                                    fields.length
                                                                )}
                                                                className={
                                                                    classes.tableBodyItem
                                                                }
                                                            >
                                                                {renderIconButtons(
                                                                    name
                                                                )}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    ...getTableBorderStyles(
                                                                        index,
                                                                        fields.length
                                                                    ),
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                                className={
                                                                    classes.tableBodyItem
                                                                }
                                                            >
                                                                {renderAddRemoveButtons(
                                                                    fields,
                                                                    index
                                                                )}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        needNote[
                                                                            name
                                                                        ]
                                                                            ? "table-row"
                                                                            : "none",
                                                                    width: "400.4%",
                                                                    borderTop:
                                                                        "none",
                                                                }}
                                                            >
                                                                <TextInput
                                                                    source={`${name}.pm_note`}
                                                                    label=""
                                                                    variant="outlined"
                                                                    className={
                                                                        classes.textarea
                                                                    }
                                                                    placeholder="If Necessary note"
                                                                    minRows={1}
                                                                    multiline
                                                                    fullWidth
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </FieldArray>
                </div>
            </div>
        </div>
    );
};

const useStyles = makeStyles(() => ({
    input: {
        "&.MuiFormControl-marginDense": {
            marginTop: 0,
            marginBottom: 0,
        },
        "& .MuiInputBase-input": {
            border: "none",
        },
        "& .MuiOutlinedInput-inputMarginDense": {
            padding: 10,
        },
        "& fieldset": {
            top: -2,
            border: "none",
            bottom: -9,
            right: -1,
            "& legend": {
                display: "none",
            },
            "&.Mui-focused fieldset": {
                borderColor: "red",
            },
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: 0,
        },
    },
    textarea: {
        "&.MuiFormControl-marginDense": {
            marginTop: "0px",
            marginBottom: 0,
            marginLeft: "-1px",
            width: "100.1%",
        },
        "& fieldset": {
            top: -1,
            border: "1px solid #CED4DA",
            bottom: -25,
            left: -1,
            "& legend": {
                display: "none",
            },
            "&.Mui-focused fieldset": {
                borderColor: "red",
            },
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: 0,
        },
    },
    root: {
        "& .MuiTableCell-root": {
            "&.MuiTableCell-body": {
                border: "1px solid #CED4DA",
                padding: 0,
            },
            "&.MuiTableCell-body:last-child": {
                border: "none",
            },
            "&.MuiTableCell-head": {
                border: "1px solid #CED4DA",
            },
            "&.MuiTableCell-head:last-child": {
                border: "none",
                backgroundColor: "white",
            },
        },
    },
    selectInput: {
        "&.MuiFormControl-marginDense": {
            marginTop: 0,
            marginBottom: 0,
            "& .MuiFormLabel-filled": {
                display: "none",
            },
            "& .Mui-focused": {
                "& span": {
                    display: "none",
                },
            },
        },
        "& .MuiInputBase-input": {
            border: "none",
        },
        "& .MuiOutlinedInput-inputMarginDense": {
            padding: 10,
        },
        "& .MuiSelect-select:focus": {
            backgroundColor: "transparent",
        },

        "& fieldset": {
            border: "none",
            marginTop: 5,
            padding: 23,
            "& legend": {
                display: "none",
            },

            "&.Mui-focused fieldset": {
                borderColor: "red",
            },
            "&:focus-visible": {
                borderColor: "#CED4DA",
                marginTop: 5,
                padding: 23,
            },
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& label": {
                display: "none",
            },
        },
        // 		.MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] {
        //     padding: 9px;
        // }
        "& .MuiAutocomplete-inputRoot": {
            padding: 0,
        },
    },
    tableHeader: {
        display: "grid",
        gridTemplateColumns: "25% 18% 16% 16% 16% 6% 3%",
        backgroundColor: "#F8F9FD",
        borderTop: "1px solid #CED4DA",
        borderLeft: "1px solid #CED4DA",
    },
    tableHeaderItem: {
        padding: 18,
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: "0.875rem",
        borderRight: "1px solid #CED4DA",
    },
    tableBody: {
        display: "grid",
        gridTemplateColumns: "25% 18% 16% 16% 16% 6% 3.1%",
        borderTop: "1px solid #CED4DA",
        borderLeft: "1px solid #CED4DA",
    },
    tableBodyItem: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: "0.875rem",
        borderRight: "1px solid #CED4DA",
    },
}));

export default MedicineInfo;
