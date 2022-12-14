import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  MerkleWitness,
  Poseidon,
  Struct,
  Circuit,
  Bool
} from 'snarkyjs';
import type { } from 'snarkyjs/dist/node/snarky'
import type { } from 'snarkyjs/dist/node/lib/merkle_tree'

// create a class that accepts tuple of 3 fields
// and returns a hash of the tuple

//@ts-ignore
export class UserAccount extends Struct  ({
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
  @state(Field) treeHeight = State<Field>();
  @state(Field) treeRoot = State<Field>();
  
  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
    // hardcoded for now
    this.treeHeight.set(Field(4));
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

    return Circuit.if( calculatedRoot.equals(root),Bool(true), Bool(false) )

  }


  @method updateRoot(
    updatedVal: Field,
  ) {
    const initialRoot = this.treeRoot.get();
    this.treeRoot.assertEquals(initialRoot);
    // update root
    this.treeRoot.set(updatedVal);
  }
}


