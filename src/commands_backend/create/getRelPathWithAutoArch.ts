import { join } from "path";
import { IAutoArch } from "../../types/auto_arch.type";

export function getRelPathWithAutoArch(autoArches: IAutoArch[], origOutPath: string): string {
    // search for auto arcs for apply
    for (const arch of autoArches) {
        // check path prefix
        if (!origOutPath.startsWith(arch.pathPrefix)) {
            continue;
        }
        
        // check nesting level
        const pathAfterPrefix = origOutPath.slice(arch.pathPrefix.length);
        // slash after prefix will give extra element (['', 'pages']), so length - 1
        const nestingLevel = pathAfterPrefix.split('/').length - 1; 

        // Correct nesting level (1)
        // pages / page / component => pages / page/ components / component

        // Wrong nesting level (> 1)
        // pages / page / components / component
        if (nestingLevel !== (arch.maxNestLevel || 1)) {
            continue;
        }

        // example: add components subdir if create inside a page
        // @p/page/components
        return join(origOutPath, arch.subdirName);
    }

    // didn't find any, return orig value
    return origOutPath;
}