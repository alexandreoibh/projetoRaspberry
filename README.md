# Info da API

- importa arquivo CSV com filmes e produtores na inicialização
- organiza os dados e gera informação por produtor, com maior intervalo e menor entre vitórias
- Existem 2 endpoints
   - /goldenAwards -> exigido no desafio
   - /movies -> lista de filmes importados para garantir os dados em banco

# Como rodar o Projeto

- git clone https://github.com/alexandreoibh/projetoRaspberry.git
- cd projetoRaspberry
- npm install ou yarn
- npm start

A API ficará disponível em:
http://localhost:3000/api/v1/movies/goldenAwards

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

- http://localhost:3000/api/v1/movies

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

- implementado testes de integração utilizando Jest e Supertest.
- executa API com teste real em memória usando dados temporários nas tabelas
- valida o endpoint /goldenAwards
- valida regra de min e max do intervalo de vitórias e o formato de JSON proposto no desafio

# Execução dos testes

- npm test
- durante o teste a importação CSV é desabilitada e autenticação x-api-key também

# Banco de dados

- utilizado banco SQLite em memória
- dados são recriados a cada inicialização da aplicação

# Arquivo CSV

- nome padrão do arquivo deve ser movielist.csv
- arquivo deve ser inserido na raiz do projeto
-  formato csv separado por ;

```csv
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
```

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
- ├── tests/
- ├── movielist.csv

# Autor

- Alexandre Rodrigo da Silva
- alexandreoibh1@gmail.com
- 31-987580336
