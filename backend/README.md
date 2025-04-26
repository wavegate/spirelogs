To commit with Commitizen, run npm run commit and follow the instructions instead of running git commit normally.

Prettier is run with husky pre-commit.

The local build uses Docker compose. Install Docker. Then run npm run docker:dev for development. To create a migration file, first get the docker running, and then swap the DATABASE_URL to connect locally, and then run npx prisma migrate dev --name migration-name, and then swap back.

To deploy externally, go to the root repository and run npm run deploy. Swap to DATABASE_URL for the heroku database, go into /backend folder and run npx migrate deploy to deploy migrations.
