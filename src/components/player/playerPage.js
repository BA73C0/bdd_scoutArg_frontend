import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import SeeOpinionModal from '../addOpinionButton/seeOpinionModal';
import './playerPage.css';
import { API_URL, ADMIN_ID } from '../../utils';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import { useSupabase } from '../../supabaseContext'

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

    const onDelete = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('current_user'));
            const response = await fetch(`${API_URL}/players/${playerId}`, {
                method: 'DELETE',
                body: JSON.stringify(playerId),
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar el equipo');
            }
            
            navigate('/teams'); 
        } catch (error) {
            console.error('Error al eliminar el equipo:', error);
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
                    .getPublicUrl(playerData.id + '.png');

                setPlayerData({
                    foto: data.publicUrl,
                    nombre: playerData.name,
                    posicion: playerData.position,
                    numero: playerData.number,
                    id: playerData.id,
                    edad: playerData.age,
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
                <AdminDeletePlayerModal
                id = {playerId}
                nombre = {playerData.nombre}
                
                />
                <AdminEditPlayerModal />
            </div>
        </section>
    );
}

function AdminDeletePlayerModal({id, nombre, onDelete}) {
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (user.id !== ADMIN_ID) {
        return null;
    }
    

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const confirmDelete = () => {
        console.log(id);
        closeModal(); 
    };

    return (
        <>
            <button onClick={openModal}>Borrar Jugador</button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>¿Está seguro que quiere borrar a {nombre}?</p>
                        <div className="modal-actions">
                            <button className="confirm-button" onClick={onDelete}>Sí</button>
                            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function AdminEditPlayerModal() {
    const user = JSON.parse(localStorage.getItem('current_user'));
    // PATCH de un player

    if (user.id !== ADMIN_ID) {
        return null;
    } else {
        // reutilizar boton de agregar equipo/jugador

        // hay que hacerle el/los css en index.css
        return (
            <>
                <button>Editar jugador</button>

            </>
                /* Modal con form para editar jugador  */
        );
    }
}


export default PlayerPage;
