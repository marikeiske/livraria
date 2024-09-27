import React, { useState, useEffect } from 'react';
import LivroCard from './components/LivroCard';
import ClienteCard from './components/ClienteCard'; // Importando o componente ClienteCard
import './App.css';

function App() {
  const [opcao, setOpcao] = useState('');
  const [livros, setLivros] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [livroForm, setLivroForm] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    preco: '',
    quantidade_em_estoque: '',
    cliente: ''
  });
  const [clienteForm, setClienteForm] = useState({ nome: '' });

  // Fetch livros
  useEffect(() => {
    fetch('http://localhost:5000/livros')
      .then(response => response.json())
      .then(data => setLivros(data))
      .catch(error => console.error('Erro ao buscar livros:', error));
  }, []);

  // Função para lidar com a mudança do formulário de livros
  const handleLivroChange = (e) => {
    setLivroForm({
      ...livroForm,
      [e.target.name]: e.target.value
    });
  };

  // Função para lidar com a mudança do formulário de clientes
  const handleClienteChange = (e) => {
    setClienteForm({
      ...clienteForm,
      [e.target.name]: e.target.value
    });
  };

  // Função para enviar o formulário de livros
  const handleLivroSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/livros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livroForm)
    })
      .then(response => response.json())
      .then(data => {
        setLivros([...livros, livroForm]);
        setLivroForm({
          titulo: '',
          autor: '',
          isbn: '',
          preco: '',
          quantidade_em_estoque: '',
          cliente: ''
        });
      })
      .catch(error => console.error('Erro ao adicionar livro:', error));
  };

  // Função para enviar o formulário de clientes
  const handleClienteSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteForm)
    })
      .then(response => response.json())
      .then(data => {
        setClientes([...clientes, clienteForm]);
        setClienteForm({ nome: '' });
      })
      .catch(error => console.error('Erro ao adicionar cliente:', error));
  };

  // Função para atualizar o estoque de um livro
  const handleUpdateEstoque = (isbn, novoEstoque) => {
    fetch(`http://localhost:5000/livros/${isbn}/atualizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantidade_em_estoque: novoEstoque })
    })
    .then(response => response.json())
    .then(() => {
      setLivros(livros.map(livro => livro.isbn === isbn ? { ...livro, quantidade_em_estoque: novoEstoque } : livro));
    })
    .catch(error => console.error('Erro ao atualizar o estoque:', error));
  };

  // Função para remover um livro
  const handleRemoveLivro = (isbn) => {
    fetch(`http://localhost:5000/livros/${isbn}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        setLivros(livros.filter(livro => livro.isbn !== isbn));
      }
    })
    .catch(error => console.error('Erro ao remover livro:', error));
  };

  return (
    <div className="App">
      <h1> Seja Bem-Vindo! Esse Gerenciamento de Livraria foi desenvolvido pela Mariana Keiske.  </h1>

      {/* Seletor de opções */}
      <select onChange={(e) => setOpcao(e.target.value)} value={opcao}>
        <option value="">Escolha uma opção</option>
        <option value="adicionar-livro">Adicionar Livro</option>
        <option value="adicionar-cliente">Adicionar Cliente</option>
        <option value="listar-clientes">Listar Clientes</option>
        <option value="listar-livros">Listar Livros</option>
      </select>

      {/* Formulário de adicionar livro - mostrado apenas se a opção for escolhida */}
      {opcao === 'adicionar-livro' && (
        <form onSubmit={handleLivroSubmit} className="livro-form">
          <input type="text" name="titulo" placeholder="Título" value={livroForm.titulo} onChange={handleLivroChange} />
          <input type="text" name="autor" placeholder="Autor" value={livroForm.autor} onChange={handleLivroChange} />
          <input type="text" name="isbn" placeholder="ISBN" value={livroForm.isbn} onChange={handleLivroChange} />
          <input type="number" name="preco" placeholder="Preço" value={livroForm.preco} onChange={handleLivroChange} />
          <input type="number" name="quantidade_em_estoque" placeholder="Quantidade em Estoque" value={livroForm.quantidade_em_estoque} onChange={handleLivroChange} />
          <input type="text" name="cliente" placeholder="Cliente" value={livroForm.cliente} onChange={handleLivroChange} />
          <button type="submit">Adicionar Livro</button>
        </form>
      )}

      {/* Formulário de adicionar cliente - mostrado apenas se a opção for escolhida */}
      {opcao === 'adicionar-cliente' && (
        <form onSubmit={handleClienteSubmit} className="cliente-form">
          <input type="text" name="nome" placeholder="Nome do Cliente" value={clienteForm.nome} onChange={handleClienteChange} />
          <button type="submit">Adicionar Cliente</button>
        </form>
      )}

      {/* Listar clientes em formato de cards */}
      {opcao === 'listar-clientes' && (
        <div className="clientes-container">
          <h2>Clientes Cadastrados: </h2>
          {clientes.map((cliente, index) => (
            <ClienteCard key={index} cliente={cliente} />
          ))}
        </div>
      )}

      {/* Listar livros - mostrado apenas se a opção for escolhida */}
      {opcao === 'listar-livros' && (
        <div className="livros-container">
          {livros.map((livro, index) => (
            <LivroCard
              key={index}
              livro={livro}
              onUpdateEstoque={handleUpdateEstoque}
              onRemoveLivro={handleRemoveLivro}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
