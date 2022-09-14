"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentsPath = exports.packagePath = exports.configPath = exports.userPath = void 0;
const path = require("path");
exports.userPath = path.join(process.cwd());
exports.configPath = path.join(exports.userPath, "react-cm.json");
exports.packagePath = path.join(exports.userPath, "package.json");
exports.componentsPath = path.join(exports.userPath, "src", "components");
