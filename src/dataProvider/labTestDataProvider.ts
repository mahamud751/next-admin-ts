import queryString from "query-string";
import { FilterPayload, fetchUtils } from "react-admin";

import { httpClient } from "../utils/http";
import { toQueryString } from "./toQueryString";

const labTestDataProvider = {
  getList: (
    resource: string,
    params: {
      pagination: { page: number; perPage: number };
      sort: { field: string; order: string };
      filter: FilterPayload;
    }
  ) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const { q, _search, ...restFilter } = params.filter || {};

    const query = {
      ...fetchUtils.flattenObject({
        ...restFilter,
        _search: _search?.trim() || q?.trim(),
      }),
      page,
      limit: perPage,
      sortKey: field,
      sortOrder: order,
    };

    if (
      resource === "lab-order/api/v1/admin/orders" &&
      query.hasOwnProperty("orderNumberPrefix") &&
      query.orderNumberPrefix.length < 4
    ) {
      return Promise.resolve({
        data: [],
        total: 0,
      });
    }

    return httpClient(`/${resource}?${queryString.stringify(query)}`).then(
      ({ json }: any) => {
        if (json.success === false) {
          return {
            data: [],
            total: 0,
          };
        }
        return {
          ...json,
          total: json.count,
        };
      }
    );
  },
  getOne: (resource: string, params: { id: number }) =>
    httpClient(`/${resource}/${params.id}`).then(({ json }: any) => {
      if (json.success === false) {
        throw new Error(
          !!json?.message
            ? json.message
            : "Something went wrong! Please try again!"
        );
      }
      return json;
    }),
  getMany: (resource: string, params: { ids: number[] }) => {
    const query = {
      ids: `${params.ids}`,
    };

    return httpClient(`/${resource}?${queryString.stringify(query)}`).then(
      ({ json }: any) => {
        if (json.success === false) {
          throw new Error(
            !!json?.message
              ? json.message
              : "Something went wrong! Please try again!"
          );
        }
        return json;
      }
    );
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
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const { q, _search, ...restFilter } = params.filter || {};

    const query = {
      ...fetchUtils.flattenObject({
        ...restFilter,
        _search: _search?.trim() || q?.trim(),
      }),
      [params.target]: params.id,
      _orderBy: field,
      _order: order,
      _page: page,
      _perPage: perPage,
    };

    return httpClient(`/${resource}?${queryString.stringify(query)}`).then(
      ({ json }: any) => {
        if (json.success === false) {
          throw new Error(
            !!json?.message
              ? json.message
              : "Something went wrong! Please try again!"
          );
        }
        return json;
      }
    );
  },
  update: (resource: string, params: { id: number; data: any }) => {
    let url = `/${resource}`;

    if (params.id) {
      url += `/${params.id}`;
    }

    return httpClient(url, {
      method: "PUT",
      body: toQueryString(params.data),
    }).then(({ json }: any) => {
      if (json.success === false) {
        throw new Error(
          !!json?.message
            ? json.message
            : "Something went wrong! Please try again!"
        );
      }
      return {
        data: json.data,
      };
    });
  },
  updateMany: (resource: string, params: { ids: number[]; data: object }) => {
    const body = {
      ids: params.ids,
      data: params.data,
    };

    return httpClient(`/${resource}/updateMany`, {
      method: "POST",
      body: toQueryString(body),
    }).then(({ json }: any) => {
      if (json.success === false) {
        throw new Error(
          !!json?.message
            ? json.message
            : "Something went wrong! Please try again!"
        );
      }
      return {
        data: json.data,
        message: json?.message,
      };
    });
  },
  create: (resource: string, params: { data: object }) => {
    return httpClient(`/${resource}`, {
      method: "POST",
      body: toQueryString(params.data),
    }).then(({ json }: any) => {
      if (json.success === false) {
        throw new Error(
          !!json?.message
            ? json.message
            : "Something went wrong! Please try again!"
        );
      }
      return {
        data: json.data,
      };
    });
  },
  delete: (resource: string, params: { id: number }) =>
    httpClient(`/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }: any) => {
      if (json.success === false) {
        throw new Error(
          !!json?.message
            ? json.message
            : "Something went wrong! Please try again!"
        );
      }
      return {
        data: json.data,
      };
    }),
  deleteMany: (resource: string, params: { ids: number[] }) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    ).then((responses) => ({
      data: responses?.map(({ json }: any) => json.data?.id),
    })),
};

export default labTestDataProvider;
