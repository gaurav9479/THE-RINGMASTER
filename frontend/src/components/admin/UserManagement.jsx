import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, UserX, Shield, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../../utils/axios.auth';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: 10,
                ...(roleFilter && { role: roleFilter }),
                ...(search && { search })
            });

            const response = await API.get(`/admin/users?${params}`);
            setUsers(response.data.data.users);
            setPagination(prev => ({
                ...prev,
                totalPages: response.data.data.pagination.totalPages,
                total: response.data.data.pagination.total
            }));
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchUsers();
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await API.patch(`/admin/users/${userId}/role`, { role: newRole });
            toast.success('User role updated');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const handleSuspend = async (userId, suspend) => {
        const reason = suspend ? prompt('Reason for suspension:') : null;
        if (suspend && !reason) return;

        try {
            await API.patch(`/admin/users/${userId}/suspend`, {
                suspended: suspend,
                reason
            });
            toast.success(`User ${suspend ? 'suspended' : 'unsuspended'}`);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure? This will delete all user data.')) return;

        try {
            await API.delete(`/admin/users/${userId}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const roles = ['user', 'admin', 'hotel_owner', 'event_organizer'];

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="bg-gray-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl transition-colors"
                    >
                        Search
                    </button>
                </form>

                <select
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
                >
                    <option value="">All Roles</option>
                    {roles.map(role => (
                        <option key={role} value={role}>{role.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/20">
                                <tr>
                                    <th className="text-left p-4 text-gray-500 font-medium text-sm">User</th>
                                    <th className="text-left p-4 text-gray-500 font-medium text-sm">Email</th>
                                    <th className="text-left p-4 text-gray-500 font-medium text-sm">Role</th>
                                    <th className="text-left p-4 text-gray-500 font-medium text-sm">Status</th>
                                    <th className="text-left p-4 text-gray-500 font-medium text-sm">Joined</th>
                                    <th className="text-right p-4 text-gray-500 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.fullname?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.fullname}</p>
                                                    <p className="text-gray-500 text-xs">@{user.UserName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400">{user.email}</td>
                                        <td className="p-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${
                                                    user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                                    user.role === 'hotel_owner' ? 'bg-purple-500/20 text-purple-400' :
                                                    user.role === 'event_organizer' ? 'bg-cyan-500/20 text-cyan-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                                }`}
                                            >
                                                {roles.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                user.suspended
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {user.suspended ? 'Suspended' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleSuspend(user._id, !user.suspended)}
                                                    className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                                                        user.suspended ? 'text-green-400' : 'text-yellow-400'
                                                    }`}
                                                    title={user.suspended ? 'Unsuspend' : 'Suspend'}
                                                >
                                                    {user.suspended ? <Shield size={16} /> : <UserX size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-white/5">
                    <p className="text-gray-500 text-sm">
                        Showing page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedUser(null)} />
                    <div className="relative bg-gray-900 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-4">User Details</h3>
                        <div className="space-y-3">
                            <p><span className="text-gray-500">Name:</span> <span className="text-white">{selectedUser.fullname}</span></p>
                            <p><span className="text-gray-500">Username:</span> <span className="text-white">@{selectedUser.UserName}</span></p>
                            <p><span className="text-gray-500">Email:</span> <span className="text-white">{selectedUser.email}</span></p>
                            <p><span className="text-gray-500">Phone:</span> <span className="text-white">{selectedUser.Phone}</span></p>
                            <p><span className="text-gray-500">Role:</span> <span className="text-white">{selectedUser.role}</span></p>
                            <p><span className="text-gray-500">Joined:</span> <span className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span></p>
                        </div>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-xl transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
