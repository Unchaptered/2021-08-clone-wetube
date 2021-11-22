import "dotenv/config";

import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./index";

const PORT=4000;

const handleListening =() => {
console.log(`✅ index.js: Server listening on port http://localhost:${PORT}`);
}
app.listen(PORT,handleListening);
