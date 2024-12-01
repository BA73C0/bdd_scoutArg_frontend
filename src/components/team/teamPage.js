import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import './teamPage.css';
import { API_URL, ADMIN_ID } from '../../utils';
import { useSupabase } from '../../supabaseContext'
import AdminDeleteModal from '../adminDeleteModal/adminDeleteModal'
import AdminTeamModal from '../adminTeamModal/adminTeamModal';

function TeamPage() {
    const { teamId } = useParams();
    const { supabase } = useSupabase();
    const [teamData, setTeamData] = useState({ nombre: '', escudo: '' });
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('Jugadores');
    const [opinions, setOpinions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const fetchOpinions = async () => {
        setLoading(true);
        try {
            const opinionsResponse = await fetch(`${API_URL}/teams/${teamId}/opinions`);
            if (!opinionsResponse.ok) throw new Error('Error fetching opinions');
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

    const onDelete = async () => {
        const user = JSON.parse(localStorage.getItem('current_user'));
        try {
            const response = await fetch(`${API_URL}/teams/${teamId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(teamId),
            });
            
            if (!response.ok) {
                throw new Error('Error al eliminar el equipo');
            }
    
            alert('Equipo borrado exitosamente!!'); 
            navigate('/teams'); 
        } catch (error) {
            console.error('Error al eliminar el equipo:', error);
        }
    };

    const handleEditTeam = async(teamName) => {
        const user = JSON.parse(localStorage.getItem('current_user'));
        const json = {
            name: teamName,
        };
        try {
            const response = await fetch(`${API_URL}/teams/${teamId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(json),
            });

            if (!response.ok) {
                throw new Error('Error editing team');
            }

            navigate('/teams');

        } catch (error) {
            console.error('Error al editar el equipo:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch team data
                const teamResponse = await fetch(`${API_URL}/teams/${teamId}`);
                if (!teamResponse.ok) throw new Error('Error fetching team data');
                const teamData = await teamResponse.json();
                
                const { data } = await supabase.storage
                    .from("team-pictures")
                    .getPublicUrl(teamData.id + '.png');

                setTeamData({
                    escudo: data.publicUrl,
                    nombre: teamData.name,
                });

                // Fetch players
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

                const formattedPlayers = await Promise.all([playerData].map(async (player) => {
                    const { data: imageData } = await supabase.storage
                        .from("player-pictures")
                        .getPublicUrl(player.id + '.png');

                    return {
                    edad: player.age,
                    nombre: player.name,
                    numero: player.number,
                    posicion: player.position,
                    id: player.id,
                    foto: imageData.publicUrl,
                }}));

                setPlayers(formattedPlayers);
                setFilteredPlayers(formattedPlayers);

                // Fetch opinions
                fetchOpinions();
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teamId]);

    if (loading) {
        return <LoadingSpinner/>;
    }

    const handleSearch = (query) => {
        setSearch(query);
        const filtered = players.filter(player => player.nombre.toLowerCase().includes(query.toLowerCase()));
        setFilteredPlayers(filtered);
    };

    const handlePlayerClick = (player) => {
        navigate(`/teams/${teamData.nombre}/${player.id}/${player.nombre}`);
    }

    const handleOpinonSubmit = async (opinion, puntuacion) => {
        const user = JSON.parse(localStorage.getItem('current_user'));
        const json = {
            user_id: user.id,
            opinion_text: opinion,
            rating: puntuacion,
            team_id: teamId,
            created_at: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_URL}/teams/opinions`, {
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

    const playerColumns = [
        { name: 'Foto', isImage: true },
        { name: 'Nombre', isImage: false },
        { name: 'Posicion', isImage: false },
        { name: 'Numero', isImage: false },
        { name: 'Edad', isImage: false },
    ];
    const opinionColumns = [
        { name: 'Comentario', isImage: false },
        { name: 'Puntuación', isImage: false },
    ];

    return (
        <section className="team-page">
            <header className="team-header">
                <img 
                    src={teamData.escudo} 
                    alt={`${teamData.nombre} escudo`}
                    className="team-logo"
                    onError={(e) => { e.target.src = '/logo512.png'; }}
                />
                <h1 className="team-name">{teamData.nombre}</h1>
            </header>
            <div className="display-table-options">
                <button
                    className={`display-table-option ${selectedOption === 'Jugadores' ? '' : 'active'}`}
                    onClick={() => setSelectedOption('Jugadores')}
                >
                    Jugadores
                </button>
                <button
                    className={`display-table-option ${selectedOption === 'Opiniones' ? '' : 'active'}`}
                    onClick={() => setSelectedOption('Opiniones')}
                >
                    Opiniones
                </button>
            </div>
            {selectedOption === 'Opiniones' && (
                <>
                    <Table
                        data={opinions}
                        columns={opinionColumns}
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
                        onSubmit={handleOpinonSubmit}
                    />
                </>
            )}
            {selectedOption === 'Jugadores' && (
                <>
                    <SearchBar 
                        placeholder="Buscar jugador..." 
                        value={search} 
                        onSearch={handleSearch} 
                    />
                    <Table 
                        data={filteredPlayers} 
                        columns={playerColumns} 
                        onRowClick={handlePlayerClick} 
                        onImageError={(e) => { e.target.src = '/jugador.png'; }}
                    />

                    <div className="button-container">
                        <AdminDeleteModal
                        id = {teamId}
                        nombre = {teamData.nombre}
                        onDelete= {onDelete}
                        />
                        <AdminTeamModal
                            onAdd={handleEditTeam}
                        />
                        <AdminAddPlayerToTeamModal />
                    </div>
                </>
            )}
        </section>
    );
}

function AdminEditTeamModal() {
    const user = JSON.parse(localStorage.getItem('current_user'));
    // PATCH de un team

    if (user.id !== ADMIN_ID) {
        return null;
    } else {
        // reutilizar boton de agregar equipo/jugador

        // hay que hacerle el/los css en index.css
        return (
            <>
                <button>Editar equipo</button>

            </>
                /* Modal con form para editar equipo  */
        );
    }
}

function AdminAddPlayerToTeamModal() {
    const user = JSON.parse(localStorage.getItem('current_user'));
    // PATCH de un team

    if (user.id !== ADMIN_ID) {
        return null;
    } else {
        // reutilizar boton de agregar equipo/jugador

        // hay que hacerle el/los css en index.css
        return (
            <>
                <button>Agregar jugador</button>

            </>
                /* Modal con form para agregar un jugador al equipo  */
        );
    }
}


export default TeamPage;
