import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111]">
      <header>
       <Navbar/>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
       <Footer/>
      </footer>
    </div>
  );
};

export default MainLayout;