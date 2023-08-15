import connect from "../connect";
import jwt from "jsonwebtoken";

export const AddComment = async (req, res) => {
    try {
        // Verify the token to get the ID of the logged-in user
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để comment" });
        }

        const decoded = jwt.verify(token, "du_an_fw2");
        const userId = decoded.id;

        const { productId, content } = req.body;
        const sql = `INSERT INTO comments (product_id, user_id, content, comment_time)
                     VALUES ('${productId}', '${userId}', '${content}', NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh') RETURNING *`;

        connect.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Thêm comment thất bại" });
            }
            const data = result.rows[0];
            return res.status(200).json({ message: "Comment thành công", data });
        });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi API" });
    }
};
