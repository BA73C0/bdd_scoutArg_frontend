// src/components/BasicForm.js
import React, { useState } from 'react';
import './basicForm.css';

const BasicForm = ({ fields, onSubmit }) => {
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
    
        for (const field of fields) {
            if (!formData[field.name]) {
                setErrorMessage(`Por favor, ingresa todos los campos.`);
                return;
            }
        }

        setErrorMessage('');
        onSubmit(formData); 
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            {fields.map(field => (
                <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                    type={field.type || 'text'}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                />
                </div>
            ))}

            {errorMessage && <p className="error">{errorMessage}</p>}

            <div className="button-container">
                <button type="submit" className="auth-button">Enviar</button>
            </div>
        </form>
    );
};

export default BasicForm;
