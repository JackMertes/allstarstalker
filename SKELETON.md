# Walking Skeleton
Here is our plan for the Walking Skeleton.

The Walking Skeleton sets up a minimal version of our technical stack. It is not meant to be a product. It is used to confirm that the front end, back end, and database are able to communicate with each other.

## Tech Stack
Front end  
A simple web page that allows user input

Back end  
Java Spring Boot REST API

Database  
MySQL running in Docker

## Walking Skeleton Feature
The Walking Skeleton will allow a user to track a single name.

This name could represent a person, flight, or plane identifier.

User flow:
1. A user enters a name into a form on the front end
2. The front end sends the data to the Spring Boot back end using an HTTP POST request
3. The back end stores the name in a MySQL database
4. The back end returns a response confirming the data was saved
5. The front end displays the result
6. The front end can request all stored names using an HTTP GET request and display them

## API Plan
Base URL  
http://localhost:8080

POST /api/tracked  
Request body:
{ "name": "Taylor Swift" }

Response body:
{ "id": 1, "name": "Taylor Swift" }

GET /api/tracked  
Response body:
[
  { "id": 1, "name": "Taylor Swift" }
]

## Database Plan
Database name  
appdb

Table  
tracked_items

Columns  
id INT auto increment primary key  
name VARCHAR(255) not null  

## Setup Plan
1. Start MySQL using Docker
2. Create the database and table
3. Start the Spring Boot application
4. Open the front end page in a browser and interact with the API

## Completion Criteria
The Walking Skeleton is complete when:
- A value entered in the front end is saved to the database
- Saved values can be retrieved from the database
- Results are displayed in the front end

This walking skeleton will be expanded in future sprints.