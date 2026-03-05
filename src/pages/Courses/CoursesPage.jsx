import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { getCourses } from '../../firebase/db';
import { optimizeImage } from '../../utils/cloudinary';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const fetchedCourses = await getCourses();
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <main style={{ paddingTop: '160px', paddingBottom: '100px' }}>
            <div className="container">
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '16px' }}>Trading <span style={{ color: 'var(--primary-lime)' }}>Programs</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>Structured education designed to take you from beginner to professional.</p>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: 'var(--text-muted)' }}>
                            Loading professional courses...
                        </div>
                    ) : courses.map(course => (
                        <div key={course.id} className="glass" style={{
                            padding: '0',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            {course.imageUrl && (
                                <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                                    <img src={optimizeImage(course.imageUrl)} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}

                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--primary-lime)', fontWeight: '700', fontSize: '1.25rem' }}>{course.price}</span>
                                    <span className="glass" style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem' }}>{course.level}</span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{course.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{course.desc}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const message = encodeURIComponent(`Hello Haidar, I am interested in enrolling in the "${course.title}" course.`);
                                        window.open(`https://t.me/abbasshij?text=${message}`, '_blank');
                                    }}
                                    className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                                >
                                    Enroll Now <BookOpen size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default CoursesPage;
