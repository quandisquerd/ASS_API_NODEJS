import connect from "../connect";
import jwt from "jsonwebtoken";
export const checkPermission = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ message: "Ban chua dang nhap" });
    }
    const decoded = jwt.verify(token, "du_an_fw2");
    console.log("okok");
    let sql = `SELECT * FROM users where user_id =${decoded.id}`;
    connect.query(sql, (error, result) => {
      if (error) {
        return res.json({ message: "k tim thay user" });
      }
      const data = result.rows[0];
      if (!data || data.role !== "admin") {
        return res.json({ message: "Ban khong co quyen cut" });
      }
      next();
    });
  } catch (error) {
    return res.status(401).json({
      message: "Loi API",
      error,
    });
  }
};
