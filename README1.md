# Movie Watchlist CRUD App

Project Overview
This project is a single-page application (SPA) built with React that allows users to manage a personal movie watchlist. It demonstrates full CRUD (Create, Read, Update, Delete) operations by interacting with a DynamoDB database on Amazon Web Services (AWS) as its backend.

The app provides a user-friendly interface to:

Add new movies with details like title, genre, review, and star rating.

View all movies currently in the watchlist.

Update a movie's "watched" status.

Delete movies from the watchlist.

## Technologies Used

Frontend: React (created with Create React App - Webpack-based)

Backend/Database: AWS DynamoDB

AWS Interaction: AWS SDK for JavaScript v3 (@aws-sdk/client-dynamodb and @aws-sdk/lib-dynamodb)

Package Manager: npm

Getting Started
Follow these steps to set up and run the project locally, and to configure your AWS resources.

1. AWS DynamoDB Table Setup
Before running the app, you need to create a DynamoDB table in your AWS account to store your movie data.

Log in to the AWS Management Console.

Navigate to the DynamoDB service.

Click on "Create table".

Configure the table with these exact settings:

Table name: MovieWatchlist (Case-sensitive!)

Partition key: title (Type: String)

Sort key: Leave unchecked (not needed for this project).

Capacity mode: Select "On-demand (recommended)".

Click "Create table" and wait for its status to become "Active".

2.IAM User & Credentials
Your React app needs programmatic access to your DynamoDB table. It's crucial to use an IAM user with specific permissions, not your root account.

If you don't have one, create an IAM User in the AWS Console.

Attach a policy to this user that grants AmazonDynamoDBFullAccess (or a more restrictive policy allowing dynamodb:Scan, dynamodb:PutItem, dynamodb:UpdateItem, dynamodb:DeleteItem on your MovieWatchlist table).

Under the user's Security credentials tab, create an Access Key.

Save the Access Key ID and Secret Access Key immediately. You'll need them in the next step.

Security Warning: Never share these keys publicly or commit them to your repository!

3.Local Project Setup
Now, set up the React application on your local machine.

Clone the repository:

Bash

git clone [https://github.com/Belle531/movie-watchlist.git]
cd movie-watchlist
(Replace YOUR_GITHUB_USERNAME with your actual GitHub username)

### Install project dependencies

Bash

npm install
Create Environment Variables File:

In the root directory of your movie-watchlist project, create a new file named .env.

Open .env in your code editor and add your AWS credentials:

#### Code snippet

REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_ACCESS_KEY_ID=YOUR_SAVED_ACCESS_KEY_ID
REACT_APP_AWS_SECRET_ACCESS_KEY=YOUR_SAVED_SECRET_ACCESS_KEY
(Replace placeholders with your actual keys and ensure REACT_APP_AWS_REGION matches your DynamoDB table's region, e.g., us-east-1.)

##### Save and close the .env file. This file is automatically ignored by Git for security

4.Running the Application
Start the development server:

##### Bash

npm start
Your application will open in your browser, usually at [http://localhost:3000].

Application Features (CRUD Operations)
Once the application is running, you can:

View Movies (Read): Upon loading, the app fetches and displays all movies currently stored in your MovieWatchlist DynamoDB table.

Add New Movie (Create):

Use the "Add New Movie" form.

Enter the movie Title (required), Genre, Quick Review, and Star Rating.

Click "Add Movie". The movie will appear in your list and be saved to DynamoDB.

Toggle "Watched" Status (Update):

Next to each movie, there's a checkbox. Click it to toggle the movie's watched status. This change is reflected in DynamoDB.

Delete Movie (Delete):

Click the "Delete" button next to any movie.

Confirm the deletion, and the movie will be removed from both the UI and DynamoDB.

###### Project Structure Highlights

src/App.js: The main React component that handles UI state, user input, and calls to the dynamo.js helper.

src/dynamo.js: A dedicated helper module that encapsulates all AWS SDK v3 logic for interacting with the MovieWatchlist DynamoDB table (Scan, Put, Update, Delete operations). This keeps AWS-specific code separate from your React components.

.env: Stores sensitive AWS credentials, ensuring they are not hardcoded or committed to version control.

src/App.css: Basic styling for the application's layout and appearance.

###### Demo Screenshot

Here's a screenshot of the MovieWatchlist table in the AWS DynamoDB Console, showing some sample data created via the application:

## 🎬 Cassandra's Movie Watchlist App

A full-stack React app for tracking and managing your personal movie collection, powered by AWS DynamoDB. Users can add movies, write short reviews, rate them with stars, mark them as watched, and delete them — all through a clean responsive interface.

---

## ✨ Features

- ✅ Add new movies with title, genre, review, and star rating
- ✅ Toggle watched/unwatched status
- ✅ Delete movies from your list
- ✅ Persist movie data in DynamoDB
- ✅ Responsive UI for desktop and mobile devices
- ✅ Styled using Sass (or Chakra UI optionally)
- ✅ Scalable structure ready for testing and future expansion

---

## 🛠 Technologies Used

| Frontend       | Backend / Database |
|----------------|---------------------|
| React (CRA)    | AWS DynamoDB        |
| Sass / CSS     | AWS SDK v3          |
| UUID           | @aws-sdk/lib-dynamodb |
| Jest (Testing) | Environment Variables |

---

## 📦 Project Setup

### 1. Clone the Repo

```bash
git clone [https://github.com/Belle531/movie-watchlist.git]
cd movie-watchlist

## 2. Install Dependencies
npm install
### 3. Create .env File Never share credentials publicly
REACT_APP_AWS_REGION=your-region
REACT_APP_AWS_ACCESS_KEY_ID=your-access-key
REACT_APP_AWS_SECRET_ACCESS_KEY=your-secret-key

#### 4. Run the App 
npm start
Visit [hhp://localhost:3000]
🌐 API & AWS Integration
All movie data is stored in a DynamoDB table (MovieWatchlist). CRUD operations are handled in src/dynamo.js via:
- createMovie()
- scanMovies()
- updateMovie()
- deleteMovie()
- getMovie()
Each movie uses a UUID (id) as the primary key.

##### 5. Testing/Unit Tests
npm test //Example async text for createMovie in src/--tests--/dynamo.test.js

###### 6. Responsive Design
Sass styles include breakpoints and layout adjustments for screens under 600px. You can expand responsiveness using:
- Chakra UI’s responsive props
- CSS Grid or Flexbox layouts
- Additional media queries in App.scss

####### 7.Project Structure
src/
├── App.js
├── App.scss
├── dynamo.js
├── components/
│   └── MovieCard.js (optional)
├── __tests__/
│   └── dynamo.test.js

######## 8. Future Enhancements

- Advanced filtering and sorting
-  Star animations or ratings meter
-  User authentication and login
-  Test coverage report dashboard
-  Deployment to Vercel or Netlify

Developed By
Cassandra Moore
Mentor, Engineer, Course Architect
Helping learners build real-world front-end projects


