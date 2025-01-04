import { Navbar } from "@/app/(dashboard)/_components/Navbar";
import { Sidebar } from "@/app/(dashboard)/_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-20 md:pl-56 fixed inset-y-0 z-50 w-full">
        <Navbar />
      </div>

      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-20 h-full">{children}</main>
    </div>
  );
}
