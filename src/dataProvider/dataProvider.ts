import queryString from "query-string";
import { FilterPayload, fetchUtils } from "react-admin";

import { Status } from "../utils/enums";
import {
  getAppResource,
  isEmpty,
  isInteger,
  setResourcePaginationTrack,
} from "../utils/helpers";
import { httpClient } from "../utils/http";
import { toQueryString } from "./toQueryString";

const dataProvider = {
  getList: (
    resource: string,
    params: {
      pagination: { page: number; perPage: number };
      sort: { field: string; order: string };
      filter: FilterPayload;
    }
  ) => {
    const { page, perPage } = params.pagination || {};
    const { field, order } = params.sort || {};

    const {
      q,
      _search,
      _parent_id,
      isBaseUrl = ["general", "employeeApp"].includes(
        getAppResource(resource).split("/")[0]
      ),
      ...restFilter
    } = params.filter || {};

    if (
      ["v1/productPurchase", "v1/procurementStatus"].includes(
        getAppResource(resource)
      )
    ) {
      if (restFilter.hasOwnProperty("_start_date")) {
        restFilter._start_date = `${restFilter._start_date} 00:00:00`;
      }
      if (restFilter.hasOwnProperty("_end_date")) {
        restFilter._end_date = `${restFilter._end_date} 23:59:59`;
      }
    }

    const _searchOr_Ids =
      getAppResource(resource) === "general/v3/search" &&
      isInteger(+_search?.toString()?.trim() || +q?.toString()?.trim())
        ? {
            _ids: +_search?.toString()?.trim() || +q?.toString()?.trim(),
          }
        : {
            _search: _search?.toString()?.trim() || q?.toString()?.trim(),
          };

    const query = {
      _orderBy: field,
      _order: order || "DESC",
      _page: page || 1,
      _perPage: perPage || 25,
      ...fetchUtils.flattenObject({
        ...restFilter,
        ..._searchOr_Ids,
        ...((getAppResource(resource) === "v1/taxonomy" ||
          getAppResource(resource) === "v1/menuItem") &&
          !_search?.toString()?.trim() && { _parent_id }),
      }),
      f: "admin",
    };

    return httpClient(
      `/${getAppResource(resource)}?${queryString.stringify(query)}`,
      {
        isBaseUrl,
      }
    ).then((res: any) => ({
      ...res?.json,
      data: res?.json?.data || [],
      total: res?.json?.total || 0,
    }));
  },
  getOne: (resource: string, params: { id: number }) =>
    httpClient(`/${getAppResource(resource)}/${params.id}?f=admin`).then(
      (res: any) => {
        if (res?.json?.status !== Status.SUCCESS) {
          throw new Error(
            res?.json?.message || "Something went wrong! Please try again!"
          );
        }
        return {
          ...res?.json,
          data: !isEmpty(res?.json?.data?.revision)
            ? {
                ...res?.json?.data?.revision,
                isRevision: true,
                revision: {},
              }
            : res?.json?.data,
        };
      }
    ),
  getMany: (resource: string, params: { ids: number[] }) => {
    const ids = params.ids?.filter((id) => id && isInteger(id));

    const query = {
      [getAppResource(resource) === "general/v3/search"
        ? "_ids"
        : "ids"]: `${ids}`,
      f: "admin",
    };

    const isBaseUrl = ["general", "employeeApp"].includes(
      getAppResource(resource).split("/")[0]
    );

    if (!ids?.length) {
      return Promise.resolve({
        data: [],
        total: 0,
      });
    }

    return httpClient(
      `/${getAppResource(resource)}?${queryString.stringify(query)}`,
      {
        isBaseUrl,
      }
    ).then((res: any) => ({
      ...res?.json,
      data: res?.json?.data || [],
      total: res?.json?.total || 0,
    }));
  },
  getManyReference: (
    resource: string,
    params: {
      pagination: { page: number; perPage: number };
      sort: { field: string; order: string };
      filter: FilterPayload;
      target: string;
      id: number;
    }
  ) => {
    const { page, perPage } = params.pagination || {};
    const { field, order } = params.sort || {};
    const {
      q,
      _search,
      isBaseUrl = ["general", "employeeApp"].includes(
        getAppResource(resource).split("/")[0]
      ),
      ...restFilter
    } = params.filter || {};

    if (resource === "v1/purchaseOrderItem" && page !== 1) {
      setResourcePaginationTrack(resource, params.id, page);
    }

    const query = {
      [params.target]: params.id,
      _orderBy: field,
      _order: order,
      _page: page,
      _perPage: perPage,
      ...fetchUtils.flattenObject({
        ...restFilter,
        _search: _search?.toString()?.trim() || q?.toString()?.trim(),
      }),
      f: "admin",
    };

    return httpClient(
      `/${getAppResource(resource)}?${queryString.stringify(query)}`,
      {
        isBaseUrl,
      }
    ).then((res: any) => ({
      ...res?.json,
      data: res?.json?.data || [],
      total: res?.json?.total || 0,
    }));
  },
  update: (resource: string, params: { id: number; data: any }) => {
    return httpClient(`/${getAppResource(resource)}/${params.id}?f=admin`, {
      method: "POST",
      body: toQueryString(params?.data),
    }).then((res: any) => {
      if (res?.json?.status !== Status.SUCCESS) {
        throw new Error(
          res?.json?.message || "Something went wrong! Please try again!"
        );
      }
      return {
        ...res?.json,
        data: res?.json?.data || { id: params.id },
        message: res?.json?.message || "Updated successfully!",
      };
    });
  },
  updateMany: (resource: string, params: { ids: number[]; data: object }) => {
    return httpClient(`/${getAppResource(resource)}/updateMany?f=admin`, {
      method: "POST",
      body: toQueryString({
        ids: params.ids,
        data: params?.data,
      }),
    }).then((res: any) => {
      if (res?.json?.status !== Status.SUCCESS) {
        throw new Error(
          res?.json?.message || "Something went wrong! Please try again!"
        );
      }
      return {
        ...res?.json,
        data: res?.json?.data || {},
        message: res?.json?.message || "Updated successfully!",
      };
    });
  },
  create: (resource: string, params: { data: object }) => {
    return httpClient(`/${getAppResource(resource)}?f=admin`, {
      method: "POST",
      body: toQueryString(params?.data),
    }).then((res: any) => {
      if (res?.json?.status !== Status.SUCCESS) {
        throw new Error(
          res?.json?.message || "Something went wrong! Please try again!"
        );
      }
      return {
        ...res?.json,
        data: res?.json?.data || { id: null },
        message: res?.json?.message || "Created successfully!",
      };
    });
  },
  delete: (resource: string, params: { id: number }) =>
    httpClient(`/${getAppResource(resource)}/${params.id}?f=admin`, {
      method: "DELETE",
    }).then((res: any) => {
      if (res?.json?.status !== Status.SUCCESS) {
        throw new Error(
          res?.json?.message || "Something went wrong! Please try again!"
        );
      }
      return {
        ...res?.json,
        data: res?.json?.data || { id: params.id },
        message: res?.json?.message || "Deleted successfully!",
      };
    }),
  deleteMany: (resource: string, params: { ids: number[] }) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`/${getAppResource(resource)}/${id}?f=admin`, {
          method: "DELETE",
        })
      )
    ).then((responses) => ({
      data: responses?.map((res: any) => res?.json?.data?.id),
    })),
};

export default dataProvider;
