import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig.js';
import styles from './LearnerDashboard.module.css';
import { useNavigate } from 'react-router-dom';

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
                src={`http://localhost:5001${course.image}`}
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
                    Here you can browse through your enrolled courses and keep track of your progress.
                </p>

                {loading && <p>Loading your dashboard...</p>}
                {error && <p className={styles['error']}>{error}</p>}

                {!loading && !error && (
                    <div className={styles['course-list']}>
                        {enrolledCourses.length === 0 ? (
                            <p>No courses enrolled. Start your first course today!</p>
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
