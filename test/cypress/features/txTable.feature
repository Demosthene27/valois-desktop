Feature: Transaction table

  Scenario: 30 tx are shown, clicking show more loads more transactions
    Given I autologin as genesis to devnet
    Given I am on Wallet page
    Then I should see 30 transactions
    When I click show more
    Then I see more than 30 transactions

  Scenario: Click leads to tx details
    Given I autologin as genesis to devnet
    Given I am on Wallet page
    When I click the transaction row
    Then I am on transaction details page

  Scenario: Incoming/Outgoing/All filtering works
    Given I autologin as second_passphrase_account to devnet
    Given I am on Wallet page
    Then I see incoming transaction in table
    Then I see outgoing transaction in table
    Then I click filter incoming
    Then I see incoming transaction in table
    Then I don't see outgoing transaction in table
    Then I click filter outgoing
    Then I see outgoing transaction in table
    Then I don't see incoming transaction in table
