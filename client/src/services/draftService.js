import axiosInstance from '../axiosConfig';

/**
 * Create a new draft course.
 * @param {FormData} formData - FormData containing course details.
 * @returns {Promise<Object>} - Response from the API.
 */
export const createDraft = async (formData) => {
    const token = localStorage.getItem('token');
    return axiosInstance.post('/courses/draft', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
};

/**
 * Update an existing draft course.
 * @param {string} draftId - The ID of the draft to update.
 * @param {FormData} formData - FormData containing updated course details.
 * @returns {Promise<Object>} - Response from the API.
 */
export const saveDraft = async (draftId, formData) => {
    const token = localStorage.getItem('token');
    return axiosInstance.put(`/courses/draft/${draftId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
};
