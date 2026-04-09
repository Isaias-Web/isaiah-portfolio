import "./globals.css";
import CustomCursor from "@/components/system/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { SmoothScrollProvider } from "@/components/SmoothScrollContext";

export const metadata = {
  title: "Isaiah Portfolio",
  description: "Creative Developer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    
    <html lang="en" suppressHydrationWarning>
      <body>
        <SmoothScrollProvider>
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}