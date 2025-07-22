# API To Do list



## 🚀 Instalação e execução

  <details>
    <summary>Instalando e executando</summary>
    <br />

### 1 - Clone o repositório:

```
git clone https://github.com/Eliedson1979/Api_ToDo-List
```

### 2 - Apos ter o repositório clonado em sua maquina, execute este comando para acessar a pasta do projeto:

```sh
cd Api_ToDo-List
```

### 3 - Dentro da pasta do projeto, execute o comando abaixo para instalar as dependências do projeto:

Caso utilize o npm:

```sh
npm install
```

### 4 - Dentro da pasta do projeto, execute o comando abaixo para iniciar o servidor do projeto:

Caso utilize o npm:

```sh
node server.js 
     ou
npm run dev
```

### 5 - Acesse a aplicação:

Acesse o link: <http://localhost:3001/> em seu navegador.

### 6 - Testando pelo Postman ou Insomia:

```sh
                 API Endpoints: 
POST /register
POST /login
GET /logout
GET /tasks (Protected)
POST /tasks (Protected)
GET /tasks/:id (Protected)
PUT /tasks/:id (Protected)
PATCH /tasks/:id/check (Protected)
DELETE /tasks/:id (Protected)
```

  </details>
<br />

## ⚙️ Tecnologias

* JavaScript
* express
* express-session
* bcryptjs
* pg
* pg-hstore
* sequelize
* nodemon
