import { join } from "path";

interface CreateComponentInfo {
    createSubDir: boolean;
    componentName: string;
    isSingleFileComponent: boolean;
}

export function getNewOutDirPathWithSubdir(origPath: string, createInfo: CreateComponentInfo): string {
    const {
        createSubDir,
        componentName,
    } = createInfo;

    // no subdir, no path mutation
    if (!createSubDir) {
        return origPath;
    }

    // TestC/index.tsx
    return join(origPath, componentName);
}