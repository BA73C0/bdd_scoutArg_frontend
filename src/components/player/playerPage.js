import React, { useEffect, useState } from 'react';
import './playerPage.css';

function BodyHome() {
    const [playerData, setPlayerData] = useState({ nombre: '', posicion: '', numero: '' });
    const [opinions, setOpinions] = useState([]);

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

        const examplePlayer = [
            { foto: '/jugador.png', nombre: 'Jugador 1', posicion: 'Arquero', numero: 1 }
        ];
        const opinionsResponse = [
            { usuario: 'Usuario1', texto: 'Gran arquero, muy seguro.' },
            { usuario: 'Usuario2', texto: 'Debe mejorar los reflejos.' },
            { usuario: 'Usuario3', texto: 'Excelente en penales.' },
        ];

        setOpinions(opinionsResponse);
        setPlayerData(examplePlayer);
    }, []);

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
                    <span className="player-position">Posición: {playerData.posicion}</span>
                    <span className="player-number">Número: {playerData.numero}</span>
                </div>
            </header>
        </section>
    );
}

export default BodyHome;
