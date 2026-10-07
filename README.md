# AWS-Advanced-Portfolio
Layout for an AWS hosted portfolio with built in projects that display aws services and API usage

# Architecture
                    ┌──────────────┐
                    │   Route 53    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  CloudFront  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │      S3      │
                    │ Static Site  │
                    └──────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
       ┌───────────┐               ┌───────────┐
       │  Lambda   │               │  OpenAI   │
       │ API logic │──────────────▶│    API    │
       └─────┬─────┘               └───────────┘
             │
             ▼
       ┌──────────────┐
       │  DynamoDB    │
       │ Quiz Scores  │
       └──────────────┘

# Services
  S3   ----->  Used for hosting the website files(html, js, css, etc)
  CloudFront ---> Used for global HTTPS delivery
  Route 53 ----> DNS
  Lambda ------> Used for serverless backend code execution (chatbot and quiz)
  DynamoDB -----> Used for storing quiz questions and scores in a database
  API Gateway ---> Used to manage APIs for both the quiz and the chatbot
  OpenAI API ----> Used for the chatbot


# Features
  |Responsive portfolio website
  |AWS-hosted static frontend
  |Serverless backend
  |DynamoDB quiz storage
  |AI-powered chatbot
  |CDN distribution
  |Community average scoring


# What you learn from this project
  I started this project as a basic website resume, but by building it up to what it is now I learned more about DNS, networking, APIs, CDN distribution, serverless computing, how and how to utilize databases.
