import React from 'react';
import './addOpinionModal.css';
import { useState, useEffect } from 'react';
import Table from '../table/table';
import { API_URL } from '../../utils';
import BasicForm from '../basicForm/basicForm';

function SeeSelfOpinionModal({ opinion, onChange, onClose, onSubmit, table }) {
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
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

    return (
        <div className="modal-overlay">
            {isModalOpen2 && (
                <Comment opinion={opinion} onClose={openModal2} table={table}/>
            )}
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

                <div className="button-container">
                    <button onClick={() => onSubmit(opinion)}>Guardar Cambios</button>
                    <button onClick={openModal2}>Comentar</button>
                    <button onClick={openModal1}>Ver comentarios</button>
                    <button onClick={closeSeeModal} className="cancel-button" >Cancelar</button>
                </div>
            </div>
            {isModalOpen1 && (
                <SeeComents opinion={opinion} table={table}/>
            )}
        </div>
    );
}

function SeeComents({ opinion, table }) {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        try {
            const commentResponse = await fetch(`${API_URL}/${table.name}/opinions/${opinion.id}/comments`);
            if (!commentResponse.ok) {
                throw new Error('Error fetching opinions');
            }
            const commentsData = await commentResponse.json();

            const formattedComments = commentsData.map(comment => ({
                user_id: comment.created_at,
                id: comment.player_opinion_id,
                comentario: comment.opinion_text,
                created_at: comment.created_at,
            }));
            setComments(formattedComments);
        } catch (err) {
            setError(err.message);
        } 
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const commentColumns = [
        { name: 'Comentarios', isImage: false },
    ];

    return (
        <div className="modal" style={{height: "380px", width: "400px", marginLeft: "10px"}}>
            <h2>Comentarios</h2>
            <div style={{height: "280px"}}>
                <Table 
                    data={comments} 
                    columns={commentColumns} 
                    onRowClick={() => {}} 
                />
            </div>
        </div>
    );
}

function Comment({ opinion, onClose, table }) {
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('current_user'));

    const handleAddComment = async (formData) => {
        const { commentario } = formData;

        const json = {
            opinion_text: commentario,
            created_at: new Date().toISOString(),
        };

        console.log(json);

        try {
            console.log(json);
            const response = await fetch(`${API_URL}/${table.name}/opinions/${opinion.id}/comments`, {
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
                window.location.reload();
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

export default SeeSelfOpinionModal;
