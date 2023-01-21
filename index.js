let express = require("express");
let app = express();
var cors = require('cors')

 


let mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://127.0.0.1:27017/Note_Book")
  .then(() => {
    console.log("CONNECTION ESTD !!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR !!!");
    console.log(err);
  });

app.use(express.json()) // for using req.body
app.use(cors()) // fetch from backend and connect between frontend & backend


// ** ROUTES ** //

let noteRoutes = require("./Routes/Noteroutes");
app.use("/api/notes", noteRoutes);

let userRoutes = require("./Routes/Userroutes");
app.use("/api/auth", userRoutes);



app.listen(2000, (req, res) => {
    console.log("LISTENING ON PORT");
  });