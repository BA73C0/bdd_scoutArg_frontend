import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import LoadingSpinner from '../loadingSpinner/loadingSpinner'
import './teamPage.css';
import { API_URL } from '../../utils';

function TeamPage() {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState({ nombre: '', escudo: '' });
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            try {
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

                const playersRes = await fetch(`${API_URL}/players/${playersData}`);
                if (!playersRes.ok) {
                    throw new Error('Error fetching player data');
                }

                const playerData = await playersRes.json();

                const formattedPlayers = [playerData].map(player => ({
                    edad: player.age,
                    nombre: player.name,
                    numero: player.number,
                    posicion: player.position,
                    id: player.id,
                    foto: '/jugador.png',
                }));

                setPlayers(formattedPlayers);
                setFilteredPlayers(formattedPlayers);
                setTeamData(formattedTeamData);
            } catch (err) {
                throw err;
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [teamId]);

    if (loading) {
        return <LoadingSpinner/>;
    }

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
