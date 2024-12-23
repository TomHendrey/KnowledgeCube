import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './PDFUpload.module.css';

// pdf upload using Dropzne
const PDFUpload = ({ onPDFUpload }) => {
    const [pdfPreview, setPdfPreview] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.pdf',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setPdfPreview(file.name);
            onPDFUpload(file);
        },
    });

    return (
        <div className={styles.uploadContainer}>
            <div {...getRootProps()} className={styles.uploadBox}>
                <input {...getInputProps()} />
                <p>Upload a PDF</p>
            </div>
            {pdfPreview && <p>{pdfPreview}</p>}
        </div>
    );
};

export default PDFUpload;
