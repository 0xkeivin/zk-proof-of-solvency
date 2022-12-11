import {MerkleTree} from 'merkletreejs';
import SHA256 from 'crypto-js/sha256'; // works!


const leaves = ['a','b','c','d'].map(x => SHA256(x));
const tree = new MerkleTree(leaves, SHA256);
const root = tree.getRoot().toString('hex');
const leaf = SHA256('a').toString();
const proof = tree.getProof(leaf);

console.log(`leave:${leaves.toString()}\n`);
console.log(`tree:${tree.toString()}\n`);
console.log(`root:${root.toString()}\n`);
console.log(`leaf:${leaf}\n`);
console.log(`proof:${JSON.stringify(proof)}`);
console.log(tree.verify(proof, leaf, root)); // true
