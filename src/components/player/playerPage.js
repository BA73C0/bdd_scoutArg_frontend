import React, { useEffect, useState } from 'react';
import Table from '../table/table';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import './playerPage.css';

function BodyHome() {
    const [playerData, setPlayerData] = useState({ foto: '', nombre: '', posicion: '', numero: '' });
    const [opinions, setOpinions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        /*
        const fetchPlayer = async () => {
            try {
                const response = await fetch('https://api.ejemplo.com/players/${playerId}');
                const data = await response.json();
                setPlayerData(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        setPlayerData(examplePlayer);

        setOpinions(opinionsResponse);?????
        
        fetchPlayer();
        */

        const examplePlayer = {
            foto: '/jugador.png',
            nombre: 'Jugador 1',
            posicion: 'Arquero',
            numero: 1
        };
        setPlayerData(examplePlayer);
        
        const opinionsResponse = [
            { usuario: 'Usuario1', opinion: 'Gran arquero, muy seguro.' , puntuacion: 5},
            { usuario: 'Usuario2', opinion: 'Debe mejorar los reflejos.' , puntuacion: 3},
            { usuario: 'Usuario3', opinion: 'Excelente en penales.' , puntuacion: 4},
        ];
        setOpinions(opinionsResponse);
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
        setOpinions([...opinions, newOpinion]);  // Agrega la nueva opinión a la lista de opiniones
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
