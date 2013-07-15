#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var URL_DEFAULT = "http://infinite-peak-3119.herokuapp.com";
var URL_FILE_DEFAULT = "url-file.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var buildfn = function(urlfile) {
    var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            //console.error("Wrote %s", urlfile);
            fs.writeFileSync(urlfile, result);
        }
    };
    return response2console;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        //.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
        //.option('-u, --url <url_addres>', 'URL addres to index.html', URL_DEFAULT)
        .option('-u, --url <url_addres>', 'URL addres to index.html')
        .parse(process.argv);
    if ( program.url != undefined ) {
    	var urlfile = urlfile || URL_FILE_DEFAULT;
   	 	//console.error("URL: ", program.url);
    	var response2console = buildfn(urlfile);
    	rest.get(program.url).on('complete', response2console);
    	var file = urlfile;
    } else {
    	var file = program.file;
    	//console.error("FILE: ", program.file);
    }
    var checkJson = checkHtmlFile(file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
