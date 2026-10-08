# Frontend

The frontend is the user-facing portion of the AWS Quiz and portfolio application. It is built using standard **HTML, CSS, and JavaScript**, with the JavaScript handling interactive features and communication with AWS APIs.

The frontend is intentionally kept relatively simple. HTML provides the structure, CSS controls the visual design, and JavaScript adds functionality such as navigation, animations, the chatbot, and the AWS quiz.

## Project Structure

The frontend is organized into separate files and directories for HTML, CSS, JavaScript, and static assets.

```text
Website/
├── index.html
├── quiz.html
│
├── js/
│   ├── chatbot.js
│   ├── navigation.js
│   ├── cursor.js
│   └── constellation.js
│
├── css/
│   ├── style.css
│   └── chatbot.css
│
└── assets/
    └── resume.pdf
```

Keeping these files separated makes the project easier to maintain and allows individual features to be modified without putting all of the frontend code into one file.

---

## HTML

The website uses two primary HTML pages.

### `index.html`

`index.html` is the main portfolio page. It contains the primary sections of the website, including:

* Home
* About
* Skills
* Projects
* Resume
* Contact
* AWS Challenge

The homepage uses a constellation-inspired design where navigation nodes can be selected to smoothly scroll to different sections of the page.

The page also contains the HTML elements required by the chatbot, including the chatbot window, message area, input field, and send button.

The AWS Challenge section provides an introduction to the quiz and displays community statistics such as:

* Average score
* Total attempts

### `quiz.html`

`quiz.html` contains the actual AWS knowledge quiz.

The page initially displays the quiz questions and community statistics. Questions are loaded dynamically from the AWS API rather than being hard-coded into the HTML.

When the user submits the quiz, JavaScript calculates their score and sends the result to the backend API.

---

# CSS

The website uses two CSS files.

## `css/style.css`

`style.css` controls the main appearance and layout of the portfolio.

It handles:

* Page layout
* Typography
* Backgrounds
* Portfolio navigation nodes
* Section layouts
* Responsive design
* Hover effects
* Glowing cyan visual effects
* Resume section
* Contact section
* AWS Challenge section

The overall design uses a dark, futuristic theme with cyan highlights to create a technology/cloud-infrastructure aesthetic.

The CSS also contains responsive media queries so sections such as the About and Skills areas can adapt to smaller screens.

## `css/chatbot.css`

`chatbot.css` controls the appearance of the chatbot interface.

It handles:

* Chatbot button
* Chatbot window
* Header
* Message area
* User messages
* AI messages
* Text input
* Send button

Keeping the chatbot styling separate prevents the chatbot-specific CSS from making the main stylesheet unnecessarily large.

---

# JavaScript

JavaScript provides most of the website's interactive functionality.

## `js/navigation.js`

`navigation.js` handles the clickable navigation nodes on the homepage.

Each node contains a target corresponding to a section of the website. When a node is clicked, JavaScript uses `scrollIntoView()` to smoothly move the user to that section.

For example:

```text
Navigation Node
      │
      ▼
data-target
      │
      ▼
HTML Section
      │
      ▼
Smooth Scroll
```

This allows the homepage to function as an interactive navigation map rather than using a traditional navigation bar.

---

## `js/cursor.js`

`cursor.js` creates the glowing cursor effect used throughout the website.

The script tracks the user's mouse position and moves the `#cursor-glow` element to follow the cursor.

This works together with the radial-gradient defined in `style.css` to create the glowing effect.

---

## `js/constellation.js`

`constellation.js` creates the animated constellation background.

The script uses an HTML `<canvas>` element to:

1. Create a collection of randomly positioned stars.
2. Draw the stars onto the canvas.
3. Find the center positions of the portfolio navigation nodes.
4. Draw lines from the central portfolio node to the navigation nodes.
5. Continuously redraw the canvas using `requestAnimationFrame()`.

