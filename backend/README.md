# CabsOnline — Sistema de Reserva de Táxi

**Disciplina:** Web Development — Semester 1, 2026
**Aluna:** Ana Carolina Alves de Moura (23201111)

---

## Sobre o Projeto

CabsOnline é um sistema web de reserva de táxis para Auckland e arredores, composto por duas partes:

- **Part 1 (`assign/`)** — Aplicação PHP vanilla com HTML, CSS e JavaScript. Permite que passageiros façam reservas e que administradores pesquisem e atribuam táxis. Feita para correr no servidor **webdev.aut.ac.nz**.

- **Part 2 (`part2/`)** — Aplicação React moderna que estende a Part 1 com 4 funcionalidades extra: CRUD completo, dashboard com estatísticas, dark/light mode e mapa interativo com Leaflet.

---

## Estrutura do Repositório

```
cabsonline/
├── assign/          ← Part 1 — PHP (deploy no webdev server)
│   ├── booking.html, booking.js, booking.php
│   ├── admin.html, admin.js, admin.php
│   ├── style.css
│   ├── mysqlcommand.txt
│   └── readme.txt
│
├── part2/           ← Part 2 — React (Vite)
│   ├── src/         ← Código-fonte React
│   ├── dist/        ← Build de produção
│   ├── README.DOC   ← Documentação exigida pelo enunciado
│   └── package.json
│
├── DOC/
│   └── README.md    ← Documentação técnica completa
│
├── includes/        ← Bootstrap PHP (dev local)
├── .env.example     ← Template de variáveis de ambiente
├── booking.php      ← Backend PHP (dev local)
├── admin.php        ← Backend PHP (dev local)
└── mysqlcommand.txt ← Comandos SQL para criar a base de dados
```

---

## Como Correr Localmente

### Pré-requisitos
- PHP 8.x com extensão `pdo_mysql` ativada
- MySQL 8.x a correr em `localhost:3306`
- Node.js 18+ (para Part 2)

### 1. Configurar a base de dados
```bash
mysql -u root -e "SOURCE mysqlcommand.txt"
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Editar .env com as credenciais do MySQL local
```

### 3. Iniciar o backend PHP
```bash
php -S localhost:8080
```

### 4. Part 1 — Abrir directamente no browser
- `http://localhost:8080/assign/booking.html`
- `http://localhost:8080/assign/admin.html`

### 5. Part 2 — Iniciar o React
```bash
cd part2
npm install
npm run dev
```
Abrir `http://localhost:5173`

---

## Deploy no Servidor da Faculdade (webdev.aut.ac.nz)

Instruções detalhadas de deploy estão em [`DOC/README.md`](DOC/README.md), secção 3.

**Resumo rápido — Part 1:**
1. Fazer upload de todos os ficheiros dentro de `assign/` para `htdocs/assign/` no webdev via SFTP/SCP
2. Executar os comandos de `mysqlcommand.txt` no MySQL do webdev
3. Aceder via `http://webdev.aut.ac.nz/bvf2703/assign/booking.html`

**Part 2:** pode ser deployed em qualquer servidor com acesso por browser (GitHub Pages, Vercel, etc.) usando os ficheiros de `part2/dist/`.

---

## Documentação

| Documento | Localização | Conteúdo |
|-----------|-------------|----------|
| README.md (este) | Raiz | Visão geral e quickstart |
| DOC/README.md | `DOC/` | Documentação técnica completa (stack, API, features, limitações, reflexão AI) |
| README.DOC | `part2/` | Documento exigido pelo enunciado (8 secções obrigatórias) |
| readme.txt | `assign/` | Lista de ficheiros e instruções da Part 1 |

---

## Tecnologias

| Part 1 | Part 2 |
|--------|--------|
| HTML5, CSS3, JavaScript (ES6+) | React 19, Vite 6 |
| PHP 8.x | React Context API |
| MySQL (PDO) | Leaflet + react-leaflet |
| Fetch API (async) | CSS Custom Properties |
