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

contract('PomodoroManager', ([owner, randomDoer1, randomDoer2]) => {
  let pmToken, pomodoroManager
  const initialSupply = 100000000
  const managerInitialBalance = 100

  before(async () => {
    // Load Contracts
    pmToken = await PMToken.new(owner, initialSupply)
    pomodoroManager = await PomodoroManager.new(pmToken.address, { from: owner })

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
  })

  describe('Redeem tokens', async () => {
    before(async () => {
      await pomodoroManager.redeemToken(randomDoer1)
    })

    it('should give a token to random doer', async () => {
      const randomDoerBalance = await pmToken.balanceOf(randomDoer1)
      expect(randomDoerBalance.toString()).to.eql('1')
    })

    it('contract should have 1 less token', async () => { })

    it('should add account to doers', async () => { })

    it('doer should have 1 pomodoro completed', async () => { })

    it('should reject giving 1 more before 30 minutes to the same account', () => { })

    it('should give 1 token to another random doer', () => { })
  })

})
