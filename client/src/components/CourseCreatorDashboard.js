import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import styles from './CourseCreatorDashboard.module.css';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

const CourseCreatorDashboard = () => {
    const [courses, setCourses] = useState({ published: [], drafts: [] });
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user data from the /me route
                const response = await axiosInstance.get('/auth/me');
                const user = response.data;
                console.log('User data fetched:', user);

                const fullName = user.name || '';
                const extractedFirstName = fullName.split(' ')[0];
                setFirstName(extractedFirstName);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch draft and published course data
                const response = await axiosInstance.get('/creator/courses/');
                setCourses({
                    published: response.data.publishedCourses || [],
                    drafts: response.data.draftCourses || [],
                });
                // Clear any existing error
                setError('');
            } catch (err) {
                console.error('Error fetching courses:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Error fetching courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Debug before rendering
    console.log('State before rendering:', { loading, error, courses });

    // Show spinner while loading
    if (loading) {
        console.log('Loading is true, showing spinner...');
        return <Spinner />;
    }

    if (error) {
        console.log('Error occurred:', error);
        return <p className={styles['error']}>{error}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles['dashboard-container']}>
                <h2 className={styles['page-header']}>Your Courses</h2>

                {/* Check if user has no courses */}
                {courses.published.length === 0 && courses.drafts.length === 0 ? (
                    <div className={styles['no-courses-message']}>
                        <p>Welcome {firstName}. It looks like you haven't created any courses yet</p>
                        <p className={styles.getStarted}>Click below to get started and create your first course</p>
                        {/* Create Course Card */}
                        <div
                            className={`${styles['course-card']} ${styles['create-card']}`}
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
                ) : (
                    <>
                        <p className={styles['page-description']}>
                            Welcome back {firstName}. View and manage your created courses below.
                        </p>
                        {/* Published Courses Section */}
                        <div className={styles.section}>
                            <h2 className={styles['section-header']}>Published Courses</h2>
                            <div className={styles['course-list']}>
                                {courses.published.length > 0 ? (
                                    courses.published.map((course) => (
                                        <div key={course._id} className={styles['course-card']}>
                                            <img
                                                src={`https://knowledgecube-srfe.onrender.com${course.image}`}
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
                                    ))
                                ) : (
                                    <p className={styles['no-courses']}>No published courses available.</p>
                                )}
                            </div>
                        </div>

                        {/* Draft Courses Section */}
                        <div className={styles.section}>
                            <h2 className={styles['section-header']}>Draft Courses</h2>
                            <div className={styles['drafts-list']}>
                                {courses.drafts.length > 0 ? (
                                    courses.drafts.map((draft) => (
                                        <div key={draft._id} className={styles['course-card']}>
                                            <img
                                                src={`https://knowledgecube-srfe.onrender.com${draft.image}`}
                                                alt={draft.title}
                                                className={styles['course-image']}
                                            />
                                            <h3 className={styles['course-title']}>{draft.title}</h3>
                                            <button
                                                className={styles['course-action']}
                                                onClick={() => navigate(`/creator/courses/${draft._id}`)}
                                            >
                                                View Draft
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles['no-courses']}>No drafts available.</p>
                                )}
                                {/* Always append the Create A New Course card last */}
                                <div
                                    className={`${styles['course-card']} ${styles['create-card']}`}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseCreatorDashboard;
