import App from './src/server';

App.listen(8080, function() {
	// console.log(JSON.parse("{\"$match\": { \"card\": {\"id\":1}} }"))
	console.log('Now browse to http://localhost:8080/playground');
});
