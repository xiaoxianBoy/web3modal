import { expect } from '@playwright/test'
import { testMEmail } from './shared/fixtures/w3m-email-fixture'
import { SECURE_WEBSITE_URL } from './shared/constants'

testMEmail.beforeEach(async ({ modalValidator }) => {
  await modalValidator.expectConnected()
})

testMEmail('it should sign', async ({ modalPage, modalValidator }) => {
  await modalPage.sign()
  await modalPage.approveSign()
  await modalValidator.expectAcceptedSign()
})

testMEmail('it should upgrade wallet', async ({ modalPage, context }) => {
  const page = await modalPage.clickWalletUpgradeCard(context)
  expect(page.url()).toContain(SECURE_WEBSITE_URL)
  await page.close()
})

testMEmail('it should reject sign', async ({ modalPage, modalValidator }) => {
  await modalPage.sign()
  await modalPage.rejectSign()
  await modalValidator.expectRejectedSign()
})

testMEmail('it should switch network and sign', async ({ modalPage, modalValidator }) => {
  let targetChain = 'Polygon'
  await modalPage.switchNetwork(targetChain)
  await modalValidator.expectNetwork(targetChain)
  await modalPage.closeModal()
  await modalPage.sign()
  await modalPage.approveSign()
  await modalValidator.expectAcceptedSign()

  targetChain = 'Ethereum'
  await modalPage.switchNetwork(targetChain)
  await modalValidator.expectNetwork(targetChain)
  await modalPage.closeModal()
  await modalPage.sign()
  await modalPage.approveSign()
  await modalValidator.expectAcceptedSign()
})

testMEmail('it should disconnect correctly', async ({ modalPage, modalValidator }) => {
  await modalPage.disconnect()
  await modalValidator.expectDisconnected()
})

testMEmail('it should update email', async ({ modalPage }) => {
  const mailsacApiKey = process.env['MAILSAC_API_KEY']
  if (!mailsacApiKey) {
    throw new Error('MAILSAC_API_KEY is not set')
  }

  await modalPage.updateEmail(mailsacApiKey)
})
