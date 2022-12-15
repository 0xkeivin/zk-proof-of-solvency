import {
    Mina,
    PublicKey,
    DeployArgs
} from 'snarkyjs';
// create a function that updates the state of contract

import type { Add } from '../../contracts/src/Add';
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
