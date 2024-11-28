import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../table/table';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import SeeOpinionModal from '../addOpinionButton/seeOpinionModal';
import './playerPage.css';
import { API_URL } from '../../utils';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';

function PlayerPage() {
    const { playerId } = useParams();
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

                const formattedplayerData = {
                    foto: playerData.photo || '/jugador.png',
                    nombre: playerData.name,
                    posicion: playerData.position,
                    numero: playerData.number,
                    id: playerData.id,
                    edad: playerData.age,
                };
                setPlayerData(formattedplayerData);

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
        </section>
    );
}

export default PlayerPage;
