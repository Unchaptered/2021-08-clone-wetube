// import Mongoose
import mongoose from "mongoose";

mongoose.connect( process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db= mongoose.connection;

const handleOpen=()=>console.log("✅ db.js : Connecting to DB");
const handleError=(error)=>console.log("❎ db.js : DB Error : ", error);

db.on("error", handleError);
db.once("open",handleOpen);