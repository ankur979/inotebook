require("./db");
const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())
const port =process.env.PORT || 5000;

app.use(express.json())

app.use('/api/notes',require('./routes/notes'))

app.use('/api/auths', require('./routes/auths'))

app.listen(port);