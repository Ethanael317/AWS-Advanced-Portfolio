# DynamoDB Schema

DynamoDB is used for the quiz in this project, and it utilizes two tables.
quiz-questions - storing the questions you want and the correct answers
quiz-scores - used for storing scores and displaying community performance

# quiz-questions

Primary Key
|
Attribute          Type          Key Type          Description
_____________________________________________________________________
questionID        String(S)      Partition       Unique identifer
                                  Key              for each question

Attributes
|

Attribute          Type                Description
________________________________________________________________
questionID      String(S)        Unique question identifer
question        String(S)        Plaintext question given to user
options          List            Available answer choices
correctAnswer    Number(N)        Zero-based index of correct answer from options

# Example
{
 "questionID": "q1",
 "question": "Which AWS service provides protection against DDOS attacks?",
 "options": [
   "AWS Shield",
   "Amazon Inspector",
   "Amazon GuardDuty",
   "AWS Config"
  ],
  "correctAnswer": 0
}


# quiz-scores

Primary Key
|
Attribute          Type          Key Type          Description
_____________________________________________________________________
scoreID          String(S)      Partition        Unique identifier generated
                                  Key            for each submission
timestamp        Number(N)      Sort Key        Timestamp for each submission

The combination of scoreID and timestamp gives each score record a completely unique identifer

Attributes
|
Attribute          Type                Description
_____________________________________________________________
scoreID          String(S)         Unique identifier generated
                                    for each submission
timestamp        Number(N)         Timestamp for each submission
score            Number(N)         Score value 0-100


# Data Flow
## Data Flow

The DynamoDB tables are used by the quiz application's API layer.

```text
                    +----------------------+
                    |     Quiz Website     |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    quiz-api Lambda   |
                    +----------+-----------+
                               |
                    +----------+-----------+
                    |                      |
                    v                      v
          +------------------+    +------------------+
          |  quiz-questions  |    |   quiz-scores   |
          |                  |    |                  |
          |  Quiz Questions  |    | Submitted Scores |
          +------------------+    +------------------+
```

