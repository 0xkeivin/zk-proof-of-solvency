import { useEffect, useState, useRef } from "react";
import type { BasicMerkleTreeContract } from "../../contracts/src/";
import {
  Mina,
  isReady,
  PublicKey,
  fetchAccount,
  setGraphqlEndpoint,
  Field
} from "snarkyjs";
import log from "loglevel";
import ZkappWorkerClient from "./zkappWorkerClient";
import {
  Card,
  ChakraProvider,
  CardBody,
  HStack,
  Heading,
  Link,
  Stack,
  Spacer,
  Text,
  CardHeader,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import StateCard from "../components/StateCard";
import { shortenAddress } from "../utils/shortenAddress";
import { updateAddContract, onSendTransaction } from "../utils/updateAddContract";

// set log level
log.setLevel("debug");

let transactionFee = 0.1;

export default function Home() {
  const [accountState, setAccountState] = useState<String | undefined>("");
  const [transactionRes, setTransactionRes] = useState<String | undefined>("");
  const minaNetwork = useRef(Mina);
  const [zkAppPublicKey, setZkAppPublicKey] = useState<PublicKey>();
  
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });
  
  // Fetch the account from Berkeley Testnet
  // Sample contract: B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
  // My deployed contract: B62qrRt1HpXupeJJef3GkRXKAoZi2iiajzJjxXJGtp8qqeNoQNm6g8Q
  const zkAppAddress =
    "B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV";
    // create useEffect hook to run code on page load
  // useEffect(() => {
  //   // create async function to run code
  //   (async () => {
  //     // wait for snarkyjs to be ready
  //     const isSnarkyReady = await isReady;
  //     log.debug(`isSnarkyReady: ${isSnarkyReady}`);
  //     setZkAppPublicKey( PublicKey.fromBase58(zkAppAddress));
  //     const graphqlEndpoint = "https://proxy.berkeley.minaexplorer.com/graphql";
  //     setGraphqlEndpoint(graphqlEndpoint);
  //     let Berkeley = minaNetwork.current.Network(graphqlEndpoint);
  //     const setNetworkRes = minaNetwork.current.setActiveInstance(Berkeley);
  //     log.info(`setNetworkRes: ${setNetworkRes}`);
  //     // load the contract
  //     const { BasicMerkleTreeContract } = await import(
  //       "../../contracts/build/src/"
  //     );
  //     const { Add } = await import("../../contracts/build/src/");

  //     // This should be removed once the zkAppAddress is updated.
  //     if (!zkAppAddress) {
  //       log.error(
  //         'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
  //       );
  //     }
  //     // log.info(`zkApp JSON: ${JSON.stringify(account)}`);
  //     // log.info(`zkApp state: ${JSON.stringify(account?.appState)}`);

  //     // log.info(`error: ${error}`);
  //     // await Add.compile();
  //   })();
  // }, []);

  // --- copied from tutorial
  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();
        
        console.log('Loading SnarkyJS...');
        await zkappWorkerClient.loadSnarkyJS();
        console.log('done');

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58 : string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log('using key', publicKey.toBase58());

        console.log('checking if account exists...');
        const res = await zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log('compiling zkApp');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');

        // demo with deployed contract
        // const zkappPublicKey = PublicKey.fromBase58('B62qph2VodgSo5NKn9gZta5BHNxppgZMDUihf1g7mXreL4uPJFXDGDA');
        // test with own deployed contract 
        // const zkappPublicKey = PublicKey.fromBase58('B62qrrHaYLmHvCCa9qoMgYB8ZjZM8VmZUvUQp6EdYT3TqBybePF2qR8');
        const zkappPublicKey = PublicKey.fromBase58(zkAppAddress);

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey })
        const currentNum = await zkappWorkerClient.getNum() as Field;
        console.log('current state:', currentNum?.toString());

        setState({ 
            ...state, 
            zkappWorkerClient, 
            hasWallet: true,
            hasBeenSetup: true, 
            publicKey, 
            zkappPublicKey, 
            accountExists, 
            currentNum
        });
      }
    })();
  }, []);
  

    // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          console.log('checking if account exists...');
          const res = await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! })
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);
  // create button click handler
  // TODO: Fix this
  const getStateHandler = async () => {
    log.info("getStateHandler: Clicked");
    const { account } = await fetchAccount({
      // publicKey: zkAppPublicKey!,
      publicKey: state.zkappPublicKey!,

    });
    log.debug(`account: ${JSON.stringify(account)}`);
    const accState = account?.appState?.toString();
    if (accState) {
      setAccountState(accState);
    }
  };
  // create button click handler
  const setStateHandler = async () => {
    log.info("setStateHandler: Clicked");
    // const updateAddContractRes = await updateAddContract(
    //   minaNetwork.current,
    //   zkAppAddress
    // );

    // if (updateAddContractRes) {
    //   setTransactionRes(updateAddContractRes);
    // }
    // log.info(`updateAddContractRes: ${updateAddContractRes}`);
    const onSendTransactionRes = await onSendTransaction(
      state.zkappPublicKey!,
      // zkAppPublicKey!,
    )
    if (onSendTransactionRes) {
      setTransactionRes(JSON.stringify(onSendTransactionRes));
    }
    log.info(`updateAddContractRes: ${onSendTransactionRes}`);
  };
  return (
    <>
      <ChakraProvider>
        <Card align="center">
          <CardHeader>
            <Heading>zkProof of Solvency</Heading>
          </CardHeader>
        </Card>
        <Stack align="center">
          <Spacer p="4" />
          <HStack>
            <Card width="md" bg="gray.200">
              <CardBody>
                <HStack>
                  <Text as="b">zkApp Address: </Text>
                  <Link
                    href={
                      "https://berkeley.minaexplorer.com/wallet/" + zkAppAddress
                    }
                    isExternal
                  >
                    {shortenAddress(zkAppAddress)} <ExternalLinkIcon mx="2px" />
                  </Link>
                </HStack>
              </CardBody>
            </Card>
          </HStack>
          <Spacer p="1" />
          <StateCard buttonName="Get State (Auto Refreshes)" clickHandler={getStateHandler}>
            {state.currentNum?.toString()}
          </StateCard>
          <Spacer p="1" />
          <StateCard buttonName="Update State" clickHandler={setStateHandler}>
            {JSON.stringify(transactionRes)}
          </StateCard>
        </Stack>
      </ChakraProvider>
    </>
  );
}
