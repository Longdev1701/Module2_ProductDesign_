import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FilePlus, History, Scale, Package, Settings, Bell, HelpCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "./ui/button";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Check", href: "/new", icon: FilePlus },
  { name: "History", href: "/history", icon: History },
  { name: "Regulations", href: "/regulations", icon: Scale },
  { name: "Products", href: "/products", icon: Package },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-surface-container-low border-r border-outline-variant">
      <div className="p-6">
        <h1 className="font-serif text-xl font-bold text-primary">Coffee EU-Check AI</h1>
        <p className="text-xs font-mono text-outline uppercase tracking-wider mt-1">Khiên Tuân Thủ</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded px-3 py-2.5 text-sm font-medium font-sans transition-colors",
                isActive
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface hover:bg-surface-container hover:text-on-surface-variant"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-on-primary-container" : "text-outline group-hover:text-on-surface-variant"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant p-4">
        <div className="flex items-center rounded-lg bg-surface-container-lowest p-3 border border-outline-variant">
          <img
            className="h-10 w-10 rounded-full bg-surface-container"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <div className="ml-3">
            <p className="text-sm font-semibold text-on-surface">Minh Nguyễn</p>
            <p className="text-xs font-mono text-outline uppercase">Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-outline-variant bg-surface-container-lowest px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Tìm kiếm mã lô hàng hoặc sản phẩm...
          </label>
          <div className="relative w-full max-w-2xl flex items-center">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <input
              id="search-field"
              className="block h-10 w-full rounded border border-outline-variant bg-surface-container-low pl-10 pr-3 text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="Tìm kiếm mã lô hàng hoặc sản phẩm..."
              type="search"
              name="search"
            />
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-outline hover:text-on-surface relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error"></span>
          </button>
          <button type="button" className="-m-2.5 p-2.5 text-outline hover:text-on-surface">
            <HelpCircle className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-outline-variant" aria-hidden="true" />
          <Button variant="default" className="gap-2">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
             </svg>
             Export Report
          </Button>
        </div>
      </div>
    </header>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-surface p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
