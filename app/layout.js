import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "./context/AuthProvider";
import { RentReqProvider } from "./context/RentReqContext";
import { ToggleFavContext } from "./context/ToggleFavContext";
import { AosContext } from "./context/AosContext";
import { WelcomingAnimation } from "./context/WelcomingAnimation";
const outfit = Outfit({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Rentil",
  description: "Behaved By Muhammed Elkutayni - Moxtil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-no-repeat bg-cover min-h-screen text-[#eee]`}
      >
        <ClerkProvider
          key={process.env.CLERK_SECRET_KEY}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ToggleFavContext>
            <RentReqProvider>
              <AuthProvider>
                <AosContext>
                  <WelcomingAnimation>{children}</WelcomingAnimation>
                </AosContext>
              </AuthProvider>
            </RentReqProvider>
          </ToggleFavContext>
        </ClerkProvider>
      </body>
    </html>
  );
}
