export const handler = async (event) => {
    const { path, httpMethod, headers, body, queryStringParameters } = event;

    // Determine target URL base
    const targetBase = 'https://uat-miniapp.kbzpay.com';

    // Construct the target path (stripping /.netlify/functions/proxy)
    const targetPath = path.replace('/.netlify/functions/proxy', '');
    const url = `${targetBase}${targetPath}${queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''}`;

    console.log(`[Proxy Request] ${httpMethod} ${path} -> ${url}`);

    // Prepare headers for forwarding
    const forwardHeaders = { ...headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;

    // Add a standard User-Agent for compatibility
    forwardHeaders['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    try {
        const response = await fetch(url, {
            method: httpMethod,
            headers: forwardHeaders,
            body: (httpMethod !== 'GET' && httpMethod !== 'HEAD') ? body : undefined,
            redirect: 'follow'
        });

        const responseData = await response.text();
        console.log(`[Proxy Response] Status: ${response.status}`);

        const responseHeaders = {};
        response.headers.forEach((value, key) => {
            // Avoid forwarding problematic headers
            if (!['content-encoding', 'transfer-encoding', 'content-length'].includes(key.toLowerCase())) {
                responseHeaders[key] = value;
            }
        });

        return {
            statusCode: response.status,
            headers: {
                ...responseHeaders,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*',
            },
            body: responseData,
        };
    } catch (error) {
        console.error('[Proxy Error]', error);
        return {
            statusCode: 502,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Proxy failed to reach KBZPay UAT',
                details: error.message,
                targetUrl: url,
                method: httpMethod
            }),
        };
    }
};
