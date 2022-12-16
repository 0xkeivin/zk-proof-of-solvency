import {
    MerkleTree,
    Field,
    MerkleWitness,
} from 'snarkyjs'
import { UserAccount } from '../../contracts/build/src/BasicMerkleTreeContract'
// UserAccount interface
// export interface UserAccount {
//     publicKey: string;
//     balance: number;
//     salt: number;
// }

// creates a tree 
export const createTree = (height: number, accounts: UserAccount[]): MerkleTree => {
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