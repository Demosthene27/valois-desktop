import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

describe('Search', () => {
  const testnetTransaction = '755251579479131174';
  const mainnetTransaction = '881002485778658401';
  const testnetTransactionId = '6676752260506338126';

  beforeEach(() => {
    cy.server();
    cy.route('/api/accounts**').as('requestAccount');
    cy.route('/api/transactions**').as('requestTransaction');
    cy.route('/api/delegates**').as('requestDelegate');
  });

  function assertAccountPage(accountsAddress) {
    cy.wait('@requestAccount');
    cy.wait('@requestDelegate');
    cy.get(ss.searchAccountRow).find('.account-title').should('have.text', accountsAddress);
  }

  function assertTransactionPage(transactionId) {
    cy.wait('@requestTransaction');
    cy.get(ss.searchTransactionRow).find(ss.searchTransactionRowId).should('have.text', transactionId);
  }

  /**
   * Search for Lisk ID using keyboard Enter, signed out
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Lisk ID using keyboard Enter, signed off', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts.delegate.address}{enter}`);
    assertAccountPage(accounts.delegate.address);
  });

  /**
   * Search for Lisk ID using suggestions, signed in
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Lisk ID using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts.delegate.address}`);
    assertAccountPage(accounts.delegate.username);
  });

  /**
   * Search for transaction using keyboard Enter, signed off
   * @expect transaction details page a result
   * @expect localStorage have the searches object with correct id
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Transaction using keyboard Enter, signed off', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${mainnetTransaction}{enter}`);
    assertTransactionPage(mainnetTransaction);
  });

  /**
   * Search for transaction using suggestions, signed in
   * @expect transaction details page a result
   * @expect localStorage have the searches object with correct id
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Transaction using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${testnetTransaction}`);
    assertTransactionPage(testnetTransaction);
  });

  /**
   * Search for delegate using keyboard Enter, signed off
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Delegate using keyboard Enter, signed off', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts['mainnet delegate'].username}{enter}`);
    cy.get(ss.searchDelegatesRow).find(ss.delegateName).eq(0).should('have.text', accounts['mainnet delegate'].username);
  });

  it('4 search suggestions appears after 3 letters entered', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(accounts.delegate.username.substring(0, 3));
    cy.get(ss.searchDelegatesRow).should('have.length', 4);
  });

  /**
   * Search for delegate using suggestions, signed in
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Delegate using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts.delegate.username}`);
    cy.get(ss.searchDelegatesRow).eq(0).click();
    cy.get(ss.accountName).should('have.text', accounts.delegate.username);
  });

  /**
   * Search without signing in
   * @expect happens in mainnet
   */
  it('Search without signing in - happens in mainnet', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts['mainnet delegate'].address}`);
    cy.wait('@requestAccount');
    cy.get(ss.searchAccountRow).eq(0).click();
    cy.get(ss.accountName).should('have.text', accounts['mainnet delegate'].username);
  });

  /**
   * Search signed in mainnet
   * @expect happens in mainnet
   * This test should be fxied once the transaction details page
   * change the behavior of how to present the data
   */
  it('Search signed in mainnet - happens in mainnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.mainnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts['mainnet delegate'].address}`);
    cy.get(ss.searchAccountResults).eq(0).click();
    cy.wait('@requestAccount');
    cy.wait('@requestDelegate');
    cy.get(ss.accountName).should('have.text', accounts['mainnet delegate'].username);
  });

  /**
   * Search signed in testnet
   * @expect happens in testnet
   */
  it('Search signed in testnet - happens in testnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${testnetTransaction}`);
    cy.get(ss.transactionRow).eq(0).click();
    cy.get(ss.transactionId).should('have.text', testnetTransactionId);
  });

  /**
   * Search signed in devnet
   * @expect happens in devnet
   */
  it('Search signed in devnet - happens in devnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts.delegate.address}{enter}`);
    cy.get(ss.searchAccountRow).eq(0).click();
    cy.get(ss.accountName).should('have.text', accounts.delegate.username);
  });

  /**
   * Search after logout
   * @expect happens in last used network
   */
  it('Search after logout - happens in last used network', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.userAvatar).click();
    cy.get(ss.logoutBtn).click();
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(`${accounts.delegate.username}`);
    cy.get(ss.searchDelegetesResults).eq(0).click();
    cy.get(ss.accountName).should('have.text', accounts.delegate.username);
  });

  /**
   * Type not sufficient amount of chars
   * @expect 'Type at least 3 characters' message
   */
  it('Type 2 chars - dropdown shows not enough chars message', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type('43');
    cy.get(ss.searchMessage).eq(0).should('have.text', 'Type at least 3 characters');
  });

  /**
   * Type not existent gibberish of chars
   * @expect 'No results found' message
   */
  it('Type nonexistent thing - dropdown shows not results found message', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type('43th3j4bt324');
    cy.get(ss.searchMessage).eq(0).should('have.text', 'No results found.');
  });

  /**
   * Search for nonexistent item
   * @expect no results plug
   */
  it('Search for nonexistent item - shows no results plug', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type('321321');
    cy.get(ss.searchMessage).eq(0).should('have.text', 'No results found.');
  });
});
