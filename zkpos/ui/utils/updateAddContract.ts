import {
    Mina,
    PublicKey,
    DeployArgs,
    MerkleWitness,
    Field
} from 'snarkyjs';
// create a function that updates the state of contract
import ZkappWorkerClient from '../pages/zkappWorkerClient';
import type { Add } from '../../contracts/src/Add';
import getISOTime from './getISOTime';
class MerkleWitness20 extends MerkleWitness(4) { }

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

const state = {
    Add: null as null | typeof Add,
    zkapp: null as null | Add,
    transaction: null as null | Transaction,
}
export const updateAddContract = async (
    Mina: any,
    publicKey58: string,
) => {
    // load contract 
    const { Add } = await import('../../contracts/build/src/Add.js');
    state.Add = Add;
    await state.Add!.compile();
    // init zkapp instance
    const publicKey = PublicKey.fromBase58(publicKey58);
    state.zkapp = new state.Add!(publicKey);
    // create an update transaction
    const transaction = await Mina.transaction(() => {
        state.zkapp!.update();
    }
    );
    state.transaction = transaction;
    console.log("transaction", transaction);
    return transaction;
}

// -------------------------------------------------------
// Send a transaction

export const onSendTransaction = async (zkAppPublicKey: PublicKey,
    // leafWitness: MerkleWitness20,
    // previousVal: Field,
    updatedVal: Field,
) => {
    const zkappWorkerClient = new ZkappWorkerClient();
    const transactionFee = 0.1;
    await zkappWorkerClient.loadSnarkyJS();
    await zkappWorkerClient.setActiveInstanceToBerkeley();
    // setState({ ...state, creatingTransaction: true });
    await zkappWorkerClient.loadContract();

    console.log(`${getISOTime()} - compiling zkApp`);
    await zkappWorkerClient.compileContract();
    console.log(`${getISOTime()} - zkApp compiled`);
    // await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! });
    // const publicKey = PublicKey.fromBase58(publicKey58);
    console.log("zkAppPublicKey", zkAppPublicKey);
    await zkappWorkerClient.initZkappInstance(zkAppPublicKey);
    console.log('getting zkApp state...');
    // await state.zkappWorkerClient!.fetchAccount({ publicKey: publicKey });
    await zkappWorkerClient!.fetchAccount({ publicKey: zkAppPublicKey });

    // await state.zkappWorkerClient!.createUpdateTransaction();
    await zkappWorkerClient!.createUpdateTransaction(
        // leafWitness,
        // previousVal,
        updatedVal,
    );

    
    console.log(`${getISOTime()} - creating proof...`);
    // await state.zkappWorkerClient!.proveUpdateTransaction();
    await zkappWorkerClient!.proveUpdateTransaction();

    console.log(`${getISOTime()} - getting Transaction JSON...`);
    const transactionJSON = await zkappWorkerClient!.getTransactionJSON()

    console.log('requesting send transaction...');
    const { hash } = await (window as any).mina.sendTransaction({
        transaction: transactionJSON,
        feePayer: {
            fee: transactionFee,
            memo: '',
        },
    });
    const message = `Transaction sent! See transaction at https://berkeley.minaexplorer.com/transaction/${hash}`;
    console.log(
        message
    );
    // return transactionJSON
    return hash

    // setState({ ...state, creatingTransaction: false });
}