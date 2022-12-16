import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
  MerkleWitness
} from 'snarkyjs'
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------
import { UserAccount } from '../utils/merkleTree';
import type { BasicMerkleTreeContract } from '../../contracts/src/BasicMerkleTreeContract';
// import type { Add } from "../../contracts/src/Add"; 
const state = {
  // BasicMerkleTreeContract: null as null | typeof BasicMerkleTreeContract,
  BasicMerkleTreeContract: null as null | typeof BasicMerkleTreeContract,
  zkapp: null as null | BasicMerkleTreeContract,
  transaction: null as null | Transaction,
}

// ---------------------------------------------------------------------------------------
class MerkleWitness20 extends MerkleWitness(4) { }

const functions = {

  loadSnarkyJS: async (args: {}) => {
    console.log("loadSnarkyJS() called")
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    console.log("setActiveInstanceToBerkeley")
    const Berkeley = Mina.Network(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { BasicMerkleTreeContract } = await import("../../contracts/build/src/BasicMerkleTreeContract.js");
    state.BasicMerkleTreeContract = BasicMerkleTreeContract;
  },
  compileContract: async (args: {}) => {
    await state.BasicMerkleTreeContract!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    // state.zkapp = new state.BasicMerkleTreeContract!(publicKey);
    state.zkapp = new state.BasicMerkleTreeContract!(publicKey);

  },
  // Get value 
  // getNum: async (args: {}) => {
  //   const value = await state.zkapp!.num.get();
  //   return JSON.stringify(value.toJSON());
  // },
  getTreeHeight: async (args: {}) => {
    const treeHeight = await state.zkapp!.treeHeight.get();
    return JSON.stringify(treeHeight.toJSON());
  },

  getTreeRoot: async (args: {}) => {
    const treeRoot = await state.zkapp!.treeRoot.get();
    return JSON.stringify(treeRoot.toJSON());
  },
  createUpdateTransaction: async (args: {
    // leafWitness: MerkleWitness20,
    // previousVal: Field,
    updatedVal: Field,
  }) => {
    console.log("createUpdateTransaction() called")
    console.log(`state: ${state.transaction?.toJSON()}`)
    // get hash of inclusion proof
    
    const transaction = await Mina.transaction(() => {
      state.zkapp!.updateRoot(
        // args.leafWitness,
        // args.previousVal,
        args.updatedVal,
      );
    }
    );
    state.transaction = transaction;
  },
  checkInclusion: async (args: {
    userAccountVal: UserAccount,
    path: MerkleWitness20
  }) => {
    console.log("checkInclusion() called")
    console.log(`state: ${state.transaction?.toJSON()}`)
    const transaction = await Mina.transaction(() => {
      state.zkapp!.checkInclusion(
        args.userAccountVal,
        args.path
      );
    }
    );
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number,
  fn: WorkerFunctions,
  args: any
}

export type ZkappWorkerReponse = {
  id: number,
  data: any
}
if (process.browser) {
  addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
      id: event.data.id,
      data: returnData,
    }
    postMessage(message)
  });
}