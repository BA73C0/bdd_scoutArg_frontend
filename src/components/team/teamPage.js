import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import './teamPage.css';

function TeamPage() {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState({ nombre: '', escudo: '' });
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        /*
        const fetchTeamData = async () => {
            try {
                setLoading(true);
                
                // Solicitud para obtener datos del equipo
                const teamResponse = await fetch(`https://api.ejemplo.com/teams/${teamId}`);
                if (!teamResponse.ok) {
                    throw new Error('Error fetching team data');
                }
                const teamData = await teamResponse.json();

                // Solicitud para obtener jugadores del equipo
                const playersResponse = await fetch(`https://api.ejemplo.com/teams/${teamId}/players`);
                if (!playersResponse.ok) {
                    throw new Error('Error fetching players');
                }
                const playersData = await playersResponse.json();

                // Actualizar el estado
                setTeamData(teamData);
                setPlayers(playersData);
                setFilteredPlayers(playersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
        */

        // Datos de ejemplo
        const examplePlayers = [
            { foto: '/jugador.png', nombre: 'Jugador 1', posicion: 'Arquero', numero: 1 },
            { foto: '/jugador.png', nombre: 'Jugador 2', posicion: 'Defensor', numero: 4 },
            { foto: '/jugador.png', nombre: 'Jugador 4', posicion: 'Defensor', numero: 13 },
            { foto: '/jugador.png', nombre: 'Jugador 5', posicion: 'Defensor', numero: 88 },
            { foto: '/jugador.png', nombre: 'Jugador 6', posicion: 'Defensor', numero: 10 },
            { foto: '/jugador.png', nombre: 'Jugador 7', posicion: 'Mediocampo', numero: 3 },
            { foto: '/jugador.png', nombre: 'Jugador 8', posicion: 'Mediocampo', numero: 7 },
            { foto: '/jugador.png', nombre: 'Jugador 9', posicion: 'Mediocampo', numero: 12 },
            { foto: '/jugador.png', nombre: 'Jugador 10', posicion: 'Mediocampo', numero: 5 },
            { foto: '/jugador.png', nombre: 'Jugador 11', posicion: 'Delantero', numero: 6 },
            { foto: '/jugador.png', nombre: 'Jugador 3', posicion: 'Delantero', numero: 9 },
        ];

        const exampleTeamData = {
            nombre: 'Equipo de ejemplo',
            escudo: '/logo512.png',
        };

        setPlayers(examplePlayers);
        setFilteredPlayers(examplePlayers);
        setTeamData(exampleTeamData);
    }, [teamId]);

    const handleSearch = (query) => {
        setSearch(query);
        const filtered = players.filter(player => player.nombre.toLowerCase().includes(query.toLowerCase()));
        setFilteredPlayers(filtered);
    };

    const handleRowClick = (player) => {
        navigate(`/teams/${teamData.nombre}/${player.nombre}`);
    }


    const columns = [
        { name: 'Foto', isImage: true },
        { name: 'Nombre', isImage: false },
        { name: 'Posicion', isImage: false },
        { name: 'Numero', isImage: false },
    ];

    return (
        <section className="team-page">
            <header className="team-header">
                <img 
                    src={teamData.escudo} 
                    alt={`${teamData.nombre} escudo`}
                    className="team-logo"
                />
                <h1 className="team-name">{teamData.nombre}</h1>
            </header>
            <SearchBar 
                placeholder="Buscar jugador..." 
                value={search} 
                onSearch={handleSearch} 
            />
            <Table 
                data={filteredPlayers} 
                columns={columns} 
                onRowClick={handleRowClick} 
            />
        </section>
    );
}

export default TeamPage;
