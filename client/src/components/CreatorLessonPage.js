import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CreatorLessonPage.module.css';
import buttonStyles from './buttonStyles.module.css';
import axiosInstance from '../axiosConfig';
import Spinner from './Spinner';

const CreatorLessonPage = () => {
    const { id: lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/creator/lessons/${lessonId}`);
                setLesson(response.data);
            } catch (err) {
                setError('Failed to load lesson details.');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    if (loading) return <Spinner />;
    if (error) return <p>{error}</p>;

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
                </div>
                <div>
                    <button
                        className={buttonStyles.blackButton}
                        onClick={() => navigate(`/creator/courses/${lesson.courseId}`)}
                    >
                        Back to Course
                    </button>
                </div>
                <div className={styles.footerNavigation}>
                    {lesson.previousLessonId && (
                        <button
                            className={buttonStyles.greenButton}
                            onClick={() => navigate(`/creator/lessons/${lesson.previousLessonId}`)}
                        >
                            Previous Lesson
                        </button>
                    )}
                    {lesson.nextLessonId && (
                        <button
                            className={buttonStyles.greenButton}
                            onClick={() => navigate(`/creator/lessons/${lesson.nextLessonId}`)}
                        >
                            Next Lesson
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatorLessonPage;
