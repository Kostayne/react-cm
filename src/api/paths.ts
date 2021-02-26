import * as path from "path";

export const userPath = path.join(process.argv[1], "../", "../");
export const configPath = path.join(userPath, "react-pm.json");
export const packagePath = path.join(userPath, "package.json");

// DEV
export const pmTestPath = path.join(userPath, "pmTest");
const templatesPath = path.join(pmTestPath, "templates");
export const componentsPath = path.join(pmTestPath, "components");

// DEV DEP
export const cTemplatePath = path.join(templatesPath, "cTemplate.tsx");
export const fnTemplatePath = path.join(templatesPath, "fnTemplate.tsx");

export function getComponentPath(name: string) {
    // DEV
    return path.join(pmTestPath, name);
}