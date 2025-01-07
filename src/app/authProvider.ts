import { AuthProvider, UserIdentity } from "react-admin";

import { toQueryString } from "@/dataProvider/toQueryString";
import { inMemoryJWT } from "@/services";
import { SocketServer, Status } from "@/utils/enums";
import { initiateSocket, socket } from "@/utils/socketio";
import { getApiBaseUrl, logger, isJSONParsable } from "@/utils/helpers";
import { httpClient, axiosInstance } from "@/utils/http";

type LoginInput = {
  mobile: string;
  otp: string;
};

const authProvider: AuthProvider = {
  login: ({ mobile, otp }: LoginInput): Promise<any> => {
    inMemoryJWT.setRefreshTokenEndpoint(
      `${getApiBaseUrl().split("/admin")[0]}/auth/v1/token/refresh?f=admin`
    );

    return httpClient("/auth/v1/sms/verify?f=admin", {
      method: "POST",
      body: toQueryString({ mobile, otp }),
      credentials: "include",
      isBaseUrl: true,
    }).then((res: any) => {
      const { json } = res || {};

      if (json?.status !== Status.SUCCESS) {
        throw new Error(
          json?.message || "Something went wrong! Please try again!"
        );
      }

      localStorage.setItem("user", JSON.stringify(json.data.user));
      inMemoryJWT.setToken(json.data?.authToken, json.data?.tokenExpiry);

      if (process.env.REACT_APP_SOCKET_SERVER === SocketServer.ON) {
        initiateSocket(
          {
            userId: json.data.user.u_id,
            userName: json.data.user.u_name,
          },
          json.data.user.expressToken
        );

        socket.on("connect", () =>
          axiosInstance
            .post(
              "/users/signup",
              {
                userId: json.data.user.u_id,
                userName: json.data.user.u_name,
              },
              {
                headers: {
                  Authorization: `Bearer ${json.data.user.expressToken}`,
                },
              }
            )
            .catch((err) => logger(err))
        );
      }
    });
  },
  logout: (): Promise<string | false | void> => {
    const localUser = localStorage.getItem("user");

    const userInfo = isJSONParsable(localUser) ? JSON.parse(localUser) : {};

    httpClient("/auth/v1/logout?f=admin", {
      method: "POST",
      credentials: "include",
      isBaseUrl: true,
    }).catch((err) => logger(err));

    if (process.env.REACT_APP_SOCKET_SERVER === SocketServer.ON) {
      axiosInstance
        .get(`/users/logout?userName=${userInfo?.u_name}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.expressToken}`,
          },
        })
        .catch((err) => logger(err));
    }

    localStorage.removeItem("user");
    inMemoryJWT.ereaseToken();

    return Promise.resolve();
  },
  checkError: (error): Promise<void> => {
    const status = error.status;

    if (status === 401 || status === 403) {
      inMemoryJWT.setRefreshTokenEndpoint(
        `${getApiBaseUrl().split("/admin")[0]}/auth/v1/token/refresh?f=admin`
      );
      return inMemoryJWT.getRefreshedToken().then((tokenHasBeenRefreshed) => {
        if (tokenHasBeenRefreshed) {
          return Promise.resolve();
        } else {
          inMemoryJWT.ereaseToken();
          return Promise.reject();
        }
      });
    }

    return Promise.resolve();
  },
  checkAuth: (): Promise<void> => {
    if (!inMemoryJWT.getToken()) {
      inMemoryJWT.setRefreshTokenEndpoint(
        `${getApiBaseUrl().split("/admin")[0]}/auth/v1/token/refresh?f=admin`
      );
      return inMemoryJWT
        .getRefreshedToken()
        .then((tokenHasBeenRefreshed) => {
          return tokenHasBeenRefreshed ? Promise.resolve() : Promise.reject();
        })
        .catch((err) => {
          logger(err);
          return Promise.reject();
        });
    } else {
      return Promise.resolve();
    }
  },
  getPermissions: (): Promise<any> => {
    const user = localStorage.getItem("user");

    return inMemoryJWT.waitForTokenRefresh().then(() => {
      return inMemoryJWT.getToken() && !!user
        ? Promise.resolve(JSON.parse(user).permissions)
        : Promise.reject();
    });
  },
  getIdentity: (): Promise<UserIdentity> => {
    const { u_id, u_name } = isJSONParsable(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user"))
      : "";

    if (u_name) {
      return Promise.resolve({ id: u_id, fullName: u_name });
    } else {
      return Promise.reject();
    }
  },
};

export default authProvider;
