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
# 3 - https://berkeley.minaexplorer.com/transaction/CkpZnXe3KjjfY8j2ysHvyG4FtPk6gWvo1LNawfpW3cCZ4KBQfaP2P
```


## sample eth addresses 
```bash
0x28c6c06298d514db089934071355e5743bf21d60,
0x8103683202aa8da10536036edef04cdd865c225e
0xe92d1a43df510f82c66382592a047d288f85226f,
0x742d35cc6634c0532925a3b844bc454e4438f44e,
0xf977814e90da44bfa03b6295a0616a897441acec,
0xbe0eb53f46cd790cd13851d5eff43d12404d33e8,
0x59448fe20378357f206880c58068f095ae63d5a5,
0x36a85757645e8e8aec062a1dee289c7d615901ca
```
288,958.133685395914154691
288,955.832397811163442377


# Getting started
```
# copy the sample file and enter alchemy key
cp .env.example .env.local

```