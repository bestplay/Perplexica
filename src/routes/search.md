fetch('http://127.0.0.1:3001/api/search', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: "1133",
        files: [],
        focusMode: "webSearch",
        optimizationMode: "speed",
        history: []
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));