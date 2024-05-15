const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const htmxScriptTag = `<script src="htmx.js" type="text/javascript"></script>`
const jqScriptTag = `<script src="jq.js"></script>`
const jqInteractionScriptTag = `<script>
$(document).on("click", "button", function(){
$.ajax({url: "/test-no-htmx.html", success: function(result){
$("#container").html(result);
}});
});
</script>`

const PORT = process.env.PORT || 3000;

let todos = [
  {
    id: 1,
    name: 'Taste htmx',
    done: true
  },
  {
    id: 2,
    name: 'Buy a unicorn',
    done: false
  }
];

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("assets"))

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from(htmxScriptTag + '<h2>Test String</h2><button hx-get="/test" hx-target="#container" hx-push-url="true">Show more</button><div id="container"/>'));
});

app.get('/index-no-htmx.html', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(Buffer.from( jqScriptTag + jqInteractionScriptTag +'<h2>Test String</h2><button>Show more</button><div id="container"/>'));
});



app.get('/test', (req, res) => {
  res.set('Content-Type', 'text/html');
  const content = '<p>Content to load on click</p>'
  if (req.header('HX-Request') == 'true') {
	  res.send(Buffer.from(content));
  } else {
	  res.send(Buffer.from(htmxScriptTag + '<h2>Test String</h2><button hx-get="/test" hx-target="#container" hx-push-url="true">Show more</button><div id="container">'+content+'</div>'))
  }
});

app.get('/test-no-htmx.html', (req, res) => {
  res.set('Content-Type', 'text/html');
  const content = '<p>Content to load on click</p>'
  res.send(Buffer.from(content));
});

app.listen(PORT);

console.log('Listening on port: ' + PORT);
