# Quiz API — AWS Lambda

## Overview

This Lambda function provides the backend for a web-based quiz application. It retrieves quiz questions from Amazon DynamoDB, stores submitted scores, and calculates the average score across quiz attempts.

The API uses Amazon API Gateway HTTP API routes to expose the Lambda functionality to a frontend application.

## Architecture

The application follows a serverless architecture:

1. The frontend requests quiz questions or submits a completed quiz.
2. Amazon API Gateway routes the HTTP request to AWS Lambda.
3. Lambda validates the request and performs the requested operation.
4. Amazon DynamoDB stores the quiz questions and submitted scores.
5. Lambda returns a JSON response to the frontend.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/quiz/questions` | Retrieves and randomizes quiz questions, returning up to 20 |
| POST | `/quiz/submit` | Validates and stores a quiz score |
| GET | `/quiz/average` | Returns the average score and total number of attempts |
| OPTIONS | Applicable routes | Handles CORS preflight requests |

### Retrieve Questions

**Request**

`GET /quiz/questions`

Returns a JSON array containing up to 20 randomly ordered questions.

Each question can contain a question identifier, question text, answer options, and the correct answer index.

### Submit a Score

**Request**

`POST /quiz/submit`

Example request body:

```json
{
  "score": 85,
  "totalQuestions": 20
}
```

The API validates the submitted score and stores the result in DynamoDB.

A successful response includes a success indicator and a generated score identifier.

### Retrieve the Average Score

**Request**

`GET /quiz/average`

Example response:

```json
{
  "average": 85.5,
  "totalAttempts": 12
}
```

The average is calculated from the stored scores. An empty score table returns an average of zero and zero attempts.

## DynamoDB Tables

### Questions Table

Default table name: `quiz-questions`

| Attribute | Type | Purpose |
|---|---|---|
| `questionID` | String | Unique question identifier |
| `question` | String | Question text |
| `options` | List of strings | Available answer choices |
| `correctAnswer` | Number | Index of the correct answer |

The `questionID` attribute is the partition key.

### Scores Table

Default table name: `quiz-scores`

| Attribute | Type | Purpose |
|---|---|---|
| `scoreID` | String | Unique identifier for a submission |
| `timestamp` | Number | Submission time in milliseconds |
| `score` | Number | Submitted score from 0 to 100 |
| `totalQuestions` | Number | Number of questions in the attempt |

The table uses `scoreID` as its partition key and `timestamp` as its sort key.

## Environment Variables

| Variable | Purpose |
|---|---|
| `AWS_REGION` | AWS region containing the DynamoDB tables |
| `QUESTIONS_TABLE` | Questions table name |
| `SCORES_TABLE` | Scores table name |
| `ALLOWED_ORIGIN` | Website origin allowed by CORS |

Default table names are provided for demonstration purposes. Configure these values for the target environment.

## IAM Permissions

The Lambda execution role requires appropriate permissions for the configured DynamoDB tables:

- `dynamodb:Scan` on the questions table
- `dynamodb:PutItem` on the scores table
- `dynamodb:Scan` on the scores table

Follow the principle of least privilege by granting only the required actions on the specific resources.

## Error Handling

The API returns appropriate HTTP status codes:

| Status | Meaning |
|---|---|
| `200` | Request completed successfully |
| `400` | Invalid JSON or invalid score data |
| `404` | Unknown endpoint |
| `405` | Unsupported HTTP method |
| `500` | Internal processing or DynamoDB error |

Internal error details are logged to Amazon CloudWatch rather than returned to clients.

## CORS and Security

The Lambda function returns CORS headers to support browser requests. Configure the allowed origin for the deployed frontend and align API Gateway CORS settings with the Lambda configuration.

CORS is not authentication. For a public deployment, consider API throttling, request validation, and controls against fraudulent score submissions.

The current API trusts the score submitted by the client. A production quiz should validate answers on the backend and calculate the score server-side to prevent visitors from submitting arbitrary results.

## Technologies

- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- AWS SDK for JavaScript v3
- Node.js
- JavaScript ES modules
- JSON and HTTP APIs
