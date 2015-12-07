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

2) Create database and user: 

```sql
CREATE DATABASE csh_map;
CREATE USER 'csh_map'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON csh_map.* TO 'csh_map'@'localhost';
exit;
```

3) Create `config/config.json` from sample:

```json
{
	"development": {
		"dialect": "sqlite",
		"storage": "./db.development.sqlite"
	},
	"production": {
		"dialiect": "mysql",
		"username": "csh_map",
		"database": "csh_map",
		"password": "password",
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

__Note:__ API is still under heavy development and may change unexpectedly!

### Members

A "member" is a CSH Member who has interacted with the CSH Map.

#### GET /members

Get data for one or more members.

__Parameters:__

| Name | Description | Example | 
| --- | --- | --- |
| uid (optional) | Username of the single user to retrieve | `"bencentra"` |

__Response:__

If `uid` is present, returns a single user object. Otherwise, returns an array of users.

#### POST /members

Add a new member. 

__Parameters:__

| Name | Description | Example | 
| --- | --- | --- |
| uid | Username of the single user | `"bencentra"` |
| cn | Full name of the single user | `"Ben Centra"` |

__Response:__

An object with the `uid` of the member.

### Locations

A "location" is a city that a member has recorded themselves as being in.

#### GET /locations

Get data for recorded locations.

__Parameters:__

None.

__Response:__

An array of location objects.

#### POST /locations

Add a new location. 

__Parameters:__

| Name | Description | Example | 
| --- | --- | --- |
| address | Name of the location | `"Boston, MA, USA"` |
| latitude | Latitude of the location | `42.3601` |
| longitude | Longitude of the location | `71.0589` |

__Response:__

An object with the `id` of the location.

### Records

A "record" represents a member changing the city they are in, including removing themselves from the map.

#### GET /records

Get a list of records. By default only returns a member's most recent record.

__Parameters:__

| Name | Description | Example | 
| --- | --- | --- |
| allRecords | Include all records, not just a user's most recent one | `true` |

__Response:__

#### POST /records

Add a new record.

__Parameters:__

| Name | Description | Example | 
| --- | --- | --- |
| member | Username of the member to record | `"bencentra"` |
| location | The ID of the location to record. Set to `null` to remove the member from the map. | `123` | 

__Response:__
