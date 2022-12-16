import DataTable, { createTheme } from "react-data-table-component";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Spacer,
  HStack,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

// create props
type Props = {
  recordsType?: any;
};
const CustomDataTable = (props: Props) => {
  const recordsTypeColumns = [
    {
      name: "Eth Address",
      selector: (row: any) => row.publicKey,
      sortable: true,
      wrap: true,

    },
    {
      name: "ETH Balance",
      selector: (row: any) => row.accountBalance,
      sortable: true,
      wrap: true,
    },
    {
      name: "Salt",
      selector: (row: any) => row.salt,
      sortable: true,
      wrap: true,
    },
  ];
  // create a constant for custom style with width 70% and margin auto

  const customTableStyle = {
    table: {
      style: {
        // spacing: "5px",
        // padding: "1px",
        width: "1000%",
      },
    },
    pagination: {
      style: {
        // width: "95%",
      },
    },
    headCells: {
      style: {
        paddingLeft: "2px", // override the cell padding for data cells
        paddingRight: "2px",
        fontSize: "20px",
        fontWeight: "bold",
        color: "black",
        backgroundColor: "grey",
        // width: "95%",
      },
    },
    cells: {
      style: {
        paddingLeft: "2px", // override the cell padding for data cells
        paddingRight: "2px",
        fontSize: "18px",
      },
    },
    columns: {
      style: {
        wrap: true,
      },
    },
  };

  return (
    <>
      <Flex
        height={"xl"}
        width={"95%"}
        justifyContent={"center"}
        padding={"30px"}
      >
        <Card
          width="5xl"
          height="xl"
          bg="lavender"
          justifyContent="center"
          alignContent="center"
          padding="10px"
        >
          <CardBody>
            <Spacer p="4" />
            <DataTable
              highlightOnHover={true}
              // dense={true}
              customStyles={customTableStyle}
              striped={true}
              title="Leaf Nodes to be Hashed"
              columns={recordsTypeColumns}
              data={props.recordsType}
              pagination={true}
              paginationPerPage={20}
              defaultSortFieldId={1}
              defaultSortAsc={false}
            />
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};

export default CustomDataTable;
