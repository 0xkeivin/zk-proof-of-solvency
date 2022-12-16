import {
  Button,
  Card,
  CardBody,
  Stack,
  HStack,
  Spacer,
} from "@chakra-ui/react";

// create component to render Card and Button
// create props
type StateCardProps = {
  buttonName: String;
  clickHandler: () => void;
  children?: React.ReactNode;
};
const StateCard = ({ buttonName, clickHandler, children }: StateCardProps) => {
  return (
    <Card p="2" width="5xl" bg="lavender">
      <HStack spacing="4">
        <Button
          width="12rem"
          colorScheme="messenger"
          onClick={clickHandler}
          id="testButton"
        >
          {buttonName}
        </Button>
        {/* <Stack direction='row'> */}
        {/* <CardBody>
          </CardBody> */}
        <CardBody>{children}</CardBody>
        {/* </Stack> */}
      </HStack>
    </Card>
  );
};

export default StateCard;
