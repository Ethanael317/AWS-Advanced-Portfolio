
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1'
});

const docClient = DynamoDBDocumentClient.from(client);

const QUESTIONS_TABLE =
    process.env.QUESTIONS_TABLE || 'quiz-questions';

const SCORES_TABLE =
    process.env.SCORES_TABLE || 'quiz-scores';

const headers = {
    'Access-Control-Allow-Origin':
        process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers':
        'Content-Type,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json'
};

function response(statusCode, body) {
    return {
        statusCode,
        headers,
        body: JSON.stringify(body)
    };
}

export const handler = async (event) => {
    const method = event.requestContext?.http?.method;
    const path = event.requestContext?.http?.path;

    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        if (path === '/quiz/questions' && method === 'GET') {
            return await getQuestions();
        }

        if (path === '/quiz/submit' && method === 'POST') {
            let body;

            try {
                body = event.body ? JSON.parse(event.body) : {};
            } catch {
                return response(400, {
                    error: 'Invalid JSON request body'
                });
            }

            return await submitScore(body);
        }

        if (path === '/quiz/average' && method === 'GET') {
            return await getAverageScore();
        }

        return response(404, {
            error: 'Route not found'
        });
    } catch (error) {
        console.error('Quiz API error:', error.message);

        return response(500, {
            error: 'An internal server error occurred'
        });
    }
};

async function getQuestions() {
    try {
        const result = await docClient.send(
            new ScanCommand({
                TableName: QUESTIONS_TABLE
            })
        );

        const questions = result.Items || [];

        // Randomize the questions and return at most 20.
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] =
                [questions[j], questions[i]];
        }

        return response(200, questions.slice(0, 20));
    } catch (error) {
        console.error('Failed to retrieve questions:', error.message);

        return response(500, {
            error: 'Failed to retrieve questions'
        });
    }
}

async function submitScore(data) {
    try {
        const score = data.score;
        const totalQuestions = data.totalQuestions ?? 20;

        if (
            typeof score !== 'number' ||
            !Number.isFinite(score) ||
            score < 0 ||
            score > 100
        ) {
            return response(400, {
                error: 'Score must be a number between 0 and 100'
            });
        }

        if (
            !Number.isInteger(totalQuestions) ||
            totalQuestions < 1 ||
            totalQuestions > 1000
        ) {
            return response(400, {
                error: 'Invalid totalQuestions value'
            });
        }

        const timestamp = Date.now();
        const scoreID =
            `score_${timestamp}_${crypto.randomUUID()}`;

        await docClient.send(
            new PutCommand({
                TableName: SCORES_TABLE,
                Item: {
                    scoreID,
                    timestamp,
                    score,
                    totalQuestions
                }
            })
        );

        return response(200, {
            success: true,
            message: 'Score submitted successfully',
            scoreID
        });
    } catch (error) {
        console.error('Failed to submit score:', error.message);

        return response(500, {
            success: false,
            error: 'Failed to submit score'
        });
    }
}

async function getAverageScore() {
    try {
        const result = await docClient.send(
            new ScanCommand({
                TableName: SCORES_TABLE,
                ProjectionExpression: '#score',
                ExpressionAttributeNames: {
                    '#score': 'score'
                }
            })
        );

        const scores = result.Items || [];

        if (scores.length === 0) {
            return response(200, {
                average: 0,
                totalAttempts: 0
            });
        }

        const totalScore = scores.reduce(
            (sum, item) => sum + (item.score || 0),
            0
        );

        return response(200, {
            average: Math.round(
                (totalScore / scores.length) * 100
            ) / 100,
            totalAttempts: scores.length
        });
    } catch (error) {
        console.error('Failed to calculate average:', error.message);

        return response(500, {
            error: 'Failed to calculate average score'
        });
    }
}
