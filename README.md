# Requisito do teste  Golden Raspberry Awards API
- Desenvolva uma API RESTful para possibilitar a leitura da lista de indicados e vencedores da 
categoria Pior Filme do Golden Raspberry Awards. 
- Ler o arquivo CSV dos filmes e inserir os dados em uma base de dados ao iniciar a aplicação. 
- Obter o produtor com maior intervalo entre dois prêmios consecutivos, e o que obteve dois 
prêmios mais rápido, seguindo a especificação de formato definida na página 2. 

# Requisitos não funcionais do sistema 
1. O web service RESTful deve ser implementado com base no nível 2 de maturidade de 
Richardson; 
2. Devem ser implementados somente testes de integração. Eles devem garantir que os dados 
obtidos estão de acordo com os dados fornecidos na proposta; 
3. O banco de dados deve estar em memória utilizando um SGBD embarcado (por exemplo, H2). 
Nenhuma instalação externa deve ser necessária; 
4. A aplicação deve conter um readme com instruções para rodar o projeto e os testes de 
integração. 
5. O código-fonte deve ser disponibilizado em um repositório git (Github, Gitlab, Bitbucket, etc).


# Rodar o Projeto
- Node.js 16 ou acima
- npm ou yarn

# Arquitetura Projeto
- ├── src/
- │   │──app/
- │       ├── controllers/ 
- │            ├── helpers.js
- │            └── movieController.js # Controladores das rotas
- │       ├── models/
- │           └── movieModel.js # Modelos de dados e acesso ao banco
- ├── config/
- │   └── database.js # Configuração do banco de dados
- ├── routes/
- │   └── movieRoute.js # Definição das rotas
- ├── services/
- │   ├── importService.js # Lógica de negócio (importação de CSV, etc.)
- │   └── utilsServices.js
- ├── movielist.csv  # Arquivo de dados (a ser colocado na raiz)
- ├── app.js # Arquivo principal
- ├── package.json
- └── README.md

# Instalação 
- 1- Clone o projeto em seu computador
 - 1.1- git clone https://github.com/alexandreoibh/projetoRaspberry.git
 - 1.2- cd <diretorio>
 - 1.3- npm install

# Banco de dados
- 1- utilizado banco SQLite par atender os requisitos 
   # Tabelas
    - 1- banco por ser em meória perder os dados a cada reinicialização
    - 2- para segurar não duplciação de dados, as tabelas são excluidas na etapa 1 do processo

# Executar importação do arquivo CSV
 - 1.1 colocar o arquivo movielist.csv na raiz do projeto 
   - 1.1 IMPORTANTE!! o arquivo precisa ter esse nome ou a importação não ocorrerá
   - 1.2 O arquivo CSV deve ter o  formato separado por ; (ponto e vírgula)
       -  year;title;studios;producers;winner
       -  1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
       -  1980;Cruising;Lorimar Productions, United Artists;Jerry Weintraub;
- 2 com o arquivo na pasta execute o comando abaixo
   - 2.1 npm start

- 3 a importação ocorre em 4 etapas abaixo com  mensagem 5 de serviço disponível
   - 0- Iniciando validação do arquivo Csv existe
   - 1- Iniciando Limpeza das tabelas
   - 2- Iniciando carga do arquivo CSV
   - 3- Iniciando Tratamento de Produtores por Filme
   - 4- Iniciando carga do dashboard
   - 5- Serviço REST da Api Online e Disponível

- 4- após a conclusão da etapa lista uma mensagem de API disponível para consulta dos dados
  validar a mensagem Service OnLine Port 3001 é importante para saber se está rodando 


        
# Endpoints da API
# GET 
-  /api/v1/movies?page=1&limit=10&orderBy=year
-    └── criado para validar a carga do CSV, não contém a lista de filme tratada para um único produtor

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

            
# GET
-   /api/v1/movies/goldenAwards
-   └── gera o resultado final para o requisito

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



# Autor
Alexandre Rodrigo da Silva
alexandreoibh1@gmail.com
31-987580336
