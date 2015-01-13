CSH Map
=======

Map for locating CSHers and Alumni across the country and around the world! Uses the [Google Maps v3 JavaScript API](https://developers.google.com/maps/documentation/javascript/).

Members of CSH can access the map here: https://members.csh.rit.edu/~bencentra/csh-map/

API
---

A simple JSON API for setting and retrieving addresses. Requests can be in the form of ~~either `/api/<request>` or~~ `/api/api.php?request=<request>`. Relies on Webauth for authentication.

The following API methods are available:

### GET /users

__Description:__ Gets an array of all users and their addresses.

__Parameters:__ No required parameters.

__Sample Response:__

```json
{
    "status": true,
    "message": "",
    "data": [
        ...
        {
            "uid": "bencentra",
            "cn": "Ben Centra",
            "latitude": "42.376485",
            "longitude": "-71.235611",
            "address": "Waltham, MA, USA",
            "date": "2014-07-22 23:12:52"
        },
        ...
    ]
}
```

### GET /users/group_by/location

__Description:__ Gets an object with all users grouped by location.

__Parameters:__ No required parameters.

__Sample Response:__

```json
{
    "status": true,
    "message": "",
    "data": {
        ...
        "Rochester, NY, USA": [
            ...
            {
                "uid": "rossdylan",
                "cn": "Ross Delinger",
                "latitude": "43.1610300",
                "longitude": "-77.6109219",
                "address": "Rochester, NY, USA",
                "date": "2014-07-29 20:37:04"
            },
            ...
        ],
        ...
    }
}
```

### POST /users

__Description:__ Set or update your own address.

__Parameters:__ 

param|description|required
---|---|---
latitude|The user's latitude coordinate|true
longitude|The user's longitude coordinate|true
address|The user's address string|true

__Sample Response:__

```json
{
    "status": true,
    "message": "",
    "data": true
}
```

### DELETE /users

__Description:__ Delete your own address.

__Parameters:__ No required parameters.

__Sample Response:__

```json
{
    "status": true,
    "message": "",
    "data": true
}
```
