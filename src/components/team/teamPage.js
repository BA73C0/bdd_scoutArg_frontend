import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import './teamPage.css';
import { API_URL } from '../../utils';

function TeamPage() {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState({ nombre: '', escudo: '' });
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                setLoading(true);
                const teamResponse = await fetch(`${API_URL}/teams/${teamId}`);
                if (!teamResponse.ok) {
                    throw new Error('Error fetching team data');
                }
                const teamData = await teamResponse.json();

                const formattedTeamData = {
                    escudo: teamData.photo || '/logo512.png',
                    nombre: teamData.name,
                };
                
                const playersResponse = await fetch(`${API_URL}/teams/${teamId}/players`);
                if (!playersResponse.ok) {
                    throw new Error('Error fetching players');
                }
                const playersData = await playersResponse.json();
                
                const formattedPlayers = playersData.players.map(player => ({
                    foto: player.photo || '/jugador.png',
                    nombre: player.name,
                    posicion: player.position,
                    numero: player.number,
                    id: player.id,
                    edad: player.age,
                }));
                
                setPlayers(formattedPlayers);
                setFilteredPlayers(formattedPlayers);
                setTeamData(formattedTeamData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId]);

    const handleSearch = (query) => {
        setSearch(query);
        const filtered = players.filter(player => player.nombre.toLowerCase().includes(query.toLowerCase()));
        setFilteredPlayers(filtered);
    };

    const handleRowClick = (player) => {
        navigate(`/teams/${teamData.nombre}/${player.id}/${player.nombre}`);
    }

    const columns = [
        { name: 'Foto', isImage: true },
        { name: 'Nombre', isImage: false },
        { name: 'Posicion', isImage: false },
        { name: 'Numero', isImage: false },
        { name: 'Edad', isImage: false },
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
