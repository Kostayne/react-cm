export function isInOptions(arg: string, chooses: string[]) {
    for (let i = 0; i < chooses.length - 1; i++) {
        if (chooses[i] = arg) return true;
    }
}

export function validateChooseArg(arg: string, chooses: string[]) {
    if (!isInOptions(arg, chooses)) throw `Argument ${arg} must to be one of that options: ${chooses.toString()}`;
}