# 📰 Northcoders News API 📰
Welcome to my first backend project at Northcoders Bootcamp!

It's all thanks to my fantastic tutors & cohort at Northcoders for making this a great experience.

## Project Summary 📚
The Northcoders News API is a backend service for the purpose of accessing application data programmatically. Whilst providing information for front-end purposes, this project also aims to mimic the functionality of real-world platforms like Reddit, allowing users to interact with articles, comments, topics, and more!

The database for this project will be PSQL, and we will interact with it using node-postgres.

### Hosted Version
The hosted version of the Northcoders News API can be accessed [here](https://nc-news-zzyy.onrender.com/api).

### Requirements ❗
- Node.js (minimum version: 16.0.0)
- PostgreSQL (minimum version: 8.11.3)

## Getting Started 👩‍💻

### Clone the repository in your terminal
```bash
git clone https://github.com/beckylakes/nc-news 
```

### Install Dependencies
```bash
cd nc-news
npm install
```

## Setup Local Databases 🔧
Create a local PostgreSQL database using the following script:
```bash
npm run setup-dbs
```
Then, to seed the local database you just created with data, run:
```bash
npm run seed
```

## Setup Environment Variables 🔨
Create two '.env' files called:
- .env.development
- .env.test

In each '.env' file, add the appropriate variables:
- For '.env.development': PGDATABASE=nc_news
- For '.env.test': PGDATABASE=nc_news_test

### Important❗
Make sure that both '.env' files are added to your '.gitignore' file (make this now if you haven't already)!

## Testing 🧪
A complete testing suite (using 'jest' & 'supertest') has been provided for in this project. Use the following command to run tests (please ensure that you have setup local databases before this step!)

```bash
npm run test
```

## Packages 📦
- dotenv
- express
- jest
- jest-extended
- jest-sorted
- supertest
- husky
- pg
- pg-format

## Additional Information 📝
For any questions or issues, please let me know [here](https://github.com/beckylakes/nc-news/issues).



