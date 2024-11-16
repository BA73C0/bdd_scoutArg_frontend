import React, { useEffect, useState } from 'react';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import { useNavigate } from 'react-router-dom';
import './bodyHome.css';

function BodyHome() {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        /*
        const fetchTeams = async () => {
            try {
                const response = await fetch('https://api.ejemplo.com/teams');
                const data = await response.json();
                setTeams(data);
                setFilteredTeams(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
        */

        const exampleTeam = [
            {
                escudo: '/logo512.png',
                nombre: 'Equipo 1',
                team_id: 1,
            },
            {
                escudo: '/logo512.png',
                nombre: 'Equipo 2',
                team_id: 2,
            },
            {
                escudo: '/logo512.png',
                nombre: 'Equipo 3',
                team_id: 1,
            }
        ];

        setTeams(exampleTeam);  // Establece el equipo manualmente
        setFilteredTeams(exampleTeam);
    }, []);

    const handleSearch = (query) => {
        setSearch(query);
        const filtered = teams.filter(team => team.nombre.toLowerCase().includes(query.toLowerCase()));
        setFilteredTeams(filtered);
    };

    const handleRowClick = (team) => {
        navigate(`/teams/${team.nombre}`);
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
