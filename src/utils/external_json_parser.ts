import * as fs from "fs";

export async function parseExternalJSON(path: string) {
    try {
        const data = await (await fs.promises.readFile(path)).toString();
        const parsedData = JSON.parse(data);
        return parsedData;
    }

    catch(e) {
        console.error(e);
        throw e;
    }
}