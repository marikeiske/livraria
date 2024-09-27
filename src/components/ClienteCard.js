import React from 'react';

function ClienteCard({ cliente, onRemove }) {
  return (
    <div className="cliente-card">
      <h3> {cliente.nome}</h3>
     
    </div>
  );
}

export default ClienteCard;
