// YTBOT

// reqs
var connect = require('connect');
var sys = require('util');
var exec = require('child_process');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var path = require('path');
var https = require('https');

// app setup
var application_root = __dirname;
var app = express();
var apiKey = "&key=AIzaSyDgzZpFy_BDYb3OJ92xwB3sT3H_NGIQT1A";
var q_url = "www.googleapis.com"
var q_options = "/youtube/v3/search?part=snippet&maxResults=1&type=video&videoEmbeddable=true"
var url = 'http://www.youtube.com/watch?v='
def_video = '04F4xlWSFh0' // set default video ID (bodies, drowning pool)

var apiPort = '80'

// config

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    //res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);   // make sure this is is called before the router
app.use(bodyParser());
app.use(methodOverride());
app.use(errorhandler());
app.use(express.static(path.join(application_root, "public")));

// === FUNCTIONS === //

function vidsearch(query) {
    q = '&q=' + query
    var req = https.get({
        host: q_url
        path: q_options + apiKey + q,
        port: 443,
        method: "GET",
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
            return parsed.items[0].id.videoId;
        });
    });
};

// === API === //

app.post('/search', function (req, res) {
    console.log(req.body.text)
    var text = req.body.text
    text = encodeURIComponent(text.substr(7));
    console.log(text)
    var vid_id = vidsearch(text, function() {
        if (err) {
            console.log('http error');
            res.send({ "text" : "there was an error fetching the video"})
        } else {
            console.log(vid_id);
            body = { "text" : url + vid_id }
            res.send(body);
        }
    });
});



app.listen(process.env.PORT || apiPort)
console.log('bot is listening on port ' + apiPort)
