React component manager (k-react-cm)
===================
Manages your react components from cli. Easy to configure and extend.

<!-- shileds -->

![npm](https://img.shields.io/npm/v/k-react-cm)
![npm](https://img.shields.io/npm/dm/k-react-cm)
![NPM](https://img.shields.io/npm/l/k-react-cm)

* [Start](#Start)
* [Usage](#Usage)
* [Commands](#Commands)
* [Sources](#Sources)

## Getting started
First of all install the package from npm.

```
# npm global installation
npm i -g k-react-cm

# npm local installation
npm i -D k-react-cm

# yarn local installation
yarn add -D k-react-cm
```

Then setup the config. You can do this in two ways: by creating seperated react-cm.json file in the project root or by creating reactCm field in "package.json". Info about how to fill it below.

## Usage
Check full config example if you want to start quickly, otherwise read usage sections.

### Templates
K-react-cm supports complex & single file component templates. To use template you need assign a name, the path to file or directory containing template and the out dir where components will be created.

Example of templates structure:
```
/templates
    /simple_component.tsx

    /complex_component
        /index.tsx
        /style.module.scss
        /test.tsx
```

Example of config:
``` json
{
    "templates": [
        {
            "name": "simple",
            "path": "./templates/simple_component.tsx",
            "outDir": "./components/"
        },

        {
            "name": "complex",
            "path": "./templates/compex_component",
            "outDir": "./components/"
        }
    ]
}
```

What if we want to create single file component in its own directory, or complex component without subdir? We can do it with `subDir` prop in the template config.

Example of subDir prop:
``` json
{
    "components": [
        {
            "name": "fn",
            "path": "@t/fn.tsx",
            "subDir": true
        }
    ]
}
```

We can set default outDir to all components and omit it declaration in templates:
``` json
{
    "defaults": {
        "outDir": "./example/out/"
    },

    "templates": [
        {
            "name": "simple",
            "path": "./templates/simple_component.tsx",
        },
    ]
}
```

### Use component names
**K-react-cm do replaces in file name and file content!**

There are few types of available component name cases:
- `cname` original case (without any transform);
- `CName` PascalCase;
- `c-name` kebab-case;
- `c_name` snake_case;

Example of template file names:
```
/complex_component
    /index.tsx
    /cname.test.ts
    /cname.module.scss
```

Example of tsx template file:
```tsx
import React from "react";

export const CName = () => {
    return (
        <div>
            <p>Text</p>
        </div>
    );
}
```

Example of css template file:
``` css
.c-name {
    /* your styles here */
    /* or just empty space */
}
```

### Paths (Aliases)
Enter all paths is not convinient, because of that aliases exist! It's very easy to use them. Just declare paths array in the config, where each alias will be object, that contains name and value. Name should begin with @ symbol, and value should refer to directory full or relative path. After aliases declarations, we can use them in config & cli.

Example of aliases declaration:
``` json
"paths": [
    {
        "name": "@c",
        "value": "./components"
    },

    {
        "name": "@t",
        "value": "./templates"
    }
]
```

Example of aliases usage in cfg file:
``` json
{
    "components": [
        {
            "name": "fn",
            "path": "@t/fn.tsx",
            "outDir": "@c"
        }
    ]
}
```

### Rewrites
There are situations when some tools scan files for specific extensions and it can't ignore certain directories. So we have to name files with exitension prefixes like `.!stories.ts` or `.!test.ts`. But it quickly becomes tedious to rename file names in created components. We can use rewrites to fix this problem. We define aliases inside templates, because they are related to each other.

``` json
{
    "templates": [
        {
            "name": "complex",
            "path": "@t/complex",
            "subDir": false,
            
            "rewrites": [
                {
                    "from": "/cname.test.!tsx",
                    "to": "/cname.test.tsx"
                }
            ]
        }
    ]
}
```

## Full config example
Here is the example of working config with various component types. 

``` json
{
    "defaults": {
        "outDir": "@c"
    }

    "paths": [
        {
            "name": "@c",
            "value": "./example/out",
        },

        {
            "name": "@t",
            "value": "./example/templates"
        }
    ],

    "templates": [
        {
            "name": "fn",
            "path": "@t/fn.tsx",
            "outDir": "@c",

            "rewrites": [
                {
                    "from": "/cname.test.!tsx",
                    "to": "/cname.test.tsx"
                }
            ]
        },

        {
            "name": "cl",
            "path": "@t/cl"
        },

        {
            "name": "page",
            "path": "@t/page",
            "subDir": false
        }
    ]
}
```

## Commands
! For local installation use npx k-react-cm !

```
k-react-cm help // to display help
k-react-cm (create | c) template_name component_name // to create component
k-react-cm (create | c) template_name component_name (-o | --out) out_dir_path // to override out dir
k-react-cm (create | c) template_name component_name (-s | --subdir) // to create all in subdir
```

## Sources
- [:package: this package on npm](https://www.npmjs.com/package/k-react-cm)
- [:octocat: this package on github](https://github.com/Kostayne/react-cm)