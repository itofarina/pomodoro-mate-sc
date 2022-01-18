// /* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const {
  expectEvent,
  expectRevert,
  balance,
  constants,
  ether
} = require('@openzeppelin/test-helpers')
const upgrades = require('@openzeppelin/truffle-upgrades')
const { toBN, toWei } = require('web3-utils')

const { expect } = require('chai')

const PomodoroManager = artifacts.require('PomodoroManager')
const PMToken = artifacts.require('PMToken')

// TODO: move to utils
// const id = 0
// const jsonrpc = '2.0'
// const send = (method, params = []) =>
//   web3.currentProvider.send({ id, jsonrpc, method, params })
// const timeTravel = async seconds => {
//   await send('evm_increaseTime', [seconds])
//   await send('evm_mine')
// }
// TODO: works but check this for better approach: https://forum.openzeppelin.com/t/how-to-simulate-a-date-in-the-future-with-truffle-tests/908/3


contract('PomodoroManager', ([owner, randomDoer1, randomDoer2]) => {
  let pmToken, pomodoroManager
  const initialSupply = 100000000
  const managerInitialBalance = 2
  const sessionLengthMinutes = 25

  before(async () => {
    // Load Contracts
    pmToken = await PMToken.new(owner, initialSupply)
    pomodoroManager = await PomodoroManager.new(pmToken.address, sessionLengthMinutes, { from: owner })

    // Send tokens to pomodoro manager contract
    await pmToken.transfer(pomodoroManager.address, managerInitialBalance, { from: owner })
  })

  // TODO: move to PMToken.test.js
  describe('PMToken deployment', () => {
    it('has a name', async () => {
      const name = await pmToken.name()
      expect(name).to.eql('Pomodoro Mate Token')
    })

    it('owner has proper balance', async () => {
      const ownerBalance = await pmToken.balanceOf(owner)
      expect(ownerBalance.toString()).to.eql(
        (initialSupply - managerInitialBalance).toString()
      )
    })
  })

  describe('Pomodoro Manager deployment', () => {
    it('has a name', async () => {
      const name = await pomodoroManager.name()
      expect(name).to.eql('Pomodoro Manager')
    })

    it('has initial balance', async () => {
      const balance = await pmToken.balanceOf(pomodoroManager.address)
      expect(balance.toString()).to.eql(managerInitialBalance.toString())
    })

    it('has proper session length', async () => {
      const sessionMinutes = await pomodoroManager.sessionLengthMinutes()

      expect(sessionMinutes.toString()).to.eql(sessionLengthMinutes.toString())
    })
  })

  describe('Redeem tokens', async () => {
    let receipt
    before(async () => {
      receipt = await pomodoroManager.redeemToken(randomDoer1)
    })

    it('should give a token to random doer', async () => {
      const randomDoerBalance = await pmToken.balanceOf(randomDoer1)
      expect(randomDoerBalance.toString()).to.eql('1')
    })

    it('should emit Redeemed', () => {
      expectEvent(receipt, 'Redeemed', {
        doer: randomDoer1,
      })
    })

    it('manager should have 1 less token', async () => {
      const pomoBalance = await pmToken.balanceOf(pomodoroManager.address)
      expect(pomoBalance.toString()).to.eql(`${managerInitialBalance - 1}`)
    })

    it('should add account to doers', async () => {
      const doers = await pomodoroManager.getAllDoers()
      expect(doers).to.include(randomDoer1)
    })

    it('doer should have 1 pomodoro completed', async () => {
      const pomosCompleted = await pomodoroManager.pomodorosCompleted(randomDoer1)
      expect(pomosCompleted.toString()).to.eql('1')
    })

    // it('should reject giving 1 more before 25 minutes to the same account', async () => {
    // await timeTravel(60)
    // await expectRevert(
    //   pomodoroManager.redeemToken(randomDoer1),
    //   "Pomodoro Manager: Tokens can only be redeemed in 25 minutes period"
    // )
    // await expect(pmToken.balanceOf(randomDoer1).toString()).to.be.eql('1')
    // })

    it('should give 1 token to another random doer', async () => {
      const receipt2 = await pomodoroManager.redeemToken(randomDoer2)
      const getDoers = await pomodoroManager.getAllDoers()
      expect(getDoers.length).to.eql(2)
      expectEvent(receipt2, 'Redeemed', {
        doer: randomDoer2,
      })
    })

  })

})
