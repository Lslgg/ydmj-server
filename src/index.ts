import App from './server';
var PORT=8080;
var server=App.listen(PORT, function () {
	console.log('Now browse to http://localhost:8080/playground');
	console.log('Now browse to http://localhost:8080/graphiql');
	console.log('Now browse to http://localhost:8080/voyager');	
	App.settings.port=PORT;
});

