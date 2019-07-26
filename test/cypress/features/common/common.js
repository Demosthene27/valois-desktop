/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';
import ss from '../../../constants/selectors';
import networks from '../../../constants/networks';
import compareBalances from '../../utils/compareBalances';
import urls from '../../../constants/urls';

Given(/^I autologin as ([^\s]+) to ([^\s]+)$/, function (account, network) {
  cy.autologin(accounts[account].passphrase, networks[network].node);
});

Given(/^I login$/, function () {
  cy.server();
  cy.route('/account/**').as('btcAccount');
  cy.get(ss.loginBtn).should('be.enabled');
  cy.get(ss.loginBtn).click();
  cy.wait('@btcAccount');
});

Then(/^I enter ([^\s]+) passphrase of ([^\s]+)$/, function (passphraseType, accountName) {
  const passphrase = accounts[accountName][(passphraseType === 'second') ?  'secondPassphrase' : 'passphrase'];
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
});

Given(/^I am on (.*?) page$/, function (page) {
  page = page.toLowerCase();
  switch (page) {
    case 'dashboard':
      cy.server();
      cy.route('/api/node/constants').as('constants');
      cy.visit(urls.dashboard).then(() => {
        if (window.localStorage.getItem('liskCoreUrl')) cy.wait('@constants');
      });
      break;
    case 'second passphrase registration':
      cy.visit(urls.secondPassphrase);
      break;
    case 'register delegate':
      cy.visit(urls.registerDelegate);
      break;
    case 'delegates':
      cy.visit(urls.delegates);
      cy.get(ss.delegateName);
      break;
    default:
      cy.visit(urls[page]);
      break;
  }
});

Then(/^The latest transaction is (.*?)$/, function (transactionType) {
  if (transactionType.indexOf('transfer') > 0) {
    const transactionAddress = transactionType.split(' ').pop(); // For uses like: 'transfer to 123456L'
    cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).should('have.text', transactionAddress);
  } else {
    cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains(/delegate vote/i);
  }
});

Then(/^I should be on Tx Details page$/, function () {
  cy.get(ss.app).contains('Confirmations');
});

Then(/^I should be on Account page$/, function () {
  cy.get(ss.accountName).should('be.visible');
});

Then(/^I should be on Account page of ([^s]+)$/, function (accountAddress) {
  cy.get(ss.accountAddress).contains(accountAddress);
});

Then(/^I should be on Delegate page of ([^s]+)$/, function (delegateName) {
  cy.get(ss.accountName).should('have.text', delegateName);
});

Then(/^I should be on Tx Details page of ([^s]+)$/, function (transactionId) {
  cy.get(ss.transactionId).should('have.text', transactionId);
});

Then(/^I am on Wallet page of ([^s]+)$/, function (accountName) {
  cy.server();
  cy.route('/api/accounts?address=**').as('requestAccountData');
  cy.visit(`${urls.accounts}/${accounts[accountName].address}`);
  cy.wait('@requestAccountData');
});

Then(/^I see ([^s]+) in recipient$/, function (accountName) {
  cy.get(ss.recipientInput).should('have.value', accounts[accountName].address);
});
