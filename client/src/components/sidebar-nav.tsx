import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart3, 
  Archive, 
  HelpCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

function NavItem({ href, icon, text, active }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-4 py-2 text-sm font-medium rounded-md",
          active
            ? "bg-primary-50 text-primary-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <div className={cn("mr-3 h-5 w-5", active ? "text-primary-500" : "text-gray-500")}>
          {icon}
        </div>
        {text}
      </a>
    </Link>
  );
}

export default function SidebarNav() {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: <Home size={20} />, text: 'Dashboard' },
    { href: '/previous-ideas', icon: <Archive size={20} />, text: 'Previous Ideas' },
    { href: '/resources', icon: <BarChart3 size={20} />, text: 'Resources' },
    { href: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];

  const renderNavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4 py-5">
        <div className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xl font-bold text-gray-900">VentureForge</span>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="mt-8 flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            active={location === item.href}
          />
        ))}
      </nav>
      
      {/* User Menu */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div className="inline-block h-9 w-9 rounded-full bg-gray-100 overflow-hidden">
              <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Jane Smith</p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Account Settings</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">VentureForge</span>
            </div>
            
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  {renderNavContent()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Spacer for fixed header */}
        <div className="h-14" />
      </>
    );
  }
  
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {renderNavContent()}
        </div>
      </div>
    </div>
  );
}
