import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  MerkleWitness,
  MerkleTree,
  Poseidon,
  PublicKey,
  Signature,
  Circuit,
  Struct,
  Bool,
  UInt32,
} from 'snarkyjs';
import { Witness } from 'snarkyjs/dist/node/lib/merkle_tree';

// create a class that accepts tuple of 3 fields
// and returns a hash of the tuple

export class UserAccount extends Struct({
  // publicKey: Field,
  // salt: Field,
  // accountBalance: Field,
  publicKey: String,
  salt: String,
  accountBalance: Number,
}) {
  constructor(publicKey: string, salt: string, accountBalance: number) {
    super({ publicKey, salt, accountBalance });
    this.publicKey = publicKey;
    this.salt = salt;
    this.accountBalance = accountBalance;
  }
  hash(): Field {
    const publicKeyField = Field(this.publicKey);
    const saltField = Field(this.salt);
    const accountBalanceField = Field(this.accountBalance);
    
    return Poseidon.hash([
      // publicKeyField,
      // saltField,
      accountBalanceField,
      // Field(this.publicKey), 
      // Field(this.salt), 
      // Field(this.accountBalance)
    ]);
  }
}

class MerkleWitness20 extends MerkleWitness(4) { }

export class BasicMerkleTreeContract extends SmartContract {
  @state(Field) treeRoot = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method initState(initialRoot: Field) {
    this.treeRoot.set(initialRoot);

  }

  @method checkInclusion(
    userAccountVal: UserAccount,
    path: MerkleWitness20
  ) {
    // fetch on-chain root commitment
    const root = this.treeRoot.get();
    this.treeRoot.assertEquals(root);
    // check if value is within committed merkle tree
    // const calculatedRoot = path.calculateRoot(userAccountVal.accountBalance);
    const calculatedRoot = path.calculateRoot(userAccountVal.hash());

    if (calculatedRoot.toString() === root.toString()) {
      // console.log(`DEBUG:calculatedRoot: ${calculatedRoot.toString()}`)
      // console.log(`DEBUG:userAccountVal: ${JSON.stringify(userAccountVal)}`)
      return true
    } else {
      // console.log("DEBUG: NOT MATCHING")
      return false
    }
    // path.calculateRoot(userAccountVal.accountBalance).assertEquals(root);
    // return true;
  }


  @method update(
    leafWitness: MerkleWitness20,
    numberBefore: Field,
    incrementAmount: Field,
  ) {
    const initialRoot = this.treeRoot.get();
    this.treeRoot.assertEquals(initialRoot);

    incrementAmount.assertLt(Field(10));

    // check the initial state matches what we expect
    const rootBefore = leafWitness.calculateRoot(numberBefore);
    rootBefore.assertEquals(initialRoot);

    // compute the root after incrementing
    const rootAfter = leafWitness.calculateRoot(numberBefore.add(incrementAmount));

    // set the new root
    this.treeRoot.set(rootAfter);
  }
}


