react-component-manager (k-react-cm)
===================
!This is stable version, you can download it!

Manages your react components from cli. Easy to configure and extend.

<!-- shileds -->

![npm](https://img.shields.io/npm/v/k-react-cm)
![npm](https://img.shields.io/npm/dm/k-react-cm)
![NPM](https://img.shields.io/npm/l/k-react-cm)

* [Start](#Start)
* [Usage](#Usage)
* [Commands](#Commands)
* [Sources](#Sources)

# Start
First of all install the package from npm.

```
npm i -g k-react-cm
```

Then setup the config. You can do this in two ways. By creating seperated react-cm.json file in the project root or by creating reactCm field in "package.json". After that fill the config.

``` ts json
// cfg exmaple
{
    // use double slashes on windows
    "templates": [
        {
            "name": "fn",
            "path": "path\\to\\template"
        },
        {
            "name": "c",
            "path": "path\\to\\template"
        }
    ],

    "components": "C:\\Users\\usr\\Desktop\\project\\src\\components"
}
```

# Usage
If you want to create complex component (more than single file) then create a directory. Move component files into it. And specify template path (fn or class) to that dir full path. Done!

Want to use name from argument? Insert \_\_oname__ into the template. It will be replaced with original name. Insert \_\_cname__ to replace it with jsx component name (PascalCase). To create css selector use \_\_pname__ (it will be kebab cased).

``` tsx
// template example
import React from "react";

export const __cname__ = () => {
    return (
        <div>
            <p>Text</p>
        </div>
    );
}
```

# Commands
```
// commands
k-react-cm help //to display help
k-react-cm $command $args // syntaxis
k-react-cm create-c $name (c or fn in this example)
k-react-cm remove-c $name
```

Will there be updates?
Yes, they will be someday. Now i want to add more ways to get component name in template.


[:octocat: github](https://github.com/Kostayne/react-cm)
