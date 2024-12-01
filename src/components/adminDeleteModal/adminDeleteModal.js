import React, { useState } from 'react';
import { ADMIN_ID } from '../../utils';

function AdminDeleteModal({id, nombre, onDelete}) {
    const user = JSON.parse(localStorage.getItem('current_user'));
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (user.id !== ADMIN_ID) {
        return null;
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const confirmDelete = () => {
        console.log(id);
        closeModal(); 
    };

    return (
        <>
            <button onClick={openModal}>Borrar</button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>¿Está seguro que quiere borrar a {nombre}?</p>
                        <div className="modal-actions">
                            <button className="confirm-button" onClick={onDelete}>Sí</button>
                            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminDeleteModal;