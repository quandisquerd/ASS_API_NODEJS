import jwt from "jsonwebtoken";
import connect from "../connect";

export const AddToCart = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        //xu ly khi dang nhap
        if (token) {
            try {

                const decoded = jwt.verify(token, "du_an_fw2");
                const userId = decoded.id;
                let sqlUser = `SELECT * FROM users WHERE user_id = $1 `;
                let values = [userId];
                let user
                connect.query(sqlUser, values, async (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Truy van user that bai", err });
                    }
                    user = result.rows[0];
                    let sqlCart = `SELECT * FROM carts WHERE cart_id = $1`
                    let values = [user.cartid];
                    console.log(values);
                    connect.query(sqlCart, values, async (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: "Tim cart theo cart user that bai", err })
                        }
                        const cart = result.rows[0]
                        const { product_id } = req.body
                        cart.products.push(product_id)
                        let sqlUpdateCart = `UPDATE carts SET products = array_append(products, ${product_id}), user_id=${userId} WHERE cart_id = ${cart.cart_id} RETURNING *`;
                        connect.query(sqlUpdateCart, (err, result) => {
                            if (err) {
                                return res.status(500).json({ message: "Loi khi them", err })
                            }
                            const data = result.rows[0]
                            return res.json({ message: "Thanh cong", data })
                        })
                        // await cart.save()
                        // return res.status(200).json({ message: "Them san pham vao cart thanh cong", cart })
                    })


                })
            } catch (err) {
                return res.status(500).json({ message: "Loi khi Add To Cart da dang nhap", err })
            }
        } else {
            const { product_id } = req.body
            let cart
            let products = []
            let sqlAddCart = `INSERT INTO carts (products) VALUES ($1) RETURNING *`
            let values = [products];
            connect.query(sqlAddCart, values, async (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Loi tao cart", err })
                }
                cart = result.rows[0]
                if (cart.cart_id) {
                    console.log(product_id);
                    let sqlUpdateCart = `UPDATE carts SET products = array_append(products, ${product_id}) WHERE cart_id = ${cart.cart_id} RETURNING *`;
                    connect.query(sqlUpdateCart, (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: "Loi khi them", err })
                        }
                        const data = result.rows[0]
                        return res.json({ message: "Thanh cong", data })
                    })
                } else {
                    return res.status(404).json({ message: "Tao cart bi loi" })
                }
            })
        }
    } catch (err) {
        return res.status(500).json({ message: "Loi API" })
    }
}