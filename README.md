## API Expenses

A API Expenses é uma aplicação Node.js que utiliza o framework Express, o banco de dados MongoDB e o ORM Prisma para gerenciar despesas. A API inclui autenticação de usuários, CRUD de usuários e despesas, utilizando tokens JWT para autenticação.

# Dependências

<ul>
    <li>express - Framework web para Node.js.</li>
    <li>@prisma/client - Cliente do Prisma para interagir com o banco de dados.</li>
    <li>bcrypt - Biblioteca para hash de senhas.</li>
    <li>jsonwebtoken - Biblioteca para geração e verificação de tokens JWT.</li>
    <li>dotenv - Biblioteca para carregar variáveis de ambiente de um arquivo .env.</li>
</ul>

# Configuração

<strong>Variáveis de Ambiente</strong>
Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority"
SECRETY_TOKEN="your_secret_token"
PORT=3000
```

# Instalação

<ol>
  <li>Clone o repositório:</li>
</ol>

```bash
git clone https://github.com/seu-usuario/api-expenses.git
cd api-expenses
```
<ol>
  <li>Instale as dependências:</li>
</ol>

```bash
npm install
```

<ol>
  <li>Configure o Prisma:</li>
</ol>

```bash
npx prisma generate
```

<ol>
  <li>Inicie o servidor:</li>
</ol>

```bash
npm start
```

## Rotas

<strong>Autenticação</strong>
<ol>
<stron>Login</strong>
<li>Endpoint: POST /login</li>
<li>Descrição: Realiza o login do usuário e retorna um token JWT.</li>
<li>Body</li>
</ol>

```json
{
  "email": "usuario@example.com",
  "password": "senha"
}

```


## Usuários

<strong>Criar Usuário</strong>
<ol>
<li>Endpoint: POST /user/add</li>
<li>Descrição: Cria um novo usuário.</li>
<li>Body</li>
</ol>

```json
{
  "email": "usuario@example.com",
  "name": "Nome do Usuário",
  "password": "senha",
  "level": "nível",
  "status": "status"
}

```

<stron>Listar Usuários</strong>
<ol>
<li>Endpoint: GET /user/list</li>
<li>Descrição: Lista todos os usuários. Requer autenticação.</li>
<li>Headers:</li>
</ol>

```json
{
  "Authorization": "Bearer <token>"
}

```

# Despesas

<stron>Criar Despesa</strong>
<ol>
<li>Endpoint: POST /expense/add</li>
<li>Descrição: Cria uma nova despesa. Requer autenticação.</li>
<li>Body:</li>
</ol>

```json
{
  "name": "Nome da Despesa",
  "price": "valor",
  "status": "status",
  "dueDate": "YYYY-MM-DD"
}

```
<ol>
<li>Headers:</li>
</ol>

```json
{
  "Authorization": "Bearer <token>"
}

```

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  password  String
  level     String
  status    String
  createdAt DateTime @default(now())
}

model Expense {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String   
  price     String
  status    String
  dueDate   DateTime
  createdAt DateTime @default(now())
}

```

# Contribuição

<ol>
<li>Faça um fork do repositório.</li>
<li>Crie uma branch para sua feature (git checkout -b feature/fooBar).</li>
<li>Commit suas mudanças (git commit -am 'Add some fooBar').</li>
<li>Push para a branch (git push origin feature/fooBar).</li>
<li>Crie um novo Pull Request.</li>
</ol>

# Contato
<strong>Nome</strong>: @railan-bernardo-oficial 
<strong>E-mail</strong>: railanbernardoreserva@gmail.com

Link do Projeto: <a href="https://github.com/railan-bernardo-oficial/api-expenses">https://github.com/railan-bernardo-oficial/api-expenses</a>