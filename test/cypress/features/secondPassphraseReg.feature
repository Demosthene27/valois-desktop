Feature: Second Passphrase Registration

  Scenario: Register second passphrase
    Given I login as second_passphrase_candidate on devnet
    Given I am on Second passphrase registration page
    And I remember my passphrase
    And I confirm my passphrase
    And I click on confirmButton
    When I am on Wallet page
    Then The latest transaction is Second passphrase registration
