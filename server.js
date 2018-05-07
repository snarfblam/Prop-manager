var Express = require('express');

var PORT = process.env.PORT || 3001;
var app = Express();

app.use(Express.urlencoded());
app.use(Express.json());

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});