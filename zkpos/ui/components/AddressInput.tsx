import {
  Button,
  Textarea,
  Input,
  InputGroup,
  VStack,
  HStack,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

// create component to render Card and Button

type AddressInputProps = {
  buttonName1: String;
  button1Handler: Function;
  buttonName2?: String;
  button2Handler?: Function;
  buttonName3?: String;
  button3Handler?: Function;
  onChangeHandler: Function;
  value: string | number | readonly string[] | undefined;
  placeHolder: string;
  children?: React.ReactNode;
};

const AddressInput = ({
  buttonName1,
  button1Handler,
  button2Handler,
  buttonName2,
  buttonName3,
  button3Handler,
  onChangeHandler,
  placeHolder,
  value,
  children,
}: AddressInputProps) => {
  return (
    <VStack
      width="xl"
      spacing={4}
      direction="row"
      display="flex"
      alignItems="center"
      justify={"center"}
      padding={1}
    >
      <Textarea
        w="30rem"
        h="14rem"
        placeholder={placeHolder}
        onChange={(event) => onChangeHandler(event)}
        value={value}
      />
      <Spacer p="2" />
      <HStack>
        <Button
          w="12rem"
          colorScheme="teal"
          onClick={(event) => button1Handler(event)}
          id="sampleBtn"
        >
          {buttonName1}
        </Button>
        {buttonName2 && button2Handler && (
          <Button
            w="12rem"
            colorScheme="linkedin"
            onClick={(event) => button2Handler(event)}
            id="processAddrBtn"
          >
            {buttonName2}
          </Button>
        )}
        {buttonName3 && button3Handler && (
          <Button
            w="5rem"
            colorScheme="gray"
            onClick={(event) => button3Handler(event)}
            id="button3"
          >
            {buttonName3}
          </Button>
        )}
      </HStack>
    </VStack>
  );
};

export default AddressInput;
