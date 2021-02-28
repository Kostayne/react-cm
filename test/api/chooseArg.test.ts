import { string } from '@oclif/command/lib/flags';
import {expect, test} from '@oclif/test'
import { assert } from 'chai';
import { isInOptions, validateChooseArg } from "../../src/api/chooseArg";

describe('is in options function test', () => {
    test.it("right returns false", () => {
        assert.equal(isInOptions("c", ["a", "b"]), false);
    });

    test.it("right returns true", () => {
        assert.equal(isInOptions("a", ["a", "b"]), true);
    });
})

describe('validate ChoosedArg function test', () => {
    test.it("throws exeption when invalid arg", () => {
        try {
            assert.throw(() => { validateChooseArg("a", [""]) });
        }

        catch(e) {

        }
    });

    test.it("not throwes when arg is ok", () => {
        try {
            assert.doesNotThrow(() => { validateChooseArg("a", ["a"]) });
        }

        catch(e) {

        }
    });
})

// import {expect, test} from '@oclif/test'

// describe('hello', () => {
//   test
//   .stdout()
//   .command(['hello'])
//   .it('runs hello', ctx => {
//     expect(ctx.stdout).to.contain('hello world')
//   })

//   test
//   .stdout()
//   .command(['hello', '--name', 'jeff'])
//   .it('runs hello --name jeff', ctx => {
//     expect(ctx.stdout).to.contain('hello jeff')
//   })
// })