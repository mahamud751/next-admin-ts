// @ts-nocheck
import axios, { AxiosInstance } from "axios";
import { fetchUtils } from "react-admin";

import { inMemoryJWT } from "../services";
import { getApiBaseUrl, isJSONParsable, logger } from "./helpers";

const user = localStorage.getItem("user");
const expressToken = isJSONParsable(user) ? JSON.parse(user).expressToken : "";

// axiosInstance for Express Server
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_EXPRESS_API_BASE_URL}/api/v1`,
  headers: {
    Authorization: `Bearer ${expressToken}`,
  },
});

export const httpClient = (url: string, options: object = {}) => {
  const URL = getApiUrl({ isBaseUrl: options?.isBaseUrl, resource: url });

  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  if (options.body) {
    options.headers.set("Content-Type", "application/x-www-form-urlencoded");
  }

  const token = inMemoryJWT.getToken();
  const endpoint = options?.isCustomUrl ? url : `${URL}${url}`;

  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
    return fetchUtils.fetchJson(endpoint, options);
  } else {
    inMemoryJWT.setRefreshTokenEndpoint(
      `${URL.split("/admin")[0]}/auth/v1/token/refresh?f=admin`
    );
    return inMemoryJWT
      .getRefreshedToken()
      .then((gotFreshToken) => {
        if (gotFreshToken) {
          options.headers.set(
            "Authorization",
            `Bearer ${inMemoryJWT.getToken()}`
          );
        }
        return fetchUtils.fetchJson(endpoint, options);
      })
      .catch((err) => logger(err));
  }
};

export const checkLabTest = (resource: string, index: number = 0) => {
  const labPrefix = resource.split("/")[index];

  if (labPrefix && baseApiUrl[labPrefix]) return baseApiUrl[labPrefix];

  return false;
};

const getApiUrl = ({ isBaseUrl, resource }) => {
  const isLabTest = checkLabTest(resource, 1);

  if (isLabTest) return isLabTest;

  return isBaseUrl ? getApiBaseUrl().split("/admin")[0] : getApiBaseUrl();
};

const baseApiUrl = {
  "lab-order": process.env.NEXT_PUBLIC_LT_API_URL,
  "lab-cart": process.env.NEXT_PUBLIC_LT_API_URL,
  "lab-loc": process.env.NEXT_PUBLIC_LT_API_URL,
  misc: process.env.NEXT_PUBLIC_LT_API_URL,
  patient: process.env.NEXT_PUBLIC_LT_API_URL,
  translator: process.env.NEXT_PUBLIC_LT_API_URL,
};
