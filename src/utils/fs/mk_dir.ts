import * as fs from "fs";

export async function mkDirIfNotExists(path: string) {
    try {
        await fs.promises.access(path);
    } catch(e: any) {
        if (e.code == 'ENOENT') {
            return await fs.promises.mkdir(path, { recursive: true });
        }
    }
}