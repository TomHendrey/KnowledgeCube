import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig.js';
import Spinner from './Spinner.js';
import styles from './CreatorCourseDetails.module.css';

const LearnerCourseDetails = () => {
    const { id: courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/learner/courses/${courseId}`);

                if (!response.data || !response.data.course) {
                    throw new Error('Invalid course data');
                }

                const { course, progressPercentage } = response.data;

                setCourse(course);
                setProgressPercentage(progressPercentage || 0);
            } catch (err) {
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (loading) return <Spinner />;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.courseHeader}>
                    <img
                        src={`https://knowledgecube-srfe.onrender.com${course?.image}`}
                        alt={course?.title || 'Course Image'}
                        className={styles.courseImage}
                    />
                    <div className={styles.courseDetails}>
                        <h1 className={styles.courseTitle}>{course?.title}</h1>
                        <p className={styles.courseDescription}>{course?.description}</p>
                        <div className={styles.progressContainer}>
                            <label className={styles.progressLabel}>Progress: {progressPercentage}%</label>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width: `${progressPercentage}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
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
                                                            ? `https://knowledgecube-srfe.onrender.com${lesson.images[0]}`
                                                            : `https://knowledgecube-srfe.onrender.com/uploads/lesson-placeholder.jpg`
                                                    }
                                                    alt={lesson.lessonTitle || 'Lesson Image'}
                                                    className={styles.lessonImage}
                                                />
                                                <h5 className={styles.lessonTitle}>{lesson.lessonTitle}</h5>
                                                <button
                                                    className={styles.viewLessonButton}
                                                    onClick={() => navigate(`/learner/lessons/${lesson._id}`)}
                                                >
                                                    Go To Lesson
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

export default LearnerCourseDetails;
