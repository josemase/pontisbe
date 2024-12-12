# pontisBE

## Set Up
1. Download the necessary software
-Running the LTS Node 20.9.0 (https://nodejs.org/en/blog/release/v20.9.0)

`npm install`
- Run npm install to get all of the packages you need to run the back end
- Postico 2 (This is where you can create a local database and interact with real data before pushing to production) Download-> https://eggerapps.at/postico2/

2. Create your own local database in Postico

- Host: localhost
- Port: 5432
- User: postgres (Unless you changed it)
- Password: (This is the password you set up when you set up Postgres)

3. Push the current Prisma Schema to your database

`npx prisma db push`

4. Build the js files to run the program

'npm run build'

5. Seed the Database to create users (optional)

`npm run seed`

6. Create a .env file to interact with AWS
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- S3_BUCKET_NAME
- DATABASE_URL (This will come from your local postgres setup)
Ask for Amadeus' help to set this up


7. Start the running back end

'npm run start'

## Edit the Prisma Schema
npx prisma migrate dev --name (Add Description Here)

## Build and Run docker file for development
docker-compose up --build

## Build and Run docker file for production
docker-compose -f docker-compose.yml up --build app-prod
