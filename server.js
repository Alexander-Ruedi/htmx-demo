const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const htmxScriptTag = `<script src="htmx.js"></script>`

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

const getItemsLeft = () => todos.filter(t => !t.done).length;

const app = express();
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("assets"))

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from(htmxScriptTag + '<h2>Test String</h2><button hx-get="/test" hx-target="#container" hx-push-url="true">Show more</button><div id="container"/>'));
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

app.listen(PORT);

console.log('Listening on port: ' + PORT);
