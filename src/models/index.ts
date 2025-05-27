//src/models/index.ts
import School from "./School";
import User from "./User";
import Teacher from "./Teacher";
import HomeroomTeacher from "./HomeroomTeacher";
import Student from "./Student";
import Parent from "./Parent";
import Admin from "./Admin";
import SuperAdmin from "./SuperAdmin";
import Class from "./Class";

const db = {
  School,
  User,
  Teacher,
  HomeroomTeacher,
  Student,
  Parent,
  Admin,
  SuperAdmin,
  Class,
};

export default db;
