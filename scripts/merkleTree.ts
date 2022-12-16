import {MerkleTree} from 'merkletreejs';
import SHA256 from 'crypto-js/sha256'; // works!

const leaves = ['a','b','c','d'].map(x => SHA256(x));
const tree = new MerkleTree(leaves, SHA256);
const treeFlat = tree.getLayersFlat()
const root = tree.getRoot().toString('hex');
const leaf = SHA256('a').toString();
const proof = tree.getProof(leaf);

// summation of leaves
const hash1 = SHA256('a');
const hash2 = SHA256('b');
const concatHashes = hash1;
concatHashes.concat(hash2);
// create a new CryptoJS.lib.WordArray



// const sumAB = SHA256("ab")  ;
const wordArray1 = SHA256(concatHashes);
// check if concatHashes is included in leaves
const wordArrayProof = tree.getProof(concatHashes.toString());
const verifyWordArray = tree.verify(wordArrayProof, concatHashes.toString(), root);

console.log("\n")
console.log(`wordArrayProof:${JSON.stringify(wordArrayProof)}`)
console.log(`verifyWordArray:${verifyWordArray}`);
console.log("\n")

console.log(`hash1:${hash1}\n`);
console.log(`hash2:${hash2}\n`);
console.log(`concatHashes:${concatHashes}\n`);
console.log(`wordArray1:${wordArray1}\n\n`);

// console.log(`leave:${leaves.toString()}\n`);
console.log(`tree:${tree.toString()}\n`);
console.log(`treeFlat:${treeFlat}\n`);
// console.log(`root:${root.toString()}\n`);
// console.log(`leaf:${leaf}\n`);
// console.log(`proof:${JSON.stringify(proof)}`);
// console.log(tree.verify(proof, leaf, root)); // true

// visualize merkletree


