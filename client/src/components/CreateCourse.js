import React, { useState } from 'react';
import axiosInstance from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import styles from './CreateCourse.module.css';
import ImageUpload from './ImageUpload.js';
import PDFUpload from './PDFUpload.js';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modules, setModules] = useState([]);
    const [courseImage, setCourseImage] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Add a new module
    const addModule = () => {
        setModules([...modules, { moduleTitle: '', moduleDescription: '', lessons: [] }]);
    };

    // Remove a module
    const removeModule = (moduleIndex) => {
        const updatedModules = [...modules];
        updatedModules.splice(moduleIndex, 1);
        setModules(updatedModules);
    };

    // Update module title
    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...modules];
        updatedModules[index][field] = value;
        setModules(updatedModules);
    };

    // Add a new lesson to a module
    const addLesson = (moduleIndex) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].lessons.push({
            lessonTitle: '',
            moduleDescription: '',
            lessonContent: '',
        });
        setModules(updatedModules);
    };

    // Remove a lesson
    const removeLesson = (moduleIndex, lessonIndex) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
        setModules(updatedModules);
    };

    // Update lesson title or content
    const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
        setModules(updatedModules);
    };

    // Handle image upload
    const handleCourseImageUpload = (file) => {
        setCourseImage(file); // Attach file for form submission
    };

    // Handle form submission
    const handleSubmit = async (isDraft) => {
        // Prevent default form submission
        if (isDraft === undefined) return; // Safety check for undefined values

        if (!isDraft && modules.length === 0) {
            setMessage('You must add at least one module.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description || ''); // Allow empty description for drafts
        formData.append('isDraft', isDraft); // Include the draft flag

        if (courseImage) formData.append('image', courseImage);
        pdfs.forEach((pdf) => formData.append('pdfs', pdf));

        modules.forEach((module, moduleIndex) => {
            formData.append(`modules[${moduleIndex}][moduleTitle]`, module.moduleTitle);
            formData.append(`modules[${moduleIndex}][moduleDescription]`, module.moduleDescription);

            module.lessons.forEach((lesson, lessonIndex) => {
                formData.append(`modules[${moduleIndex}][lessons][${lessonIndex}][lessonTitle]`, lesson.lessonTitle);
                formData.append(
                    `modules[${moduleIndex}][lessons][${lessonIndex}][lessonContent]`,
                    lesson.lessonContent || ''
                );
                if (lesson.lessonImage) {
                    formData.append('lessonImages', lesson.lessonImage);
                }
                if (lesson.lessonPDF) {
                    formData.append('pdfs', lesson.lessonPDF);
                }
            });
        });

        try {
            const endpoint = isDraft ? '/courses/draft' : '/courses/create'; // Determine endpoint
            const token = localStorage.getItem('token');

            const response = await axiosInstance.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage(response.data.message);

            // Reset form fields after publishing (not for drafts)
            if (!isDraft) {
                setTitle('');
                setDescription('');
                setModules([]);
                setCourseImage(null);
                setPdfs([]);
                navigate('/creator-dashboard'); // Redirect after publishing
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error saving course.');
        }
    };

    // Validation function to check if the course can be published
    const canPublish = () => {
        // Ensure title and description are filled
        if (!title || !description) return false;

        // Ensure at least one module exists
        if (modules.length === 0) return false;

        // Validate each module and its lessons
        for (const module of modules) {
            if (!module.moduleTitle || !module.moduleDescription) return false;
            for (const lesson of module.lessons) {
                if (!lesson.lessonTitle) return false;
            }
        }

        // All validations passed
        return true;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles['page-header']}>Create a New Course</h1>
            <p className={styles['page-description']}>
                Here you can use our course builder to create a course from scratch. Please complete at least one
                module.
            </p>

            <form onSubmit={handleSubmit} className={styles.createCourseForm}>
                <h3>Course Title</h3>

                <input
                    type="text"
                    placeholder="Enter your title here... max 30 characters"
                    className={styles.inputField}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <h3>Course Description</h3>
                <input
                    type="text"
                    placeholder="Enter your description here... max 60 characters"
                    className={styles.inputField}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                {/* Course Image Upload */}
                <div className={styles.coverImageSection}>
                    <h3>Course Cover Image</h3>
                    <p>Please upload a cover image for your course, square images work better</p>

                    <ImageUpload id="courseImageUpload" onImageUpload={handleCourseImageUpload} />
                </div>

                <hr className={styles.spacer} />

                {/* Modules and Lessons */}
                <h3>Content</h3>
                <p>All courses must have at leat one module</p>
                {modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className={styles.module}>
                        <div className={styles.moduleHeader}>
                            <h3>Module Title</h3>
                        </div>
                        <input
                            className={styles.moduleInput}
                            type="text"
                            placeholder="Enter module title here..."
                            value={module.moduleTitle}
                            onChange={(e) => handleModuleChange(moduleIndex, 'moduleTitle', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Enter module description here..."
                            value={module.moduleDescription}
                            onChange={(e) => handleModuleChange(moduleIndex, 'moduleDescription', e.target.value)}
                            required
                        />

                        {/* Remove Module Button */}
                        <button type="button" onClick={() => removeModule(moduleIndex)} className={styles.removeButton}>
                            Remove Module
                        </button>

                        {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className={styles.lesson}>
                                <div className={styles.lessonHeader}>
                                    <h3>Lesson Title</h3>
                                    <p>All courses must have at leat one lesson, please number them in sequence.</p>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter lesson title here..."
                                    value={lesson.lessonTitle}
                                    onChange={(e) =>
                                        handleLessonChange(moduleIndex, lessonIndex, 'lessonTitle', e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Enter lesson description here..."
                                    value={lesson.lessonDescription}
                                    onChange={(e) =>
                                        handleLessonChange(
                                            moduleIndex,
                                            lessonIndex,
                                            'lessonDescription',
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                {/* Lesson Content Text Area */}
                                <h3>Lesson Content</h3>
                                <p>All courses must some written content</p>
                                <textarea
                                    placeholder="Enter detailed lesson content here..."
                                    value={lesson.lessonContent || ''}
                                    onChange={(e) =>
                                        handleLessonChange(moduleIndex, lessonIndex, 'lessonContent', e.target.value)
                                    }
                                    rows={6}
                                    className={styles.textArea}
                                />

                                {/* Upload Lesson Image */}
                                <h3>Upload Lesson Image</h3>
                                <p>Please upload a cover image for your course, square images work</p>
                                <ImageUpload
                                    onImageUpload={(file) =>
                                        handleLessonChange(moduleIndex, lessonIndex, 'lessonImage', file)
                                    }
                                />

                                {/* Upload Lesson PDF */}
                                <h3>Upload Lesson PDF</h3>
                                <p>Please upload a PDF document to support your lesson here</p>

                                <PDFUpload
                                    onPDFUpload={(file) =>
                                        handleLessonChange(moduleIndex, lessonIndex, 'lessonPDF', file)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                    className={styles.removeButton}
                                >
                                    Remove Lesson
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addLesson(moduleIndex)} className={styles.addLesson}>
                            Add Lesson
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addModule} className={styles.addButton}>
                    Add Module
                </button>
                <div></div>
                <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    className={`${styles.addButton} ${styles.draftButton}`}
                >
                    Save as Draft
                </button>
                <div></div>
                <p className={styles.publishDescription}>
                    Before publishing a course you must include a 'Course Title' and a 'Course Description', as well as
                    at least one Module also with a 'Title' and a 'Descripion'.
                </p>
                <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    className={`${styles.addButton} ${styles.submitButton}`}
                    disabled={!canPublish()}
                >
                    Publish Course
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateCourse;
