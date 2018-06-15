/*
To run this do `sudo npm start` or 
`node index.js`
url http://localhost:8080/?var=this-is-value-of-query-variable
*/
/*
DEPENDENCIES
*/
var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var events = require('events');
var test = require('./custom_modules/test_module');
var nodemailer = require('nodemailer');

let content;
let file_name;


http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    /*
	FUNCTIONS
	*/

	function save_file(name_of_file)
	{
		//saving the file if the form was submitted
		var form = new formidable.IncomingForm();
		form.parse(req, (err,fields,files) =>
		{
			var oldpath = files.filetoupload.path;
			//files.filetoupload.name
			var newpath = name_of_file;
			fs.rename(oldpath, newpath, (err) =>
			{
				if (err) console.log(err);
				res.write("<h1>File uploaded!</h1>");
				return;
			});//end of fs rename
			
		});//end of form parse
	}

	function read_file( file_name, callback = () => {} )
	{
		//reading the file the was uploaded
    	fs.readFile(file_name, (err, data) =>
    	{

    		if (err) console.log(err);
    		res.write("<p>~~~~~~~~</p>");
    		res.write(data);
    		console.log(data);
    		res.write("<br><p>~~~~~~~~</p>");  
    		callback() 	
    		return data;
    	});
	}

	function read_dir(callback = (str) => {})
	{
		fs.readdir("./uploaded_files/",
    			(err,files) =>
		{
			let files_arr = files;
			files_arr.sort();
			callback("./uploaded_files/" + files_arr[ files_arr.length - 1]);
			return files_arr;
		});

	}

	/*
	MAIN CODE
	*/

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
    	save_file("./uploaded_files/" + new Date());

    	read_dir(read_file);
    }//end of else

    //sending emails
    var transporter = nodemailer.createTransport(
    	{
    		service	:"gmail",
    		auth	:
    		{
    			user:"shanemaygunlogson@gmail.com",
    			pass:"Shane1993!"
    		}
    	});
    var mailOptions = 
    {
    	from 	: "shanemaygunlogson@gmail.com",
    	to 		: "krbsweet16@gmail.com",
    	subject	: "i love you",
    	html	: "<h1 style='color:pink; text-align:center;'>I Love You!</h1>"
    };
    transporter.sendMail(
    	mailOptions, 
    	(err, info) =>
    	{
    		if (err){ console.log(err);}
    		else{ console.log("Email sent!");}
    	})

    test.test_func();



    
}).listen(8080);



