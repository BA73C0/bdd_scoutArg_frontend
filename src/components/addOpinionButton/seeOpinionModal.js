import React from 'react';
import './addOpinionModal.css';
import { useState, useEffect } from 'react';
import Table from '../table/table';
import { API_URL } from '../../utils';
import BasicForm from '../basicForm/basicForm';

function SeeOpinionModal({ opinion, onChange, onClose, onSubmit }) {
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [editAvaliable, setEditAvaliable] = useState(false);

    const user = JSON.parse(localStorage.getItem('current_user'));

    useEffect(() => {
        if (opinion && user.id === opinion.user_id) {
            setEditAvaliable(true);
        } else {
            setEditAvaliable(false);
        }
    }, [opinion, user]);
    
    if (!opinion) return null;

    const handleStarClick = (rating) => {
        onChange({ ...opinion, puntuacion: rating });
    };

    const openModal1 = () => setIsModalOpen1(!isModalOpen1);
    const openModal2 = () => setIsModalOpen2(!isModalOpen2);
    const closeSeeModal = () => {
        setIsModalOpen1(false);
        setIsModalOpen2(false);
        onClose();
    };

    if (!opinion) {
        return null;
    }

    return (
        <div className="modal-overlay">
            {isModalOpen2 && <Comment opinion={opinion} onClose={openModal2} />}
            <div className="modal">
                <>
                    <h2>{editAvaliable ? 'Editar Opinión' : 'Opinión'}</h2>
                    <textarea
                        value={opinion.comentario}
                        onChange={(e) =>
                            editAvaliable && onChange({ ...opinion, comentario: e.target.value })
                        }
                        readOnly={!editAvaliable}
                    />
                    <div className="rating-container">
                        <label>Puntuación:</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${opinion.puntuacion >= star ? 'filled' : ''}`}
                                    onClick={() => editAvaliable && handleStarClick(star)}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="button-container">
                        <button onClick={openModal2}>Comentar</button>
                        <button onClick={openModal1}>Ver comentarios</button>
                    </div>
                    {editAvaliable ? (
                        <div className="button-container">
                            <button onClick={() => onSubmit(opinion)}>Guardar Cambios</button>
                            <button onClick={closeSeeModal} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div className="button-container">
                            <button onClick={closeSeeModal} className="cancel-button">
                                Salir
                            </button>
                        </div>
                    )}
                </>
            </div>
            {isModalOpen1 && <SeeComents opinion={opinion} />}
        </div>
    );
}

function SeeComents({ opinion }) {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        try {
            const commentResponse = await fetch(`${API_URL}/players/opinions/${opinion.id}/comments`);
            if (!commentResponse.ok) {
                throw new Error('Error fetching opinions');
            }
            const commentsData = await commentResponse.json();

            const formattedComments = commentsData.map(comment => ({
                user_id: comment.created_at,
                id: comment.player_opinion_id,
                comentario: comment.comment_text,
                created_at: comment.created_at,
            }));
            setComments(formattedComments);
        } catch (err) {
            setError(err.message);
        } 
    };

    const commentColumns = [
        { name: 'Comentario', isImage: false },
    ];

    return (
        <div className="modal" style={{height: "380px", width: "400px", marginLeft: "10px"}}>
            <h2>Comentarios</h2>
            <Table 
                data={comments} 
                columns={commentColumns} 
                onRowClick={() => {}} 
            />
        </div>
    );
}

function Comment({ opinion, onClose }) {
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('current_user'));

    const handleAddComment = async (formData) => {
        const { commentario } = formData;

        const json = {
            opinion_text: commentario,
            created_at: new Date().toISOString(),
        };

        console.log(opinion);

        try {
            console.log(json);
            const response = await fetch(`${API_URL}/players/opinions/${opinion.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(json),
            });

            if (response.ok) {
                await response.json();
                setError('');
                onClose()
            } else {
                throw new Error('Error adding Comment');
            }
        } catch (error) {
            console.error('Error al comentar:', error);
            setError('Error al comentar');
        }
    };

    const fields = [
        { name: 'commentario', label: 'Commentario', required: true },
    ];

    return (
        <div className="modal" style={{width: "400px", marginRight: "10px"}}>
            <h2>Comentar</h2>
            <BasicForm 
                fields={fields} 
                onSubmit={handleAddComment} 
                onCancel={onClose} 
            />
        </div>
    );
}

export default SeeOpinionModal;
