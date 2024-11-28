import React from 'react';
import './addOpinionModal.css';

function SeeOpinionModal({ opinion, onChange, onClose, onSubmit }) {
    if (!opinion) return null;

    const handleStarClick = (rating) => {
        onChange({ ...opinion, puntuacion: rating });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Editar Opinión</h2>
                <textarea
                    value={opinion.comentario}
                    onChange={(e) => onChange({ ...opinion, comentario: e.target.value })}
                />
                
                <div className="rating-container">
                    <label>Puntuación:</label>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${opinion.puntuacion >= star ? 'filled' : ''}`}
                                onClick={() => handleStarClick(star)}
                            >
                                &#9733;
                            </span>
                        ))}
                    </div>
                </div>

                <div className="modal-buttons">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={() => onSubmit(opinion)}>Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
}

export default SeeOpinionModal;
