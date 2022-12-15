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

import type { BasicMerkleTreeContract } from '../../contracts/src/BasicMerkleTreeContract';

const state = {
  BasicMerkleTreeContract: null as null | typeof BasicMerkleTreeContract,
  zkapp: null as null | BasicMerkleTreeContract,
  transaction: null as null | Transaction,
}

// ---------------------------------------------------------------------------------------

const functions = {
  
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.BerkeleyQANet(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { BasicMerkleTreeContract } = await import('../../contracts/build/src/BasicMerkleTreeContract.js');
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
  getTreeHeight: async (args: {}) => {
    const treeHeight = await state.zkapp!.treeHeight.get();
    return JSON.stringify(treeHeight.toJSON());
  },

  getTreeRoot: async (args: {}) => {
    const treeRoot = await state.zkapp!.treeRoot.get();
    return JSON.stringify(treeRoot.toJSON());
  },
  // createUpdateTransaction: async (args: {}) => {
  //   const transaction = await Mina.transaction(() => {
  //     state.zkapp!.update();
  //   }
  //   );
  //   state.transaction = transaction;
  // },
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