
import Card from "@mui/material/Card";

// WorkScience React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import { StyledEngineProvider } from '@mui/material/styles';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
// WorkScience React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import StripedRowsDemo from "./data/attendance";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import DataTable from "layouts/tables/data/leaves";
import projectsTableData from "layouts/tables/data/attendance";

function Employee() {
  const { columns, rows } = authorsTableData;
  const { columns: prCols, rows: prRows } = projectsTableData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Attandance</SoftTypography>
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              {/* <Table columns={columns} rows={rows} /> */}
              <StyledEngineProvider>
             < StripedRowsDemo/>
              </StyledEngineProvider>
            </SoftBox>
            {/* <DataTable/> */}
          </Card>
        </SoftBox>
       
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Employee;
