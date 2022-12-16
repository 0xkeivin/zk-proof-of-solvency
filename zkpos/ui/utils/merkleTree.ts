import {
    MerkleTree,
    Field,
    MerkleWitness,
    Poseidon,
    Struct
} from 'snarkyjs'
// import { UserAccount } from '../../contracts/src/BasicMerkleTreeContract'
// UserAccount interface
// export interface UserAccount {
//     publicKey: string;
//     balance: number;
//     salt: number;
// }

export class UserAccount extends Struct  ({
    publicKey: String,
    salt: Number,
    accountBalance: BigInt,
  }) {
    constructor(publicKey: string, salt: number, accountBalance:  bigint) {
      super({ publicKey, salt, accountBalance });
      this.publicKey = publicKey;
      this.salt = salt;
      this.accountBalance = accountBalance;
    }
    // 
    hash(): Field {
      const publicKeyField = Field(BigInt(this.publicKey));
      const saltField = Field(this.salt);
      const accountBalanceField = Field(this.accountBalance);
      // console.log(`DEBUG:publicKeyField: ${publicKeyField.toString()}`)
      // console.log(`DEBUG:accountBalanceField: ${accountBalanceField.toString()}`)
      // console.log(`DEBUG:saltField: ${saltField.toString()}`)
  
      // return Poseidon.hash([saltField, accountBalanceField].flat()
      return Poseidon.hash(
        [
          publicKeyField,
          saltField,
          accountBalanceField,
  
        ]
      )
    }
  }

// creates a tree 
export const createTree = (height: number, accounts: any[]): MerkleTree => {
    const tree = new MerkleTree(height);
    // get class
    class MerkleWitness20 extends MerkleWitness(height) { }
    // for each value in values array
    for (const leafValue of accounts) {
        console.log(`DEBUG: leafValue: ${JSON.stringify(leafValue)}`)
        const leafIndex = accounts.indexOf(leafValue);
        console.log(`DEBUG: leafIndex: ${leafIndex}`)
        // insert value into leaf node
        const witness = new MerkleWitness20(tree.getWitness(BigInt(leafIndex)));
        // console.log(`DEBUG: witness: ${JSON.stringify(witness)}`)
        const leafValHash = leafValue.hash();
        // console.log(`DEBUG: leafValue.hash(): ${leafValHash}`)
        tree.setLeaf(BigInt(leafIndex), leafValHash);
        // console.log(`DEBUG: BREAKPOINT 1`)
        

        // const txn = await Mina.transaction(deployerAccount, () => {
        //     zkapp.update(
        //         witness,
        //         //   Field.zero,
        //         Field(0),
        //         leafValue.hash());
        //     zkapp.sign(basicTreeZkAppPrivateKey); // Todo ? 

        // });
        // await txn.send();

    }
    // const treeRoot = tree.getRoot();
    // console.log(`DEBUG: treeRoot: ${treeRoot}`)
    return tree;
}

// // create function to check inclusion proof
// export const checkInclusionProof = (tree: MerkleTree, leafValue: any, leafIndex: number, userAccount: UserAccount): boolean => {
//     // get class
//     class MerkleWitness20 extends MerkleWitness(4) { }
//     // create witness
//     const witness = new MerkleWitness20(tree.getWitness(BigInt(leafIndex)));
//     // get leaf value hash
//     const leafValHash = leafValue.hash();
//     // check inclusion proof
//     return tree.checkInclusionProof(
//         userAccount.publicKey,
//         userAccount.salt,
//         userAccount.accountBalance
//     );

// }