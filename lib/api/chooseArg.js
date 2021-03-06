"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChooseArg = exports.isInOptions = void 0;
function isInOptions(arg, chooses) {
    for (let i = 0; i <= chooses.length - 1; i++) {
        if (chooses[i] == arg)
            return true;
    }
    return false;
}
exports.isInOptions = isInOptions;
function validateChooseArg(arg, chooses) {
    if (!isInOptions(arg, chooses))
        throw new Error(`Argument ${arg} must to be one of that options: ${chooses.toString()}`);
}
exports.validateChooseArg = validateChooseArg;
