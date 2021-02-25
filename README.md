cli-project-manager
===================

manages your project from cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli-project-manager.svg)](https://npmjs.org/package/cli-project-manager)
[![Downloads/week](https://img.shields.io/npm/dw/cli-project-manager.svg)](https://npmjs.org/package/cli-project-manager)
[![License](https://img.shields.io/npm/l/cli-project-manager.svg)](https://github.com/Kostayne/cli-project-manager/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cli-project-manager
$ cli-pm COMMAND
running command...
$ cli-pm (-v|--version|version)
cli-project-manager/1.0.0 win32-x64 node-v14.15.5
$ cli-pm --help [COMMAND]
USAGE
  $ cli-pm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cli-pm hello [FILE]`](#cli-pm-hello-file)
* [`cli-pm help [COMMAND]`](#cli-pm-help-command)

## `cli-pm hello [FILE]`

describe the command here

```
USAGE
  $ cli-pm hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cli-pm hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Kostayne/cli-project-manager/blob/v1.0.0/src/commands/hello.ts)_

## `cli-pm help [COMMAND]`

display help for cli-pm

```
USAGE
  $ cli-pm help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
