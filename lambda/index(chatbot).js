
const https = require('https');

exports.handler = async (event) => {
    const corsHeaders = {
        // Replace with your website's origin before deployment.
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Access-Control-Allow-Headers':
            'content-type, x-amz-date, authorization, x-api-key, x-amz-security-token',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    const method = event.requestContext?.http?.method;

    // Handle CORS preflight requests.
    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    if (method !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Method not allowed'
            })
        };
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API key is not configured');

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Server configuration error'
            })
        };
    }

    try {
        let body;

        try {
            body = event.body ? JSON.parse(event.body) : {};
        } catch {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: 'Invalid JSON in request body'
                })
            };
        }

        const userMessage = body.message;

        if (
            typeof userMessage !== 'string' ||
            !userMessage.trim()
        ) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: 'A valid message is required'
                })
            };
        }

        // Limit message size to help control API usage.
        if (userMessage.length > 4000) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: 'Message is too long'
                })
            };
        }

        const aiResponse = await callOpenAI(userMessage);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: aiResponse
            })
        };
    } catch (error) {
        console.error('Chatbot request failed:', error.message);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Unable to process your request at this time'
            })
        };
    }
};

function callOpenAI(message) {
    return new Promise((resolve, reject) => {
        const requestBody = JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: process.env.CHATBOT_SYSTEM_PROMPT ||
                        `You are a helpful, professional AI assistant.
Answer the user's questions clearly and accurately.
If you do not know an answer, say so rather than
inventing information. Keep responses concise.`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 300
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);

                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        reject(
                            new Error(
                                parsed.error?.message ||
                                `OpenAI returned HTTP ${res.statusCode}`
                            )
                        );
                        return;
                    }

                    const answer =
                        parsed.choices?.[0]?.message?.content;

                    if (typeof answer !== 'string') {
                        reject(new Error('Invalid OpenAI response'));
                        return;
                    }

                    resolve(answer);
                } catch (error) {
                    reject(
                        new Error(
                            `Failed to process OpenAI response: ${error.message}`
                        )
                    );
                }
            });
        });

        req.setTimeout(20000, () => {
            req.destroy(new Error('OpenAI request timed out'));
        });

        req.on('error', reject);

        req.write(requestBody);
        req.end();
    });
}
