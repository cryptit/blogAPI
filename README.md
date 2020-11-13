
To install dependencies, navigate into directory containing *package.json* and `npm install`

### blogAPI
See API-spec

### Create MySQL tables
Change credentials in *dbconn.js*
Log onto mysql terminal, then:
```
create database blog;
use blog;
source tables.sql;
```

