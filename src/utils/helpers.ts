import imageCompression from "browser-image-compression";
import pluralize from "pluralize";
import queryString from "query-string";

import { MOBILE_NO_VALIDATOR_REGEX, monthsWithId } from "./constants";

export const required =
  (message: string = "Required") =>
  (value: string): string | undefined =>
    value ? undefined : message;

export const logger = (message: string, isError: boolean = true): void => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    if (isError) {
      console.error(message);
    } else {
      console.log(message);
    }
  }
};

export const isString = (value: any): value is string =>
  typeof value === "string";

export const isInteger = (value: any): boolean => Number.isInteger(+value);

export const isFloatingPoint = (value: any) =>
  Number.isFinite(+value) && !Number.isInteger(+value);

export const isDecimal = (value) =>
  Number.isFinite(+value) && !Number.isInteger(+value) && +value % 1 !== 0;

export const isInfinity = (value) => !isFinite(value);

export const isObject = (value) => value && typeof value === "object";

export const isArray = (value) => Array.isArray(value);

export const isArrayOfTypeString = (arr) =>
  isArray(arr) && arr.length && arr.every((item) => isString(item));

export const isArrayofTypeObject = (value) =>
  isArray(value) && value.every((item) => isObject(item));

export const isEmpty = (value) => {
  if (
    !value ||
    (isArray(value) && value.every((item) => item === undefined || item === ""))
  )
    return true;
  if (isArray(value) && value.length === 0) return true;
  if (isObject(value) && Object.keys(value).length === 0) return true;
  return false;
};

export const isValidMobileNo = (mobileNo: string) => {
  if (!mobileNo) return false;

  return MOBILE_NO_VALIDATOR_REGEX.test(mobileNo.trim());
};

export const groupBy = (data: any[], callback) => {
  return data?.reduce((groups, item) => {
    const key = callback(item);
    if (!groups?.[key]) {
      groups[key] = [];
    }
    groups?.[key]?.push(item);
    return groups;
  }, {});
};

export const groupAndNestBy = ({ data, groupKey = "id", nestKeys }) => {
  const groupedData = groupBy(data, (item) => item?.[groupKey]);

  for (const key in groupedData) {
    const group = groupedData?.[key]?.[0];

    nestKeys?.forEach((item) => {
      const nestedKey = isArrayOfTypeString(nestKeys) ? item : item?.key;
      const mappingKey = isArrayOfTypeString(nestKeys)
        ? "id"
        : item?.mappingKey;

      const nestedItems = group?.[nestedKey];
      group[nestedKey] = {};
      nestedItems?.forEach(
        (item) => (group[nestedKey][item?.[mappingKey]] = item)
      );
    });
  }

  return groupedData;
};

export const isJSONParsable = (data: string) => {
  if (!data) return false;

  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};

export const toFixedNumber = (num: number, digits: number = 2): number => {
  if (isNaN(parseFloat(num?.toString())) || isNaN(num - 0)) return 0;

  let pow = Math.pow(10, digits);
  const result = Math.round(num * pow) / pow;
  return isInfinity(result) ? 0 : result;
};

export const numberFormat = (number) => new Intl.NumberFormat().format(number);

export const toFilterObj = (locationSearch: string) => {
  const filterString = queryString.parse(locationSearch).filter?.toString();
  const filterObj = isJSONParsable(filterString)
    ? JSON.parse(filterString)
    : {};
  return filterObj;
};

export const capitalizeFirstLetter = (text: string) => {
  if (!text || !isString(text)) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const capitalizeFirstLetterOfEachWord = (sentence) => {
  if (!sentence || !isString(sentence)) return sentence;

  const modifiedSentence = sentence.replace(/_/g, " ");
  return modifiedSentence
    .split(/\s+/)
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
};

export const convertToSnakeCase = (str: string) =>
  str
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();

type toFormattedDateTimeProps = {
  isDate?: boolean;
  isPreviousDate?: boolean;
  isNextDate?: boolean;
  isHyphen?: boolean;
  dateString: string;
};

export const toFormattedDateTime = ({
  isDate,
  isPreviousDate,
  isNextDate,
  isHyphen,
  dateString,
}: toFormattedDateTimeProps) => {
  if (!dateString || dateString === "0000-00-00 00:00:00")
    return "0000-00-00 00:00:00";

  let date;

  if (isPreviousDate) {
    date = new Date();
    date.setDate(date.getDate() - 1);
  } else if (isNextDate) {
    date = new Date();
    date.setDate(date.getDate() + 1);
  } else {
    date = new Date(dateString);
  }

  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);
  const second = ("0" + date.getSeconds()).slice(-2);

  if (isDate || isPreviousDate || isNextDate)
    return `${date.getFullYear()}-${month}-${day}`;
  if (isHyphen)
    return `${date.getFullYear()}-${month}-${day}_${hour}-${minute}-${second}`;

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};

