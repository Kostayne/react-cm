import { IReactCMTemplate } from "../../types/template.type";

// need to both paths work (/cname.tsx & cname.tsx)
function _normalizeRelPath(path: string): string {
    if (path[0] === '/') {
        return path.slice(1);
    }

    return path;
}

/**
 * @param template 
 * @param origRelPath orig path relative to template entry
 * @example "/cname.test.!tsx" => "/cname.test.tsx"
 */
export function getNewRelPathWithFnameRewrites(template: IReactCMTemplate, origRelPath: string): string {
    if (!template) {
        throw new Error('Template is not set! Stopping execution...');
    }

    const rewrites = template.rewrites || [];
    const normalizedOrigPath = _normalizeRelPath(origRelPath);

    // looking for rewrites to apply
    for (const r of rewrites) {
        // rewrite name to new one
        if (normalizedOrigPath === _normalizeRelPath(r.from)) {
            return r.to;
        }
    }

    return origRelPath;
}