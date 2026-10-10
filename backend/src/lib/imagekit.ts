import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/env";

const imagekitClient = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

const imagekit = {
    upload: async (params: {
        file: Buffer;
        fileName: string;
        folder?: string;
    }) =>
        imagekitClient.files.upload({
            ...params,
            file: await toFile(params.file, params.fileName),
        }),
};

export default imagekit;
