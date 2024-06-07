require("dotenv").config();
const cookieParser = require('cookie-parser');
const path = require("path");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const clientRoutes = require('./routes/clientRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const methodOverride = require('method-override');
const express = require("express");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(methodOverride('_method'));
const publicDirectory = path.join(__dirname, "public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});
app.get('/check-session', authMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
app.use("/api", authRoute);
app.use("/api/admin", adminRoute);
app.use('/api/user-portal', clientRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});