import React, { useState, useEffect } from 'react';
import { subscribeToAuthChanges } from '../firebase/auth';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Mail, Phone, MapPin, Save, Edit2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        enrolledCourses: []
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (u) => {
            setUser(u);
            if (u) {
                await fetchProfile(u.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchProfile = async (uid) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    enrolledCourses: data.enrolledCourses || []
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                address: profileData.address
            });
            setEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    if (!user) {
        return (
            <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                <h2>Please log in to view your profile.</h2>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', borderRadius: '24px' }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '32px',
                    flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                    gap: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{
                            width: window.innerWidth < 640 ? '60px' : '80px',
                            height: window.innerWidth < 640 ? '60px' : '80px',
                            borderRadius: '50%',
                            background: 'var(--primary-lime)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: window.innerWidth < 640 ? '1.5rem' : '2rem',
                            fontWeight: 'bold',
                            color: '#000'
                        }}>
                            {profileData.firstName ? profileData.firstName[0].toUpperCase() : <User size={window.innerWidth < 640 ? 30 : 40} />}
                        </div>
                        <div>
                            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', marginBottom: '4px' }}>
                                {profileData.firstName} {profileData.lastName}
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profileData.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => editing ? handleSave() : setEditing(true)}
                        className="btn-primary"
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
                    >
                        {editing ? <Save size={18} /> : <Edit2 size={18} />}
                        {saving ? 'Saving...' : (editing ? 'Save Changes' : 'Edit Profile')}
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '0.9rem' }}>First Name</label>
                        {editing ? (
                            <input
                                type="text"
                                value={profileData.firstName}
                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                style={{ width: '100%', background: 'transparent', border: '1px solid var(--primary-lime)', padding: '8px', borderRadius: '8px', color: 'white' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.1rem' }}>{profileData.firstName || '-'}</div>
                        )}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '0.9rem' }}>Last Name</label>
                        {editing ? (
                            <input
                                type="text"
                                value={profileData.lastName}
                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                style={{ width: '100%', background: 'transparent', border: '1px solid var(--primary-lime)', padding: '8px', borderRadius: '8px', color: 'white' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.1rem' }}>{profileData.lastName || '-'}</div>
                        )}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '0.9rem' }}>Phone</label>
                        {editing ? (
                            <input
                                type="text"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                style={{ width: '100%', background: 'transparent', border: '1px solid var(--primary-lime)', padding: '8px', borderRadius: '8px', color: 'white' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.1rem' }}>{profileData.phone || '-'}</div>
                        )}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '0.9rem' }}>Address</label>
                        {editing ? (
                            <input
                                type="text"
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                style={{ width: '100%', background: 'transparent', border: '1px solid var(--primary-lime)', padding: '8px', borderRadius: '8px', color: 'white' }}
                            />
                        ) : (
                            <div style={{ fontSize: '1.1rem' }}>{profileData.address || '-'}</div>
                        )}
                    </div>
                </div>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={24} color="var(--primary-lime)" /> Enrolled Courses
                </h3>

                {profileData.enrolledCourses && profileData.enrolledCourses.length > 0 ? (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {profileData.enrolledCourses.map((courseId, index) => (
                            <div key={index} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                                Course ID: {courseId}
                                {/* In a real app we'd fetch course details here */}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>You are not enrolled in any courses yet.</p>
                )}

            </motion.div>
        </div>
    );
};

export default UserProfile;
