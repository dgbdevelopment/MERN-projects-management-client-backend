require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
require('./database')


//settings
app.set('PORT', process.env.PORT || 3300)


//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


//routes
app.use('/api', require('./routes/index.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use("/api/project", require("./routes/project.routes"));
app.use("/api/task", require("./routes/task.routes"));


//create server
app.listen(app.get('PORT'), () => console.log('App listening on port', app.get('PORT')));