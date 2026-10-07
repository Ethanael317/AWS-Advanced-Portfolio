The architecture for this portfolio doesn't require a lot of services, all of which you've probably already used if you've used AWS before.
Aside from the diagram below, you will also used IAM roles for basic permissions.
OpenAI API is optional, I've also used the google workspace API and it works great.
Something important to note, and it will be written numerous times, DO NOT put your API key in your frontend. It should only be in your lambda function.


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
