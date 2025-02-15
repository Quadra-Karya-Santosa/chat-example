import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./sidebar.layout";
import Container from "./container.layout";

const DashboardLayout: React.FC = () => {
  const [navbarActive, setNavbarActive] = useState<boolean>(true);

  const toggleSidebar = (): void => {
    setNavbarActive((prev) => !prev);
  };

  return (
    <div className="flex">
      <Sidebar active={navbarActive} toggleSidebar={toggleSidebar} />
      <Container className={`${navbarActive ? "w-[75%]" : "w-full"}`}>
        <Outlet />
      </Container>
    </div>
  );
};

export default DashboardLayout;