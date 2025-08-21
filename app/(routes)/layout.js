import { Outfit } from "next/font/google";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export const metadata = {
  title: "Rentil",
  description: "Behaved By Muhammed Elkutayni - Moxtil",
};
export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-14 min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
