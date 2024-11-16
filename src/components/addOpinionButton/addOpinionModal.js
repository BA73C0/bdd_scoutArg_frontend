import React, { useState } from 'react';
import './addOpinionModal.css';

function AddOpinionModal({ isOpen, onClose, onSubmit }) {
    const [opinion, setOpinion] = useState('');
    const [puntuacion, setPuntuacion] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (opinion.trim()) {
            onSubmit(opinion, puntuacion);
            setOpinion('');
            setPuntuacion(1);
            onClose();
        }
    };

    /*
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (opinion.trim()) {
            // Aquí guardamos la nueva opinión en la base de datos
            const response = await fetch('https://api.ejemplo.com/opinions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ opinion, puntuacion }),
            });

            if (response.ok) {
                const newOpinion = await response.json();
                onSubmit(newOpinion);  // Pasar la nueva opinión al componente principal
                setOpinion('');
                setPuntuacion(1);
                onClose();
            } else {
                console.error('Error guardando la opinión');
            }
        }
    };
    */ 

    const handleStarClick = (rating) => {
        setPuntuacion(rating);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Agregar Opinión</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={opinion}
                        onChange={(e) => setOpinion(e.target.value)}
                        placeholder="Escribe tu opinión..."
                        required
                    />
                    <div className="rating-container">
                        <label>Puntuación:</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${puntuacion >= star ? 'filled' : ''}`}
                                    onClick={() => handleStarClick(star)}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                    </div>
                    <button type="submit">Enviar Opinión</button>
                    <button type="button" onClick={onClose}>Cerrar</button>
                </form>
            </div>
        </div>
    );
}

export default AddOpinionModal;
