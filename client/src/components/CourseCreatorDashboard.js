import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import styles from './CourseCreatorDashboard.module.css';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

const CourseCreatorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get('/creator/courses/');
                setCourses(response.data.courses);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Show spinner while loading
    if (loading) return <Spinner />;
    if (error) return <p className={styles['error']}>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles['dashboard-container']}>
                <h2 className={styles['page-header']}>Your Courses</h2>
                <p className={styles['page-description']}>View your created courses here</p>

                <div className={styles['course-list']}>
                    {courses.map((course) => (
                        <div key={course._id} className={styles['course-card']}>
                            <img
                                src={`http://localhost:5001${course.image}`}
                                alt={course.title}
                                className={styles['course-image']}
                            />
                            <h3 className={styles['course-title']}>{course.title}</h3>
                            <button
                                className={styles['course-action']}
                                onClick={() => navigate(`/creator/courses/${course._id}`)}
                            >
                                View Course
                            </button>
                        </div>
                    ))}

                    {/* Final card for creating a new course */}
                    <div
                        className={`${styles['course-card']} ${styles['create-card']}`}
                        style={{
                            border: '2px dashed #ccc',
                            backgroundColor: '#f9f9f9',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/create-course')}
                    >
                        <div>
                            <span className={styles['course-wordA']}>Create A New</span>
                            <br />
                            <span className={styles['course-wordB']}>Course</span>
                            <br />
                            <span className={styles['course-wordC']}>+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCreatorDashboard;
