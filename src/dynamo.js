import { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const TABLE_NAME = 'MovieWatchlist'; // Ensure this matches your DynamoDB table name

if (process.env.NODE_ENV !== 'test') {
  console.log('Running DynamoDB operations...');
}

if (process.env.NODE_ENV !== 'test') {
  console.log('Dynamo.js - REACT_APP_AWS_REGION:', REGION);
  console.log('Dynamo.js - REACT_APP_AWS_ACCESS_KEY_ID (partial):', ACCESS_KEY_ID?.substring(0, 4) + '...');
  console.log('Dynamo.js - REACT_APP_AWS_SECRET_ACCESS_KEY (partial):', SECRET_ACCESS_KEY?.substring(0, 4) + '...');
}

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  }
});

export const scanMovies = async () => {
  try {
    const response = await client.send(new ScanCommand({ TableName: TABLE_NAME }));
    console.log('Movies scanned successfully.');
    return response.Items ? response.Items.map(unmarshall) : [];
  } catch (error) {
    console.error('Error scanning movies:', error);
    return [];
  }
};

// --- CRUD Operations for DynamoDB ---

/**
 * Creates a new movie item in the DynamoDB table.
 * Assumes 'id' is the primary key.
 * @param {object} movie - The movie object to be created. Must include an 'id'.
 */
export const createMovie = async (movie) => {
  if (!movie.id) {
    console.error('Error creating movie: Movie object must have an "id" field.');
    return null;
  }

  // Convert the movie object to DynamoDB attribute format
  const item = {};
  for (const key in movie) {
    item[key] = { S: String(movie[key]) }; // Assuming all values are strings for simplicity
  }

  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log('Movie created successfully:', movie.id);
    return movie; // Return the created movie object
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

/**
 * Updates an existing movie item in the DynamoDB table.
 * Assumes 'id' is the primary key.
 * @param {string} id - The ID of the movie to update.
 * @param {object} updates - An object containing the attributes to update.
 */
export const updateMovie = async (id, updates) => {
  if (!id) {
    console.error('Error updating movie: ID is required.');
    return null;
  }

  let UpdateExpression = 'set ';
  const ExpressionAttributeValues = {};
  const ExpressionAttributeNames = {};
  let i = 0;

  for (const key in updates) {
    if (key === 'id') continue; // Skip updating the ID
    const valuePlaceholder = `:val${i}`;
    const namePlaceholder = `#attr${i}`;

    UpdateExpression += `${namePlaceholder} = ${valuePlaceholder}, `;
    ExpressionAttributeValues[valuePlaceholder] = { S: String(updates[key]) }; // Assuming all values are strings
    ExpressionAttributeNames[namePlaceholder] = key;
    i++;
  }

  // Remove trailing comma and space
  UpdateExpression = UpdateExpression.slice(0, -2);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: { S: String(id) } // Assuming 'id' is a string primary key
    },
    UpdateExpression: UpdateExpression,
    ExpressionAttributeValues: ExpressionAttributeValues,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ReturnValues: 'ALL_NEW' // Returns the item's new attributes
  };

  try {
    const response = await client.send(new UpdateItemCommand(params));
    console.log('Movie updated successfully:', id);
    return response.Attributes ? unmarshall(response.Attributes) : null;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

/**
 * Deletes a movie item from the DynamoDB table.
 * Assumes 'id' is the primary key.
 * @param {string} id - The ID of the movie to delete.
 */
export const deleteMovie = async (id) => {
  if (!id) {
    console.error('Error deleting movie: ID is required.');
    return false;
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: { S: String(id) } // Assuming 'id' is a string primary key
    }
  };

  try {
    await client.send(new DeleteItemCommand(params));
    console.log('Movie deleted successfully:', id);
    return true; // Indicate successful deletion
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};