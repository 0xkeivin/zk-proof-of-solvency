// converted from Vitalik's example code from https://github.com/ethereum/research/blob/master/proof_of_solvency/merkle_sum_tree.py

import { SHA256 } from "crypto-ts";
import {Buffer} from "buffer";
import { assert } from "console";
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
function userdata_to_leaf(username:string, salt:string, balance:number): any {
    return hash(username + salt + balance);
}
// create empty leaf
// const EMPTY_LEAF: [Buffer, number] = [Buffer.from('00', 'hex'), 0];

// create a type for an empty leaf
type EmptyLeaf = {
    value: Buffer,
    balance: number,
};
const EMPTY_LEAF: EmptyLeaf = {
    value: Buffer.from('00', 'hex'),
    balance: 0,
  };
// print binary representation of empty leaf
console.log(`EMPTY_LEAF:${EMPTY_LEAF[0]}`)

// The function for computing a parent node given two child nodes
function combine_tree_nodes(left: EmptyLeaf, right: EmptyLeaf): any {
    // unpack the left and right nodes
    
    // const {L_hash, L_balance} = left;
    // const {R_hash, R_balance} = right;
    // assert that values are greater than 0
    assert(left.balance >= 0);
    assert(right.balance >= 0);
    // create a new node hash
    const new_node_hash = hash(
        L_hash + L_balance
    );
}