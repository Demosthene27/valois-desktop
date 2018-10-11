import numeral from 'numeral';
import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import { fromRawLsk } from '../../../src/utils/lsk';

const ss = {
  newAccountBtn: '.new-account-button',
  passphraseInput: '.passphrase input',
  loginBtn: '.login-button',
  networkDropdown: '.network',
  headerAddress: '.copy-title',
  headerBalance: '.balance span',
  networkStatus: '.network-status',
  nodeAddress: '.peer',
  errorPopup: '.toast',
};

const loginUI = (passphrase, network) => {
  cy.visit('/');
  switch (network) {
    case 'default':
      break;
    case 'mainnet':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(1).click();
      break;
    case 'testnet':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(2).click();
      break;
    case 'devnet':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(3).click();
      cy.get('.address input').type(networks.devnet.node);
      break;
    case 'invalid':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(3).click();
      cy.get('.address input').type('http://silk.road');
      break;
    default:
      throw new Error(`Network should be one of : default, main , test, dev, invalid . Was: , ${network}`);
  }
  cy.get(ss.passphraseInput).click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
  cy.get(ss.loginBtn).click();
};

const castNumberToBalanceString = number => numeral(fromRawLsk(number)).format('0,0.[0000000000000]');

describe('Login Page', () => {
  it('Create lisk id -> Register account page', () => {
    cy.visit('/');
    cy.get(ss.newAccountBtn).click();
    cy.url().should('include', '/register');
    cy.get('.multistep-back');
  });

  it('Log in to Mainnet by default ("Switch Network" is not set)', () => {
    loginUI(accounts.genesis.passphrase, 'default');
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Log in to Mainnet by default ("Switch Network" is false)', () => {
    cy.addLocalStorage('settings', 'showNetwork', false);
    loginUI(accounts.genesis.passphrase, 'default');
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Log in to Mainnet (Selected network)', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    loginUI(accounts.genesis.passphrase, 'mainnet');
    cy.get(ss.networkStatus).contains('Connected to mainnet');
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
  });

  it('Log in to Testnet', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    loginUI(accounts['testnet guy'].passphrase, 'testnet');
    cy.get(ss.networkStatus).contains('Connected to testnet');
    cy.get(ss.headerAddress).should('have.text', accounts['testnet guy'].address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(accounts['testnet guy'].balance));
  });

  it('Log in to Devnet', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    loginUI(accounts.genesis.passphrase, 'devnet');
    cy.get(ss.networkStatus).contains('Connected to devnet');
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('contain', castNumberToBalanceString(accounts.genesis.balance).substring(0, 6));
    cy.get(ss.nodeAddress).contains(networks.devnet.node);
  });

  it('Network switcher available by url ?showNetwork=true', () => {
    cy.visit('?showNetwork=true');
    cy.get(ss.networkDropdown).should('be.visible');
  });

  it('Log in to invalid address', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    loginUI(accounts.genesis.passphrase, 'invalid');
    cy.get(ss.errorPopup).contains('Unable to connect to the node');
  });
});
