CSH Map
=======

Map for locating CSHers and Alumni across the country and around the world! Uses the [Google Maps v3 JavaScript API](https://developers.google.com/maps/documentation/javascript/).

API
---

A simple RESTful API for setting and retrieving addresses. Requests can be in the form of either `/api/<request>` or `/api/api.php?request=<request>`. Relies on Webauth for authentication.

The following API methods are available:

### GET /users

__Description:__ Gets a list of all adresses.

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
