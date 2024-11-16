import React from 'react';
import './table.css';

function StarRating({ rating }) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
        );
    }
    return <div>{stars}</div>;
}

function Table({ data, columns, onRowClick }) {

    return (
        <table className="table">
            <thead className="table-head">
                <tr className="column-names">
                    {columns.map((col, index) => (
                        <th key={index}>{col.name}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="table-body">
                {data.map((row, index) => (
                    <tr 
                        className="table-card" 
                        key={index} 
                        onClick={() => onRowClick(row)}
                    >
                        {columns.map((col, i) => (
                            <td key={i}>
                                {col.isImage ? (
                                    row[col.name.toLowerCase()] ? (
                                        <div className="table-card-logo">
                                            <img 
                                                src={row[col.name.toLowerCase()]} 
                                                alt={col.name} 
                                            />
                                        </div>
                                    ) : (
                                        <div className="table-card-logo">
                                            <img 
                                                src="path/to/default-image.png"
                                                alt="default" 
                                            />
                                        </div>
                                    )
                                ) : col.name === 'Puntuación' ? (
                                    <StarRating rating={row.puntuacion} />
                                ) : (
                                    <div className="table-card-subcontainer">
                                        {row[col.name.toLowerCase()]}
                                    </div>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;
