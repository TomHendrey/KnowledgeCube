import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import styles from './CourseDiscovery.module.css';
import Spinner from './Spinner';

const CourseDiscovery = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true); // Ensure loading state is set

                const response = await axiosInstance.get('/courses');
                setCourses(response.data.courses); // Adjust based on API response structure
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.response?.data?.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // To handle enrollement buttons to new courses
    const handleEnroll = async (courseId) => {
        console.log('Enrolling in course with ID:', courseId); // Debug log
        try {
            const token = localStorage.getItem('token'); // Retrieve JWT token
            const response = await axiosInstance.post(
                '/courses/enroll',
                { courseId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message || 'Enrolled successfully');
        } catch (err) {
            console.error('Enrollment failed:', err);
            console.log('Error response:', err.response);
            console.log('Error data:', err.response?.data);
            console.log('Error message:', err.response?.data?.message);

            // Extract and display the correct error message
            const errorMessage = err.response?.data?.message || 'Failed to enroll. Please try again.';
            alert(errorMessage);
        }
    };

    const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={styles.container}>
            <div className={styles['card-container']}>
                <h2 className={styles.title}>Discover Courses</h2>
                <p className={styles['page-description']}>
                    Plese serch below fo any subjects you are interested in to see if we have a course for you.
                </p>
                <input
                    type="text"
                    placeholder="Search for courses..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className={styles['search-bar']}
                />

                {loading && <Spinner />}

                {error && <p className={styles['error']}>{error}</p>}

                {!loading && !error && filteredCourses.length === 0 && <p>No courses found. Try a different search.</p>}

                {!loading && !error && filteredCourses.length > 0 && (
                    <div className={styles['course-list']}>
                        {filteredCourses.map((course) => (
                            <div key={course._id} className={styles['course-card']}>
                                {course.image && (
                                    <img
                                        src={`https://knowledgecube-srfe.onrender.com${course.image}`} // Full image URL
                                        alt={course.title}
                                        className={styles['course-image']}
                                    />
                                )}
                                <h3>{course.title}</h3>
                                <p className={styles['course-description']}>{course.description}</p>
                                <button onClick={() => handleEnroll(course._id)} className={styles['enroll-button']}>
                                    Enroll
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDiscovery;
