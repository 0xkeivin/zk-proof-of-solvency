import {MerkleTree} from 'merkletreejs';
import SHA256 from 'crypto-js/sha256'; // works!

const leaves = ['a','b','c','d','e','f','g'].map(x => SHA256(x));
const tree = new MerkleTree(leaves, SHA256);


const getleaves = tree.getLeaves()
const root = tree.getRoot()
const treeFlat = tree.getLayersFlat()
const leavesCount = leaves.length
const proofIndices = [2, 5, 6]
console.log(`proofIndices:${proofIndices}\n`);

const proofLeaves = proofIndices.map(i => leaves[i].toString())
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
