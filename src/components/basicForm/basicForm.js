import React, { useState } from 'react';
import './basicForm.css';

const BasicForm = ({ fields, onSubmit, onCancel, setImage  }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {})
    );
  
    const handleChange = (e) => {
        const { name, value } = e.target;
            setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        for (const field of fields) {
            if (field.name === 'foto') continue;
            if (!formData[field.name]) {
                setErrorMessage(`Por favor, ingresa todos los campos.`);
                return;
            }
        }

        if (setImage && !file) {
            setErrorMessage(`Por favor, selecciona una imagen.`);
            return;
        }

        setErrorMessage('');
        onSubmit({ ...formData, file });
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            {fields.map(field => (
                <div className="form-group" key={field.name}>
                    {field.name === 'foto' ? (
                        <div className="file-upload">
                            <label htmlFor="file-upload" className="custom-file-upload">
                                {field.label}
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                name="foto"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <p> {file ? file.name : 'No se ha seleccionado un archivo'} </p>
                        </div>
                    ) : (
                        <>
                            <label htmlFor={field.name}>{field.label}</label>
                            <input
                                type={field.type || 'text'}
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            />
                        </>
                    )}
                </div>
            ))}

            {errorMessage && <p className="error">{errorMessage}</p>}

            <div className="button-container">
                <button type="submit" className="auth-button">Confirmar</button>
                {onCancel && typeof onCancel === 'function' && (
                    <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
                )}
            </div>
        </form>
    );
};

export default BasicForm;
