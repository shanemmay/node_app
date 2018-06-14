/*
To run this do `sudo npm start` or 
`node index.js`
url http://localhost:8080/?var=this-is-value-of-query-variable
*/
//dependancies
var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var test = require('./custom_modules/test_module');

let content;
let file_name

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    res.write("<h1>Web  Site Development Day 1!</h1>");

    //URL
    res.write(`<p>url: ${req.url} </p>`);
    var query = url.parse( req.url, true).query;
    res.write(`<p>query: ${query.var}</p>`);

    //FS 
    /*
    *must put return to stop from running twice
    */
    //creating file
    content = "<p>This is content written to a file</p>";
    file_name = "html/fs_test_file.html";
    //using writeFile because it replaces existing contents (don't want a huge file)
    fs.writeFile(file_name, content,
    	(err) =>
    	{
    		if (err) throw err;
    		console.log("File created");
    		return;
    	});
    //updating file
    content = '<img src="https://avatars2.githubusercontent.com/u/12717585?s=400&v=4">';
    fs.appendFile(file_name, content , 
    	(err) =>
    	{
    		if (err) throw err;
    		console.log("File updated");
    		return;
    	});
    //reading file
    fs.readFile(file_name, (err, data) =>
    	{
    		res.write(data);
    		console.log('File read');
    		return;
    	});

    //UPLOAD FILE type `npm install formidable`
    //creating the form
    if (req.url != '/fileupload')
    {
    	fs.readFile("html/basic_form.html", (err, data) =>
    	{
    		res.write(data);
    		return;

    		res.end('end');
    	});
    }
    else
    {
    	//saving the file if the form was submitted
    	var form = new formidable.IncomingForm();
    	form.parse(req, (err,fields,files) =>
    	{
    		var oldpath = files.filetoupload.path;
    		var newpath = "./uploaded_files/" + files.filetoupload.name;
    		fs.rename(oldpath, newpath, (err) =>
    		{
    			if (err) console.log(err);
    			res.write("<h1>File uploaded!</h1>");
    			return;

    			res.end('end');
    		});//end of fs rename
    		
    	});//end of form parse
    }


    test.test_func();

    
}).listen(8080);

