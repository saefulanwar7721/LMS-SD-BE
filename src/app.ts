//src/app.ts
import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import db from "./models"; // ini penting!
import superadminRoutes from "./routes/auth/authSuperadmin";
import authSchoolRoutes from "./routes/auth/authSchool";
import authTeacherRoutes from "./routes/auth/authTeacher";
import authStudentRoutes from "./routes/auth/authStudent";
import authHomeroomTeacherRoutes from "./routes/auth/authHomeroomTeacher";
import authParentRoutes from "./routes/auth/authParent";
import authRefreshRoutes from "./routes/auth/authRefresh";
import classCreateRoutes from "./routes/create/classRoutes";

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
app.use("/api/create", classCreateRoutes);

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
