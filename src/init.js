import "dotenv/config" // 환경변수 호출

import "./db";
import "./models/Video";
import "./models/User";
import app from "./index";

const PORT=4000;

const handleListening =() => {
console.log(`✅ index.js: Server listening on port http://localhost:${PORT}`);
}
app.listen(PORT,handleListening);
