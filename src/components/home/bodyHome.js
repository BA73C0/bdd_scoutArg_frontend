import React, { useEffect, useState } from 'react';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import { useNavigate } from 'react-router-dom';
import './bodyHome.css';
import { API_URL, ADMIN_ID } from '../../utils';
import LoadingSpinner from '../loadingSpinner/loadingSpinner'
import { useSupabase } from '../../supabaseContext'
import AdminTeamModal from '../adminTeamModal/adminTeamModal';

function BodyHome() {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const { supabase } = useSupabase();

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/teams`);
                if (!response.ok) {
                    throw new Error('Error al obtener los equipos');
                }
                const data = await response.json();
                const formattedTeams = await Promise.all(data.map(async (team) => {
                    const { data: imageData } = await supabase.storage
                        .from("team-pictures")
                        .getPublicUrl(team.id + '.png');
                    
                    return {
                        escudo: imageData.publicUrl,
                        nombre: team.name,
                        team_id: team.id,
                    };
                }));

                setTeams(formattedTeams);
                setFilteredTeams(formattedTeams);
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTeams();
    }, []);

    const handleSearch = (query) => {
        setSearch(query);
        const filtered = teams.filter(team => team.nombre.toLowerCase().includes(query.toLowerCase()));
        setFilteredTeams(filtered);
    };

    const handleAddTeam = async(teamName) => {
        const user = JSON.parse(localStorage.getItem('current_user'));
        const json = {
            name: teamName,
        };
        try {
            const response = await fetch(`${API_URL}/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(json),
            });

            if (!response.ok) {
                throw new Error('Error adding team');
            }

        } catch (error) {
            console.error('Error al crear el equipo:', error);
        }
    };

    const handleRowClick = (team) => {
        navigate(`/teams/${team.team_id}/${team.nombre}`);
    }

    const columns = [
        { name: 'Escudo', isImage: true },
        { name: 'Nombre', isImage: false }
    ];

    if (loading) {
        return <LoadingSpinner/>;
    }

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
                onImageError={(e) => { e.target.src = '/logo512.png'; }}
            />
            <AdminTeamModal
                onAdd={handleAddTeam}
             />
        </section>
    );
}

function AdminAddTeamModal() {
    const user = JSON.parse(localStorage.getItem('current_user'));
    // POST de un team

    if (user.id !== ADMIN_ID) {
        return null;
    } else {
        // reutilizar boton de agregar equipo/jugador

        // hay que hacerle el/los css en index.css
        return (
            <>
                <button>Añadir equipo</button>

                /* Modal con el form para añadir equipo */
            </>
        );
    }
}

export default BodyHome;
