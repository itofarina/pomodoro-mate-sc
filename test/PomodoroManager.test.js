// /* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const {
  expectEvent,
  expectRevert,
  balance,
  constants
} = require('@openzeppelin/test-helpers')
const upgrades = require('@openzeppelin/truffle-upgrades')
const { toBN } = require('web3-utils')

const { expect } = require('chai')

const PomodoroManager = artifacts.require('PomodoroManager')
const PMToken = artifacts.require('PMToken')

contract('PomodoroManager', ([owner, randomDoer]) => {
  let pmToken, pomodoroManager

  before(async () => {
    // Load Contracts
    pmToken = await PMToken.new()
    pomodoroManager = await PomodoroManager.new(pmToken.address)
  })

  describe('Issuing tokens', async () => {

  })
})
