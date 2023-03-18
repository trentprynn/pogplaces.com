# pogplace.com
Repository for the source code of pogplaces.com

## Run and develop locally
1. clone the repository
2. navigate into it 
3. run `yarn`
    - installs dependencies
4. setup `.env` file with expected values (`cp .env.sample .env`)
5. run `yarn dev`
    - runs application with hot reloading enabled

## Deployment
- On a push to master the website will be deployed automatically by Railway
- The following commands can be used to locally build and run the Dockerfile that will be deployed
    - build image: `docker build . -t pogplaces.com`
    - create container: `docker run -d --name pogplaces.com --env-file .env -p 3000:3000  pogplaces.com`
    - stop container: `docker stop pogplaces.com`
    - delete container: `docker rm pogplaces.com`
    - delete image: `docker rmi pogplaces.com`
