import * as fs from "fs";

export async function isFileExists(path: string): Promise<boolean> {
    try {
        await fs.promises.access(path);
    }

    catch(e) {
        return false;
    }

    return true;
}