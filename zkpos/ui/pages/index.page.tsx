import { useEffect, useState, useRef } from "react";
import type { BasicMerkleTreeContract } from "../../contracts/src/";
import { Mina, PublicKey, Field } from "snarkyjs";
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
import {
  updateAddContract,
  onSendTransaction,
} from "../utils/updateAddContract";
import { createTree, UserAccount } from "../utils/merkleTree";
// import { UserAccount } from '../../contracts/build/src/BasicMerkleTreeContract'
// import { UserAccount } from "../../contracts/src/BasicMerkleTreeContract";

// set log level
log.setLevel("debug");

let transactionFee = 0.1;
// create a type
// type UserAccount = {
//   publicKey: String;
//   salt: Number;
//   accountBalance: Number;
// };
// interface IUserAccount {
//   publicKey: String;
//   salt: Number;
//   accountBalance: Number;
// }
export default function Home() {
  const [currentNum, setCurrentNum] = useState<String | undefined>();
  const [transactionRes, setTransactionRes] = useState<String | undefined>("");
  const [publicKey, setPublicKey] = useState<String | undefined>();
  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  // Fetch the account from Berkeley Testnet
  // Sample contract: B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
  // My deployed contract: B62qrRt1HpXupeJJef3GkRXKAoZi2iiajzJjxXJGtp8qqeNoQNm6g8Q
  const zkAppAddress =
    "B62qrRt1HpXupeJJef3GkRXKAoZi2iiajzJjxXJGtp8qqeNoQNm6g8Q";

  /// hardcoded user accounts
  // const userAccountArray: UserAccount[] = [
  //   {
  //     publicKey: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
  //     salt: 100,
  //     accountBalance: 0,
  //   },
  //   {
  //     publicKey: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
  //     salt: 101,
  //     accountBalance: 100,
  //   },
    
  // ]
  // create a user with interface

    const userAccountArray = [
      new UserAccount("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
          100,
          0),
      new UserAccount(
          "0xee564fd8992c055663a124db7c6aa8f63ef01af5",
          101,
          100),
      new UserAccount(
          "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43",
          102,
          200),
      new UserAccount(
          "0x6b36094c4b0108cc3d6f8ca05fb8878eff54a541",
          103,
          300),
      new UserAccount(
          "0x50b90054be990305fd1899e7dcd9bd98cf4b5b4a",
          104,
          400),
      new UserAccount(
          "0xd6a309f49cf79542cea91df7b334eb4bd29aa0d7",
          105,
          500),
      new UserAccount(
          "0x4305be04c4416152a880d319b85e4ccbdd267073",
          106,
          600),
      new UserAccount(
          "0xad3f1453667e44ce5f1c180c967a5310793f8013",
          107,
          700),
  ];
  // --- copied from tutorial
  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        const zkappWorkerClient = new ZkappWorkerClient();

        console.log("Loading SnarkyJS...");
        await zkappWorkerClient.loadSnarkyJS();
        console.log("done");

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKeyVal = PublicKey.fromBase58(publicKeyBase58);
        setPublicKey(publicKeyBase58);
        console.log("using key", publicKeyVal.toBase58());

        console.log("checking if account exists...");
        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKeyVal!,
        });
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log("compiling zkApp");
        await zkappWorkerClient.compileContract();
        console.log("zkApp compiled");

        // demo with deployed contract
        // const zkappPublicKey = PublicKey.fromBase58('B62qph2VodgSo5NKn9gZta5BHNxppgZMDUihf1g7mXreL4uPJFXDGDA');
        // test with own deployed contract
        // const zkappPublicKey = PublicKey.fromBase58('B62qrrHaYLmHvCCa9qoMgYB8ZjZM8VmZUvUQp6EdYT3TqBybePF2qR8');
        const zkappPublicKey = PublicKey.fromBase58(zkAppAddress);

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log("getting zkApp state...");
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        const currentNum = (await zkappWorkerClient.getTreeHeight()) as Field;
        console.log("getTreeHeight:", currentNum?.toString());
        setCurrentNum(currentNum?.toString());
        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          zkappPublicKey,
          accountExists,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          console.log("checking if account exists...");
          const publicKeyPK = PublicKey.fromBase58(publicKey?.toString()!);
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: publicKeyPK,
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasBeenSetup]);
  // create button click handler
  // TODO: Fix this
  const getStateHandler = async () => {
    log.info("getStateHandler: Clicked");
    console.log("getting zkApp state...");
    await state.zkappWorkerClient?.fetchAccount({
      publicKey: state.zkappPublicKey!,
    });
    const currentNumVal = (await state.zkappWorkerClient?.getTreeHeight()) as Field;

    if (currentNumVal) {
      // state.currentNum = currentNum;
      log.debug(`currentNumVal: ${currentNumVal}`);
      setCurrentNum(currentNumVal.toString());
      // setCurrentNum(currentNum);
    }
  };
  // create button click handler
  const setStateHandler = async () => {
    log.info("setStateHandler: Clicked");
    /// working
    // const onSendTransactionRes = await onSendTransaction(
    //   state.zkappPublicKey!
    // );
    // if (onSendTransactionRes) {
    //   setTransactionRes(JSON.stringify(onSendTransactionRes));
    // }
    // log.info(`updateAddContractRes: ${onSendTransactionRes}`);

    /// testing
    const treeHash = createTree(4, userAccountArray);
    log.info(`tree: ${JSON.stringify(treeHash)}`);
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
            <Card width="xl" bg="gray.200">
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
                <HStack>
                  <Text as="b">User Address:</Text>
                  <Link
                    href={
                      "https://berkeley.minaexplorer.com/wallet/" + publicKey
                    }
                    isExternal
                  >
                    {shortenAddress(publicKey)} <ExternalLinkIcon mx="2px" />
                  </Link>
                </HStack>
              </CardBody>
            </Card>
          </HStack>
          <Spacer p="1" />
          <StateCard buttonName="Get State" clickHandler={getStateHandler}>
            {currentNum ? currentNum.toString() : "No state yet"}
            {/* {state.currentNum?.toString()} */}
          </StateCard>
          <Spacer p="1" />
          <StateCard buttonName="Update State" clickHandler={setStateHandler}>
            {transactionRes ? (
              <>
                <div>Transaction sent! See transaction at: </div>
                <Link
                  href={
                    "https://berkeley.minaexplorer.com/transaction/" +
                    transactionRes?.slice(1, -1)
                  }
                  isExternal
                >
                  {shortenAddress(transactionRes?.slice(1, -1))}{" "}
                  <ExternalLinkIcon mx="2px" />
                </Link>
              </>
            ) : (
              "No transactions sent yet"
            )}
          </StateCard>
        </Stack>
      </ChakraProvider>
    </>
  );
}
