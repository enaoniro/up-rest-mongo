require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const userRoute = require("./routes/userRoute.js");
const studentRoute = require("./routes/studentRoute.js");
const cantonRoute = require( "./routes/cantonRoute.js");
const groupRoute = require( "./routes/groupRoute.js");
const taskRoute = require( "./routes/taskRoute.js");
const targetRoute = require("./routes/targetRoute.js");
const recordRoute = require("./routes/recordRoute.js");
const connectDB = require('./config/dbCon');
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/api/v1/users", userRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/targets", targetRoute);
app.use("/api/v1/records", recordRoute);
app.use("/api/v1/cantons", cantonRoute);
app.use("/api/v1/groups", groupRoute);
app.use("/api/v1/students", studentRoute);

// Serve frontend
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));

//   app.get('*', (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
//     )
//   );
// } else {
//   app.get('/', (req, res) => res.send('Please set to production'));
// }

// app.use(errorHandler);


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})