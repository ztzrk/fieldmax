import midtransClient from "midtrans-client";
import { config } from "./env";

export const midtransSnap = new midtransClient.Snap({
    isProduction: false,
    serverKey: config.MIDTRANS_SERVER_KEY,
    clientKey: config.MIDTRANS_CLIENT_KEY,
});
