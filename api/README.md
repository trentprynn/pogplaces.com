# Pog Places API
This is the API portion of the Pog Places project


## Running this project
1. Create a local database using `docker` that our API can connect to
```bash
docker run --name pog-places-db -e POSTGRES_USER=pog-places_user -e POSTGRES_PASSWORD=pog-places_pass -e POSTGRES_DB=pog-places -p 5432:5432 -v pog-places_data:/var/lib/postgresql/data -d postgres
```

2. Create a `.env` file in the root of the api directory with the following variables defined
```bash
DATABASE_URL=postgres://pog-places_user:pog-places_pass@localhost:5432/pog-places?schema=public
JWT_SECRET=LOCAL_SECRET_KEY
JWT_LIFE_SECONDS=3600
REFRESH_TOKEN_SECRET=LOCAL_REFRESH_SECRET
REFRESH_TOKEN_LIFE_SECONDS=2592000
```

3. Install dependencies, run migrations, and start the API with hot reloading enabled
```bash
yarn
yarn prisma migrate dev
yarn start
```

## Deployment
- The following commands can be used to locally build and run the Dockerfile that will be deployed
    - build image: `docker build . -t api.pogplaces.com`
    - create container: `docker run -d --name api.pogplaces.com --env-file .env -p 3000:3000  api.pogplaces.com`
    - stop container: `docker stop api.pogplaces.com`
    - delete container: `docker rm api.pogplaces.com`
    - delete image: `docker rmi api.pogplaces.com`
