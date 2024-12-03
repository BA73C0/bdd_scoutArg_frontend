import React, { useEffect, useState } from 'react';
import Table from '../table/table';
import SearchBar from '../searchBar/searchBar';
import { useNavigate } from 'react-router-dom';
import './bodyHome.css';
import { API_URL, ADMIN_ID } from '../../utils';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import { useSupabase } from '../../supabaseContext';
import BasicForm from '../basicForm/basicForm';

function BodyHome() {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { supabase } = useSupabase();


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
                    .getPublicUrl(team.id);
                
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
            setSearch('');
            setLoading(false);
        }
    };

    // Llamar a fetchTeams() al montar el componente
    useEffect(() => {
        fetchTeams();
    }, []);

    const handleSearch = (query) => {
        setSearch(query);
        const filtered = teams.filter(team => team.nombre.toLowerCase().includes(query.toLowerCase()));
        setFilteredTeams(filtered);
    };

    const handleRowClick = (team) => {
        navigate(`/teams/${team.team_id}/${team.nombre}`);
    };

    const columns = [
        { name: 'Escudo', isImage: true },
        { name: 'Nombre', isImage: false }
    ];

    if (loading) {
        return <LoadingSpinner />;
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
            <div style={{width: "60%"}}>
                <Table 
                    data={filteredTeams} 
                    columns={columns} 
                    onRowClick={handleRowClick} 
                    onImageError={(e) => { e.target.src = '/logo512.png'; }}
                    redirect={true}
                />
            </div>
            <AdminAddTeamModal fetchTeams={fetchTeams} />
        </section>
    );
}

function AdminAddTeamModal({ fetchTeams }) {
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { supabase } = useSupabase();
    const [file, setFile] = useState(null);

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const uploadTeamImage = async (teamId) => {
        if (!file) {
            setError('Por favor selecciona un archivo para subir');
            return;
        }

        console.log("user", user);

        try {
            const { data } = await supabase.storage
                .from('team-pictures')
                .upload(`${teamId}`, file, {
                    metadata: {
                        owner_id: user.id,
                    },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

            console.log('Uploaded data:', data);

        } catch (error) {
            setError('Error al cargar la imagen del equipo');
        }
    };

    const handleAddTeam = async (formData) => {
        const { teamName } = formData;

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

            if (response.ok) {
                const team = await response.json();
                await fetchTeams();
                await uploadTeamImage(team.id);
                setError('');
                closeModal();
            } else {
                throw new Error('Error adding Team');
            }
        } catch (error) {
            console.error('Error al crear el equipo:', error);
            setError('Error al crear el equipo');
        }
    };

    const fields = [
        { name: 'teamName', label: 'Nombre del equipo', required: true },
        { name: 'foto', label: 'Seleccionar escudo', required: true },
    ];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFile(null);
        setError('');
    };

    return (
        <>
            <button onClick={openModal}>Agregar Equipo</button>

            {isModalOpen && (
                <div className="form-window-overlay">
                    <div className="form-window">
                        <h1>Agregar nuevo equipo</h1>
                        <BasicForm 
                            fields={fields} 
                            onSubmit={handleAddTeam} 
                            onCancel={closeModal} 
                            setFile={setFile}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default BodyHome;
