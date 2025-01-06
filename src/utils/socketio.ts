import { io } from "socket.io-client";

export let socket;

export const initiateSocket = (
    query: { userId: number; userName: string },
    token: string
) => {
    socket = io(process.env.REACT_APP_EXPRESS_API_BASE_URL, {
        query,
        auth: {
            token,
        },
    });
};
