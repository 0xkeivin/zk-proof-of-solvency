
import {
    Mina,
    isReady,
    shutdown,
    Bool,
    UInt32,
    UInt64,
    Int64,
    Character,
    CircuitString,
    PrivateKey,
    PublicKey,
    Signature,
    Poseidon,
    Field,
    CircuitValue,
    prop,
    arrayProp,
    Circuit,
    MerkleWitness,
    MerkleTree,
    AccountUpdate
} from 'snarkyjs'

//   import { LedgerContract } from './LedgerContract.js'
import { BasicMerkleTreeContract, UserAccount } from './BasicMerkleTreeContract.js'

// create an async function that inserts array of values into leafNodes
// of merkle tree
// then call this function in main
async function insertValuesIntoTree(deployerAccount: PrivateKey, basicTreeZkAppPrivateKey: PrivateKey, zkapp: BasicMerkleTreeContract, height: number, tree: MerkleTree, values: Field[]) {
    // get class
    class MerkleWitness20 extends MerkleWitness(height) { }

    // counter for leaf nodes
    let i = 0;
    // for each value in values array
    for (const leafValue of values) {
        const leafIndex = values.indexOf(leafValue);
        // insert value into leaf node
        const witness = new MerkleWitness20(tree.getWitness(BigInt(leafIndex)));
        tree.setLeaf(BigInt(leafIndex), leafValue);

        const txn = await Mina.transaction(deployerAccount, () => {
            zkapp.update(
                witness,
                //   Field.zero,
                Field(0),
                leafValue);
            zkapp.sign(basicTreeZkAppPrivateKey); // Todo ? 

        });
        await txn.send();

    }
}

// create function to check through all leaf nodes in merkle tree
// and check that they are equal to the values in the values array
async function checkLeafInclusion(zkapp: BasicMerkleTreeContract, height: number, tree: MerkleTree, checkValue: Field) {
    // get class
    class MerkleWitness20 extends MerkleWitness(height) { }
    // calculate leaves in tree
    const leaves = 2 ** height;
    // create range of values from 0 to leaves
    const values = Array.from(Array(leaves).keys());
    // for each value in values array
    for (const leafIndex in values) {
        console.log(`DEBUG: leafIndex: ${leafIndex}`);
        // const leafIndex = values.indexOf(leafValue);
        // get witness
        const witness = new MerkleWitness20(tree.getWitness(BigInt(leafIndex)));
        const userAccount = new UserAccount(
            Field(checkValue),
        )
        // const calculatedRoot = witness.calculateRoot(
        //     leafValue,
        // )
        const checkInclusionResult = zkapp.checkInclusion(
            userAccount,
            witness,
        )
        if (checkInclusionResult) {
            console.log(`DEBUG: Leaf included at index ${leafIndex} with value ${checkValue}`);
            return
        }
    }
    console.log(`DEBUG: Leaf not included in tree with value ${checkValue}`);
    return
}

async function main() {
    await isReady;
    console.log("SnarkyJS loaded");

    // --------------------------------------

    const Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    const deployerAccount = Local.testAccounts[0].privateKey;


    {

        const basicTreeZkAppPrivateKey = PrivateKey.random();
        const basicTreeZkAppAddress = basicTreeZkAppPrivateKey.toPublicKey();

        //   const height = 20;
        const height = 4; // 4 levels allows 8 leaf nodes in binary hash tree

        const tree = new MerkleTree(height);
        console.log(`New merkletree: ${JSON.stringify(tree)}`);
        class MerkleWitness20 extends MerkleWitness(height) { }

        const zkapp = new BasicMerkleTreeContract(basicTreeZkAppAddress);

        const deployTxn = await Mina.transaction(deployerAccount, () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            zkapp.deploy({ zkappKey: basicTreeZkAppPrivateKey });
            zkapp.initState(tree.getRoot());
            zkapp.sign(basicTreeZkAppPrivateKey);
        });
        await deployTxn.send();
        // get initial state of BasicMerkleTreeContract after deployment
        const num0 = zkapp.treeRoot.get();
        console.log("State after init 'treeRoot':", num0.toString());


        // --------------------------------------
        const leafValArray = [Field(0), Field(1), Field(2), Field(3), Field(4), Field(5), Field(6), Field(7)];
        console.log(`\nleafValArray: ${leafValArray}`);
        await insertValuesIntoTree(deployerAccount, basicTreeZkAppPrivateKey, zkapp, height, tree, leafValArray);

        // --------------------------------------

        // check inclusion
        const checkVal = Field(5)
        checkLeafInclusion(
            zkapp,
            height,
            tree,
            checkVal);
        // final tree 
        const finalTree = tree;
        console.log(`\nfinalTree: ${JSON.stringify(finalTree)}`);
        

    }
    await shutdown();
}


main();