## Changelog
## 02.09.2021 V (3.1.7)

### Commands
- removed command "remove-c" 
- changed command "create-c" to "create"
- changed command "create-c" args to "kreact-cm create \<path> \<name>"
- added command "create-c" optional parametr "-o || --out", that overrides template outDir

### Config
- removed components path field in config,
- added outDir path in template

### Code
- removed config loader & validator from command backend constructor
- improved cfg validation with ajv package
- improved project structure

JSON changed to

``` json
{
    "templates": [
        {
            "name": "component_fn",
            "templatePath": "./examples/fn.tsx",
            "outDir": "./src/components/"
        },

        {
            "name": "page_fn",
            "templatePath": "./examples/page_fn.tsx",
            "outDir": "./src/pages/"
        }
    ]
}
```