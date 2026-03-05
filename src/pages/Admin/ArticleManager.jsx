import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Eye, Calendar, EyeOff, X } from 'lucide-react';
import { getArticles, addArticle, deleteArticle, updateArticle } from '../../firebase/db';

const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', category: 'Market Update', description: '', status: 'Published' });
    const [editingId, setEditingId] = useState(null);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const data = await getArticles();
            setArticles(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateArticle(editingId, {
                    ...formData,
                    // Keep original date if editing, or update lastModified? Usually keep original date or add updated field.
                    // For now, let's just update the content fields.
                });
                alert("Article updated!");
            } else {
                await addArticle({
                    ...formData,
                    views: 0,
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                });
                alert("Article published!");
            }
            setShowForm(false);
            setFormData({ title: '', category: 'Market Update', description: '', status: 'Published' });
            setEditingId(null);
            fetchArticles();
        } catch (error) {
            console.error(error);
            alert("Error saving article");
        }
    };

    const handleEdit = (article) => {
        setFormData({
            title: article.title,
            category: article.category,
            description: article.description,
            status: article.status
        });
        setEditingId(article.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleStatus = async (article) => {
        const newStatus = article.status === 'Published' ? 'Inactive' : 'Published';
        if (window.confirm(`Change status to ${newStatus}?`)) {
            try {
                await updateArticle(article.id, { status: newStatus });
                fetchArticles();
            } catch (error) {
                console.error("Error updating status:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this article?")) {
            await deleteArticle(id);
            fetchArticles();
        }
    };

    const resetForm = () => {
        setShowForm(!showForm);
        setFormData({ title: '', category: 'Market Update', description: '', status: 'Published' });
        setEditingId(null);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
                marginBottom: '32px',
                gap: '20px'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Article Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Write and publish market insights for your community.</p>
                </div>
                <button className="btn-primary" onClick={resetForm} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    width: window.innerWidth < 768 ? '100%' : 'auto',
                    justifyContent: 'center'
                }}>
                    {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Article'}
                </button>
            </div>

            {showForm && (
                <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', marginBottom: '32px' }}>
                    <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Article' : 'New Article'}</h3>
                    <form onSubmit={handleSubmit} style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
                        gap: '16px'
                    }}>
                        <input type="text" placeholder="Article Title" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }} />
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}>
                            <option value="Market Update">Market Update</option>
                            <option value="Techniques">Techniques</option>
                            <option value="Psychology">Psychology</option>
                        </select>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Status</label>
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none' }}>
                                <option value="Published">Published</option>
                                <option value="Inactive">Inactive (Hidden)</option>
                            </select>
                        </div>
                        <textarea placeholder="Description / Content Snippet" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ gridColumn: '1/-1', width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', outline: 'none', minHeight: '80px' }}></textarea>
                        <button type="submit" className="btn-primary" style={{ gridColumn: '1/-1' }}>{editingId ? 'Update Article' : 'Publish Article'}</button>
                    </form>
                </div>
            )}

            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <th style={{ padding: '20px' }}>Title & Status</th>
                                <th style={{ padding: '20px' }}>Date</th>
                                <th style={{ padding: '20px' }}>Views</th>
                                <th style={{ padding: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map(article => (
                                <tr key={article.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{article.title}</div>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: article.status === 'Published' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                            color: article.status === 'Published' ? '#4ade80' : '#fbbf24'
                                        }}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {article.date}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14} /> {article.views || 0}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleToggleStatus(article)}
                                                title={article.status === 'Published' ? "Hide Article" : "Publish Article"}
                                                style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                                            >
                                                {article.status === 'Published' ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(article)}
                                                style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                style={{ padding: '6px', borderRadius: '8px', border: '1px solid #FF4444', background: 'transparent', color: '#FF4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {loading && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading articles...</td></tr>}
                            {!loading && articles.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No articles found. Add your first article!</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ArticleManager;
