/* eslint-disable import/no-anonymous-default-export */
import {
  CREATE,
  DELETE,
  DELETE_MANY,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
  UPDATE,
  UPDATE_MANY,
} from "react-admin";

import { convertFileToBase64, imageCompress, logger } from "../utils/helpers";
import { checkLabTest } from "../utils/http";
import dataProvider from "./dataProvider";
import labTestDataProvider from "./labTestDataProvider";

//@ts-ignore
export default (type, resource, params) => {
  const mappingType = {
    [GET_LIST]: "getList",
    [GET_ONE]: "getOne",
    [GET_MANY]: "getMany",
    [GET_MANY_REFERENCE]: "getManyReference",
    [CREATE]: "create",
    [UPDATE]: "update",
    [UPDATE_MANY]: "updateMany",
    [DELETE]: "delete",
    [DELETE_MANY]: "deleteMany",
  };

  if (!!checkLabTest(resource))
    //@ts-ignore
    return labTestUploadDataProvider[mappingType[type]](resource, params);
  //@ts-ignore
  return uploadDataProvider[mappingType[type]](resource, params);
};

export const uploadDataProvider = {
  ...dataProvider,
  create: (resource: string, params: object) =>
    createUpdateFunc({
      method: "create",
      resource,
      params,
      isLabTest: false,
    }),
  update: (resource: string, params: object) =>
    createUpdateFunc({
      method: "update",
      resource,
      params,
      isLabTest: false,
    }),
};

export const labTestUploadDataProvider = {
  ...labTestDataProvider,
  create: (resource: string, params: object) =>
    createUpdateFunc({
      method: "create",
      resource,
      params,
      isLabTest: true,
    }),
  update: (resource: string, params: object) =>
    createUpdateFunc({
      method: "update",
      resource,
      params,
      isLabTest: true,
    }),
};

type CreateUpdateFunc = {
  method: "create" | "update";
  resource: string;
  params: any;
  isLabTest?: boolean;
};

const createUpdateFunc = ({
  method,
  resource,
  params,
  isLabTest,
}: CreateUpdateFunc) => {
  let callbackFun: any = "";

  callbackFun = isLabTest ? labTestDataProvider[method] : dataProvider[method];

  const attachedFilesKeys = Object.keys(params.data).filter(
    (item) => item.startsWith("attachedFiles") && !!params.data[item]
  );

  if (!attachedFilesKeys?.length) return callbackFun(resource, params);

  const attachedFiles =
    !!attachedFilesKeys?.length &&
    attachedFilesKeys.map((key) => ({
      key: key,
      values: params.data[key],
    }));

  const filteredAttachedFiles =
    //@ts-ignore
    !!attachedFiles?.length &&
    //@ts-ignore
    attachedFiles.filter((item) => {
      if (item.values?.rawFile instanceof File) {
        item.values = [item.values];
      }

      return item;
    });

  return Promise.all(
    filteredAttachedFiles.map((item: { key: string; values: any }) =>
      Promise.all(
        item.values?.map((file: File) => imageCompress(file, resource, item))
      )
        .then((compressedFiles) =>
          Promise.all(compressedFiles.map(convertFileToBase64))
        )
        .then((items) => ({ key: item.key, values: items }))
    )
  )
    .then((items) =>
      callbackFun(resource, {
        ...params,
        data: {
          ...params.data,
          ...Object.fromEntries(
            items?.map((item: { key: string; values: any }) => [
              item.key,
              item.values,
            ])
          ),
        },
      })
    )
    .catch((err) => {
      logger(err);
      throw err;
    });
};
