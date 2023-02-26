const Voting = artifacts.require("./Voting.sol");

const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

 
contract("Voting", accounts => {
    // constant addresses
    const _owner = accounts[0];
    const _voter1 = accounts[1];
    const _voter2 = accounts[2];
    const _voter3 = accounts[3];
    const _voter4 = accounts[4];
    const _unregistred = accounts[5];

    // constant statuses
    const _RegisteringVoters            = new BN(0);
    const _ProposalsRegistrationStarted = new BN(1);
    const _ProposalsRegistrationEnded   = new BN(2);
    const _VotingSessionStarted         = new BN(3);
    const _VotingSessionEnded           = new BN(4);
    const _VotesTallied                 = new BN(5);

    const _prop1 = "Bob";
    const _prop2 = "Terry";
    const _prop3 = "John";
    const _prop4 = "Alice";

    const _id1 = new BN(1);
    const _id2 = new BN(2);
    const _id3 = new BN(3);
    const _id4 = new BN(4);

    const _zero = new BN(0);
    const _un = new BN(1);

    let votingInstance;


    // STATUS CHANGES
    describe("Status changes", () => {
        beforeEach(async function(){
            votingInstance = await Voting.new({from: _owner});
        });
        // startProposalsRegistering
        context("startProposalsRegistering", () => {
            // check storage
            it("should change status", async () => {
                let status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_RegisteringVoters);

                await votingInstance.startProposalsRegistering({from: _owner});

                status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_ProposalsRegistrationStarted);
            });
            // emit event WorkflowStatusChange
            it("should emit event WorkflowStatusChange", async () => {
                const result = await votingInstance.startProposalsRegistering({from: _owner});
                await expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: _RegisteringVoters,
                    newStatus: _ProposalsRegistrationStarted,
                })
            });
        });
        // endProposalsRegistering
        context("endProposalsRegistering", () => {
            beforeEach(async function(){
                votingInstance = await Voting.new({from: _owner});
                await votingInstance.startProposalsRegistering({from: _owner});
            });
            // check storage
            it("should change status", async () => {
                let status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_ProposalsRegistrationStarted);

                await votingInstance.endProposalsRegistering({from: _owner});

                status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_ProposalsRegistrationEnded);
            });
            // emit event WorkflowStatusChange
            it("should emit event WorkflowStatusChange", async () => {
                const result = await votingInstance.endProposalsRegistering({from: _owner});
                await expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: _ProposalsRegistrationStarted,
                    newStatus: _ProposalsRegistrationEnded,
                })
            });
        });
        // startVotingSession
        context("startVotingSession", () => {
            beforeEach(async function(){
                votingInstance = await Voting.new({from: _owner});
                await votingInstance.startProposalsRegistering({from: _owner});
                await votingInstance.endProposalsRegistering({from: _owner});
            });
            // check storage
            it("should change status", async () => {
                let status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_ProposalsRegistrationEnded);

                await votingInstance.startVotingSession({from: _owner});

                status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_VotingSessionStarted);
            });
            // emit event WorkflowStatusChange
            it("should emit event WorkflowStatusChange", async () => {
                const result = await votingInstance.startVotingSession({from: _owner});
                await expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: _ProposalsRegistrationEnded,
                    newStatus: _VotingSessionStarted,
                })
            });
        });
        // endVotingSession
        context("endVotingSession", () => {
            beforeEach(async function(){
                votingInstance = await Voting.new({from: _owner});
                await votingInstance.startProposalsRegistering({from: _owner});
                await votingInstance.endProposalsRegistering({from: _owner});
                await votingInstance.startVotingSession({from: _owner});
            });
            // check storage
            it("should change status", async () => {
                let status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_VotingSessionStarted);

                await votingInstance.endVotingSession({from: _owner});

                status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_VotingSessionEnded);
            });
            // emit event WorkflowStatusChange
            it("should emit event WorkflowStatusChange", async () => {
                const result = await votingInstance.endVotingSession({from: _owner});
                await expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: _VotingSessionStarted,
                    newStatus: _VotingSessionEnded,
                })
            });
        });
        // tallyVotes
        context("tallyVotes", () => {
            beforeEach(async function(){
                votingInstance = await Voting.new({from: _owner});
                await votingInstance.startProposalsRegistering({from: _owner});
                await votingInstance.endProposalsRegistering({from: _owner});
                await votingInstance.startVotingSession({from: _owner});
                await votingInstance.endVotingSession({from: _owner});
            });
            // check storage
            it("should change status", async () => {
                let status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_VotingSessionEnded);

                await votingInstance.tallyVotes({from: _owner});

                status = await votingInstance.workflowStatus({from: _unregistred});
                expect(status).to.be.bignumber.equal(_VotesTallied);
            });
            // emit event WorkflowStatusChange
            it("should emit event WorkflowStatusChange", async () => {
                const result = await votingInstance.tallyVotes({from: _owner});
                await expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: _VotingSessionEnded,
                    newStatus: _VotesTallied,
                })
            });
        });
    });


    // MODIFIERS
    describe("Modifiers validation", () => {
        before(async function(){
            votingInstance = await Voting.new({from: _owner});
        });
        // onlyOwner: to test or not to test that is the question!
        // Should we trust Hadrien? :D
        context("onlyOwner", () => {
            it("should revert if not Owner", async () => {
                await expectRevert(votingInstance.addVoter(_voter1, {from: _unregistred}), "Ownable: caller is not the owner")
            });
        });
        // onlyVoters
        context("onlyVoters", () => {
            it("should revert if not Voter", async () => {
                await expectRevert(votingInstance.addProposal(_prop1, {from: _unregistred}), "You're not a voter");
            });
        });
    });

    // REGISTRATION
    describe("Registration step", () => {
        before(async function(){
            votingInstance = await Voting.new({from: _owner});
            await votingInstance.addVoter(_voter1, {from: _owner});
        });
        // getVoter
        context("getVoter", () => {
            it("should return a voter", async () => {
                voter = await votingInstance.getVoter(_voter1, {from: _voter1});
                expect(voter.isRegistered).to.be.true;
                expect(voter.hasVoted).to.be.false;
                expect(voter.votedProposalId).to.be.bignumber.equal(new BN(0));
            });
        });
        // addVoter
        context("addVoter", () => {
            // check storage
            it("should register a voter", async () => {
                let voter = await votingInstance.getVoter(_voter2, {from: _voter1});
                expect(voter.isRegistered).to.be.false;

                await votingInstance.addVoter(_voter2, {from: _owner});

                voter = await votingInstance.getVoter(_voter2, {from: _voter1});
                expect(voter.isRegistered).to.be.true;
            });
            // emit event VoterRegistered
            it("should emit event VoterRegistered", async () => {
                const result = await votingInstance.addVoter(_voter3, {from: _owner});
                await expectEvent(result, 'VoterRegistered', {voterAddress: _voter3})
            });
            // revert already registered
            it("should revert if already registered", async () => {
                await expectRevert(votingInstance.addVoter(_voter3, {from: _owner}), "Already registered");
            });
        });
    });

    // PROPOSAL
    describe("Proposal step", () => {
        before(async function(){
            votingInstance = await Voting.new({from: _owner});
            await votingInstance.addVoter(_voter1, {from: _owner});
            await votingInstance.addVoter(_voter2, {from: _owner});
            await votingInstance.startProposalsRegistering({from: _owner});
            await votingInstance.addProposal(_prop1, {from: _voter1});
            await votingInstance.addProposal(_prop2, {from: _voter1});
        });
        // getOneProposal
        context("getOneProposal", () => {
            it("should return a proposal", async () => {
                proposal = await votingInstance.getOneProposal(_id1, {from: _voter1});
                expect(proposal.description).to.equal(_prop1);
                expect(proposal.voteCount).to.be.bignumber.equal(_zero);
            });
        });
        // addProposal
        context("addProposal", () => {
            // revert empty desc
            it("should revert if description is empty", async () => {
                const _empty = '';
                await expectRevert(
                    votingInstance.addProposal(_empty, {from: _voter2}), 
                    'Vous ne pouvez pas ne rien proposer'
                );
            });
            // check storage
            it("should store a proposal", async () => {
                // overflow revert: unexisting proposal
                await expectRevert.unspecified(votingInstance.getOneProposal(_id3, {from: _voter2}));
                await votingInstance.addProposal(_prop3, {from: _voter2});
                proposal = await votingInstance.getOneProposal(_id3, {from: _voter2});
                expect(proposal.description).to.equal(_prop3);
            });
            // emit event ProposalRegistered
            it("should emit event ProposalRegistered", async () => {
                const result = await votingInstance.addProposal(_prop4, {from: _voter2});
                await expectEvent(result, 'ProposalRegistered', {proposalId: _id4})
            });
        });
    });

    // VOTE
    describe("Vote step", () => {
        before(async function(){
            votingInstance = await Voting.new({from: _owner});
            await votingInstance.addVoter(_voter1, {from: _owner});
            await votingInstance.addVoter(_voter2, {from: _owner});
            await votingInstance.addVoter(_voter3, {from: _owner});
            await votingInstance.startProposalsRegistering({from: _owner});
            await votingInstance.addProposal(_prop1, {from: _voter1});
            await votingInstance.addProposal(_prop2, {from: _voter1});
            await votingInstance.addProposal(_prop3, {from: _voter2});
            await votingInstance.endProposalsRegistering({from: _owner});
            await votingInstance.startVotingSession({from: _owner});
        });
        // setVote
        context("setVote", () => {

            // revert proposal unknown
            it("shoud revert if proposal is unknown", async () => {
                await expectRevert(
                    votingInstance.setVote(_id4, {from: _voter1}), 
                    'Proposal not found'
                );
            });
            // check storage
            it("should store a vote", async () => {
                let voter = await votingInstance.getVoter(_voter1, {from: _voter1})
                let prop = await votingInstance.getOneProposal(_id2, {from: _voter1})
                expect(voter.hasVoted).to.be.false;
                expect(voter.votedProposalId).to.be.bignumber.equal(_zero);
                expect(prop.voteCount).to.be.bignumber.equal(_zero);
                
                await votingInstance.setVote(_id2, {from: _voter1});

                voter = await votingInstance.getVoter(_voter1, {from: _voter1});
                prop = await votingInstance.getOneProposal(_id2, {from: _voter1});
                expect(voter.hasVoted).to.be.true;
                expect(voter.votedProposalId).to.be.bignumber.equal(_id2);
                expect(prop.voteCount).to.be.bignumber.equal(_un);
            });
            // revert already voted
            it("shoud revert if voter already voted", async () => {
                await votingInstance.setVote(_id2, {from: _voter2});
                await expectRevert(
                    votingInstance.setVote(_id3, {from: _voter2}), 
                    'You have already voted'
                );
            });
            // emit event Voted
            it("should emit event Voted", async () => {
                const result = await votingInstance.setVote(_id3, {from: _voter3});
                await expectEvent(result, 'Voted', {voter: _voter3, proposalId: _id3})
            });
        });
    });

    // TALLY VOTE
    describe("Tally step", () => {
        before(async function(){
            votingInstance = await Voting.new({from: _owner});
            await votingInstance.addVoter(_voter1, {from: _owner});
            await votingInstance.addVoter(_voter2, {from: _owner});
            await votingInstance.addVoter(_voter3, {from: _owner});
            await votingInstance.addVoter(_voter4, {from: _owner});
            await votingInstance.startProposalsRegistering({from: _owner});
            await votingInstance.addProposal(_prop1, {from: _voter1});
            await votingInstance.addProposal(_prop2, {from: _voter1});
            await votingInstance.addProposal(_prop3, {from: _voter2});
            await votingInstance.addProposal(_prop4, {from: _voter3});
            await votingInstance.endProposalsRegistering({from: _owner});
            await votingInstance.startVotingSession({from: _owner});
            await votingInstance.setVote(_id2, {from: _voter1});
            await votingInstance.setVote(_id2, {from: _voter2});
            await votingInstance.setVote(_id3, {from: _voter3});
            await votingInstance.setVote(_id4, {from: _voter4});
            await votingInstance.endVotingSession({from: _owner});
        });
        // tallyVotes
        context("tallyVotes", () => {
            // check storage
            it("should update the winner", async () => {
                let winner = await votingInstance.winningProposalID();
                expect(winner).to.be.bignumber.equal(_zero);
                
                await votingInstance.tallyVotes({from: _owner});

                winner = await votingInstance.winningProposalID();
                expect(winner).to.be.bignumber.equal(_id2);
            });
        });
    });

    // STATUS RESTRICTIONS
    describe("Status restrictions revert check", () => {
        beforeEach(async function(){
            votingInstance = await Voting.new({from: _owner});
            await votingInstance.addVoter(_voter1, {from: _owner});
        });
        // addVoter
        context("addVoter", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await votingInstance.startProposalsRegistering({from: _owner});
                await expectRevert(
                    votingInstance.addVoter(_voter2, {from: _owner}), 
                    'Voters registration is not open yet'
                );
            });
        });
        // startProposalsRegistering
        context("startProposalsRegistering", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await votingInstance.startProposalsRegistering({from: _owner});
                await expectRevert(
                    votingInstance.startProposalsRegistering({from: _owner}), 
                    'Registering proposals cant be started now'
                );
            });
        });
        // addProposal
        context("addProposal", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await expectRevert(
                    votingInstance.addProposal(_prop1, {from: _voter1}), 
                    'Proposals are not allowed yet'
                );
            });
        });
        // endProposalsRegistering
        context("endProposalsRegistering", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await expectRevert(
                    votingInstance.endProposalsRegistering({from: _owner}), 
                    'Registering proposals havent started yet'
                );
            });
        });
        // startVotingSession
        context("startVotingSession", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await expectRevert(
                    votingInstance.startVotingSession({from: _owner}), 
                    'Registering proposals phase is not finished'
                );
            });
        });
        // setVote
        context("setVote", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await expectRevert(
                    votingInstance.setVote(_id1, {from: _voter1}), 
                    'Voting session havent started yet'
                );
            });
        });
        // endVotingSession
        context("endVotingSession", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await expectRevert(
                    votingInstance.endVotingSession({from: _owner}), 
                    'Voting session havent started yet'
                );
            });
        });
        // tallyVotes
        context("tallyVotes", () => {
            // revert wrong status
            it("should revert if not called at the right step", async () => {
                await expectRevert(
                    votingInstance.tallyVotes({from: _owner}), 
                    'Current status is not voting session ended'
                );
            });
        });
    });

});