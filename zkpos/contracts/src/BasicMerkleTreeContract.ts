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


export class UserAccount extends Struct({
  // publicKey: PublicKey,
  accountBalance: Field,
}) {
  constructor(accountBalance: Field) {
    super({ accountBalance });
    // this.publicKey = publicKey;
    this.accountBalance = accountBalance;
  }
  hash(): Field {
    return Poseidon.hash([this.accountBalance]);
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
    console.log("\n")
    console.log(`root: ${root.toString()}`)
    // check if value is within committed merkle tree
    path.calculateRoot(userAccountVal.accountBalance).assertEquals(root);
    return true;
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


