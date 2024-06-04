require("dotenv").config();
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const clientRoutes = require('./routes/clientRoutes');
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api", authRoute);
app.use("/api/admin", adminRoute);
app.use('/api/client', clientRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
