import {MerkleTree} from 'merkletreejs';
import SHA256 from 'crypto-js/sha256'; // works!

const leaves = ['a','b','c','d'].map(x => SHA256(x));
const tree = new MerkleTree(leaves, SHA256);
const root = tree.getRoot().toString('hex');
const leaf = SHA256('d').toString();


// inclusion proof
const leafProof = tree.getProof(leaf);

const verifyWordArray = tree.verify(leafProof, leaf, root);

console.log(`leafProof:${JSON.stringify(leafProof)}`)
console.log(`leaf:${leaf}`)
console.log(`root:${root}`)
console.log(`verifyWordArray:${verifyWordArray}`);
console.log("\n")
console.log(`tree:${tree.toString()}\n`);
