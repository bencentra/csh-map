# csh-map-svc

ExpressJS API for the CSH Alumni Map.

## Installation

1) Install dependencies:

```bash
npm install
```

2) Perform database setup (see below).

3) Start the server:

```bash
node bin/www
```

### Database Setup

1) Install mysql and sequelize-cli:

```bash
npm install -g sequelize-cli
brew install mysql
mysql -u root
```

2) Create database and user: 

```sql
CREATE DATABASE csh_map;
CREATE USER 'csh_map'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON csh_map.* TO 'csh_map'@'localhost';
exit;
```

3) Run sequelize migration:

```bash
sequelize db:migrate
```
