import connect from "../connect";
import jwt from "jsonwebtoken";

export const AddBill = (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, "du_an_fw2");
            const userId = decoded.id;
            let sqlUser = `SELECT * FROM checkout WHERE user_id=${userId}`;
            connect.query(sqlUser, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Lỗi khi tìm user", err });
                }

                const { total_amount, bill_date, status } = req.body;
                const user_id = userId; // Lấy user_id từ decoded
                const checkout_id = result.rows[0].checkout_id; // Lấy checkout_id từ kết quả truy vấn

                if (!checkout_id) {
                    return res.status(400).json({
                        message: "Checkout_id không tồn tại",
                    });
                }

                let sql = `INSERT INTO bill (user_id, checkout_id, total_amount, bill_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING bill_id`;
                const values = [user_id, checkout_id, total_amount, bill_date, status];
                connect.query(sql, values, (err, result) => {
                    if (err) {
                        return res.json({
                            message: "Lỗi khi tạo bill",
                            error: err.message
                        });
                    }
                    const bill_id = result.rows[0].bill_id;
                    return res.json({
                        message: "Tạo bill thành công",
                        bill_id: bill_id,
                        values: values
                    });
                });
            });
        }
    } catch (error) {
        return res.json({
            message: "Lỗi API",
            error
        });
    }
};
