import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, User, LogOut, ChevronDown, Compass, Shield, LayoutDashboard, Briefcase } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

function Navbar() {
  const { isLoggedIn, setIsLoginOpen, user, logout, hasRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogin = () => setIsLoginOpen(true);
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.fullname) return 'U';
    return user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 glass-panel border-b border-white/10 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-gradient-to-br from-ringmaster-crimson to-ringmaster-accent rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
          <Compass className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-black bg-gradient-to-r from-white via-ringmaster-gold to-white bg-clip-text text-transparent tracking-tighter">
          THE RINGMASTER
        </span>
      </Link>

      <ul className="flex space-x-8 items-center">
        <li>
          <Link 
            to="/ai-planner" 
            className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-ringmaster-gold transition-colors group"
          >
            <Sparkles className="w-4 h-4 text-ringmaster-gold group-hover:animate-pulse" />
            AI PLANNER
          </Link>
        </li>
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="btn-primary px-6 py-2 rounded-xl text-sm font-bold"
          >
            Login
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 pr-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ringmaster-accent to-ringmaster-plum flex items-center justify-center text-white font-bold text-xs border border-white/20">
                {getUserInitials()}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-ringmaster-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up backdrop-blur-xl">
                <div className="p-4 border-b border-white/5 bg-white/5">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">{user?.fullname || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || ''}</p>
                </div>
                <div className="p-2">
                  {/* Admin Dashboard - only for admins */}
                  {hasRole('admin') && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium">Admin Dashboard</span>
                    </Link>
                  )}

                  {/* Vendor Dashboard - for hotel owners and event organizers */}
                  {hasRole(['hotel_owner', 'event_organizer', 'admin']) && (
                    <Link
                      to="/vendor-dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl transition-all"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">Vendor Dashboard</span>
                    </Link>
                  )}

                  {/* User Dashboard */}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium">My Dashboard</span>
                  </Link>

                  <Link
                    to="/my-account"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl transition-all"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-ringmaster-gold" />
                    <span className="text-sm font-medium">My Account</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-gray-300 hover:text-red-400 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
