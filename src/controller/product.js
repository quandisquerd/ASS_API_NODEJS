import connect from "../connect"

import jwt from "jsonwebtoken"

//searchProduct
export const searchProduct = async (req, res) => {
    try {
        const name = req.query.name;
        const regex = `%${name}%`;

        let sql = `SELECT * FROM products WHERE name ILIKE $1`;
        const result = await connect.query(sql, [regex]);

        return res.json({
            message: "Tìm thấy sản phẩm",
            data: result.rows,
        });
    } catch (error) {
        return res.json({
            message: "Không tìm thấy sản phẩm",
            error,
        });
    }
};

//searchProduct by Category

export const searchProductByCategory = async (req, res) => {
    try {
        const name = req.query.name;
        const regex = `%${name}%`
        let sql = `SELECT p.* FROM products p JOIN categories c ON p.cat_id = c.cat_id WHERE c.name ILIKE $1`;
        const result = await connect.query(sql, [regex]);
        return res.json({
            message: "Tìm thấy sản phẩm trong danh mục ",
            data: result.rows,
        })
    } catch (error) {
        return res.json({
            message: "Không tìm thấy sản phẩm của danh mục bạn đã chọn",
            error,
        });
    }
}


//add
export const AddProduct = async (req, res) => {
    try {
        const { name, price, quantity, description, color, image, cat_id } = req.body
        let sql = `INSERT INTO products(name, price, quantity, description, color, image, cat_id)
        VALUES('${name}', '${price}', '${quantity}', '${description}', '${color}', '${image}', '${cat_id}') RETURNING *`
        connect.query(sql, (err, result) => {
            if (err) return res.status(500).json({ message: 'Them that bai' })
            const data = result.rows[0]
            return res.status(200).json({ message: 'Them thanh cong product', data })
        })
    } catch (err) {
        return res.status(500).json({ message: 'Loi api' })
    }
}

//remove
export const RemoveProduct = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, "du_an_fw2");
        const userId = decoded.id;
        const id = req.params.id
        let sqluser = `SELECT * FROM users WHERE user_id=${userId}`;
        connect.query(sqluser, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Lay user that bai", err
                })
            }
            const user = result.rows[0]
            let sqldelete = `DELETE FROM products WHERE product_id=${id} RETURNING *`
            connect.query(sqldelete, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Xóa sản phẩm that bai", err
                    })
                }
                const product = result.rows[0]
                console.log(product);
                let sql = `INSERT INTO recyclebin(product, user_info, time) VALUES ('{"product_id":${product.product_id}, "name":"${product.name}", "price":${product.price}, "description":"${product.description}", "color":"${product.color}", "quantity":${product.quantity}, "cat_id":${product.cat_id}, "image":"${product.image}"}', '{"user_id":${user.user_id}, "name":"${user.name}"}', NOW()) RETURNING *`
                connect.query(sql, (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: "khong them vao thung rac duoc", err })
                    }
                    const data = results.rows[0]
                    console.log(data);
                    return res.json({ message: "Them vao thung rac thanh cong", data })
                })
            })
        });

    } catch (err) {
        return res.status(500).json({ message: 'Loi api' })
    }
}
//getone
export const GetOneProduct = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        let sql = `SELECT * FROM products WHERE product_id=${id} `
        connect.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Lay 1 san pham that bai', err })
            }
            const data = result.rows[0]
            return res.status(200).json({ message: 'Lay 1 san pham thanh cong', data })
        })
    } catch (errr) {
        return res.status(500).json({ message: 'Loi api' })
    }
}
//getall
export const GetAllProduct = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    try {
        const { _sort = "createAt", _order = "asc", _limit = 3, _page = 1 } = req.query;
        const offset = (_page - 1) * _limit;
        let sqlQuery = `SELECT * FROM products ORDER BY ${_sort} ${_order === "desc" ? "DESC" : "ASC"} LIMIT ${_limit} OFFSET ${offset};`;
        connect.query(sqlQuery, (err, result) => {
            if (err) {
                return res.json({
                    message: "Không lấy được danh sách sản phẩm"
                })
            }
            const data = result.rows
            const countQuery = 'SELECT COUNT(*) as totalProducts FROM products;';
            connect.query(countQuery, (err, countResult) => {
                if (err) {
                    return res.json({
                        message: "Không lấy được tổng số sản phẩm"
                    });
                }
                const totalProducts = countResult.rows[0].totalproducts;
                const totalPages = Math.ceil(totalProducts / _limit);
                // console.log(totalPages);
                return res.json({
                    message: "Danh sách sản phẩm",
                    data,
                    totalPages
                });
            })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Loi api' })
    }
}
//http://localhost:8080/api/products?_sort=price&_page=3&_order=desc&_limit=5 truy van dang nhu nay


//update
export const UpdateProduct = async (req, res) => {
    try {
        const id = req.params.id
        const { name, price, quantity, color, image, description, cat_id } = req.body
        let sql = `UPDATE products SET name='${name}', price=${price}, quantity=${quantity}, color = '${color}', image='${image}', description='${description}', cat_id = ${cat_id} WHERE product_id=${id} RETURNING *`
        connect.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Update product that bai', err })
            }
            const data = results.rows[0]
            return res.status(200).json({ message: 'Update product thanh cong', data })
        })
    } catch (err) {
        return res.status(500).json({ message: 'Loi api' })
    }
}
//  6 new product
export const GetSixNewestProducts = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    try {
        const { _limit = 8, _page = 1 } = req.query;
        const offset = (_page - 1) * _limit;
        let sqlQuery = `SELECT * FROM products ORDER BY product_id DESC LIMIT ${_limit} OFFSET ${offset};`;
        connect.query(sqlQuery, (err, result) => {
            if (err) {
                return res.json({
                    message: "Không lấy được danh sách 8 sản phẩm mới nhất"
                })
            }
            const data = result.rows
            const countQuery = 'SELECT COUNT(*) as totalProducts FROM products;';
            connect.query(countQuery, (err, countResult) => {
                if (err) {
                    return res.json({
                        message: "Không lấy được tổng số sản phẩm"
                    });
                }
                const totalProducts = countResult.rows[0].totalproducts;
                const totalPages = Math.ceil(totalProducts / _limit);
                return res.json({
                    message: "Danh sách 8 sản phẩm mới nhất",
                    data,
                    totalPages
                });
            })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi API' })
    }
}
// http://localhost:8080/api/sixproducts?_limit=8&_page=1