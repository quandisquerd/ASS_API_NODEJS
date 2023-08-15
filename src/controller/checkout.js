import connect from "../connect";
import jwt from "jsonwebtoken"
export const Checkout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, "du_an_fw2")
            const userId = decoded.id
            const { payment, total } = req.body
            let sqlUser = `SELECT * FROM users WHERE user_id=${userId}`
            connect.query(sqlUser, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Loi khi tim user", err })
                }
                const user = result.rows[0]
                let sqlCart = `SELECT * FROM carts WHERE cart_id=${user.cartid}`
                connect.query(sqlCart, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Loi khi tim cart", err })
                    }
                    const cart = result.rows[0]
                    let sqlCheckout = `INSERT INTO checkout (user_id,cart_id,payment_method,order_total,order_time) VALUES (${user.user_id},${cart.cart_id},'${payment}', ${total}, NOW()) RETURNING *`
                    connect.query(sqlCheckout, (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: "Loi khi tao checkout", err })
                        }
                        const checkout = result.rows[0]
                        return res.status(200).json({ message: "tao checkout thanh cong", checkout })
                    })
                })
            })
        }
    } catch (err) {
        return res.status(500).json({ message: "Loi API" })
    }
}