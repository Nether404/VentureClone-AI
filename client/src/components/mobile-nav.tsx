import { useState } from "react";
import { Menu, X, Home, BarChart3, Book, Settings, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user?: any;
  onSettingsClick: () => void;
}

export function MobileNav({ user, onSettingsClick }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/docs", label: "Documentation", icon: Book },
  ];

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="text-vc-text"
        data-testid="button-mobile-menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] bg-vc-card border-vc-border">
          <SheetHeader>
            <SheetTitle className="text-vc-text">Menu</SheetTitle>
            <SheetDescription className="text-vc-text-muted">
              Navigate through VentureClone AI
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 flex flex-col gap-4">
            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3 p-3 bg-vc-dark rounded-lg">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-vc-border rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-vc-text-muted" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-vc-text truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-vc-text-muted">
                    {user.firstName || 'User'}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setOpen(false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      "text-vc-text hover:bg-vc-dark",
                      location === item.href && "bg-vc-primary/20 text-vc-primary"
                    )}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              ))}
            </nav>

            {/* Settings Button */}
            <Button
              variant="outline"
              className="w-full justify-start border-vc-border text-vc-text"
              onClick={() => {
                onSettingsClick();
                setOpen(false);
              }}
              data-testid="button-mobile-settings"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
              data-testid="button-mobile-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}