import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// WorkScience React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";
import Logout from "layouts/authentication/Logout";
import LeaveData from "layouts/tables/LeaveData";
import TaskData from "layouts/tables/TaskData";
import TicketData from "layouts/tables/TicketData";
import Employee from "layouts/tables/Employee";
import Project from "layouts/tables/Project";
import Attendance from "layouts/tables/Attandance";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Leaves",
    key: "leaves",
    route: "/leaves",
    icon: <Office size="12px" />,
    component: <LeaveData />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tickets",
    key: "tickets",
    route: "/tickets",
    icon: <CreditCard size="12px" />,
    component: <TicketData />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Task",
    key: "task",
    route: "/task",
    icon: <Cube size="12px" />,
    component: <TaskData />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Employee",
    key: "employee",
    route: "/employee",
    icon: <CustomerSupport size="12px" />,
    component: <Employee />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Attandance",
    key: "attandance",
    route: "/attandance",
    icon: <CustomerSupport size="12px" />,
    component: <Attendance />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Project",
    key: "project",
    route: "/project",
    icon: <CustomerSupport size="12px" />,
    component: <Project />,
    noCollapse: true,
  },
  // { type: "title", title: "Account Pages", key: "account-pages" },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   route: "/profile",
  //   icon: <CustomerSupport size="12px" />,
  //   component: <Profile />,
  //   noCollapse: true,
  // },
  {
    type: "route",
    name: "Sign In",
    key: "sign-in",
    route: "/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "Sign Out",
    key: "sign-out",
    route: "/sign-out",
    icon: <Document size="12px" />,
    component: <Logout />,
    noCollapse: true,
  },
  
];

export default routes;
