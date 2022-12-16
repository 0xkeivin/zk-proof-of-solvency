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
  buttonName2: String;
  clickHandler: Function;
  sampleHandler: Function;
  onChangeHandler: Function;
  value: string | number | readonly string[] | undefined;
  placeHolder: string;
  children?: React.ReactNode;
};

const AddressInput = ({
  buttonName1,
  buttonName2,
  clickHandler,
  sampleHandler,
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
          w="14rem"
          colorScheme="teal"
          onClick={(event) => sampleHandler(event)}
          id="sampleBtn"
        >
          {buttonName1}
        </Button>
        <Button
          w="14rem"
          colorScheme="linkedin"
          onClick={(event) => clickHandler(event)}
          id="processAddrBtn"
        >
          {buttonName2}
        </Button>
      </HStack>
    </VStack>
  );
};

export default AddressInput;
