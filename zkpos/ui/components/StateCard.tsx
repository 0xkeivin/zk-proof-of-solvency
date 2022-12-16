import { Button, Card, CardBody, HStack } from "@chakra-ui/react";

// create component to render Card and Button
// create props
type StateCardProps = {
  buttonName: String;
  clickHandler: () => void;
  children?: React.ReactNode;
};
const StateCard = ({ buttonName, clickHandler, children }: StateCardProps) => {
  return (
    // <HStack>
      <Card width="xl" bg="lavender">
        <HStack>
          <CardBody width="30%">
            <Button
              colorScheme="messenger"
              onClick={clickHandler}
              id="testButton"
            >
              {buttonName}
            </Button>
          </CardBody>
          <CardBody width="80%">{children}</CardBody>
        </HStack>
      </Card>
    // </HStack>
  );
};

export default StateCard;
