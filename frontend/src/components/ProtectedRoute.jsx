import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

/**
 * ProtectedRoute component that restricts access to authenticated users
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Optional array of allowed roles
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isLoggedIn, user, loading, hasRole } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // If not logged in, redirect to home with return path
    if (!isLoggedIn) {
        return <Navigate to="/" state={{ from: location, needsLogin: true }} replace />;
    }

    // If roles are specified, check if user has required role
    if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
