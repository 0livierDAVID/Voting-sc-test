const Voting = artifacts.require("./Voting.sol");

const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants');

 
contract("Voting", accounts => {
    // constants
    const _owner = accounts[0];
    const _voter1 = accounts[1];
    const _voter2 = accounts[2];
    const _voter3 = accounts[3];

    let votingInstance;

    beforeEach(async function(){
        votingInstance = await Voting.new({from: _owner});
    });

    describe("test", () => {
        // bla
        it("test1", async () => {

        });
    });
});