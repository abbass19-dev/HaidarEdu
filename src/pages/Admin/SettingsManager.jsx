import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Settings, ToggleLeft, ToggleRight, Upload, Image } from 'lucide-react';
import { getSystemSettings, updateSystemSettings } from '../../firebase/db';
import { uploadImage } from '../../utils/cloudinary';

const SettingsManager = () => {
    const [settings, setSettings] = useState({
        siteName: '',
        logoUrl: '',
        maintenanceMode: false,
        allowSignups: true,
        supportEmail: '',
        enableChat: true,
        mobile: '',
        address: '',
        instagram: '',
        linkedin: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await getSystemSettings();
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            const url = await uploadImage(file);
            setSettings(prev => ({ ...prev, logoUrl: url }));
        } catch (error) {
            console.error("Logo upload failed:", error);
            alert("Failed to upload logo.");
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSystemSettings(settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading system configuration...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>System Settings</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Configure global platform settings.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', opacity: saving ? 0.7 : 1 }}
                >
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Brand Configuration */}
                <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Image size={20} color="var(--primary-lime)" /> Brand Configuration
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Website Logo</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px dashed var(--border-subtle)',
                                    overflow: 'hidden'
                                }}>
                                    {settings.logoUrl ? (
                                        <img src={settings.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <Image size={24} color="var(--text-dim)" />
                                    )}
                                </div>
                                <div>
                                    <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px' }}>
                                        <Upload size={16} />
                                        {uploadingLogo ? "Uploading..." : "Upload New Logo"}
                                        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px' }}>Recommended: 200x200px PNG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings size={20} color="var(--primary-lime)" /> General Configuration
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="glass-input"
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}
                            />
                        </div>

                        {/* Contact Info Group */}
                        <div style={{ padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                            <h4 style={{ marginBottom: '16px', color: 'var(--primary-lime)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Details</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Support Email</label>
                                    <input
                                        type="email"
                                        name="supportEmail"
                                        value={settings.supportEmail}
                                        onChange={handleChange}
                                        className="glass-input"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Mobile Number</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={settings.mobile || ''}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        className="glass-input"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={settings.address || ''}
                                        onChange={handleChange}
                                        placeholder="123 Education St, Beiruit"
                                        className="glass-input"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Media Group */}
                        <div style={{ padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                            <h4 style={{ marginBottom: '16px', color: 'var(--primary-lime)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Social Media</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Instagram URL</label>
                                    <input
                                        type="text"
                                        name="instagram"
                                        value={settings.instagram || ''}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/..."
                                        className="glass-input"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>LinkedIn URL</label>
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={settings.linkedin || ''}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/..."
                                        className="glass-input"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Toggles */}
                <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle size={20} color="#fbbf24" /> Feature Control
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Maintenance Mode</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Disable access to public pages</div>
                            </div>
                            <button onClick={() => handleToggle('maintenanceMode')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: settings.maintenanceMode ? 'var(--primary-lime)' : 'var(--text-dim)' }}>
                                {settings.maintenanceMode ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Allow New Signups</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Toggle user registration</div>
                            </div>
                            <button onClick={() => handleToggle('allowSignups')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: settings.allowSignups ? 'var(--primary-lime)' : 'var(--text-dim)' }}>
                                {settings.allowSignups ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Enable AI Chatbot</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Show assistant on all pages</div>
                            </div>
                            <button onClick={() => handleToggle('enableChat')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: settings.enableChat ? 'var(--primary-lime)' : 'var(--text-dim)' }}>
                                {settings.enableChat ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
