# zkpos
- Project submission for the zkIgnite hackathon https://minaprotocol.com/blog/zkignite-cohort0 
- https://zk-proof-of-solvency.vercel.app/
# Project Description
## Problem statement
- Most centralized exchanges release audit reports to prove that they have enough funds to cover all user withdrawals. However, these reports are not verifiable by users. 
- The only way to verify the funds is to check the onchain balances of the exchange. However, this is not possible because the exchange can use a hot wallet to withdraw funds from the exchange.
- The users could not be certain if the exchanges have enough funds to cover all withdrawals and prevent bankrun situations.
## Proposed solution
- The zkProof of Solvency protocol allows users to verify the funds of an exchange by checking their unique hash against the merkle tree root.
- This is done via the hashing of 
    - wallet address
    - onchain balance at a certain the point in time
    - salt value (to introduce randomness)
- The merkle tree will then be constructed using the hashes of the above values. The merkle tree root will be published onchain and kept in a `Field` in the zkApp.
- The users can then verify their reported funds within the exchange by checking their unique hash against the merkle tree root.
## Components
- `MerkleTree Class` to construct the tree structure https://docs.minaprotocol.com/zkapps/tutorials/common-types-and-functions#merkle-trees
- `Etherscan API` to fetch onchain address balances https://etherscan.io/apis
-  `Auro Wallet` to sign transactions
## Improvements
- Using a better hashing approach which allows summation of balances of multiple addresses
- Using special puporse ZK-SNARKs to prove non-negative balances

# Running the project
```bash
cd zkpos
# copy the sample file and enter etherscan api value
cp ui/.env.example ui/.env.local
npm install --prefix contracts && npm install --prefix ui
npm run build --prefix contracts && npm run build --prefix ui
npm run dev --prefix ui
```
## References
- https://vitalik.ca/general/2022/11/19/proof_of_solvency.html
- https://medium.com/iconominet/proof-of-solvency-technical-overview-d1d0e8a8a0b8
