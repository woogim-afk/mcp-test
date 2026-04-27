const http = require('http');

// MCP HTTP 서버
const server = http.createServer(async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/mcp') {
    let data = '';
    
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        const request = JSON.parse(data);
        let response;

        // MCP 프로토콜에 따른 응답
        if (request.method === 'tools/call') {
          const { name, arguments: args } = request.params;
          
          if (name === 'add' && args.a !== undefined && args.b !== undefined) {
            const result = args.a + args.b;
            response = {
              jsonrpc: '2.0',
              result: {
                content: [{
                  type: 'text',
                  text: `${args.a} + ${args.b} = ${result}`
                }]
              },
              id: request.id
            };
          }
        } else {
          response = {
            jsonrpc: '2.0',
            result: { message: 'MCP Server 실행 중' },
            id: request.id
          };
        }

        res.writeHead(200);
        res.end(JSON.stringify(response));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'MCP HTTP Server',
      available_tools: ['add']
    }));
  }
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`MCP Server listening on http://localhost:${PORT}`);
});
