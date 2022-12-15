import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
} from 'snarkyjs'
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

// import type { BasicMerkleTreeContract } from '../../contracts/src/BasicMerkleTreeContract';
import type { Add } from "../../contracts/src/Add"; const state = {
  // BasicMerkleTreeContract: null as null | typeof BasicMerkleTreeContract,
  Add: null as null | typeof Add,
  zkapp: null as null | Add,
  transaction: null as null | Transaction,
}

// ---------------------------------------------------------------------------------------

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
    const { Add } = await import("../../contracts/build/src/Add.js");
    state.Add = Add;
  },
  compileContract: async (args: {}) => {
    await state.Add!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    // state.zkapp = new state.BasicMerkleTreeContract!(publicKey);
    state.zkapp = new state.Add!(publicKey);

  },
  // Get value 
  getNum: async (args: {}) => {
    const value = await state.zkapp!.num.get();
    return JSON.stringify(value.toJSON());
  },
  // getTreeHeight: async (args: {}) => {
  //   const treeHeight = await state.zkapp!.treeHeight.get();
  //   return JSON.stringify(treeHeight.toJSON());
  // },

  // getTreeRoot: async (args: {}) => {
  //   const treeRoot = await state.zkapp!.treeRoot.get();
  //   return JSON.stringify(treeRoot.toJSON());
  // },
  createUpdateTransaction: async (args: {}) => {
    console.log("createUpdateTransaction() called")
    console.log(`state: ${state.transaction?.toJSON()}`)
    const transaction = await Mina.transaction(() => {
      state.zkapp!.update();
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