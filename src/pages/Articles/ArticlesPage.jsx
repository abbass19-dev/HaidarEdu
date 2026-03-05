import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Eye, Calendar } from 'lucide-react';
import { getArticles } from '../../firebase/db';

const ArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const fetchedArticles = await getArticles();
                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <main style={{ paddingTop: '160px', paddingBottom: '100px' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: window.innerWidth < 768 ? 'flex-start' : 'flex-end',
                    marginBottom: '40px',
                    gap: '24px'
                }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '12px' }}>Market <span style={{ color: 'var(--primary-lime)' }}>Insights</span></h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>Deep-dives, techniques, and articles for the modern trader.</p>
                    </div>
                    <div className="glass" style={{
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: window.innerWidth < 768 ? '100%' : 'auto'
                    }}>
                        <Search size={18} color="var(--text-dim)" />
                        <input type="text" placeholder="Search articles..." style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', width: '100%' }} />
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: 'var(--text-muted)' }}>
                            Loading latest insights...
                        </div>
                    ) : articles.map(article => (
                        <div key={article.id} className="glass" style={{
                            padding: '24px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--primary-lime)', fontSize: '0.8rem', fontWeight: '600' }}>{article.category}</span>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Eye size={14} /> {article.views || 0}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', lineHeight: '1.4', margin: '0' }}>{article.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexGrow: '1' }}>{article.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={14} /> {article.date}
                                </span>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0', fontWeight: '600', cursor: 'pointer' }}>
                                    Read Article <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ArticlesPage;
