import {MerkleTree} from 'merkletreejs';
import SHA256 from 'crypto-js/sha256'; // works!

const leaves = ['a','b','c','d','e','f','g'].map(x => SHA256(x));
const tree = new MerkleTree(leaves, SHA256);


const getleaves = tree.getLeaves()
const root = tree.getRoot()
const treeFlat = tree.getLayersFlat()
const leavesCount = leaves.length

const proofLeaves = ['c','f','g'].map(x => SHA256(x).toString());
const proofIndices = [2, 5, 6]
// convert proofLeaves to type string[]
const proof = tree.getMultiProof(treeFlat, proofIndices)
const verified = tree.verifyMultiProof(root, proofIndices, proofLeaves, leavesCount, proof)

console.log(`leaves:${leaves}\n`);
// console.log(`getleaves:${getleaves}\n`);
// console.log(`root:${root}\n`);
// console.log(`treeFlat:${treeFlat.toString()}\n`);
console.log(`leavesCount:${leavesCount}\n`);
console.log(`proofIndices:${proofIndices}\n`);
console.log(`proofLeaves:${proofLeaves}\n`);
// console.log(`proof:${proof.toString()}\n`);
console.log(`verified:${verified}\n`);


// custom 
// manual
// proofLeaves:2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6,252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111,cd0aa9856147b6c5b4ff2b7dfee5da20aa38253099ef1b4a64aced233c9afe29
// proofLeaves:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb,2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6,cd0aa9856147b6c5b4ff2b7dfee5da20aa38253099ef1b4a64aced233c9afe29