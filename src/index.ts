import App from './server';
var PORT=8070;
var server=App.listen(PORT, function () {
	console.log('Now browse to http://localhost:8070/playground');
	console.log('Now browse to http://localhost:8070/graphiql');
	console.log('Now browse to http://localhost:8070/voyager');	
	App.settings.port=PORT;
});

