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
npm i -g k-react-cm
```

Then setup the config. You can do this in two ways. By creating seperated react-cm.json file in the project root or by creating reactCm field in "package.json". After that fill the config.

``` ts json
// cfg exmaple
// fn - single file template
// cl - complex template

{
    "templates": [
        {
            "name": "fn",
            "path": "./example/templates/fn.tsx",
            "outDir": "path": "./example/components",
        },

        {
            "name": "cl",
            "path": "./example/templates/cl",
            "outDir": "path": "./example/components",
        },

        {
            "name": "page",
            "path": "./example/templates/page",
            "outDir": "path": "./example/components",
            "subDir": false // it's optional prop

            // ------------------------------------------
            // when subDir is false
            // pages => home.tsx, home.scss

            // when subDir is true
            // pages => home => home.tsx, home.scss

            // in complex components it's true by default
            // ------------------------------------------
        }
    ]
}
```

## Usage
If you want to create complex component (more than single file) then create a directory, move component files into it and specify template path to that dir full or relative path. Done!

Want to use component name inside template? Insert \_\_oname__ into the template. It will be replaced with original name. Insert \_\_cname__ to replace it with jsx component name (PascalCase). To create css selector use \_\_pname__ (it will be kebab-cased). Template file names are parsed as it's content, so when you name the file like "\_\_oname\_\_.tsx", where component name is "test", the output will be "test.tsx".

``` tsx
// tsx template example
import React from "react";

export const __cname__ = () => {
    return (
        <div>
            <p>Text</p>
        </div>
    );
}
```

``` css
/* css template example */

.__pname__ {
    /* your styles here */
    /* or just empty space */
}
```

## Commands
```
// commands
k-react-cm help // to display help
k-react-cm create template_name component_name // to create component
k-react-cm create template_name component_name -o out_dir_path // to override out dir
k-react-cm create template_name component_name -s // to create subdir
```

## Sources
- [:package: this package on npm](https://www.npmjs.com/package/k-react-cm)
- [:octocat: this package on github](https://github.com/Kostayne/react-cm)