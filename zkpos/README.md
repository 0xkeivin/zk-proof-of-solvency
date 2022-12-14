# zkpos 
## running contracts
```bash
cd contracts
npm run build && node build/src/main.js
```

## deploying contracts
```bash
cd contracts
zk config
# Name: berkeley
# URL: https://proxy.berkeley.minaexplorer.com/graphql
# Fee: 0.1
# Fund account via generated link e.g. https://faucet.minaprotocol.com/?address=B62qrRt1HpXupeJJef3GkRXKAoZi2iiajzJjxXJGtp8qqeNoQNm6g8Q
# check transaction 
# https://berkeley.minaexplorer.com/transaction/CkpYTNHgwyXHBCMjYA51QUtEASyq7vEhjnLRb1m32udMvLdXYgKgh
BasicMerkleTreeContract
zk deploy berkeley

# 1 - https://berkeley.minaexplorer.com/transaction/CkpZDyaAAVhFXZFM9JNmjFoWqF9HasB2WafTRZMMvK3Bbv2m65FsT
# 2 - https://berkeley.minaexplorer.com/transaction/CkpYiQqEHDbMqk2aMBXwG1osbxvNrPJBQw2PSMgTpDixBaPCSRic1
```
