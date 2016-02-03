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

1) Install and enter MySQL:

```bash
brew install mysql
mysql -u root
```

2) Create databases and user:

```sql
CREATE USER 'csh_map'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE csh_map;
GRANT ALL PRIVILEGES ON csh_map.* TO 'csh_map'@'localhost';
CREATE DATABASE csh_map_test;
GRANT ALL PRIVILEGES ON csh_map_test.* TO 'csh_map'@'localhost';
exit;
```

3) Create `config/config.json` from sample:

```json
{
	"development": {
		"dialiect": "mysql",
		"username": "csh_map",
		"database": "csh_map_test",
		"password": "",
		"host": "127.0.0.1"
	},
  "production": {
    "dialiect": "mysql",
    "username": "csh_map",
    "database": "csh_map",
    "password": "",
    "host": "127.0.0.1"
  }
}

```

4) Start the application in dev mode to reset database and seed data:

```bash
NODE_ENV=development node bin/www
```

### Environment Variables

Create a `.env` file with the following contents:

```
NODE_ENV=production # "production" or "development"
PORT=3000
```

## API

TODO
