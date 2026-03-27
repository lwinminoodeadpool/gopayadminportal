export const handler = async (event) => {
    const { path, httpMethod, headers, body, queryStringParameters } = event;

    // Determine target URL base
    let targetBase = 'https://uat-miniapp.kbzpay.com';

    // Construct the target path (stripping /.netlify/functions/proxy)
    const targetPath = path.replace('/.netlify/functions/proxy', '');
    const url = `${targetBase}${targetPath}${queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''}`;

    console.log(`[Proxy] ${httpMethod} ${path} -> ${url}`);

    // Prepare headers for forwarding
    const forwardHeaders = { ...headers };
    delete forwardHeaders.host;
    delete forwardHeaders.connection;

    try {
        const response = await fetch(url, {
            method: httpMethod,
            headers: forwardHeaders,
            body: (httpMethod !== 'GET' && httpMethod !== 'HEAD') ? body : undefined,
        });

        const responseData = await response.text();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
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
            body: JSON.stringify({ error: 'Proxy failed to reach target', message: error.message }),
        };
    }
};
