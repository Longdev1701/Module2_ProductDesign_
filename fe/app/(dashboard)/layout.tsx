import { Sidebar, Topbar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans antialiased min-h-screen flex">
      <Sidebar />
      <main className="ml-[280px] flex-1 flex flex-col min-h-screen">
        <Topbar />
        <div className="pt-[88px] px-8 pb-10 max-w-[1440px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
