import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import AddOpinionModal from '../addOpinionButton/addOpinionModal';
import './teamPage.css';
import { API_URL, ADMIN_ID } from '../../utils';
import { useSupabase } from '../../supabaseContext'
import BasicForm from '../basicForm/basicForm';

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

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const playersResponse = await fetch(`${API_URL}/teams/${teamId}/players`);
            if (!playersResponse.ok) throw new Error('Error fetching players');
            const playersData = await playersResponse.json();
            const formattedPlayers = await Promise.all(playersData.map(async (player) => {
                const playersRes = await fetch(`${API_URL}/players/${player}`);
                if (!playersRes.ok) {
                    throw new Error('Error fetching player data');
                }

                const playerData = await playersRes.json();
                const { data: imageData } = await supabase.storage
                    .from("player-pictures")
                    .getPublicUrl(playerData.id);

                console.log("playerData", imageData);

                return {
                    edad: playerData.age,
                    nombre: playerData.name,
                    numero: playerData.number,
                    posicion: playerData.position,
                    id: playerData.id,
                    foto: imageData.publicUrl,
                };
        }));
            setPlayers(formattedPlayers);
            setFilteredPlayers(formattedPlayers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch team data
            const teamResponse = await fetch(`${API_URL}/teams/${teamId}`);
            if (!teamResponse.ok) throw new Error('Error fetching team data');
            const teamData = await teamResponse.json();
            
            const { data } = await supabase.storage
                .from("team-pictures")
                .getPublicUrl(teamData.id);

            setTeamData({
                escudo: data.publicUrl,
                nombre: teamData.name,
            });

            // Fetch players
            fetchPlayers();
            // Fetch opinions
            fetchOpinions();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
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
                        <AdminDeleteTeamModal/>
                        <AdminAddPlayerModal
                        fetchPlayers={ fetchPlayers } />
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

function AdminDeleteTeamModal() {
    const { teamId } = useParams();
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('current_user'));
    const navigate = useNavigate();

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const handleDeleteTeam = async () => {

        try {
            const response = await fetch(`${API_URL}/teams/${teamId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting Team');
            }

            await response.json();

            setError('');
            closeModal();
        } catch (error) {
            console.error('Error al borrar el equipo:', error);
            setError('Error al  al borrar el equipo');
        }
        navigate('/teams');
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setError('');
    };

    return (
        <>
            <button onClick={openModal}>Borrar equipo</button>

            {isModalOpen && (
                <div className="form-window-overlay">
                    <div className="form-window">
                        <h1>Borrar equipo</h1>
                        <p>Estas seguro que quieres borrar este equipo?</p>
                        <BasicForm 
                            onSubmit={handleDeleteTeam} 
                            onCancel={closeModal} 
                            fields={[]}
                            setImage={false}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

function AdminAddPlayerModal({ fetchPlayers }) {
    const { teamId } = useParams();
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { supabase } = useSupabase();
    const [file, setFile] = useState(null);

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const uploadPlayerImage = async (playerId) => {
        if (!file) {
            setError('Por favor selecciona un archivo para subir');
            return;
        }

        try {
            const { data } = await supabase.storage
                .from('player-pictures')
                .upload(`${playerId}`, file, {
                    metadata: {
                        owner_id: user.id,
                    },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

        } catch (error) {
            setError('Error al cargar la imagen del equipo');
        }
    };

    const handleAddPlayer = async (formData) => {
        const { playerName, age, position, number } = formData;

        const json = {
            name: playerName,
            age: parseInt(age, 10),
            position,
            number: parseInt(number, 10),
            team_id: teamId,
        };

        try {
            const response = await fetch(`${API_URL}/players`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(json),
            });

            if (response.ok) {
                const player = await response.json();
                await fetchPlayers();
                await uploadPlayerImage(player.id);
                setError('');
                closeModal();
            } else {
                throw new Error('Error adding Player');
            }
        } catch (error) {
            console.error('Error al agregar el jugador:', error);
            setError('Error al agregar el jugador');
        }
    };

    const fields = [
        { name: 'playerName', label: 'Nombre', required: true },
        { name: 'age', label: 'Edad', required: true },
        { name: 'position', label: 'Posicion', required: true },
        { name: 'number', label: 'Numero', required: true },
        { name: 'foto', label: 'Seleccionar foto', required: true },
    ];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null);
        setError('');
    };

    return (
        <>
            <button onClick={openModal}>Agregar Jugador</button>

            {isModalOpen && (
                <div className="form-window-overlay">
                    <div className="form-window">
                        <h1>Agregar nuevo equipo</h1>
                        <BasicForm 
                            fields={fields} 
                            onSubmit={handleAddPlayer} 
                            onCancel={closeModal} 
                            setImage={true}
                            setFile={setFile}
                        />
                    </div>
                </div>
            )}
        </>
    );
}



export default TeamPage;
