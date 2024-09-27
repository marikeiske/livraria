import React, { useState } from 'react';
import './LivroCard.css';

const LivroCard = ({ livro, onUpdateEstoque, onRemoveLivro }) => {
  const [novoEstoque, setNovoEstoque] = useState('');

  const handleUpdateEstoque = () => {
    onUpdateEstoque(livro.isbn, novoEstoque);  // Função passada via props para atualizar o estoque
    setNovoEstoque('');  // Limpa o campo após a atualização
  };

  const handleRemoveLivro = () => {
    onRemoveLivro(livro.isbn);  // Função passada via props para remover o livro
  };

  return (
    <div className="livro-card">
      <h3>{livro.titulo}</h3>
      <p><strong>Autor:</strong> {livro.autor}</p>
      <p><strong>ISBN:</strong> {livro.isbn}</p>
      <p><strong>Preço:</strong> R${livro.preco}</p>
      <p><strong>Estoque:</strong> {livro.quantidade_em_estoque}</p>
      <p><strong>Cliente:</strong> {livro.cliente}</p>

      {/* Campo para atualizar o estoque */}
      <input 
        type="number" 
        placeholder="Novo Estoque" 
        value={novoEstoque}
        onChange={(e) => setNovoEstoque(e.target.value)} 
      />
      <button onClick={handleUpdateEstoque}>Atualizar Estoque</button>

      {/* Botão para remover o livro */}
      <button onClick={handleRemoveLivro} className="remover-livro">Remover Livro</button>
    </div>
  );
};

export default LivroCard;
