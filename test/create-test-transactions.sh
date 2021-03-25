#!/bin/bash

lisk config:set api.nodes http://localhost:4000

NETWORKIDENTIFIER="93d00fe5be70d90e7ae247936a2e7d83b50809c79b73fa14285f02c842348b3e"
PASSPHRASE="peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready"

NONCE=103

function transfer(){
	lisk transaction:broadcast $(lisk transaction:create -t 8 $1 0.1 $2 $3 --data=$4 --passphrase="$PASSPHRASE" --networkIdentifier=$NETWORKIDENTIFIER)
}

function registerDelegate(){
	lisk transaction:broadcast $(lisk transaction:create --type=10 0 11 delegate --passphrase="recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit" --networkIdentifier=$NETWORKIDENTIFIER)
}
lisk transaction:broadcast $(lisk transaction:create -t 8 103 0.1 544792633152563672L --data=account-initialization \
--passphrase="pass:right cat soul renew under climb middle maid powder churn cram coconut")

lisk transaction:broadcast $(lisk transaction:create:transfer 0.1 4264113712245538326L --data=account-initialization \
--passphrase="pass:dolphin inhale planet talk insect release maze engine guilt loan attend lawn")

lisk transaction:broadcast $(lisk transaction:create:second-passphrase \
--passphrase="pass:awkward service glimpse punch genre calm grow life bullet boil match like" \
--second-passphrase="pass:forest around decrease farm vanish permit hotel clay senior matter endorse domain")

function vote() {
	lisk transaction:broadcast $(lisk transaction:create --type=13 156 0.1 --votes="537318935439898807L,100" --passphrase="peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready" --networkIdentifier=93d00fe5be70d90e7ae247936a2e7d83b50809c79b73fa14285f02c842348b3e)
	lisk transaction:broadcast $(lisk transaction:create --type=13 157 0.1 --votes="537318935439898807L,-20" --passphrase="peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready" --networkIdentifier=93d00fe5be70d90e7ae247936a2e7d83b50809c79b73fa14285f02c842348b3e)
}

for i in {1..50}; do
  CURRENT=$(( $i + $NONCE - 1 ))
	transfer ${CURRENT} ${i}00 537318935439898807L test
done

transfer 153 90 544792633152563672L delegate-candidate
transfer 154 70 16422276087748907680L send-all-account
transfer 155 1 94495548317450502L without-initialization
registerDelegate
# vote

# docker exec -t docker_db_1 pg_dump -U lisk lisk > ./dev_blockchain.db
