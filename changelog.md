## Changelog
## 04.09.2021 V (3.2.9)

### Commands
- added optional flag -s (--subdir) to override config template value

### Config
- added optional subdir template property

### Code
- refactored create_backend
- moved mkDirIfNotExists to utils
- added getCreateSubdir method in create_backend

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
            "outDir": "./src/pages/",
            "subdir": false
        }
    ]
}
```