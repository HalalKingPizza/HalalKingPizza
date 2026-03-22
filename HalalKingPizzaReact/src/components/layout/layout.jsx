import Navbar from "./navbar";
import { Outlet } from "react-router-dom";
import Footer from "./footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16, paddingTop: 90 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
