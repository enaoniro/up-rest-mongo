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


const path = require('path');
//const express = require('express');
const app = express();

// Frontend build dosyalarını sun (React'in build klasörü)
app.use(express.static(path.join(__dirname, '../client/build')));

// Tüm GET isteklerini index.html'e yönlendir (React Router için)




app.use(express.json());
//app.use(cors());
// Express.js
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/users", userRoute);
app.use("/tasks", taskRoute);
app.use("/targets", targetRoute);
app.use("/records", recordRoute);
app.use("/cantons", cantonRoute);
app.use("/groups", groupRoute);
app.use("/students", studentRoute);

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
