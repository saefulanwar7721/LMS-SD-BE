//src/app.ts
import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import db from "./models"; // ini penting!
import superadminRoutes from "./routes/authSuperadmin";
import authSchoolRoutes from "./routes/authSchool";
import authTeacherRoutes from "./routes/authTeacher";
import authStudentRoutes from "./routes/authStudent";
import authHomeroomTeacherRoutes from "./routes/authHomeroomTeacher";
import authParentRoutes from "./routes/authParent";
import authRefreshRoutes from "./routes/authRefresh";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/superadmin", superadminRoutes);
app.use("/api/school", authSchoolRoutes);
app.use("/api/teacher", authTeacherRoutes);
app.use("/api/student", authStudentRoutes);
app.use("/api/wali_kelas", authHomeroomTeacherRoutes);
app.use("/api/parent", authParentRoutes);
app.use("/api/auth", authRefreshRoutes);

app.get("/", (req, res) => {
  res.send("LMS SD API is running 🏫");
});

sequelize
  .authenticate()
  .then(async () => {
    console.log("🟢 Database connected!");
    await sequelize.sync({ alter: true }); // Ini akan sync semua model dari db/
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("🔴 Database connection error:", err);
  });
