import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, User, Search, Trash2, Eye, X, BookOpen, Phone, MapPin } from 'lucide-react';
import { getUsers, updateUserRole, deleteUser } from '../../firebase/db';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (uid, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Change role from ${currentRole} to ${newRole}?`)) {
            try {
                await updateUserRole(uid, newRole);
                fetchUsers();
            } catch (error) {
                console.error("Error updating role:", error);
                alert("Failed to update role. Check console.");
            }
        }
    };

    const handleDelete = async (uid) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteUser(uid);
                fetchUsers();
                if (selectedUser?.id === uid) setSelectedUser(null);
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ position: 'relative' }}>
            <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
                marginBottom: '32px',
                gap: '24px'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>User Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage user access, roles, and profiles.</p>
                </div>
                <div style={{ position: 'relative', width: window.innerWidth < 768 ? '100%' : '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 10px 10px 40px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '50px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <th style={{ padding: '20px' }}>User</th>
                                <th style={{ padding: '20px' }}>Role</th>
                                <th style={{ padding: '20px' }}>Joined</th>
                                <th style={{ padding: '20px' }}>Enrolled Courses</th>
                                <th style={{ padding: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                                                {user.firstName ? user.firstName[0].toUpperCase() : <User size={16} color="var(--text-dim)" />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '4px 12px',
                                            borderRadius: 'var(--radius-full)',
                                            background: user.role === 'admin' ? 'rgba(203, 251, 69, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            color: user.role === 'admin' ? 'var(--primary-lime)' : 'var(--text-muted)',
                                            border: user.role === 'admin' ? '1px solid rgba(203, 251, 69, 0.2)' : '1px solid var(--border-subtle)'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        {user.enrolledCourses?.length || 0}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRoleUpdate(user.id, user.role || 'user')}
                                                style={{
                                                    padding: '6px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-subtle)',
                                                    background: 'transparent',
                                                    color: user.role === 'admin' ? 'var(--primary-lime)' : 'var(--text-dim)',
                                                    cursor: 'pointer'
                                                }}
                                                title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                                            >
                                                {user.role === 'admin' ? <ShieldAlert size={16} /> : <Shield size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                style={{ padding: '6px', borderRadius: '8px', border: '1px solid #FF4444', background: 'transparent', color: '#FF4444', cursor: 'pointer' }}
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {loading && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading users...</td></tr>}
                            {!loading && filteredUsers.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users found matching "{searchTerm}"</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={() => setSelectedUser(null)}>
                    <div
                        className="glass"
                        style={{ width: '90%', maxWidth: '500px', padding: '32px', borderRadius: '24px', position: 'relative' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedUser(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>
                                {selectedUser.firstName ? selectedUser.firstName[0].toUpperCase() : <User size={32} />}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{selectedUser.firstName} {selectedUser.lastName}</h2>
                                <p style={{ color: 'var(--text-dim)' }}>{selectedUser.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                <Phone size={18} color="var(--primary-lime)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Phone</div>
                                    <div>{selectedUser.phone || 'Not provided'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                <MapPin size={18} color="var(--primary-lime)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Address</div>
                                    <div>{selectedUser.address || 'Not provided'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                <Shield size={18} color="var(--primary-lime)" />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Role</div>
                                    <div style={{ textTransform: 'capitalize' }}>{selectedUser.role || 'User'}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><BookOpen size={18} /> Enrolled Courses</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {selectedUser.enrolledCourses && selectedUser.enrolledCourses.length > 0 ? (
                                        selectedUser.enrolledCourses.map((c, i) => (
                                            <span key={i} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', fontSize: '0.85rem' }}>{c}</span>
                                        ))
                                    ) : (
                                        <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No active enrollments</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
