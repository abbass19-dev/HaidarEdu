import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, FileText, MessageCircle, Megaphone, Search } from 'lucide-react';
import { addKnowledgeBaseEntry, subscribeToKnowledgeBase, deleteKnowledgeBaseEntry } from '../../firebase/knowledgeBase';

const KnowledgeBase = () => {
    const [entries, setEntries] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        type: 'qa', // qa, service, announcement
        question: '',
        answer: '',
        title: '',
        content: ''
    });

    useEffect(() => {
        const unsubscribe = subscribeToKnowledgeBase(setEntries);

        // Auto-seed if empty
        const attemptSeed = async () => {
            const { seedKnowledge } = await import('../../firebase/seeder');
            await seedKnowledge();
        };
        attemptSeed();

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addKnowledgeBaseEntry(formData);
            setIsAdding(false);
            setFormData({ type: 'qa', question: '', answer: '', title: '', content: '' });
        } catch (error) {
            console.error("Error adding entry:", error);
            alert("Failed to add entry. See console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            await deleteKnowledgeBaseEntry(id);
        }
    };

    const filteredEntries = entries.filter(e => filter === 'all' || e.type === filter);

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>AI Knowledge Base</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Train your AI Assistant with Q&A, Services, and Updates.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {isAdding ? 'Cancel' : <><Plus size={20} /> Add New Entry</>}
                </button>
            </div>

            {/* Add Entry Form */}
            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '30px'
                    }}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Entry Type</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['qa', 'service', 'announcement'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: formData.type === type ? '1px solid var(--primary-lime)' : '1px solid var(--border-subtle)',
                                            background: formData.type === type ? 'rgba(203, 251, 69, 0.1)' : 'transparent',
                                            color: formData.type === type ? 'var(--primary-lime)' : 'var(--text-muted)',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.type === 'qa' && (
                            <>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Question</label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={e => setFormData({ ...formData, question: e.target.value })}
                                        placeholder="e.g., How do I reset my password?"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'white' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>AI Answer</label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                        placeholder="The clear, professional answer the AI should give."
                                        rows={4}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'white' }}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {formData.type !== 'qa' && (
                            <>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder={formData.type === 'service' ? "Service Name (e.g., VIP Signals)" : "Announcement Title"}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'white' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Description / Details</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Detailed description including pricing, features, or news."
                                        rows={4}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'white' }}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> Save to Knowledge Base
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['all', 'qa', 'service', 'announcement'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-subtle)',
                            background: filter === f ? 'white' : 'transparent',
                            color: filter === f ? 'black' : 'var(--text-muted)',
                            fontSize: '0.9rem',
                            textTransform: 'capitalize'
                        }}
                    >
                        {f === 'qa' ? 'Q&A' : f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div style={{ display: 'grid', gap: '16px' }}>
                {filteredEntries.map(entry => (
                    <motion.div
                        key={entry.id}
                        layout
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    background: entry.type === 'qa' ? 'rgba(59, 130, 246, 0.2)' : entry.type === 'service' ? 'rgba(203, 251, 69, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: entry.type === 'qa' ? '#60a5fa' : entry.type === 'service' ? 'var(--primary-lime)' : '#f87171'
                                }}>
                                    {entry.type}
                                </span>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                    {entry.type === 'qa' ? entry.question : entry.title}
                                </h3>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {entry.type === 'qa' ? entry.answer : entry.content}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(entry.id)}
                            style={{ padding: '8px', color: '#ef4444', opacity: 0.7 }}
                            title="Delete Entry"
                        >
                            <Trash2 size={18} />
                        </button>
                    </motion.div>
                ))}
                {filteredEntries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No entries found. Start adding knowledge!
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBase;
