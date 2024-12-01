import React, { useState } from 'react';
import { ADMIN_ID } from '../../utils';

function AdminTeamModal({onAdd}) {
    const [teamName, setTeamName] = useState('');
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAddTeam = () => {
        if (teamName.trim()) {
            onAdd(teamName);
            setTeamName('');
            closeModal();
        } else {
            alert('Por favor, ingresa un nombre válido para el equipo.');
        }
    };

    return (
        <>
            <button onClick={openModal}>Agregar Equipo</button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Agregar Nuevo Equipo</h2>
                        <input
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Nombre del equipo"
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button className="confirm-button" onClick={handleAddTeam }>Agregar Equipo</button>
                            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminTeamModal;