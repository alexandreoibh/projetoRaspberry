# Info da API

- importa arquivo CSV com filmes e produtores na inicialização
- organiza os dados e gera informação por produtor, com maior intervalo e menor entre vitórias
- Existem 2 endpoints

# Como rodar o Projeto

- git clone https://github.com/alexandreoibh/projetoRaspberry.git
- cd projetoRaspberry
- npm install ou yarn
- npm start

A API ficará disponível em:
http://localhost:3000

# Endpoints

# GET - Produtores com resultado de maior e menor intervalo

- Este é o endpoint principal exigido no teste técnico.

- http://localhost:3000/api/v1/movies/goldenAwards

```json
{
  "min": [
    {
      "producer": "Producer A",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer B",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

# GET - Lista de filmes importados

- http://localhost:3000/api/v1/movies?page=1&limit=10&orderBy=year

```json
{
  "total": 206,
  "limit": 10,
  "offset": 0,
  "page": 1,
  "totalPages": 21,
  "data": [
    {
      "id": 1,
      "year": 1980,
      "title": "Can't Stop the Music",
      "studios": "Associated Film Distribution",
      "producers": "Allan Carr",
      "winner": true,
      "created_date": "2024-01-01 00:00:00"
    }
  ]
}
```

# Testes

# Banco de dados

- utilizado banco SQLite em memória
- dados são recriados a cada inicialização da aplicação

# Arquivo CSV

- nome padrão do arquivo deve ser movielist.csv
- arquivo deve ser inserido na raiz do projeto

# Authenticação

- uso de header: x-api-key
- chave definida no .env
- em programas como Postman/Insomnia, enviar no header
- x-api-key: <sua_chave>

# Arquitetura

- ├── src/
- │ │──app/
- │ ├── controllers/
- │ ├── models/
- ├── config/
- ├── middlewares/
- ├── routes/
- ├── services/
- ├── movielist.csv

# Autor

Alexandre Rodrigo da Silva
alexandreoibh1@gmail.com
31-987580336


