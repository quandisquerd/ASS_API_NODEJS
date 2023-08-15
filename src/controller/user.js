import connect from "../connect";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
//signup
export const signUp = async (req, res) => {
    try {
        const { name, province, district, ward, address, email, password, image, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 5);
        const products = []
        let sqlcart = `INSERT INTO carts (products) VALUES ($1) RETURNING *`
        let values = [products];
        let cart

        connect.query(sqlcart, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Loi tao cart", err })
            }
            cart = result.rows[0]
            console.log(cart);
            let sql = `INSERT INTO users(name,province,district,ward,address,email,password,image,role,cartid)
        VALUES('${name}','${province}','${district}','${ward}','${address}','${email}','${hashedPassword}','${image}','member',${cart.cart_id}) RETURNING *`
            connect.query(sql, (err, result) => {
                if (err) return res.json({
                    message: "Đăng ký thất bại ", err
                })

                const data = result.rows[0]
                const accesstoken = jwt.sign({ id: data.user_id }, "du_an_fw2", { expiresIn: "1d" });
                return res.json({
                    message: "Đăng ký thành công",
                    accesstoken,
                    data
                })
            })
        })

    } catch (error) {
        return res.json({
            message: "Lỗi api"
        })
    }
}

//signin



export const signIn = (req, res) => {
    try {
        const { email, password } = req.body;
        let sql = `SELECT * FROM users WHERE email='${email}'`;

        connect.query(sql, async (err, result) => {
            if (err) {
                console.error(err);
                return res.json({
                    message: "Đăng nhập thất bại",
                });
            }
            if (result.rows.length > 0) {
                const user = result.rows[0];
                console.log(user);
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    const accesstoken = jwt.sign({ id: user.user_id }, "du_an_fw2", {
                        expiresIn: "1d",
                    });
                    return res.json({
                        message: "Đăng nhập thành công",
                        accesstoken,
                        user,
                    });
                }
            }
            return res.json({
                message: "Email hoặc mật khẩu không chính xác",
            });
        });
    } catch (error) {
        return res.json({
            message: "Lỗi api",
        });
    }
};

// get all user
export const GetALlUser = async (req, res) => {
    try {
        let sql = `SELECT * FROM users`
        connect.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lay danh sach that bai' })
            }
            const data = results.rows
            return res.status(200).json({ message: 'Lay danh sach user thanh cong', data })
        })
    } catch (err) {
        return res.status(500).json({ message: 'Loi api' })
    }
}




