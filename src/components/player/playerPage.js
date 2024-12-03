import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import './playerPage.css';
import { API_URL, ADMIN_ID } from '../../utils';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import { useSupabase } from '../../supabaseContext'
import BasicForm from '../basicForm/basicForm';
import SeeOpinionModal from '../addOpinionButton/seeOpinionModal';

function PlayerPage() {
    const { playerId } = useParams();
    const { supabase } = useSupabase();
    const [playerData, setPlayerData] = useState({ foto: '', nombre: '', posicion: '', numero: '' , edad: ''});
    const [opinions, setOpinions] = useState([]);
    const [selectedOpinion, setSelectedOpinion] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOpinions = async () => {
        setLoading(true);
        try {
            const opinionsResponse = await fetch(`${API_URL}/players/${playerId}/opinions`);
            if (!opinionsResponse.ok) {
                throw new Error('Error fetching opinions');
            }
            const opinionsData = await opinionsResponse.json();

            const formattedOpinions = opinionsData.map(opinion => ({
                created_at: opinion.created_at,
                id: opinion.id,
                comentario: opinion.opinion_text,
                player_id: opinion.player_id,
                puntuacion: opinion.rating,
                user_id: opinion.user_id
            }));
            setOpinions(formattedOpinions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchPlayerData = async () => {
            setLoading(true);
            try {
                const playerResponse = await fetch(`${API_URL}/players/${playerId}`);
                if (!playerResponse.ok) {
                    throw new Error('Error fetching player data');
                }
                const playerData = await playerResponse.json();

                const { data } = await supabase.storage
                    .from("player-pictures")
                    .getPublicUrl(playerData.id);

                setPlayerData({
                    foto: data.publicUrl,
                    nombre: playerData.name,
                    posicion: playerData.position,
                    numero: playerData.number,
                    id: playerData.id,
                    edad: playerData.age,
                    team: playerData.team,
                });

                await fetchOpinions();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [playerId]);

    const handleSubmit = async (opinion, puntuacion) => {
        const json = {
            opinion_text: opinion,
            rating: puntuacion,
            player_id: playerId,
            created_at: new Date().toISOString(),
        };

        const user = JSON.parse(localStorage.getItem('current_user'));

        try {
            const response = await fetch(`${API_URL}/players/opinions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(json),
            });

            if (response.ok) {
                await fetchOpinions(); 
            } else {
                throw new Error('Error adding opinion');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpinionClick = (opinion) => {
        setSelectedOpinion(opinion);
    }

    const closeOpinionForm = () => {
        setSelectedOpinion(null);
    };

    const opinionColumns = [
        { name: 'Comentario', isImage: false },
        { name: 'Puntuación', isImage: false },
    ];

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <section className="player-home">
            <header className="player-header">
                <img
                    src={playerData.foto}
                    alt={`${playerData.nombre} foto`}
                    className="player-picture"
                    onError={(e) => { e.target.src = '/jugador.png'; }}
                />
                <h1 className="player-name">{playerData.nombre}</h1>
                <div className="player-details">
                    <span className="player-position">{playerData.posicion}</span>
                    <span className="player-number">Número: {playerData.numero}</span>
                </div>
            </header>
            <div style={{width: "60%"}}>
                <Table 
                    data={opinions} 
                    columns={opinionColumns} 
                    onRowClick={handleOpinionClick} 
                    redirect={true}
                />
            </div>

            <button className="add-opinion-btn" onClick={() => setIsModalOpen(true)} >
                OPINAR
            </button>

            <AddOpinionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />

            <SeeOpinionModal
                opinion={selectedOpinion}
                onChange={setSelectedOpinion}
                onClose={closeOpinionForm}
                table={{name: 'players'}}
            />
            
            <div className="button-container">
                <AdminDeletePlayerModal playerData={playerData}/>
                <AdminEditPlayerModal playerData={playerData}/>
            </div>
        </section>
    );
}

function SeeSelfOpinionModal({ opinion, onChange, onClose, onSubmit }) {
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [editAvaliable, setEditAvaliable] = useState(false);

    if (!opinion) return null;

    if (user.id !== opinion.id) {
        setEditAvaliable(false);
    } else {
        setEditAvaliable(true);
    }

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
                <Comment opinion={opinion} onClose={openModal2}/>
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
                <SeeComents opinion={opinion}/>
            )}
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

function AdminDeletePlayerModal({ playerData }) {
    const { playerId } = useParams();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('current_user'));
    const navigate = useNavigate();

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const handleDeletePlayer = async () => {

        try {
            const response = await fetch(`${API_URL}/players/${playerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting player');
            }

            await response.json();

            setError('');
            closeModal();
        } catch (error) {
            console.error('Error al borrar el jugador:', error);
            setError('Error al  al borrar el jugador');
        }
        navigate(`/teams/${playerData.team.id}/${playerData.team.name}`);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setError('');
    };

    return (
        <>
            <button onClick={openModal}>Borrar jugador</button>

            {isModalOpen && (
                <div className="form-window-overlay">
                    <div className="form-window">
                        <h1>Borrar jugador</h1>
                        <p>¿Estas seguro que quieres borrar a "{playerData.nombre}"?</p>
                        <BasicForm 
                            onSubmit={handleDeletePlayer} 
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

function AdminEditPlayerModal({ playerData }) {
    const [error, setError] = useState('');
    const { playerId} = useParams();
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { supabase } = useSupabase();
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const uploadPlayerImage = async (playerId) => {
        if (!file) {
            setError('Por favor selecciona un archivo para subir');
            return;
        }

        try {
            const { data } = await supabase.storage
                .from('player-pictures')
                .upload(`${playerId}`, file, {
                    metadata: {
                        owner_id: user.id,
                    },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

        } catch (error) {
            setError('Error al cargar la imagen del jugador');
        }
    };

    const handleEditPlayer = async (formData) => {
        const { playerName, age, position, number } = formData;

        const json = {
            name: playerName,
            age: parseInt(age, 10),
            position: position,
            number: parseInt(number, 10),
            team_id: playerData.team.id,
        };

        try {
            const response = await fetch(`${API_URL}/players/${playerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(json),
            });

            if (response.ok) {
                await response.json();
                if (file) {
                    await uploadPlayerImage(playerId);
                }
            } else {
                console.error('Error al editar el equipo:');
                throw new Error('Error adding Team');
            }
        } catch (error) {
            console.error('Error al editar el equipo:', error);
            setError('Error al editar el equipo');
        } finally {
            setError('');
            closeModal();
            navigate(`/teams/${playerData.team.name}/${playerId}/${playerName}`);
            window.location.reload();
        }
    };

    const fields = [
        { name: 'playerName', label: 'Nombre',value: `${playerData.nombre}`, required: false },
        { name: 'age', label: 'Edad',value: `${playerData.edad}`, required: false },
        { name: 'position', label: 'Posicion',value: `${playerData.posicion}`, required: false },
        { name: 'number', label: 'Numero',value: `${playerData.numero}`, required: false },
        { name: 'foto', label: 'Seleccionar foto', required: false },
    ];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null);
        setError('');
    };

    return (
        <>
            <button onClick={openModal}>Editar Jugador</button>

            {isModalOpen && (
                <div className="form-window-overlay">
                    <div className="form-window">
                        <h1>Editar equipo</h1>
                        <BasicForm 
                            fields={fields} 
                            onSubmit={handleEditPlayer} 
                            onCancel={closeModal} 
                            setFile={setFile}
                        />
                        {error && <p className="error">{error}</p>}
                    </div>
                </div>
            )}
        </>
    );
}


export default PlayerPage;