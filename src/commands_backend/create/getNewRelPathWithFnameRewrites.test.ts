import { IReactCMTemplate } from "../../types/template.type";
import { getNewRelPathWithFnameRewrites } from "./getNewRelPathWithFnameRewrites";

describe('GetNewRelPathWithFnameRewrites Fn', () => {
    const template: IReactCMTemplate = {
        path: '',
        subDir: true,
        outDir: 'components',
        name: 'TestComponentTemplate',

        rewrites: [
            {
                from: 'cname.test.!tsx',
                to: 'cname.test.tsx'
            }
        ],
    };

    // tests
    it('Throws error if template is nullish', () => {
        expect(
            () => getNewRelPathWithFnameRewrites(null as unknown as IReactCMTemplate, '')
        ).toThrow();
    });

    it('Not applies to mismatching rel path', () => {
        expect(getNewRelPathWithFnameRewrites(template, 'random_file.ts')).toBe('random_file.ts');
    });

    it('Applies to matching rel path', () => {
        expect(getNewRelPathWithFnameRewrites(template, 'cname.test.!tsx')).toBe('cname.test.tsx');
    });

    it('Applies to matching rel path with beginning slash support', () => {
        expect(getNewRelPathWithFnameRewrites(template, '/cname.test.!tsx')).toBe('cname.test.tsx');
    });
});