////////////// Modules ////////////////////////
const Express = require('express');
const path = require('path');

////////////// Configuration //////////////////
const PORT = process.env.PORT || 3001;
const app = Express();
app.use(Express.urlencoded());
app.use(Express.json());

////////////// Routing ////////////////////////
app.use(Express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
    var indexPath = path.join(__dirname, 'client', 'build', 'index.html');
    res.sendfile(indexPath);
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});