export const getFormattedDateString = (inputDate: string) => {
  if (
    !inputDate ||
    ["0000-00-00 00:00:00", "0000-00-00", "00:00:00"].includes(inputDate)
  ) {
    return;
  }

  const date = new Date(inputDate);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(inputDate?.split(" ")?.[1] && {
      hour: "2-digit",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }),
  };

  // @ts-ignore
  return date.toLocaleDateString("en-US", options);
};

export const convertTo12HourFormat = (hour: number) => {
  if (hour === 12) {
    return "12 PM";
  } else if (hour === 24) {
    return "12 AM";
  } else if (hour >= 1 && hour <= 11) {
    return hour + " AM";
  } else if (hour >= 13 && hour <= 23) {
    return hour - 12 + " PM";
  } else {
    return "";
  }
};

export const convertToSlug = (text: string) =>
  text.toLowerCase().trim().replace(/ /g, "-");

export const convertObjectToArrayOfObject = ({
  data,
  keyName = "key",
  valueName = "value",
}) => {
  return Object.entries(data)?.map(([key, value]) => ({
    [keyName]: key,
    [valueName]: value,
  }));
};

const transformFile = (file: File, source) => {
  if (!(file instanceof File)) return file;

  const preview = URL.createObjectURL(file);
  const transformedFile = {
    rawFile: file,
    [source]: preview,
    title: file.name,
  };

  return transformedFile;
};

export const transformFiles = (files: File[], source) => {
  if (!files) return [];

  if (isArray(files)) return files.map((file) => transformFile(file, source));

  return transformFile(files, source);
};

export const convertFileToBase64 = (data): Promise<unknown> => {
  const file = isArray(data) && data?.length === 1 ? data?.[0] : data;

  if (!(file?.rawFile instanceof File) && !(file?.rawFile instanceof Blob)) {
    return Promise.resolve(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve({ src: reader.result, title: file.title });

    reader.onerror = reject;

    reader.readAsDataURL(file.rawFile);
  });
};

export const convertFileToString = (file: {
  rawFile: Blob;
  title: string;
}): Promise<unknown> => {
  if (!(file.rawFile instanceof File) && !(file.rawFile instanceof Blob)) {
    return Promise.resolve(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file.rawFile);
  });
};

export const convertImageUrlToBase64 = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

export const convertAttachmentsToBase64 = async (
  key,
  data = [],
  isSingleAttachment = false
) => {
  if (isEmpty(data)) return [];

  const keys = typeof key === "string" ? [key] : key;
  const convertedData = [];

  for (const item of data) {
    for (const k of keys) {
      const attachments = isArray(item[k]) ? item[k] : [item[k]];

      if (attachments && attachments.length > 0) {
        const convertedAttachments = [];

        for (const attachment of attachments) {
          if (isEmpty(attachment)) {
            continue;
          }
          const compressedAttachment = await imageCompress(
            attachment,
            "",
            null
          );
          const base64Attachment = await convertFileToBase64(
            compressedAttachment
          );
          convertedAttachments.push(base64Attachment);
        }
        item[k] = isSingleAttachment
          ? convertedAttachments?.[0]
          : convertedAttachments;
      }
    }
    convertedData.push(item);
  }

  return convertedData;
};

