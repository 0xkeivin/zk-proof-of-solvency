import { useEffect, useState, useRef } from "react";
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
import { updateAddContract } from "../utils/updateAddContract";
// set log level
log.setLevel("debug");
export default function Home() {
  const [accountState, setAccountState] = useState<String | undefined>("");
  const minaNetwork = useRef(Mina);

  // Fetch the account from Berkeley Testnet
  // Sample contract: B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
  // My deployed contract: B62qrRt1HpXupeJJef3GkRXKAoZi2iiajzJjxXJGtp8qqeNoQNm6g8Q
  const zkAppAddress =
    "B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV";
  // create useEffect hook to run code on page load
  useEffect(() => {
    // create async function to run code
    (async () => {
      // wait for snarkyjs to be ready
      const isSnarkyReady = await isReady;
      log.debug(`isSnarkyReady: ${isSnarkyReady}`);
      const graphqlEndpoint = "https://proxy.berkeley.minaexplorer.com/graphql";
      setGraphqlEndpoint(graphqlEndpoint);
      let Berkeley = minaNetwork.current.Network(graphqlEndpoint);
      const setNetworkRes = minaNetwork.current.setActiveInstance(Berkeley);
      log.info(`setNetworkRes: ${setNetworkRes}`);
      // load the contract
      const { BasicMerkleTreeContract } = await import(
        "../../contracts/build/src/"
      );
      const { Add } = await import("../../contracts/build/src/");

      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        log.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
        );
      }
      // log.info(`zkApp JSON: ${JSON.stringify(account)}`);
      // log.info(`zkApp state: ${JSON.stringify(account?.appState)}`);

      // log.info(`error: ${error}`);
      // await Add.compile();
    })();
  }, []);
  // create button click handler
  const getStateHandler = async () => {
    log.info("getStateHandler: Clicked");
    const { account } = await fetchAccount({
      publicKey: PublicKey.fromBase58(zkAppAddress),
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
          <StateCard buttonName="Get State" clickHandler={getStateHandler}>
            {accountState}
          </StateCard>
          <Spacer p="1" />
          <StateCard buttonName="Update State" clickHandler={setStateHandler}>
            {accountState}
          </StateCard>
        </Stack>
      </ChakraProvider>
    </>
  );
}
