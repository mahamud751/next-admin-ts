import { CSSProperties, FC, useState } from "react";
import {
    formatFileSize,
    lightenDarkenColor,
    useCSVReader,
} from "react-papaparse";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
    DEFAULT_REMOVE_HOVER_COLOR,
    40
);
const GREY_DIM = "#686868";

const styles = {
    zone: {
        alignItems: "center",
        border: `2px dashed ${GREY}`,
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: 10,
    } as CSSProperties,
    file: {
        background: "linear-gradient(to bottom, #EEE, #DDD)",
        borderRadius: 15,
        display: "flex",
        height: 100,
        position: "relative",
        zIndex: 10,
        flexDirection: "column",
        justifyContent: "center",
    } as CSSProperties,
    info: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingLeft: 10,
        paddingRight: 10,
    } as CSSProperties,
    size: {
        backgroundColor: GREY_LIGHT,
        borderRadius: 3,
        marginBottom: "0.5em",
        justifyContent: "center",
        display: "flex",
    } as CSSProperties,
    name: {
        backgroundColor: GREY_LIGHT,
        borderRadius: 3,
        fontSize: 12,
        marginBottom: "0.5em",
    } as CSSProperties,
    progressBar: {
        bottom: 10,
        position: "absolute",
        width: "85%",
        paddingLeft: 10,
        paddingRight: 5,
    } as CSSProperties,
    zoneHover: {
        borderColor: GREY_DIM,
    } as CSSProperties,
    default: {
        borderColor: GREY,
    } as CSSProperties,
    remove: {
        height: 23,
        position: "absolute",
        right: 6,
        top: 6,
        width: 23,
    } as CSSProperties,
};

type CSVReaderProps = {
    setDataSource: (items) => void;
};

const CSVReader: FC<CSVReaderProps> = ({ setDataSource }) => {
    const { CSVReader } = useCSVReader();
    const [zoneHover, setZoneHover] = useState(false);
    const [removeHoverColor, setRemoveHoverColor] = useState(
        DEFAULT_REMOVE_HOVER_COLOR
    );

    return (
        <CSVReader
            onUploadAccepted={(results) => {
                const columns = results.data[0]?.map((col: string) => ({
                    accessor: col.split(" ")?.join("_").toLowerCase(),
                }));
                const rows = results?.data
                    ?.slice(1, results.data.length - 1)
                    ?.map((row) =>
                        row?.reduce((acc, curr, index) => {
                            acc[columns[index].accessor] = curr;
                            return acc;
                        }, {})
                    );
                const filteredRows = rows.filter(
                    (row) =>
                        !row.description?.startsWith("ATM WDL") &&
                        !row.description?.startsWith("REVERSE WDL")
                );
                setDataSource((prevState) => [...prevState, ...filteredRows]);
                setZoneHover(false);
            }}
            onDragOver={(event: DragEvent) => {
                event.preventDefault();
                setZoneHover(true);
            }}
            onDragLeave={(event: DragEvent) => {
                event.preventDefault();
                setZoneHover(false);
            }}
        >
            {({
                getRootProps,
                acceptedFile,
                ProgressBar,
                getRemoveFileProps,
                Remove,
            }) => (
                <>
                    <div
                        {...getRootProps()}
                        style={Object.assign(
                            {},
                            styles.zone,
                            zoneHover && styles.zoneHover
                        )}
                    >
                        {acceptedFile ? (
                            <>
                                <div style={styles.file}>
                                    <div style={styles.info}>
                                        <span style={styles.size}>
                                            {formatFileSize(acceptedFile.size)}
                                        </span>
                                        <span style={styles.name}>
                                            {acceptedFile.name}
                                        </span>
                                    </div>
                                    <div style={styles.progressBar}>
                                        <ProgressBar />
                                    </div>
                                    <div
                                        {...getRemoveFileProps()}
                                        style={styles.remove}
                                        onMouseOver={(event: Event) => {
                                            event.preventDefault();
                                            setRemoveHoverColor(
                                                REMOVE_HOVER_COLOR_LIGHT
                                            );
                                        }}
                                        onMouseOut={(event: Event) => {
                                            event.preventDefault();
                                            setRemoveHoverColor(
                                                DEFAULT_REMOVE_HOVER_COLOR
                                            );
                                        }}
                                    >
                                        <Remove color={removeHoverColor} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            "Drop CSV file here or click to upload"
                        )}
                    </div>
                </>
            )}
        </CSVReader>
    );
};

export default CSVReader;
