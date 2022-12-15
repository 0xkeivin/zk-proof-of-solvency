import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import type { BasicMerkleTreeContract } from "../../contracts/src/";
import {
  Mina,
  isReady,
  PublicKey,
  fetchAccount,
  setGraphqlEndpoint,
} from "snarkyjs";
import log from "loglevel";
import ZkappWorkerClient from "./zkappWorkerClient";

// set log level
log.setLevel("debug");
export default function Home() {
  // create useEffect hook to run code on page load
  useEffect(() => {
    // create async function to run code
    (async () => {
      // wait for snarkyjs to be ready
      const isSnarkyReady = await isReady;
      log.debug(`isSnarkyReady: ${isSnarkyReady}`);
      const graphqlEndpoint = "https://proxy.berkeley.minaexplorer.com/graphql";
      setGraphqlEndpoint(graphqlEndpoint);
      let Berkeley = Mina.Network(graphqlEndpoint);
      const setNetworkRes = Mina.setActiveInstance(Berkeley);
      log.info(`setNetworkRes: ${setNetworkRes}`);
      // load the contract
      const { BasicMerkleTreeContract } = await import(
        "../../contracts/build/src/"
      );
      const { Add } = await import("../../contracts/build/src/");
      // Fetch the account from Berkeley Testnet
      // Sample contract: B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
      // My deployed contract: B62qrRt1HpXupeJJef3GkRXKAoZi2iiajzJjxXJGtp8qqeNoQNm6g8Q
      const zkAppAddress =
        "B62qrRt1HpXupeJJef3GkRXKAoZi2iiajzJjxXJGtp8qqeNoQNm6g8Q";
      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        log.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
        );
      }
      let { account, error } = await fetchAccount({
        publicKey: PublicKey.fromBase58(zkAppAddress),
      });
      log.info(`zkApp JSON: ${JSON.stringify(account)}`);
      log.info(`zkApp state: ${JSON.stringify(account?.appState)}`);
      
      log.info(`error: ${error}`);
      // await Add.compile();
    })();
  }, []);

  return (
    <>
      <h1>Homepage served from index.page.tsx</h1>
    </>
  );
}
