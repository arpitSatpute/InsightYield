import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
// import { Footer } from "@/components/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 w-full p-0 m-0">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
