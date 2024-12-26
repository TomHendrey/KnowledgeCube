import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig.js';
import styles from './LearnerDashboard.module.css';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const LearnerDashboard = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get('/learner/courses');
                setEnrolledCourses(response.data.enrolledCourses);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.response?.data?.message || 'Error fetching courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const renderCourseCard = (course) => (
        <div key={course.courseId} className={styles['course-card']}>
            <img
                src={`https://knowledgecube-srfe.onrender.com${course.image}`}
                alt={`${course.title} cover`}
                className={styles['course-image']}
            />
            <h4 className={styles['course-title']}>{course.title}</h4>
            <p className={styles['course-description']}>{course.description}</p>

            {course.progressPercentage === 100 ? (
                <div className={styles['completed-badge']}>Completed</div>
            ) : (
                <div className={styles['progress-container']}>
                    <p className={styles['progress-label']}>Progress: {course.progressPercentage}%</p>
                    <div className={styles['progress-bar']}>
                        <div className={styles['progress']} style={{ width: `${course.progressPercentage}%` }}></div>
                    </div>
                </div>
            )}

            <button className={styles['course-action']} onClick={() => navigate(`/learner/courses/${course.courseId}`)}>
                {course.progressPercentage === 100 ? 'View Course' : 'Continue Course'}
            </button>
        </div>
    );

    return (
        <div className={styles['page-container']}>
            <div className={styles['dashboard-container']}>
                <h2 className={styles['page-header']}>Your Courses</h2>
                <p className={styles['page-description']}>
                    {enrolledCourses.length === 0
                        ? 'Start exploring courses to begin your learning journey.'
                        : 'Here you can browse through your enrolled courses and keep track of your progress.'}
                </p>
                {loading && <Spinner />}
                {error && <p className={styles['error']}>{error}</p>}
                {!loading && !error && (
                    <div className={styles['course-list']}>
                        {enrolledCourses.length === 0 ? (
                            <div className={styles['no-courses-container']}>
                                <h2 className={styles['no-courses-header']}>Discover New Learning Paths</h2>
                                <div className={styles['no-courses-content']}>
                                    <div
                                        className={styles['explore-card']}
                                        onClick={() => navigate('/course-discovery')}
                                    >
                                        <h3 className={styles['explore-card-title1']}>Explore New</h3>
                                        <h3 className={styles['explore-card-title2']}>Courses</h3>
                                        <div className={styles['explore-card-icon']}>🔍</div>
                                    </div>
                                    <p className={styles['explore-text']}>
                                        Begin your journey today and start exploring courses designed to broaden your
                                        knowledge and skills.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            enrolledCourses.map(renderCourseCard)
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearnerDashboard;
