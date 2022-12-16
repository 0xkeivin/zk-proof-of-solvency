import {
  fetchAccount,
  PublicKey,
  PrivateKey,
  Field,
  MerkleWitness
} from 'snarkyjs'

import type { ZkappWorkerRequest, ZkappWorkerReponse, WorkerFunctions } from './zkappWorker';
import { UserAccount } from '../utils/merkleTree';

class MerkleWitness20 extends MerkleWitness(4) { }
export default class ZkappWorkerClient {

  // ---------------------------------------------------------------------------------------

  loadSnarkyJS() {
    return this._call('loadSnarkyJS', {});
  }

  setActiveInstanceToBerkeley() {
    return this._call('setActiveInstanceToBerkeley', {});
  }

  // getNum() {
  //   return this._call('getNum', {});
  // }
  getTreeHeight() {
    return this._call('getTreeHeight', {});
  }

  getTreeRoot() {
    return this._call('getTreeRoot', {});
  }
  loadContract() {
    return this._call('loadContract', {});
  }

  compileContract() {
    return this._call('compileContract', {});
  }

  fetchAccount({ publicKey }: { publicKey: PublicKey }): ReturnType<typeof fetchAccount> {
    const result = this._call('fetchAccount', { publicKey58: publicKey.toBase58() });
    return (result as ReturnType<typeof fetchAccount>);
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call("initZkappInstance", {
      publicKey58: publicKey.toBase58(),
    });
  }

  // async getNum(): Promise<Field> {
  //   const result = await this._call('getNum', {});
  //   return Field.fromJSON(JSON.parse(result as string));
  // }

  createUpdateTransaction(
    // leafWitness: MerkleWitness20,
    // previousVal: Field,
    updatedVal: Field,
  ) {
    return this._call('createUpdateTransaction', {
      // leafWitness,
      // previousVal,
      updatedVal,
    });
  }
  checkInclusion(
    userAccountVal: UserAccount,
    path: MerkleWitness20
  ) {
    return this._call('checkInclusion', {
      // leafWitness,
      // previousVal,
      userAccountVal,
      path
    });
  }

  proveUpdateTransaction() {
    return this._call('proveUpdateTransaction', {});
  }

  async getTransactionJSON() {
    const result = await this._call('getTransactionJSON', {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: { [id: number]: { resolve: (res: any) => void, reject: (err: any) => void } };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zkappWorker.ts', import.meta.url))
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject }

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
