import React from 'react';
import './addOpinionModal.css';
import { useState, useEffect } from 'react';
import Table from '../table/table';
import { API_URL, ADMIN_ID } from '../../utils';
import BasicForm from '../basicForm/basicForm';

function SeeOpinionModal({ opinion, onChange, onClose, onSubmit, teamOrPlayer }) {
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
                    {user.id === ADMIN_ID && (
                        <div className="button-container">
                            <DeleteOpinion opinion={opinion} onClose={closeSeeModal} whereTo={teamOrPlayer}/>
                        </div>
                    )}
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
                        <>
                            <div className="button-container">
                                <button onClick={() => onSubmit(opinion)}>Guardar Cambios</button>
                                <button onClick={closeSeeModal} className="cancel-button">
                                    Cancelar
                                </button>
                            </div>
                            <div className="button-container">
                                <DeleteOpinion opinion={opinion} onClose={closeSeeModal} whereTo={teamOrPlayer}/>
                            </div>
                        </>
                    ) : (
                        <div className="button-container">
                            <button onClick={closeSeeModal} className="cancel-button">
                                Salir
                            </button>
                        </div>
                    )}
                </>
            </div>
            {isModalOpen1 && <SeeComents opinion={opinion} whereTo={teamOrPlayer} />}
        </div>
    );
}

function SeeComents({ opinion, whereTo }) {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("current_user"));
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleCommentClick = (comment) => {
        if (user.id !== ADMIN_ID && user.id !== comment.user_id) {
            return;
        }

        const handleDeleteOpinion = async () => {
            try {
                const response = await fetch(`${API_URL}/${whereTo}/opinions/${opinion.id}/comments/${comment.id}`, {
                    method: "DELETE",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Error deleting comment");
                }
    
                await response.json();
    
                setError("");
                closeModal();
            } catch (error) {
                console.error("Error al borrar el comentario:", error);
                setError("Error al borrar el comentario");
            }
        };

        const openModal = () => setIsModalOpen(true);
        const closeModal = () => {
            setIsModalOpen(false);
            setError("");
        };

        return (
            <>
            <button onClick={openModal} className="cancel-button">Borrar comentario</button>
    
            {isModalOpen && (
                <div className="form-window-overlay">
                <div className="form-window">
                    <h1>Borrar comentario</h1>
                    <p>¿Estas seguro que quieres borrar este comentario?</p>
                    <BasicForm
                    onSubmit={handleDeleteOpinion}
                    onCancel={closeModal}
                    fields={[]}
                    setImage={false}
                    />
                </div>
                </div>
            )}
            </>
        );
    }

    return (
        <div className="modal" style={{height: "380px", width: "400px", marginLeft: "10px"}}>
            <h2>Comentarios</h2>
            <Table 
                data={comments} 
                columns={commentColumns} 
                onRowClick={handleCommentClick} 
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

function DeleteOpinion({ opinion, onClose, whereTo }) {
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("current_user"));

    const handleDeleteOpinion = async () => {
        try {
            const response = await fetch(`${API_URL}/${whereTo}/opinions/${opinion.id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error deleting opinion");
            }

            await response.json();

            setError("");
            closeModal();
        } catch (error) {
            console.error("Error al borrar la opinion:", error);
            setError("Error al borrar la opinion");
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setError("");
    };

    return (
        <>
        <button onClick={openModal} className="cancel-button">Borrar opinion</button>

        {isModalOpen && (
            <div className="form-window-overlay">
            <div className="form-window">
                <h1>Borrar opinion</h1>
                <p>¿Estas seguro que quieres borrar esta opinión?</p>
                <BasicForm
                onSubmit={handleDeleteOpinion}
                onCancel={closeModal}
                fields={[]}
                setImage={false}
                />
            </div>
            </div>
        )}
        </>
    );
}

export default SeeOpinionModal;