This creates the animated starfield and connected-node effect used on the homepage.

---

# Chatbot

## `js/chatbot.js`

`chatbot.js` controls the portfolio's AI chatbot.

The chatbot runs entirely from the frontend interface, but the actual AI request is handled by an AWS API endpoint.

The general flow is:

```text
User
  │
  ▼
Chatbot Interface
  │
  ▼
chatbot.js
  │
  │ POST request
  ▼
API Gateway
  │
  ▼
AWS Lambda
  │
  ▼
OpenAI API
  │
  ▼
AWS Lambda
  │
  ▼
API Gateway
  │
  ▼
chatbot.js
  │
  ▼
Chatbot Interface
```

The frontend sends the user's message as JSON:

```json
{
  "message": "User's question"
}
```

The API response is then displayed as a message in the chatbot window.

The frontend does **not** directly communicate with OpenAI. Instead, the request is routed through the AWS backend. This keeps the AI integration separate from the frontend and prevents an OpenAI API key from being placed directly into the website's JavaScript.

---

# AWS Quiz Integration

The AWS quiz frontend communicates with the backend through an API endpoint.

The quiz uses three primary API operations:

```text
GET  /quiz/questions
GET  /quiz/average
POST /quiz/submit
```

### Loading Questions

When `quiz.html` loads, JavaScript requests the quiz questions from the API.

```text
quiz.html
    │
    ▼
quiz-api
    │
    ▼
DynamoDB
quiz-questions
    │
    ▼
Questions returned to browser
```

The questions are then dynamically inserted into the page.

Each question contains its available options, which are converted into radio buttons so the user can select one answer.

### Loading Community Statistics

The frontend also requests the current community statistics.

The API returns information such as:

* Average score
* Total attempts

These values are displayed in the quiz interface.

### Submitting a Score

When the user submits the quiz, the frontend compares the selected answers against the `correctAnswer` value returned with each question.

The frontend calculates the percentage score and sends it to the API.

For example:

```json
{
  "score": 80,
  "totalQuestions": 20
}
```

The backend then stores the submitted score in the `quiz-scores` DynamoDB table.

```text
User completes quiz
        │
        ▼
Frontend calculates score
        │
        ▼
POST /quiz/submit
        │
        ▼
   quiz-api Lambda
        │
        ▼
   DynamoDB
  quiz-scores
```

After submission, the quiz displays the user's result and refreshes the community statistics.

---

# Static Assets

The `assets/` directory contains files that are used by the frontend but are not code.

Currently, the project includes the portfolio resume:

```text
assets/
└── resume.pdf
```

The resume is displayed directly on the portfolio using an HTML `<iframe>` and can also be downloaded by the user.

Additional images, documents, or other static files can be added to the `assets/` directory as the portfolio grows.

---

# Deployment

The frontend consists entirely of static files, making it well suited for hosting with **Amazon S3**.

The HTML, CSS, JavaScript, and asset files can be uploaded to an S3 bucket and served as a static website.

The overall hosting architecture is:

```text
                 +----------------+
                 |    Route 53    |
                 +-------+--------+
                         |
                         v
                 +----------------+
                 |   CloudFront   |
                 +-------+--------+
                         |
                         v
                 +----------------+
                 |       S3       |
                 | Static Website |
                 +----------------+
```

The frontend itself does not require a traditional web server. AWS handles delivery of the static files while the separate API infrastructure handles dynamic functionality such as the chatbot and quiz.

---

# Summary

The frontend demonstrates how a relatively simple HTML/CSS/JavaScript application can be connected to AWS services to create a more complete cloud application.

The static frontend is responsible for:

* User interface
* Navigation
* Animations
* Chatbot interface
* Quiz interface
* Score calculation
* API requests

AWS provides the backend services responsible for:

* API endpoints
* Lambda functions
* DynamoDB storage
* AI integration
* Static website hosting and content delivery
