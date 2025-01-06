import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      variant: "default",
    });
    navigate('/login');
  };

  const navLinks = [
    { path: '/status', label: 'Status', public: true },
    { path: '/dashboard', label: 'Dashboard', protected: true },
    { path: '/services', label: 'Services', protected: true },
    { path: '/incidents', label: 'Incidents', protected: true },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Status Page</span>
        </Link>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-6">
            {navLinks.map(({ path, label, public: isPublic, protected: isProtected }) => {
              if ((isProtected && !isAuthenticated) || (isPublic === false && !isAuthenticated)) {
                return null;
              }
              return (
                <Link
                  key={path}
                  to={path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === path ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-foreground/60">
                  {user?.email}
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;