export interface IAutoArch {
    /**
     * @description path to add after original destination
     * @example 
     * subdirName = "components"
     * "pages/Page" => "pages/Page/components"
     */
    subdirName: string;
    
    /**
     * @description path prefix to apply auto sub dir feature
     */
    pathPrefix: string;

    /**
     * @description max nesting level after pathPrefix
     * @defaultValue 1
     * @example
     * pathPrefix = "pages";
     * maxNestingLevel = 1;
     * ___________________
     * "pages/Page" => "pages/Page/components"
     * "pages/Page/components" => "pages/Page/components" 
     * "pages/Page/components/Component" => "pages/Page/components/Component"
     */
    maxNestLevel?: number;

    /**
     * @description name to link from templates
     * @example
     * autoArches: [
     *   {
     *      name: "c_arch",
     *      pathPrefix: "pages",
     *      subDirName: "components"
     *   }
     * ],
     * 
     * templates: [
     *   {
     *     name: "fn",
     *     usingArches: ["c_arch"]
     *   }
     * ]
     */
    name: string;
}