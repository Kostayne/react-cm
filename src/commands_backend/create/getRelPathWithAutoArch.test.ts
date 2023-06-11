import { IAutoArch } from "../../types/auto_arch.type";
import { getRelPathWithAutoArch } from "./getRelPathWithAutoArch";

describe('getRelPathWithAutoArch fn', () => {
    const arches: IAutoArch[] = [{
        pathPrefix: 'pages',
        subdirName: 'components',
        maxNestLevel: 1,
        name: 'c_arch',
    }];

    it('Applies to specific prefix with correct nest level', () => {
        expect(getRelPathWithAutoArch(arches, 'pages/page'))
            .toBe('pages/page/components');
    });

    it('Not applies to specific prefix with too big nest nest level', () => {
        expect(getRelPathWithAutoArch(arches, 'pages/page/components'))
            .toBe('pages/page/components');
    });

    it('Not applies to specific prefix with too small nest nest level', () => {
        expect(getRelPathWithAutoArch(arches, 'pages'))
            .toBe('pages');
    });

    it('Not applies to mismatching prefix', () => {
        expect(getRelPathWithAutoArch(arches, 'components/c'))
            .toBe('components/c');
    });
});