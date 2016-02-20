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

**Current API Version:** v1

All endpoints return JSON.

### Members

A Member is a CSH member who has ever added themselves to the map.

#### GET /members/:uid?

**Description:** Get a list of Members who are recorded on the map.

**Parameters:**

| Name | Description | Example |
| --- | --- | --- |
| `uid` (optional) | Username of the single Member you want to retrieve | `"bencentra"` |

**Example Response:** The array of Member objects, or a single Member object.

```json
[
  {
    "uid": "bencentra",
    "cn": "Ben Centra",
    "createdAt": "2016-02-03T23:37:15.000Z",
    "updatedAt": "2016-02-03T23:37:15.000Z"
  },
  {
    "uid": "cohoe",
    "cn": "Grant Cohoe",
    "createdAt": "2016-02-03T23:37:15.000Z",
    "updatedAt": "2016-02-03T23:37:15.000Z"
  },
  {
    "uid": "mcsaucy",
    "cn": "Josh McSaveney",
    "createdAt": "2016-02-03T23:37:15.000Z",
    "updatedAt": "2016-02-03T23:37:15.000Z"
  }
]
```

#### POST /members

**Description:** Add a new Member to the map.

**Parameters:**

| Name | Description | Example |
| --- | --- | --- |
| `uid` | Username of the Member | `"bencentra"` |
| `cn` | Common name (first & last) of the Member | `"Ben Centra"`

**Example Response:** The new Member object.

```json
{
  "uid": "bencentra",
  "cn": "Ben Centra",
  "createdAt": "2016-02-03T01:09:29.000Z",
  "updatedAt": "2016-02-03T01:15:12.000Z"
}
```

#### PUT /members/:uid

**Description:** Update the `cn` of an existing Member.

**Parameters:**

| Name | Description | Example |
| --- | --- | --- |
| `cn` | The new common name of the Member | `"Ben Centra"`

**Example Response:**

```json
{
  "success": true
}
```

### Locations

A Location is a city added to the Map.

#### GET /locations/:id?

**Description:** Get a list of Locations recorded on the map.

**Parameters:**

| Name | Description | Example |
| --- | --- | --- |
| `id` (optional) | The ID of the single Location to retrieve | `1` |

**Example Response:** An array of Location objects, or a single Location object.

```json
[
  {
    "id": 1,
    "address": "Cambridge, MA, USA",
    "latitude": 42.3736,
    "longitude": -71.1106,
    "createdAt": "2016-02-03T23:37:15.000Z",
    "updatedAt": "2016-02-03T23:37:15.000Z"
  },
  {
    "id": 2,
    "address": "San Francisco, CA, USA",
    "latitude": 37.7833,
    "longitude": -122.4167,
    "createdAt": "2016-02-03T23:37:15.000Z",
    "updatedAt": "2016-02-03T23:37:15.000Z"
  }
]
```

#### POST /locations

**Description:** Add a new Location to the map.

**Parameters:**

| Name | Description | Example |
| --- | --- | --- |
| `address` | The address of the Location as a String | `"Boston, MA, USA"` |
| `latitude` | The latitude of the Location | `42.3601` |
| `longitude` | The longitude of the Location | `71.0589` |

**Example Response:** The new Location object.

```json
{
  "id": 3,
  "latitude": "42.3601",
  "longitude": "71.0589",
  "address": "Boston, MA, USA",
  "updatedAt": "2016-02-03T23:40:39.000Z",
  "createdAt": "2016-02-03T23:40:39.000Z"
}
```

### Reasons

A Reason is additional information about why a Member moved to a Location.

Reasons are all pre-populated when the server is started (see `/fixtures/reasons`). There is no programatic way to add new Reasons.

#### GET /reasons/:id?

**Description:** Get the list of Reasons for moving.

**Parameters:**

| Name | Description | Example |
| --- | --- | --- |
| `id` (optional) | The ID of the single Reason to retrieve | `1` |

**Example Response:** An array of Reason objects, or a single Reason object.

```json
[
    {
        "id": 1,
        "name": "Other",
        "description": "",
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    },
    {
        "id": 2,
        "name": "Back to School",
        "description": "Moved to go (back) to school",
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    },
    {
        "id": 3,
        "name": "Going Home",
        "description": "Moved back home for the summer",
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    },
    {
        "id": 4,
        "name": "Internship/Co-op",
        "description": "Moved temporarily for an internship or co-op",
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    },
    {
        "id": 5,
        "name": "Full-time Job",
        "description": "Moved permanently for a full-time job",
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    },
    {
        "id": 6,
        "name": "Family",
        "description": "Moved due to family reasons",
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    }
]
```

### Records

A Record is a saved record of a Member moving to a Location for a Reason.

#### GET /records

**Description:** Get a list of all Records representing the "present" state of the map (only the most recent Record for each Member).

**Parameters:** None

**Example Response:** An array of Record objects.

```json
[
    {
        "id": 1,
        "MemberUid": "bencentra",
        "LocationId": 1,
        "ReasonId": 4,
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    },
    {
        "id": 3,
        "MemberUid": "cohoe",
        "LocationId": 1,
        "ReasonId": 4,
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    },
    {
        "id": 2,
        "MemberUid": "mcsaucy",
        "LocationId": 2,
        "ReasonId": 4,
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z"
    }
]
```

#### GET /records/history

**Description:** Get a list of all Records ever saved, in reverse chronological order.

**Parameters:** None

**Example Response:** An array of Record objects.

```json
[
    {
        "id": 4,
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z",
        "MemberUid": "bencentra",
        "LocationId": 2,
        "ReasonId": 4
    },
    {
        "id": 3,
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z",
        "MemberUid": "cohoe",
        "LocationId": 1,
        "ReasonId": 4
    },
    {
        "id": 2,
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z",
        "MemberUid": "mcsaucy",
        "LocationId": 2,
        "ReasonId": 4
    },
    {
        "id": 1,
        "createdAt": "2016-02-04T01:57:58.000Z",
        "updatedAt": "2016-02-04T01:57:58.000Z",
        "MemberUid": "bencentra",
        "LocationId": 1,
        "ReasonId": 4
    }
]
```

#### POST /records

**Description:** Add a new Record for a move.

**Parameters:**

| Name | Description | Example |
| --- | --- | --- |
| `MemberUid`| The uid of the Member moving | `"bencentra"` |
| `LocationId`| The ID of the Location the Member is moving to | `1` |
| `ReasonId`| The ID of the Reason for why the Member is moving | `1` |

**Example Response:** The new Record object.

```json
{
    "id": 5,
    "MemberUid": "mcsaucy",
    "LocationId": "2",
    "ReasonId": "4",
    "updatedAt": "2016-02-04T02:06:27.000Z",
    "createdAt": "2016-02-04T02:06:27.000Z"
}
```

NOTE: To "remove" a Member from the map, create a Record with a null Location. This can be done by POST-ing to /records with a LocationId of -1.