export const getImageDetails = async (files) => {
  const promises = files.map(async (file) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${file.name}`));
      });
      return {
        src: img.src,
        title: file.name,
        width: img.width,
        height: img.height,
      };
    } catch (error) {
      throw error;
    }
  });

  const results = await Promise.allSettled(promises);
  const imageInfoArray = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  return imageInfoArray;
};

export const imageCompress = (file, resource: string, item): Promise<any> => {
  if (
    (!(file?.rawFile instanceof File) && !(file?.rawFile instanceof Blob)) ||
    file.rawFile?.type === "image/gif" ||
    file.rawFile?.type === "image/svg+xml"
  ) {
    return Promise.resolve(file);
  }

  let maxWidthOrHeight: number = 1920;

  if (
    item?.key === "attachedFilesApp" ||
    item?.key === "attachedFilesUnderProductBanner"
  ) {
    maxWidthOrHeight = 750;
  } else if (item?.key === "attachedFilesWeb") {
    maxWidthOrHeight = 2700;
  } else if (item?.key === "attachedFilesHomepageBanner") {
    maxWidthOrHeight = 1000;
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: 0.8,
  };

  if (file.rawFile?.type?.split("/")[0] === "image") {
    return imageCompression(file.rawFile, options)
      .then((compressedFile) => {
        file.rawFile = compressedFile;
        return file;
      })
      .catch((err) => logger(err));
  } else {
    return Promise.resolve(file);
  }
};

export const downloadFileFromUrl = (
  url,
  fileName = `File-${Math.floor(Math.random() * 1000)}`,
  target = "_self"
) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = target;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const autoGeneratedLedgerReason = (obj) => {
  const { l_a_date, username, rank, l_a_uid } = obj || {};

  const month = l_a_date?.split("-")[1];
  const year = l_a_date?.split("-")[0];

  return `Salary to ${username} (${rank}, ID=${l_a_uid}), ${
    monthsWithId.map((item) => item.name)[parseInt((month - 1).toString())]
  }, ${year}`;
};

export const medicineInputTextRenderer = (choice) =>
  !!choice
    ? `${choice?.m_name} (${choice?.m_form}) (${choice?.m_strength}) (${choice?.m_price}Tk) (${choice?.m_d_price}Tk/${choice?.m_unit}) (${choice?.m_company})`
    : "";

export const getProductTextRenderer = (choice) => {
  const form = choice?.p_form;
  const strength = choice?.p_strength;
  const brand = choice?.p_brand;

  return !!choice && !!choice?.id
    ? `${choice?.p_name} ${form ? `(${capitalizeFirstLetter(form)})` : ""} ${
        strength ? `(${strength})` : ""
      } ${brand ? `(${brand})` : ""} (ID#${choice?.p_id})`
    : "";
};

export const userEmployeeInputTextRenderer = (choice) => {
  let name;
  let mobileNo;

  if (choice?.e_name || choice?.e_mobile) {
    name = choice?.e_name || "";
    mobileNo = choice?.e_mobile || "";
  } else {
    name = choice?.u_name || "";
    mobileNo = choice?.u_mobile || "";
  }

  return !!choice
    ? `${name} ${name && mobileNo ? `(${mobileNo})` : mobileNo}`
    : "";
};

export const formSetValues = (form, values) => {
  Object.keys(values).forEach((key) => {
    form.change(key, values[key]);
  });
};

// TODO:
export const isArrayFilter = (value, deep = false) => {
  if (isArray(value)) {
    if (deep) {
      const xvalue = value.filter((nx) => {
        if (isObject(nx)) {
          const nxx = Object.values(nx).filter((n) => n);

          if (nxx.length) return true;
        }
        return false;
      });
      if (xvalue) {
        return xvalue;
      } else {
        return [];
      }
    }
    return value.filter((n) => n);
  } else {
    return [value].filter((n) => n);
  }
};

export const buildTreeFromList = (
  list: object[] = [],
  {
    keyId,
    keyParent,
    marginLeft = 5,
    isExpand = true,
    isOpen = true,
  }: {
    keyId: string;
    keyParent: string;
    marginLeft?: number;
    isExpand?: boolean;
    isOpen?: boolean;
  }
) => {
  const map = new Map();
  const tree = [];

  const initializeItem = (item) => ({
    ...item,
    level: 0,
    marginLeft: 0,
    isExpand,
    isOpen,
    children: [],
  });

  list.forEach((item) => {
    const initializedItem = initializeItem(item);
    map.set(item[keyId], initializedItem);
  });

  list.forEach((item) => {
    const parent = map.get(item[keyParent]);

    if (!parent) {
      tree.push(map.get(item[keyId]));
    } else {
      parent.children.push(map.get(item[keyId]));
    }
  });

  const setMarginLeft = (items, level = 1) => {
    items.forEach((item) => {
      item.level = level;
      item.marginLeft = level * marginLeft;
      if (item.children.length > 0) {
        setMarginLeft(item.children, level + 1);
      }
    });
  };

  tree.forEach((item) => setMarginLeft(item.children));

  return tree;
};

export const flattenTree = (tree, keyWeight = null) => {
  return tree.flatMap(({ children, ...rest }) => {
    if (children && children.length > 0) {
      if (keyWeight) {
        children.sort((a, b) => a[keyWeight] - b[keyWeight]);
      }
      return [
        { ...rest, hasChildren: true },
        ...flattenTree(children, keyWeight),
      ];
    } else {
      return { ...rest, hasChildren: false };
    }
  });
};

export const getChunkData = (data = [], chunkSize = 100) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
};

export const getDefaultVariant = (variants: any[]) => {
  return variants
    ?.filter((item) => item?.pv_deleted_at === "0000-00-00 00:00:00")
    ?.find((item) => !!+item?.pv_is_base);
};

export const getSalesUnitByB2BUser = (units: any[]) => {
  return units?.find((item) => !!+item?.pu_is_b2b_sales_unit);
};

export const getSalesUnitByB2CUser = (units: any[]) => {
  return units?.find((item) => !!+item?.pu_is_b2c_sales_unit);
};

export const getDefaultPurchaseUnit = (units: any[]) => {
  return units?.find((item) => !!+item?.pu_is_default_purchase_unit);
};

export const getReadableSKU = (attribute) => {
  if (isEmpty(attribute)) return "Medicine";

  return Object.entries(attribute)
    .map(([key, value]) => `${capitalizeFirstLetter(key)}: ${value}`)
    .join(", ");
};

export const getQuantityLabel = ({
  qty,
  salesUnit = "",
  isBaseUnit = false,
  baseUnit = "",
  salesUnitMultiplier,
  baseUnitMultiplier = 0,
}) => {
  if (!qty) return;

  if (isBaseUnit) return `${qty} ${pluralize(baseUnit, qty)}`;

  const isSameUnit = baseUnit === salesUnit;
  const x = ["tablet", "capsule", "injection"].includes(baseUnit?.toLowerCase())
    ? ""
    : "x";

  if (salesUnit && salesUnitMultiplier) {
    if (isSameUnit) {
      if (salesUnit === "1's Pack") return `${qty} ${x} ${salesUnit}`;

      return `${qty} ${x} ${pluralize(salesUnit, qty)}`;
    }
    return `${qty * salesUnitMultiplier} ${x} ${pluralize(baseUnit, qty)} (${
      baseUnitMultiplier || qty
    } ${pluralize(salesUnit, baseUnitMultiplier || qty)})`;
  }

  return qty;
};

export const getColorByStatus = (orderStatus) => {
  let color;

  switch (orderStatus) {
    case "pending":
      color = "#FFB547";
      break;
    case "paid":
    case "confirmed":
    case "approved":
    case "finance_cleared":
    case "management_approved":
    case "department_approved":
    case "active":
      color = "#4CAF50";
      break;
    case "scheduled":
      color = "#1DA099";
      break;
    case "rescheduled":
      color = "#0099CC";
      break;
    case "collected":
      color = "#9900FF";
      break;
    case "completed":
    case "delivered":
    case "received":
      color = "#006666";
      break;
    case "cancelled":
    case "rejected":
    case "inactive":
    case "finance_issue":
      color = "#FF0000";
      break;
    default:
      color = "#ED6C02";
  }

  return color;
};

export const getFormattedDate = (isoTimestamp) => {
  if (!isoTimestamp) return "N/A";

  const dateInstance = new Date(isoTimestamp);

  return `${dateInstance.toLocaleDateString("en-GB", {
    dateStyle: "medium",
  })} ${dateInstance.toLocaleTimeString()}`;
};

export const getResourcePaginationTrack = () =>
  isJSONParsable(localStorage.getItem("resourcePaginationTrack"))
    ? JSON.parse(localStorage.getItem("resourcePaginationTrack"))
    : {};

export const setResourcePaginationTrack = (resource, id, currentPage) => {
  const resourcePaginationTrack = getResourcePaginationTrack();

  localStorage.setItem(
    "resourcePaginationTrack",
    JSON.stringify({
      ...resourcePaginationTrack,
      [resource]: {
        ...resourcePaginationTrack?.[resource],
        [id]: {
          currentPage: currentPage?.toString() || 1,
        },
      },
    })
  );
};

export const getAppResource = (resource) => {
  let finalResource = resource;

  if (resource === "productCategory") {
    finalResource = "v1/taxonomy";
  }

  return finalResource;
};

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    return (
      localStorage.getItem("api-base-url") || process.env.NEXT_PUBLIC_API_URL
    );
  }
  return process.env.NEXT_PUBLIC_API_URL;
};

export const setBaseApiUrl = (url) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    localStorage.setItem("api-base-url", url);
  }
};
