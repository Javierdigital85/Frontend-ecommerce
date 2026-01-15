import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";

const Layout = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 pb-10">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
