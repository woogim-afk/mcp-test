const http = require('http');

// MCP 클라이언트: add 함수 호출
function callAdd(a, b) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'add',
        arguments: { a, b }
      },
      id: 1
    });

    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(requestData);
    req.end();
  });
}

// 1+5 계산 실행
(async () => {
  try {
    console.log('🔢 1+5 계산 중...\n');
    const result = await callAdd(1, 5);
    console.log('📊 응답:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.result && result.result.content && result.result.content[0]) {
      console.log('\n✅ 결과:', result.result.content[0].text);
    }
  } catch (err) {
    console.error('❌ 오류:', err.message);
  }
})();
