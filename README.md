# Northcoders News API

## Project Background
This project aims to build an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

The database for this project will be PSQL, and we will interact with it using node-postgres.

## Setup to connect to databases
### First step:
1. Clone this repository to your local machine using the following command in your terminal:
git clone https://github.com/beckylakes/nc-news

### Second step:
2. Setup environment vairables by creating 2 '.env' files called:
- '.env.development'
- '.env.test'

### Third step:
3. In each '.env' file, please write the following variables:
- For '.env.development': PGDATABASE=nc_news
- For '.env.test': PGDATABASE=nc_news_test

### Final step:
4. Finally, please make sure that both '.env' files are added to the '.gitignore'!


