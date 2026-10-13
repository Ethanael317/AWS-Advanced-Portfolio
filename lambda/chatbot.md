# AWS Portfolio Chatbot — Lambda Backend

## Overview

This AWS Lambda function provides the backend for the AI chatbot. It receives messages from the portfolio website, forwards them to the OpenAI API, and returns the generated response to the frontend.

The function uses Node.js and communicates with OpenAI through HTTPS requests.

## Architecture

1. A visitor submits a message through the portfolio chatbot.
2. The frontend sends a POST request to the API endpoint.
3. Amazon API Gateway invokes the Lambda function.
4. Lambda sends the message and portfolio context to the OpenAI API.
5. OpenAI generates a response.
6. Lambda returns the response as JSON to the frontend.

## Configuration

The function requires the following environment variable:

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | API key used to authenticate requests to the OpenAI API. |

**Security:** The API key must be configured in the Lambda environment and must never be included in frontend JavaScript, committed source code, or public documentation.

## API Behavior

The Lambda function supports the following HTTP methods:

- **OPTIONS:** Responds to browser CORS preflight requests.
- **POST:** Parses the submitted message, calls OpenAI, and returns the generated response.
- **Other methods:** Return HTTP 405 (Method Not Allowed).

### Request Format

```json
{
  "message": "What AWS services have you used?"
}
```

### Successful Response

```json
{
  "message": "I have experience using AWS services including Lambda, S3, DynamoDB, CloudFront, and Route 53."
}
```

The example response is illustrative and does not represent a guaranteed chatbot response.

## Error Handling

The function handles common failures and returns appropriate HTTP status codes:

| Status | Meaning |
|---|---|
| `200` | Request completed successfully |
| `400` | Invalid JSON or missing message |
| `405` | Unsupported HTTP method |
| `500` | Configuration, OpenAI API, or internal server error |

The function also logs request and error information to Amazon CloudWatch for troubleshooting.

## CORS

The function includes CORS response headers to allow requests from the portfolio website. The allowed origin should match the production website domain, and the API Gateway configuration should support OPTIONS preflight requests.

## OpenAI Integration

The backend sends the visitor's message along with a system prompt containing professional portfolio information. This context helps the chatbot answer questions about the portfolio owner's education, technical skills, certifications, experience, and projects.

The OpenAI API key is supplied through the Lambda environment rather than being embedded in the request payload.

## Deployment Notes

1. Create or configure an AWS Lambda function using a supported Node.js runtime.
2. Configure the `OPENAI_API_KEY` environment variable.
3. Configure an API Gateway HTTP API route that invokes the function.
4. Enable the required CORS settings for the production website.
5. Configure the frontend to send POST requests to the API endpoint.
6. Test successful requests, invalid payloads, and API failures.
7. Review CloudWatch logs to troubleshoot issues.

## Technologies

- AWS Lambda
- Amazon API Gateway
- OpenAI API
- Node.js
- HTTPS
- JSON
- CORS
- Amazon CloudWatch
