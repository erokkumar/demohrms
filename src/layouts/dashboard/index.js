import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { useState } from "react"; 
import {Link} from "react-router-dom";
import Swal from "sweetalert2";

// WorkScience React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// WorkScience React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import SoftButton from "components/SoftButton";
import Card from "@mui/material/Card";
import ProjectTableWithCRUD from "layouts/tables/data/project";


// WorkScience React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const emp_id = localStorage.getItem("emp_id");
  const emp_name = localStorage.getItem("user_name");
const [clockInTime, setClockInTime] = useState("");

  const handleClockIn = () => {
    const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setClockInTime(currentTime);

    fetch("https://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emp_id,
            emp_name,
            clock_in: currentTime,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Clock In Response:", data);
        Swal.fire({
          title: "Clocked In Successfully",
          text: `Clocked In at ${currentTime}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        // alert("Clocked In Successfully at " + currentTime);
    })
    .catch((err) => console.error("Error:", err));
};

const handleClockOut = () => {
    const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });
    // setClockOutTime(currentTime);

    fetch("https://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emp_id,
            emp_name,
            clock_in: clockInTime,
            clock_out: currentTime,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Clock Out Response:", data);
        Swal.fire({
          title: "Clocked Out Successfully",
          text: `Clocked Out at ${currentTime}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        // alert("Clocked Out Successfully at " + currentTime);
    })
    .catch((err) => console.error("Error:", err));
};

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Total Leaves", color: "success" }}
                count="$53,000"
                percentage={{ color: "success"}}
                icon={{ color: "info", component: "paid" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Productive Hours" }}
                count="2,300"
                percentage={{ color: "success"}}
                icon={{ color: "info", component: "public" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Tickets" }}
                count="+3,462"
                percentage={{ color: "error" }}
                icon={{ color: "info", component: "emoji_events" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Tasks" }}
                count="$103,430"
                percentage={{ color: "success" }}
                icon={{
                  color: "info",
                  component: "shopping_cart",
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <BuildByDevelopers />
            </Grid>
            <Grid item xs={12} lg={5}>
            <Card style={{padding:'10px'}}>
            <Grid container spacing={3}>

              <Grid item xs={6} lg={6}>

            <button className="btn w-100" style={{background: 'linear-gradient(90deg, rgb(3, 255, 37) 35%, rgb(78, 194, 11) 100%)', color:'white', height:'50px'}} onClick={()=>handleClockIn()}>Clock In</button>     
         </Grid>
              <Grid item xs={6} lg={6}>

              <button className="btn w-100" style={{background: 'linear-gradient(90deg, rgb(255, 30, 0) 35%, rgb(194, 5, 5) 100%)', color:'white', height:'50px'}} onClick={()=>handleClockOut()}>Clock Out</button>     

              </Grid>
              <Grid item xs={12} lg={6}>

              <Link to="/leaves"><button className="btn w-100" style={{background: 'linear-gradient(90deg, rgba(0,151,255,1) 35%, rgba(0,69,255,1) 100%)', color:'white', height:'50px'}}>Leaves</button>     </Link>
              </Grid>
              <Grid item xs={12} lg={6}>

              <Link to="/tickets"><button className="btn w-100" style={{background: 'linear-gradient(90deg, rgba(0,151,255,1) 35%, rgba(0,69,255,1) 100%)', color:'white', height:'50px'}}>Tickets</button>   </Link>  
              </Grid>
              <Grid item xs={12} lg={6}>

              <Link to="/task"><button className="btn w-100" style={{background: 'linear-gradient(90deg, rgba(0,151,255,1) 35%, rgba(0,69,255,1) 100%)', color:'white', height:'50px'}}>Tasks</button>     </Link>
</Grid>
<Grid item xs={12} lg={6}>

<button className="btn w-100" style={{background: 'linear-gradient(90deg, rgba(0,151,255,1) 35%, rgba(0,69,255,1) 100%)', color:'white', height:'50px'}}>Holidays</button>     
</Grid>
              </Grid>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                title="Attendance Rate"
                description={
                  <>
                    (<strong>+23%</strong>) than last week
                  </>
                }
                chart={chart}
                items={items}
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Work Efficiency"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon className="font-bold">arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      4% more{" "}
                      <SoftTypography variant="button" color="text" fontWeight="regular">
                        in this week
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={gradientLineChartData}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Card>

            < ProjectTableWithCRUD/>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
