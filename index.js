const express = require('express');

const app = express();

const port = process.env.PORT || 6969;

app.use('/', express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log("App is runing in port" + port);
})



