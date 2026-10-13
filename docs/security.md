# AWS Portfolio Website — Security Overview

## Overview

This project uses several AWS security controls to protect the website, manage access between services, and safeguard application data.

The primary security components include:

- **AWS IAM:** Controls permissions for Lambda functions and other AWS services.
- **Amazon CloudFront:** Enforces HTTPS for visitors and delivers website content.
- **AWS WAF:** Provides web traffic filtering at the CloudFront distribution.
- **Amazon S3:** Stores website files and encrypts stored objects.
- **Amazon API Gateway:** Exposes the quiz and chatbot backend endpoints.
- **AWS Lambda:** Executes backend logic using dedicated execution roles.
- **Amazon DynamoDB:** Stores quiz questions and submitted scores.

This document describes the security configuration used by the reference deployment.

## 1. Identity and Access Management (IAM)

Each Lambda function uses a dedicated IAM execution role. These roles allow the functions to access the AWS resources required for their respective responsibilities.

### Quiz Backend

The quiz Lambda role includes:

- CloudWatch Logs permissions for application logging.
- DynamoDB permissions for accessing the quiz questions and scores tables.

DynamoDB access is scoped to the two tables used by the application rather than granting unrestricted access to all tables in the account.

### Chatbot Backend

The chatbot Lambda role includes CloudWatch Logs permissions and an inline policy for AI-related service access.

The deployed configuration includes Amazon Bedrock model invocation and AWS Marketplace permissions. The application also has an OpenAI API key configured, so the active AI provider depends on the deployed implementation.

### IAM Trust Policies

Both execution roles trust the AWS Lambda service, allowing Lambda to assume the roles when running the functions.

Using separate execution roles helps isolate the permissions of the quiz and chatbot backends.

## 2. Website Delivery Security

### Amazon S3

Amazon S3 stores the static website files, including HTML, CSS, JavaScript, and other assets.

The current deployment uses a public-read bucket policy so visitors can retrieve the files required to display the website. The bucket does not rely on public ACL grants for this access.

S3 uses server-side encryption with Amazon S3-managed keys (SSE-S3), providing encryption at rest for stored objects.

### Amazon CloudFront

CloudFront distributes the website content and provides the public HTTPS entry point for the custom domain.

The current configuration includes:

- HTTP-to-HTTPS redirection.
- A managed SSL/TLS certificate from AWS Certificate Manager.
- A minimum TLS policy of `TLSv1.2_2021`.
- HTTP/2 and IPv6 support.
- An attached AWS WAF web ACL.

CloudFront helps provide encrypted connections between website visitors and the distribution while applying edge-level traffic filtering.

### AWS WAF

AWS WAF is associated with the CloudFront distribution. It provides a layer for filtering web requests according to the configured rules.

WAF complements the application's other security controls; it does not replace IAM permissions, input validation, or backend access controls.

## 3. API Security

The project uses separate API Gateway HTTP APIs for the quiz and chatbot features.

- **Quiz API:** Handles question retrieval, score submissions, and average-score requests.
- **Chatbot API:** Receives visitor messages and forwards them to the chatbot Lambda.

### Cross-Origin Resource Sharing (CORS)

CORS configuration controls which browser-based origins are permitted to access API responses from frontend JavaScript.

The deployed configuration restricts browser access to the portfolio website's origin where configured.

CORS is a browser security mechanism, not an authentication system. It does not prevent command-line tools or other HTTP clients from sending requests to a public endpoint.

### Request Handling

The Lambda functions process incoming API requests and communicate with their respective backend services.

The quiz backend accesses DynamoDB, while the chatbot backend communicates with its configured AI provider. These operations run on the server side rather than exposing AWS database permissions or AI credentials directly to website visitors.

## 4. Lambda and Application Secrets

Lambda environment variables provide runtime configuration for the backend functions, including resource names and AI API credentials.

The chatbot currently has an `OPENAI_API_KEY` environment variable configured. The key must remain on the backend and must never be included in frontend JavaScript, HTML, or public GitHub files.

Anyone reproducing the project should supply their own API credentials through their AWS configuration rather than copying credentials from another deployment.

The Lambda functions also send application logs to Amazon CloudWatch for troubleshooting and operational visibility.

## 5. DynamoDB Data Access

The quiz application uses two DynamoDB tables:

| Table | Purpose |
|---|---|
| `quiz-questions` | Stores quiz questions, answer choices, and correct-answer indexes |
| `quiz-scores` | Stores submitted quiz scores and timestamps |

The quiz Lambda execution role provides the database access needed by the application. The tables are not intended to be accessed directly by anonymous website visitors.

The backend is responsible for processing submissions and interacting with DynamoDB. For production deployments, score validation should take place on the server so the application does not blindly trust values submitted by the browser.

## 6. Monitoring and Operational Visibility

Amazon CloudWatch collects Lambda execution logs, which help identify application errors and troubleshoot backend requests.

CloudFront access logging and API Gateway access logging are not enabled in the reviewed configuration. These are separate from Lambda execution logging.

When extending the project, logs should be configured to avoid exposing API credentials or unnecessary sensitive visitor information. AWS usage and service costs should also be monitored, particularly for public APIs that trigger Lambda execution, database operations, or external AI requests.

## 7. Security Configuration Summary

| Component | Security control |
|---|---|
| IAM | Dedicated Lambda roles and scoped quiz database permissions |
| S3 | Server-side encryption and bucket-policy-based public website access |
| CloudFront | HTTPS redirection and TLS 1.2 security policy |
| AWS WAF | Web ACL attached to the CloudFront distribution |
| API Gateway | Separate HTTP APIs and configured CORS policies |
| Lambda | Server-side application execution and CloudWatch logging |
| DynamoDB | Access controlled through IAM execution-role permissions |
| Chatbot credentials | API key configured on the backend rather than the frontend |

## Summary

The portfolio demonstrates how security controls fit into a serverless AWS application. IAM manages service permissions, CloudFront and TLS protect website delivery, WAF filters web traffic, and Lambda mediates access to application data and external AI services.

These controls form part of the overall security design. Individual deployments may require different configurations depending on their traffic, data sensitivity, application requirements, and operational needs.


