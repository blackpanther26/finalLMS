require("dotenv").config();
const cookieParser = require('cookie-parser');
const path = require("path");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const clientRoutes = require('./routes/clientRoutes');
const express = require("express");
const app = express();
app.use(cookieParser());
app.use(express.json());
const publicDirectory = path.join(__dirname, "public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.use("/api", authRoute);
app.use("/api/admin", adminRoute);
app.use('/api/user-portal', clientRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});