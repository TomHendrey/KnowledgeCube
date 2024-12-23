import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './ImageUpload.module.css';

// Image upload for users using Dropzone
const ImageUpload = ({ onImageUpload, label }) => {
    const [imagePreview, setImagePreview] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setImagePreview(URL.createObjectURL(file));
            onImageUpload(file);
        },
    });

    return (
        <div className={styles.uploadContainer}>
            <div {...getRootProps()} className={styles.uploadBox}>
                <input {...getInputProps()} />
                <p>{label || 'Upload an image'}</p>
            </div>
            {imagePreview && (
                <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
