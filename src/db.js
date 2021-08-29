
// import Mongoose
import mongoose from "mongoose";

// connect MongoDB : rule of mongoose
mongoose.connect( process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db= mongoose.connection;

const handleOpen=()=>console.log("✅ db.js : Connecting to DB");
const handleError=(error)=>console.log("❎ db.js : DB Error : ", error);

// method on (If you want to, you can run it many times)
db.on("error", handleError);
// method once (If you want to, you can run it 1 times only)
db.once("open",handleOpen);
