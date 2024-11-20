import React, { useEffect, useState } from 'react';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import { useNavigate } from 'react-router-dom';
import './bodyHome.css';
import { API_URL } from '../../utils';


function BodyHome() {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`${API_URL}/teams`);
                if (!response.ok) {
                    throw new Error('Error al obtener los equipos');
                }
                const data = await response.json();
                const formattedTeams = data.map(team => ({
                    escudo: team.photo || '/logo512.png',
                    nombre: team.name,
                    team_id: team.id
                }));

                setTeams(formattedTeams);
                setFilteredTeams(formattedTeams);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
    
        fetchTeams();
    }, []);

    const handleSearch = (query) => {
        setSearch(query);
        const filtered = teams.filter(team => team.nombre.toLowerCase().includes(query.toLowerCase()));
        setFilteredTeams(filtered);
    };

    const handleRowClick = (team) => {
        navigate(`/teams/${team.team_id}/${team.nombre}`);
    }

    const columns = [
        { name: 'Escudo', isImage: true },
        { name: 'Nombre', isImage: false }
    ];

    return (
        <section className="body-home">
            <header className="body-header">
            </header>
            <SearchBar 
                placeholder="Buscar equipo..." 
                value={search} 
                onSearch={handleSearch} 
            />
            <Table 
                data={filteredTeams} 
                columns={columns} 
                onRowClick={handleRowClick} 
            />
        </section>
    );
}

export default BodyHome;
