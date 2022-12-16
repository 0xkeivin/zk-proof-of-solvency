
import {
    Mina,
    isReady,
    shutdown,
    PrivateKey,
    Field,
    MerkleWitness,
    MerkleTree,
    AccountUpdate
} from 'snarkyjs'

//   import { LedgerContract } from './LedgerContract.js'
import { BasicMerkleTreeContract, UserAccount } from './BasicMerkleTreeContract.js'

// create an async function that inserts array of values into leafNodes
// of merkle tree
// then call this function in main
async function insertValuesIntoTree(deployerAccount: PrivateKey, basicTreeZkAppPrivateKey: PrivateKey, zkapp: BasicMerkleTreeContract, height: number, tree: MerkleTree, values: UserAccount[]) {
    // get class
    class MerkleWitness20 extends MerkleWitness(height) { }
    // for each value in values array
    for (const leafValue of values) {
        console.log(`DEBUG: leafValue: ${JSON.stringify(leafValue)}`)
        const leafIndex = values.indexOf(leafValue);
        console.log(`DEBUG: leafIndex: ${leafIndex}`)
        // insert value into leaf node
        const witness = new MerkleWitness20(tree.getWitness(BigInt(leafIndex)));
        console.log(`DEBUG: witness: ${JSON.stringify(witness)}`)
        const leafValHash = leafValue.hash();
        // console.log(`DEBUG: leafValue.hash(): ${leafValHash}`)
        tree.setLeaf(BigInt(leafIndex), leafValHash);
        // console.log(`DEBUG: BREAKPOINT 1`)


        const txn = await Mina.transaction(deployerAccount, () => {
            zkapp.updateRoot(
                // witness,
                //   Field.zero,
                // Field(0),
                leafValue.hash());
            zkapp.sign(basicTreeZkAppPrivateKey); // Todo ? 

        });
        await txn.send();

    }
}

// create function to check through all leaf nodes in merkle tree
// and check that they are equal to the values in the values array
async function checkLeafInclusion(zkapp: BasicMerkleTreeContract, height: number, tree: MerkleTree,
    // checkAddress: Field, checkSalt: Field, checkValue: Field) {
    checkAddress: string, checkSalt: number, checkValue: number) {
    console.log(`\n\nDEBUG: checkLeafInclusion()`)
    // get class
    class MerkleWitness20 extends MerkleWitness(height) { }
    // calculate leaves in tree
    const leaves = (2 ** height) / 2;
    // create range of values from 0 to leaves
    const values = Array.from(Array(leaves).keys());
    console.log(`DEBUG: values: ${JSON.stringify(values)}`)
    const userAccount = new UserAccount(
        // Field(checkAddress),
        // Field(checkSalt),
        // Field(checkValue),
        checkAddress,
        checkSalt,
        checkValue,
    )
    // for each value in values array
    for (const leafIndex in values) {
        console.log(`DEBUG: leafIndex: ${leafIndex}`);
        // const leafIndex = values.indexOf(leafValue);
        // get witness
        const witness = new MerkleWitness20(tree.getWitness(BigInt(leafIndex)));
        // const calculatedRoot = witness.calculateRoot(
        //     leafValue,
        // )
        const checkInclusionResult = zkapp.checkInclusion(
            userAccount,
            witness,
        )
        if (checkInclusionResult) {
            console.log(`DEBUG: Leaf included at index ${leafIndex} with value ${JSON.stringify(userAccount)}`);
            return
        }
    }
    console.log(`DEBUG: Leaf not included in tree with value ${JSON.stringify(userAccount)}`);
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
        // class MerkleWitness20 extends MerkleWitness(height) { }

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
        // const leafValArray = [Field(0), Field(1), Field(2), Field(3), Field(4), Field(5), Field(6), Field(7)];
        // create array of UserAccount objects
        // create array of UserAccount objects
        // const user1 = new UserAccount(
        //     Field("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"),
        //     Field("salt0"),
        //     Field(0)
        // );
        // console.log(`DEBUG: user1: ${user1}`);
        // create a string constant 

        const userAccountArray = [
            new UserAccount("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
                100,
                0),
            new UserAccount(
                "0xee564fd8992c055663a124db7c6aa8f63ef01af5",
                101,
                100),
            new UserAccount(
                "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43",
                102,
                200),
            new UserAccount(
                "0x6b36094c4b0108cc3d6f8ca05fb8878eff54a541",
                103,
                300),
            new UserAccount(
                "0x50b90054be990305fd1899e7dcd9bd98cf4b5b4a",
                104,
                400),
            new UserAccount(
                "0xd6a309f49cf79542cea91df7b334eb4bd29aa0d7",
                105,
                500),
            new UserAccount(
                "0x4305be04c4416152a880d319b85e4ccbdd267073",
                106,
                600),
            new UserAccount(
                "0xad3f1453667e44ce5f1c180c967a5310793f8013",
                107,
                700),
        ];


        console.log("\n")
        const publicKey0 = userAccountArray[0].publicKey;
        console.log(`DEBUG: publicKeyField: ${publicKey0} ${typeof (publicKey0)}`)
        const publicKey0BigInt = BigInt(publicKey0)
        console.log(`DEBUG: publicKeyField: ${publicKey0BigInt} ${typeof (publicKey0BigInt)}`)
        const publicKeyField = Field(publicKey0BigInt);
        console.log(`DEBUG: publicKeyField: ${publicKeyField}`)
        console.log("\n")


        console.log(`\nuserAccountArray: ${JSON.stringify(userAccountArray)}`);

        await insertValuesIntoTree(deployerAccount, basicTreeZkAppPrivateKey, zkapp, height, tree, userAccountArray);


        // const leafValArray = [Field(0), Field(1), Field(2), Field(3), Field(4), Field(5), Field(6), Field(7)];
        // console.log(`\nleafValArray: ${leafValArray}`);

        // --------------------------------------

        // check inclusion

        const checkUserAccount5 = new UserAccount(
            "0xd6a309f49cf79542cea91df7b334eb4bd29aa0d7",
            105,
            500);
        await checkLeafInclusion(
            zkapp,
            height,
            tree,
            checkUserAccount5.publicKey,
            checkUserAccount5.salt,
            checkUserAccount5.accountBalance,);
        // final tree 
        const finalTree = tree;
        console.log(`\ncheckUserAccount5: ${JSON.stringify(checkUserAccount5)}`);
        console.log(`\nfinalTree: ${JSON.stringify(finalTree)}`);


    }
    await shutdown();
}


main();