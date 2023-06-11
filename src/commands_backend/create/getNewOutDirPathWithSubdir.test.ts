import { getNewOutDirPathWithSubdir } from './getNewOutDirPathWithSubdir';

describe('getNewOutDirPathWithSubdir fn', () => {
    it('Returns orig path if subdir == false', () => {
        expect(
            getNewOutDirPathWithSubdir('/', {
                componentName: 'TestC',
                createSubDir: false,
                isSingleFileComponent: false,
            })
        ).toBe('/');
    });

    it('Returns correct path with subdir == true', () => {
        expect(
            getNewOutDirPathWithSubdir('/', {
                componentName: 'TestC',
                createSubDir: true,
                isSingleFileComponent: true,
            })
        ).toBe('/TestC');
    });
});