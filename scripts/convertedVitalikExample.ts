// converted from Vitalik's example code from https://github.com/ethereum/research/blob/master/proof_of_solvency/merkle_sum_tree.py

// import { SHA256 } from "crypto-ts";
import SHA256 from 'crypto-js/sha256'; // works!

import { Buffer } from "buffer";
function hash(a: any): any {
    return SHA256(a);
}

function log2(x: number): number {
    return x.toString(2).length - 1;
}

function get_next_power_of_2(x: number): number {
    // return 2 * getNextPowerOf2(Math.floor((x + 1) / 2)) if (x > 1) else 1;
    return (x > 1) ? 2 * get_next_power_of_2(Math.floor((x + 1) / 2)) : 1;
}

// Each user has a username and balance, and gets a salt generated
// This gets converted into a leaf, which does not reveal the username
// but does reveal the balance and salt
function userdata_to_leaf(username: string, salt: string, balance: number): Leaf {
    return {
        hash: hash(username + salt),
        balance: balance,
    }
    // return hash(username + salt + balance);
}
// create empty leaf
// const EMPTY_LEAF: [Buffer, number] = [Buffer.from('00', 'hex'), 0];

// create a type for an empty leaf
type Leaf = {
    hash: Buffer,
    balance: number,
};
const EMPTY_LEAF: Leaf = {
    hash: Buffer.from('00', 'hex'),
    balance: 0,
};
// print binary representation of empty leaf
// console.log(`EMPTY_LEAF:${EMPTY_LEAF[0]}\n`)

// The function for computing a parent node given two child nodes
function combine_tree_nodes(left: Leaf, right: Leaf): Leaf {
    // unpack the left and right nodes

    // const {L_hash, L_balance} = left;
    // const {R_hash, R_balance} = right;
    /// assert that values are greater than 0
    if (left.balance < 0 || right.balance < 0) {
        throw new Error("Leaf and right leaves cannot have negative balances");
    }
    // convert to bigints
    const L_balance = BigInt(left.balance).toString(16);
    const R_balance = BigInt(right.balance).toString(16);

    /// create a new node hash
    const new_node_hash: Buffer = hash(
        left.hash + L_balance + right.hash + R_balance
    );
    return {
        hash: new_node_hash,
        balance: left.balance + right.balance,
    };
}

// Builds a full Merkle tree. Stored in flattened form where
// node i is the parent of nodes 2i and 2i+1
function build_merkle_sum_tree(user_table: [string, string, number][]): Leaf[] {
    // create a list of leaves
    const leaves: Leaf[] = user_table.map((user) => {
        const [username, salt, balance] = user;
        // console.log(`username:${username}, salt:${salt}, balance:${balance}\n`)
        return userdata_to_leaf(username, salt, balance);
    });
    console.log(`leaves:${JSON.stringify(leaves)}\n`)
    // get the next power of 2
    const next_power_of_2 = get_next_power_of_2(leaves.length);
    console.log(`next_power_of_2:${next_power_of_2}\n`)
    // create a list of empty leaves
    const empty_leaves = Array(next_power_of_2 - leaves.length).fill(EMPTY_LEAF);
    // add the empty leaves to the list of leaves
    leaves.push(...empty_leaves);
    // create a list of nodes
    const nodes: Leaf[] = leaves;
    // get the height of the tree
    const height = log2(nodes.length);
    // loop through the tree
    for (let i = 0; i < height; i++) {
        // get the number of nodes at this level
        const num_nodes_at_level = nodes.length / 2;
        // loop through the nodes at this level
        for (let j = 0; j < num_nodes_at_level; j++) {
            // get the left and right nodes
            const left = nodes[2 * j];
            const right = nodes[2 * j + 1];
            // why undefined here?
            console.log(`left:${JSON.stringify(left)}, right:${JSON.stringify(right)}\n`)
            // combine the nodes
            const new_node = combine_tree_nodes(left, right);
            // add the new node to the list of nodes
            nodes.push(new_node);
        }
    }
    return nodes;
}

// Root of a tree is stored at index 1 in the flattened form
function get_root(nodes: Leaf[]): Leaf {
    return nodes[1];
}

// Gets a proof for a node at a particular index
function get_proof(nodes: Leaf[], index: number): Leaf[] {
    // get the height of the tree
    const height = log2(nodes.length);
    // create a list of nodes
    const proof: Leaf[] = [];
    // loop through the tree
    for (let i = 0; i < height; i++) {
        // get the sibling index
        const sibling_index = index ^ 1;
        // get the sibling node
        const sibling = nodes[sibling_index];
        // add the sibling node to the list of proof nodes
        proof.push(sibling);
        // update the index
        index = Math.floor(index / 2);
    }
    return proof;
}

// Verifies the proof 
function verifyProof(username: string, salt: string, balance: number, index: number, userTableSize: number, root: any, proof: any[]): boolean {
    let leaf = userdata_to_leaf(username, salt, balance);
    const branchLength = Math.log2(get_next_power_of_2(userTableSize)) - 1;
    for (let i = 0; i < branchLength; i++) {
        if (index & (2 ** i)) {
            leaf = combine_tree_nodes(proof[i], leaf);
        } else {
            leaf = combine_tree_nodes(leaf, proof[i]);
        }
    }
    return leaf === root;
}

// create a test function 

function test(): void {
    // create a user table
    const user_table: [string, string, number][] = [
        ["alice", "salt1", 100],
        ["bob", "salt2", 200],
        ["carol", "salt3", 300],
        ["dave", "salt4", 400],
    ];
    console.log(`user_table:${user_table}\n`)
    console.log(`user_table: len: ${user_table.length}\n`)
    // build the merkle sum tree
    const nodes = build_merkle_sum_tree(user_table);
    // print nodes

    // get the root
    const root = get_root(nodes);
    console.log(`root:${JSON.stringify(root)}\n`)
    // get the proof for the first user
    const proof = get_proof(nodes, 0);
    console.log(`proof:${JSON.stringify(proof)}\n`)
    // verify the proof
    const verified = verifyProof("alice", "salt1", 100, 0, user_table.length, root, proof);
    console.log(`verified: ${verified}\n`);
}

test();