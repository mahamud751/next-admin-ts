import * as xlsx from "xlsx";

import { toFormattedDateTime } from "../utils/helpers";

const useXLSXDownloader = () => {
    const excelFilename = `file_T${toFormattedDateTime({
        isHyphen: true,
        dateString: new Date().toString(),
    })}`;

    const onExportToXLSX = (data = [], filename = excelFilename) => {
        if (!data?.length) return;

        const workBook = xlsx.utils.book_new();
        const workSheet = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(workBook, workSheet);
        xlsx.writeFile(workBook, `${filename}.xlsx`);
    };

    return {
        onExportToXLSX,
    } as {
        onExportToXLSX: (data: object[], filename?: string) => void;
    };
};

export default useXLSXDownloader;
