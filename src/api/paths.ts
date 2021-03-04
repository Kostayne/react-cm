import * as path from "path";

export const userPath = path.join(process.cwd());
export const configPath = path.join(userPath, "react-cm.json");
export const packagePath = path.join(userPath, "package.json");
export const componentsPath = path.join(userPath, "src", "components");