from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir requisições de diferentes portas (ex: React)

# Classe Livro
class Livro:
    def __init__(self, titulo, autor, isbn, preco, quantidade_em_estoque, cliente):
        self.cliente = cliente
        self.titulo = titulo
        self.autor = autor
        self.isbn = isbn
        self.preco = preco
        self.quantidade_em_estoque = quantidade_em_estoque

    def adicionar_ao_estoque(self, quantidade):
        self.quantidade_em_estoque += quantidade

    def remover_do_estoque(self, quantidade):
        if quantidade > self.quantidade_em_estoque:
            raise ValueError("Quantidade a ser removida excede o estoque disponível.")
        self.quantidade_em_estoque -= quantidade

    def exibir_informacoes(self):
        return {
            'titulo': self.titulo,
            'autor': self.autor,
            'isbn': self.isbn,
            'preco': self.preco,
            'quantidade_em_estoque': self.quantidade_em_estoque,
            'cliente': self.cliente
        }

# Classe Livraria
class Livraria:
    def __init__(self):
        self.estoque = []
        self.clientes = []

    def adicionar_livro(self, livro):
        self.estoque.append(livro)

    def listar_livros(self):
        return [livro.exibir_informacoes() for livro in self.estoque]

    def buscar_livro(self, isbn):
        for livro in self.estoque:
            if livro.isbn == isbn:
                return livro
        return None

    def remover_livro(self, isbn):
        livro = self.buscar_livro(isbn)
        if livro:
            self.estoque.remove(livro)
            return True
        return False

# Inicializa a livraria
livraria = Livraria()

# Carregar estoque de um arquivo JSON (se disponível)
try:
    with open('estoque.json', 'r') as f:
        livros = json.load(f)
        for livro_data in livros:
            livro = Livro(**livro_data)
            livraria.adicionar_livro(livro)
except FileNotFoundError:
    pass

# Rotas para a API
@app.route('/livros', methods=['GET'])
def listar_livros():
    return jsonify(livraria.listar_livros())

@app.route('/livros', methods=['POST'])
def adicionar_livro():
    dados = request.json
    if not dados:
        return jsonify({'error': 'Nenhum dado foi fornecido'}), 400
    
    # Validação dos campos obrigatórios
    required_fields = ['titulo', 'autor', 'isbn', 'preco', 'quantidade_em_estoque', 'cliente']
    for field in required_fields:
        if field not in dados:
            return jsonify({'error': f'Campo {field} faltando.'}), 400
    
    # Criar um novo livro
    livro = Livro(
        titulo=dados['titulo'],
        autor=dados['autor'],
        isbn=dados['isbn'],
        preco=dados['preco'],
        quantidade_em_estoque=dados['quantidade_em_estoque'],
        cliente=dados['cliente']
    )
    
    livraria.adicionar_livro(livro)
    return jsonify({'message': 'Livro adicionado com sucesso'}), 201



@app.route('/clientes', methods=['GET'])
def listar_clientes():
    return jsonify(livraria.clientes)

@app.route('/clientes', methods=['POST'])
def adicionar_cliente():
    dados = request.json
    nome = dados.get('nome')
    if nome and nome not in livraria.clientes:
        livraria.clientes.append(nome)
        return jsonify({'message': 'Cliente adicionado com sucesso'}), 201
    return jsonify({'error': 'Nome do cliente é obrigatório ou já existe.'}), 400




@app.route('/livros/busca', methods=['GET'])
def buscar_livro():
    chave = request.args.get('chave')
    for livro in livraria.estoque:
        if livro.titulo.lower() == chave.lower() or livro.isbn == chave:
            return jsonify(livro.exibir_informacoes())
    return jsonify({'error': 'Livro não encontrado'}), 404

# Rota para atualizar o estoque de um livro
@app.route('/livros/<isbn>/atualizar', methods=['PUT'])
def atualizar_estoque(isbn):
    dados = request.json
    novo_estoque = dados.get('quantidade_em_estoque')
    
    livro = livraria.buscar_livro(isbn)
    if livro:
        try:
            novo_estoque = int(novo_estoque)
            livro.quantidade_em_estoque = novo_estoque
            return jsonify({'message': 'Estoque atualizado com sucesso'}), 200
        except ValueError:
            return jsonify({'error': 'Quantidade de estoque inválida.'}), 400
    return jsonify({'error': 'Livro não encontrado.'}), 404

# Rota para remover um livro
@app.route('/livros/<isbn>', methods=['DELETE'])
def remover_livro(isbn):
    if livraria.remover_livro(isbn):
        return jsonify({'message': 'Livro removido com sucesso.'}), 200
    return jsonify({'error': 'Livro não encontrado.'}), 404

if __name__ == '__main__':
    app.run(debug=True)
