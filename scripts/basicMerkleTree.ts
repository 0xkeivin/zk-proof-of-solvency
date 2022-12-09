import { SHA256 } from 'crypto-ts';

function createMerkleTree(data: any[]): any[] {
    // logging
    console.log(`data:${data}`)
    // If the input data array has only one element, return it as the root of the tree
    if (data.length === 1) {
        return data;
    }

    // Create an empty array to store the hash values for the current level of the tree
    const levelHashes: any[] = [];

    // Iterate through the data array in pairs, hashing each pair and adding the hash to the levelHashes array
    for (let i = 0; i < data.length; i += 2) {
        const left = data[i];
        const right = data[i + 1];
        /// following returns WordArray 
        // const hash = hashPair(left, right);
        // levelHashes.push(hash);
        /// add original data values to levelHashes array
        levelHashes.push([left, right]);
    }

    // If there is an odd number of elements in the data array, the last element will not have a pair
    // In this case, add the last element as is to the levelHashes array
    if (data.length % 2 === 1) {
        levelHashes.push(data[data.length - 1]);
    }

    // Recursively call createMerkleTree with the levelHashes array to create the next level of the tree
    // console.log(`levelHashes:${levelHashes}`)
    return createMerkleTree(levelHashes);
}

// This helper function takes two input values and returns a hash of the concatenated values
function hashPair(left: any, right: any): any {
    const val = SHA256(left + right);
    console.log(`hashedVal:${val}`)
    return val;
}

// Helper function to recursively traverse the tree and print out value of each node 
function printMerkleTree(node: any, level = 0) {
    // Print the current node value, indenting it according to the current tree level
    console.log('  '.repeat(level) + node);
    console.log(`level:${level}`)
    // if current node is array, recursively call printMerkleTree on each element of the array
    if (Array.isArray(node)) {
        for (const child of node) {
            printMerkleTree(child, level + 1)
        }
    }
}


// Create a root hash for the tree
const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const root = createMerkleTree(data);
printMerkleTree(root);
