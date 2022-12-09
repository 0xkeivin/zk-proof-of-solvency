import { MerkleTree } from 'merkletreejs'
import { SHA256 } from 'crypto-ts'

const leaves = ['a', 'b', 'c', 'd'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
const root = tree.getRoot().toString('hex')
const leaf = SHA256('a')
const proof = tree.getProof(leaf)
const verify = tree.verify(proof, leaf, root)
// logging
console.log(tree.toString())
console.log(`leaves:${leaves.toString()}`)
console.log(`root:${root.toString()}`)
console.log(`leaf:${leaf}`)
console.log(`proof:${proof}`)
console.log(`verify:${verify}`)