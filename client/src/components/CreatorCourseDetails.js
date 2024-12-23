import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig.js';
import Spinner from './Spinner.js';
import styles from './CreatorCourseDetails.module.css';

const CourseDetails = () => {
    const { id: courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/creator/courses/${courseId}`);
                setCourse(response.data);
            } catch {
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (loading) return <Spinner />;
    if (error) return <p className={styles.error}>{error}</p>;

    const handleViewLesson = (lessonId) => {
        navigate(`/creator/lessons/${lessonId}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.courseHeader}>
                    <img
                        src={`http://localhost:5001${course?.image}`}
                        alt={course?.title}
                        className={styles.courseImage}
                    />
                    <div className={styles.courseDetails}>
                        <h1 className={styles.courseTitle}>{course?.title}</h1>
                        <p className={styles.courseDescription}>{course?.description}</p>
                    </div>
                </div>

                {course?.modules?.length > 0 ? (
                    <div className={styles.modulesContainer}>
                        {course.modules.map((module, index) => (
                            <div key={module._id} className={styles.moduleCard}>
                                <h3 className={styles.moduleTitle}>
                                    Module {index + 1} - {module.moduleTitle}
                                </h3>
                                <p className={styles.moduleDescription}>{module.moduleDescription}</p>
                                {module.lessons?.length > 0 ? (
                                    <div className={styles.lessonsContainer}>
                                        {module.lessons.map((lesson) => (
                                            <div key={lesson._id} className={styles.lessonCard}>
                                                <img
                                                    src={
                                                        lesson.images?.length > 0
                                                            ? `http://localhost:5001${lesson.images[0]}`
                                                            : `http://localhost:5001/uploads/lesson-placeholder.jpg`
                                                    }
                                                    alt={lesson.lessonTitle}
                                                    className={styles.lessonImage}
                                                />
                                                <h5 className={styles.lessonTitle}>{lesson.lessonTitle}</h5>
                                                <button
                                                    className={styles.viewLessonButton}
                                                    onClick={() => handleViewLesson(lesson._id)}
                                                >
                                                    View Lesson
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.noLessons}>No lessons available in this module.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noModules}>No modules available for this course yet.</p>
                )}
            </div>
        </div>
    );
};

export default CourseDetails;
