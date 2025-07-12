import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb';

// Log environment variables (safe partial output)
console.log("Dynamo.js - REACT_APP_AWS_REGION:", process.env.REACT_APP_AWS_REGION);
console.log("Dynamo.js - REACT_APP_AWS_ACCESS_KEY_ID (partial):", process.env.REACT_APP_AWS_ACCESS_KEY_ID?.substring(0, 4) + '...');
console.log("Dynamo.js - REACT_APP_AWS_SECRET_ACCESS_KEY (partial):", process.env.REACT_APP_AWS_SECRET_ACCESS_KEY?.substring(0, 4) + '...');

// AWS SDK Client configuration
const client = new DynamoDBClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

const TABLE_NAME = 'MovieWatchlist'; // Make sure this matches your table name exactly

// ----------------- CRUD Operations ------------------

// ✅ READ: Fetch all movies
export async function scanMovies() {
  try {
    console.log("Scanning movies from table:", TABLE_NAME);
    const { Items } = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );
    console.log("Movies scanned successfully.");
    return Items || [];
  } catch (error) {
    console.error("Error scanning movies:", error);
    throw error;
  }
}

// ✅ CREATE: Add a new movie
export async function createMovie(movie) {
  try {
    console.log("Creating movie with data:", movie);
    await docClient.send(
      new PutCommand({ TableName: TABLE_NAME, Item: movie })
    );
    console.log("Movie added:", movie.title);
  } catch (error) {
    console.error("Error creating movie:", error);
    throw error;
  }
}

// ✅ UPDATE: Modify existing movie by id
export async function updateMovie(id, updates) {
  if (Object.keys(updates).length === 0) {
    console.warn("No updates provided for movie:", id);
    return;
  }

  let UpdateExpression = 'set ';
  let ExpressionAttributeValues = {};
  let ExpressionAttributeNames = {};
  let first = true;

  for (const key in updates) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      if (!first) UpdateExpression += ', ';
      UpdateExpression += `#${key} = :${key}`;
      ExpressionAttributeNames[`#${key}`] = key;
      ExpressionAttributeValues[`:${key}`] = updates[key];
      first = false;
    }
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };

  try {
    console.log(`Updating movie '${id}' with params:`, params);
    const data = await docClient.send(new UpdateCommand(params));
    console.log(`Movie '${id}' updated. New attributes:`, data.Attributes);
    return data.Attributes;
  } catch (error) {
    console.error(`Error updating movie '${id}':`, error);
    throw error;
  }
}

// ✅ DELETE: Remove movie by id
export async function deleteMovie(id) {
  try {
    console.log("Deleting movie with id:", id);
    await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    console.log(`Movie '${id}' deleted.`);
  } catch (error) {
    console.error(`Error deleting movie '${id}':`, error);
    throw error;
  }
}

// ✅ GET: Retrieve one movie by id
export async function getMovie(id) {
  try {
    console.log("Getting movie with id:", id);
    const { Item } = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    console.log(`Movie '${id}' fetched:`, Item);
    return Item;
  } catch (error) {
    console.error(`Error fetching movie '${id}':`, error);
    throw error;
  }
}