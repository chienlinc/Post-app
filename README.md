# POST App

A scalable full-stack web application built with Node.js, Express, and MongoDB, featuring RESTful API endpoints, dynamic EJS views, and environment variable support. 

## Technologies Used

1. Node.js: JavaScript runtime for server-side programming.
2. Express: Web framework for building RESTful APIs.
3. MongoDB: NoSQL database for data storage.
4. Mongoose: ODM for MongoDB to model application data.
5. EJS: Template engine for generating dynamic HTML.
6. Dotenv: Manage environment variables.
7. Docker: Deployment of applications within lightweight containers.
8. Docker Compose: Defining and managing multi-container applications

## Application Overview

1. Your post list

![Your post list](images/your-post-list.png)

2. Create a post

![Create a post](images/create-a-post.png)

## Installation

1. Install dependencies

```bash
npm install
```

2. Create a .env file

3. Setup environment variables

## Scripts

1. Start the server.

```bash
npm start
```

2. Start the server with Nodemon for development

```bash
npm run dev
```

3. Builds images, starts containers and attaches logs

```bash
docker-compose up --build
```

Rebuilds images if there have been any changes in the Dockerfiles or dependencies. Launches all services defined in the docker-compose.yml file. Displays the output from each container, allowing you to monitor the application in real-time.

## Reference

Docker: https://www.youtube.com/watch?v=pg19Z8LL06w
Express: https://www.youtube.com/watch?v=SccSCuHhOw0
Mongoose: https://www.youtube.com/watch?v=fgTGADljAeg