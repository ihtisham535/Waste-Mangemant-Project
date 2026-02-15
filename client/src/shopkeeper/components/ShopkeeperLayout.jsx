import { Outlet } from "react-router-dom";
import ShopkeeperNavbar from "./ShopkeeperNavbar.jsx";

const ShopkeeperLayout = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
    <ShopkeeperNavbar />
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <Outlet />
    </main>
  </div>
);

export default ShopkeeperLayout;
