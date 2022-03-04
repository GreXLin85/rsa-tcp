const net = require('net'); 
const client = net.createConnection({ port: 9000 }, () => { 
  console.log('CLIENT: I connected to the server.'); 
}); 

client.on('data', (data) => { 
    console.log(data.toString()); 
    client.end(); 
});

client.on('end', () => {
    console.log('CLIENT: I disconnected from the server.');
});