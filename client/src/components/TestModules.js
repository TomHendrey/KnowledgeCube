import React from 'react';
import { createDraft, saveDraft } from '../services/draftService';

const TestModules = () => {
    const testCreateDraft = async () => {
        const modules = [
            {
                moduleTitle: 'Module 1',
                moduleDescription: 'Introduction to the course',
                lessons: [
                    {
                        lessonTitle: 'Lesson 1',
                        lessonDescription: 'Introduction to the first topic',
                        lessonContent: 'This is the first lesson content.',
                    },
                    {
                        lessonTitle: 'Lesson 2',
                        lessonDescription: 'Details about the second topic',
                        lessonContent: 'This is the second lesson content.',
                    },
                ],
            },
        ];

        const formData = new FormData();
        formData.append('title', 'Test Draft Title');
        formData.append('description', 'Test Draft Description');
        formData.append('modules', JSON.stringify(modules));

        try {
            const response = await createDraft(formData);
            console.log('Draft created successfully:', response.data);
        } catch (err) {
            console.error('Error creating draft:', err.response?.data || err.message);
        }
    };

    const testSaveDraft = async () => {
        const draftId = '6772a3defc11e770ca9ac620'; // Replace with a valid draft ID
        const modules = [
            {
                moduleTitle: 'Updated Module Title',
                moduleDescription: 'Updated module description',
                lessons: [
                    {
                        lessonTitle: 'Updated Lesson 1',
                        lessonDescription: 'Updated lesson description 1',
                        lessonContent: 'Updated lesson content 1',
                    },
                ],
            },
        ];

        const formData = new FormData();
        formData.append('title', 'Updated Draft Title');
        formData.append('description', 'Updated Draft Description');
        formData.append('modules', JSON.stringify(modules));

        try {
            const response = await saveDraft(draftId, formData);
            console.log('Draft updated successfully:', response.data);
        } catch (err) {
            console.error('Error updating draft:', err.response?.data || err.message);
        }
    };

    return (
        <div>
            <button onClick={testCreateDraft}>Test Create Draft</button>
            <button onClick={testSaveDraft}>Test Save Draft</button>
        </div>
    );
};

export default TestModules;
