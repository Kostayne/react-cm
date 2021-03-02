react-component-manager (k-react-cm)
===================
!DONT DOWNLOAD TEST VERSION!
Manages your react components from cli. Easy to configure and extend.

<!-- shileds -->
![npm bundle size](https://img.shields.io/bundlephobia/min/k-react-cm)
![npm](https://img.shields.io/npm/dm/k-react-cm)
![NPM](https://img.shields.io/npm/l/k-react-cm)

* [Start](#Start)
* [Usage](#Usage)
* [Commands](#Commands)
* [Sources](#Sources)

# Start
First of all install the package from npm.

```
npm i k-react-cm
```

Then setup the config. You can do this in two ways. By creating seperated react-cm.json file in the project root or by creating reactCm field in "package.json". After that fill the config.

``` ts
// cfg exmaple
{
    // use double slashes on windows
    "cTemplate": "C:\\Users\\usr\\Desktop\\project\\src\\templates\\complex_template",
    "fnTemplate": "C:\\Users\\usr\\Desktop\\project\\src\\templates\\fnTemplate.tsx",
    "components": "C:\\Users\\usr\\Desktop\\project\\src\\components"
}
```

# Usage
If you want to create complex component (more than single file) then create a directory. Move component files into it. And specify template path (fn or class) to that dir full path. Done!

Want to use name from argument (in pascal case)? Insert %CNAME% into the template an it will be replaced with a component name.

``` tsx
// template example
import React from "react";

export const %CNAME% = () => {
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
react-cm help //to display help
react-cm $command $args // syntaxis
react-cm create-c $name (class or fn)
react-cm remove-c $name
```

Will there be updates?
Yes, they will be someday. I want to add dynamic templates (custom types).


[:octocat: github](https://github.com/Kostayne/react-cm)
