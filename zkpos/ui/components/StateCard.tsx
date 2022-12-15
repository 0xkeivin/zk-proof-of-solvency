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
    <HStack spacing={10}>
      <Card width="md" bg="lavender">
        <HStack>
          <CardBody>
            <Button
              colorScheme="messenger"
              onClick={clickHandler}
              id="testButton"
            >
              {buttonName}
            </Button>
          </CardBody>
          <CardBody>{children}</CardBody>
        </HStack>
      </Card>
    </HStack>
  );
};

export default StateCard;
