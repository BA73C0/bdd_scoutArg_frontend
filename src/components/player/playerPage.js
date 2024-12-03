import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import SeeOpinionModal from '../addOpinionButton/seeOpinionModal';
import './playerPage.css';
import { API_URL, ADMIN_ID } from '../../utils';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import { useSupabase } from '../../supabaseContext'
import BasicForm from '../basicForm/basicForm';

function PlayerPage() {
    const { playerId } = useParams();
    const { supabase } = useSupabase();
    const navigate = useNavigate();
    const [playerData, setPlayerData] = useState({ foto: '', nombre: '', posicion: '', numero: '' });
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

                console.log(playerData);

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
            <Table 
                data={opinions} 
                columns={opinionColumns} 
                onRowClick={handleOpinionClick} 
            />

            <button 
                className="add-opinion-btn"
                onClick={() => setIsModalOpen(true)}
            >
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
            />
            <div  className="button-container">
                <AdminDeletePlayerModal playerData={playerData}/>
                <AdminEditPlayerModal playerData={playerData}/>
            </div>
        </section>
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
    const { playerId } = useParams();
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { supabase } = useSupabase();
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const uploadPlayerImage = async (teamId) => {
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

    const handleEditTeam = async (formData) => {
        const { playerName, age, position, number } = formData;

        const json = {
            name: playerName,
            age: parseInt(age, 10),
            position,
            number: parseInt(number, 10),
            team_id: teamId,
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
                    await uploadPlayerImage(teamId);
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
            navigate(`/teams/${teamId}/${teamName}`);
            window.location.reload();
        }
    };

    const fields = [
        { name: 'playerName', label: 'Nombre', required: true },
        { name: 'age', label: 'Edad', required: true },
        { name: 'position', label: 'Posicion', required: true },
        { name: 'number', label: 'Numero', required: true },
        { name: 'foto', label: 'Seleccionar foto', required: true },
    ];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null);
        setError('');
    };

    return (
        <>
            <button onClick={openModal}>Editar equipo</button>

            {isModalOpen && (
                <div className="form-window-overlay">
                    <div className="form-window">
                        <h1>Editar equipo</h1>
                        <BasicForm 
                            fields={fields} 
                            onSubmit={handleEditTeam} 
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