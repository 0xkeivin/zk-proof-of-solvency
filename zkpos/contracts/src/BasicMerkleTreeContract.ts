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
  salt: Number,
  accountBalance: Number,
}) {
  constructor(publicKey: string, salt: number, accountBalance: number) {
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
    // muted for testing
    // incrementAmount.assertLt(Field(10));
    // console.log(`DEBUG:numberBefore: ${numberBefore.toString()}`)
    // check the initial state matches what we expect
    const rootBefore = leafWitness.calculateRoot(numberBefore);
    // console.log(`DEBUG:rootBefore: ${rootBefore.toString()}`)
    // dont need this ?
    // rootBefore.assertEquals(initialRoot);

    // compute the root after incrementing
    const rootAfter = leafWitness.calculateRoot(numberBefore.add(incrementAmount));
    // console.log(`DEBUG:rootAfter: ${rootAfter.toString()}`)
    // set the new root
    this.treeRoot.set(rootAfter);
  }
}


