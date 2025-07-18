import { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const REGION = process.env.REACT_APP_AWS_REGION;
const ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const TABLE_NAME = 'MovieWatchlist';

if (process.env.NODE_ENV !== 'test') {
  console.log('Running scanMovies...');
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

// Example stubs for create/update/delete — you can expand these
export const createMovie = async (movie) => {
  // Implementation for adding a movie to DynamoDB
};

export const updateMovie = async (id, updates) => {
  // Implementation for updating a movie
};

export const deleteMovie = async (id) => {
  // Implementation for deleting a movie
};
