import App from './src/server';

App.listen(8080, function () {
	console.log('Now browse to http://localhost:8080/playground');
});


// var menu = {
// 	menu: { url: '{"$nin" : ["none"] }', pid: "5a2215d3842273172c089eb2" }
// }


// var str = JSON.stringify(menu);
// console.log(str);

// str = str.replace(/(":)/g, ":");
// str = str.replace(/(,")/g, ",");
// str = str.replace(/({")/g, "{");
// console.log(str);

