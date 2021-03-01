import * as path from "path";

export const userPath = path.join(process.argv[1], "../", "../");
export const configPath = path.join(userPath, "react-cm.json");
export const packagePath = path.join(userPath, "package.json");