import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig.js';
import Spinner from './Spinner.js';
import styles from './LearnerLessonPage.module.css';
import buttonStyles from './LessonButtonStyles.module.css';

const LearnerLessonPage = () => {
    const { id: lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    const resources = [
        { title: 'Additional Resources', url: '#' },
        { title: 'Contact Instructor', url: '#' },
        { title: 'Discussion Forum', url: '#' },
    ];

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/learner/lessons/${lessonId}`);
                setLesson(response.data);

                const userProgress = response.data?.completedLessons || [];
                setIsCompleted(userProgress.includes(lessonId));
            } catch (err) {
                setError('Failed to load lesson details.');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    const markAsComplete = async () => {
        try {
            await axiosInstance.put(`/learner/progress/${lesson.courseId}`, { lessonId });
            setIsCompleted(true);
            alert('Lesson marked as complete!');
        } catch (err) {
            alert('Failed to mark lesson as complete.');
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p className={styles.errorText}>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.lessonContainer}>
                <span className={styles.lessonNumber}>Lesson</span>
                <header className={styles.lessonHeader}>
                    <h1 className={styles.lessonTitle}>{lesson.lessonTitle}</h1>
                </header>
                <div className={styles.lessonContent}>
                    {lesson.images?.length > 0 && (
                        <div className={styles.imageContainer}>
                            <img
                                src={`http://localhost:5001${lesson.images[0]}`}
                                alt={lesson.lessonTitle}
                                className={styles.lessonImage}
                            />
                        </div>
                    )}
                    <h2 className={styles.lessonDescription}>{lesson.lessonDescription}</h2>
                    <p className={styles.lessonText}>{lesson.lessonContent}</p>
                    {lesson.pdf && (
                        <a
                            href={`http://localhost:5001${lesson.pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.pdfLink}
                        >
                            <button className={buttonStyles.pdfButton}>View PDF</button>
                        </a>
                    )}
                    <div className={styles.sampleLinks}>
                        {resources.map((resource, index) => (
                            <a key={index} href={resource.url} className={styles.sampleLink}>
                                {resource.title}
                            </a>
                        ))}
                    </div>
                </div>
                <div>
                    <button
                        className={buttonStyles.blackButton}
                        onClick={() => navigate(`/learner/courses/${lesson.courseId}`)}
                    >
                        Back to Course
                    </button>
                </div>
                <div className={styles.markCompleteContainer}>
                    <button className={buttonStyles.completeButton} disabled={isCompleted} onClick={markAsComplete}>
                        {isCompleted ? 'Completed' : 'Mark as Complete'}
                    </button>
                </div>
                <div className={styles.footerNavigation}>
                    {lesson.previousLessonId && (
                        <button
                            className={buttonStyles.greenButton}
                            onClick={() => navigate(`/learner/lessons/${lesson.previousLessonId}`)}
                        >
                            Previous Lesson
                        </button>
                    )}
                    {lesson.nextLessonId && (
                        <button
                            className={buttonStyles.greenButton}
                            onClick={() => navigate(`/learner/lessons/${lesson.nextLessonId}`)}
                        >
                            Next Lesson
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearnerLessonPage;
