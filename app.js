const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const Grid = require("gridfs-stream");
const routes = require("./routes");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config({ encoding: false });

const PORT = process.env.PORT || 5000;
const uri = process.env.URI;
let gfs, gridfsBucket;

(async () => {
  try {
    const conn = await connect(uri);
    gridfsBucket = new conn.mongo.GridFSBucket(conn.connection.db, {
      bucketName: "images",
    });

    gfs = Grid(conn.connection.db , mongoose.mongo);
    gfs.collection("images");

    const app = express();
    app.use(cors());
    app.set("jwt", process.env.JWTSecret);
    app.set("gfs", gfs)
    app.set("gfsBucket", gridfsBucket)
    app.use(express.json());
    app.get("/", (req, res) => {
      res.send("<h1>Traffic System :)</h1>")
    })
    app.use("/api/warden", routes.WardenRoutes);
    app.use("/api/auth/:user", routes.AuthRoutes);
    app.use("/api/voilation", routes.VoilationRoutes);
    app.use("/api/citizen", routes.CitizenRoutes);
    app.use("/api/challan", routes.ChallanRoutes);
    app.use("/api/image/:user", routes.ImageRoutes);
    app.listen(PORT, () => {
      console.log(`App listening on http://localhost:${PORT} 🚀 !`);
    });
  } catch (error) {
    console.error(error);
  }
})();
