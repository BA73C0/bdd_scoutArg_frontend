import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import './playerPage.css';
import { API_URL } from '../../utils';


function BodyHome() {
    const { playerId } = useParams();
    const [playerData, setPlayerData] = useState({ foto: '', nombre: '', posicion: '', numero: '' });
    const [opinions, setOpinions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setLoading(true);
                const playerResponse = await fetch(`${API_URL}/players/${playerId}`);
                if (!playerResponse.ok) {
                    throw new Error('Error fetching team data');
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

                // las opiniones siguen hardcodeadas
                const opinionsResponse = [
                    { usuario: 'Usuario1', opinion: 'Gran arquero, muy seguro.' , puntuacion: 5},
                    { usuario: 'Usuario2', opinion: 'Debe mejorar los reflejos.' , puntuacion: 3},
                    { usuario: 'Usuario3', opinion: 'Excelente en penales.' , puntuacion: 4},
                ];
                setOpinions(opinionsResponse);


            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, []);

    const opinionColumns = [
        { name: 'Usuario', isImage: false },
        { name: 'Opinion', isImage: false },
        { name: 'Puntuación', isImage: false },
    ];

    const handleAddOpinion = (newOpinion, newPuntuacion) => {
        const newOpinionEntry = {
            usuario: 'Nuevo Usuario',
            opinion: newOpinion,
            puntuacion: newPuntuacion
        };
        setOpinions([...opinions, newOpinionEntry]); 
    };

    /*
    const handleAddOpinion = (newOpinion) => {
        setOpinions([...opinions, newOpinion]);
    };
    */

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
                onRowClick={() => {}} 
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
                onSubmit={handleAddOpinion}
            />
        </section>
    );
}

export default BodyHome;
