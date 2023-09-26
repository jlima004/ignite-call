# Ignite Call

### 🚀 Aplicação para agendamento de vídeo chamadas integrada com o Google Calendar
Projeto desenvolvido com Next.js 13
 
[Link da aplicação na Vercel](https://ignite-call-psi-six.vercel.app/)
## Features

- Cadastro do usuário/host que terá sua agenda divulgada
- Criação da página calendário com as opções de agendamento de vídeo chamadas com o usuário/host 
- Integração da agenda do usuário/host com sua conta do Google Calendar

## Requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [MySQL](https://www.mysql.com/).
Para o banco de dados MySQL sugiro usar um container [Docker](https://www.docker.com/).
Além disto é bom ter um editor para trabalhar com o código como o [VSCode](https://code.visualstudio.com/)

## Como executar

```bash
# Clone este repositório
$ git clone https://github.com/jlima004/ignite-call.git

# Acesse a pasta do projeto no terminal/cmd
$ cd ignite-call

# Instale as dependências do projeto > node 18
$ npm install 

```

É necessário configurar um banco de dados MySQL.

Com o docker rodando use o comando: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=docker -p 3306:3306 mysql:latest`. <br />
Lembrando que o texto "MYSQL_ROOT_PASSWORD" deve ser substituido e será a senha do banco de dados. <br />
Se preferir pode alterar o texto "mysql" para um de sua preferência. Ele será o nome do conteiner no Docker. <br />
O comando: `docker start mysql` inicia o container.

É necessário criar um arquivo `.env.local` na raiz do projeto.

```
# Banco de dados
DATABASE_URL="mysql://root:MYSQL_ROOT_PASSWORD@localhost:3306/ignitecall"

# Google API
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL="http://localhost:3000"
```

Em `DATABASE_URL="mysql://root:MYSQL_ROOT_PASSWORD@localhost:3306/ignitecall"` substitua: "MYSQL_ROOT_PASSWORD" pela senha do banco de dados. <br />
`GOOGLE_CLIENT_ID=` e `GOOGLE_CLIENT_SECRET` são as credenciais da API criada no Google Cloud API <br />
`NEXTAUTH_SECRET=` é o segredo JWT da aplicação pode ser qualquer palavra. O ideal é gerar uma palavra forte aleatoriamente. <br />

```bash

# Execute a aplicação
$ npm run dev

```
A aplicação  inciará na porta:3000 - `http://localhost:3000`.

## Tecnologias

- 

---

<a href="https://github.com/jlima004"><b>Jefferson Dcher</b></a> :octocat:

[![Linkedin Badge](https://img.shields.io/badge/-Jefferson-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/jefferson-dcher/)](https://www.linkedin.com/in/jefferson-dcher/) 
