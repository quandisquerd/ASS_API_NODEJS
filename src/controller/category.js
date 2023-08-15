import connect from "../connect";

//add
export const AddCategory = async (req, res, next) => {
    try {
        const { name, image } = req.body;
        let sql = `INSERT INTO categories(name, image)
        VALUES('${name}', '${image}') RETURNING *`
        connect.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Them that bai' })
            }
            const data = result.rows[0]
            return res.status(200).json({ message: 'Them thanh cong category', data })
        })
    } catch (err) {
        return res.status(500).json({ message: 'Loi api' })
    }
}
//getall
export const GetALlCategory = async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    try {
        let sql = `SELECT * FROM categories`
        connect.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Lay tat ca category that bai' })
            }
            const data = results.rows
            return res.status(200).json({ message: 'Lay tat ca category thanh cong', data })
        })
    } catch (err) {
        return res.status(500).json({ message: 'Loi api' })
    }
}
//getOne
export const getOneCategory = (req, res) => {
    try {
        const id = req.params.id;
        let sql = `SELECT * FROM categories WHERE cat_id=${id}`
        connect.query(sql, (err, result) => {
            if (err) {
                return res.json({
                    message: "Lấy 1 danh mục thất bại"
                })
            }
            const data = result.rows[0]
            return res.json({
                message: "Lấy 1 danh mục thành công",
                data
            })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Loi api' })
    }
}
//remove Category
export const RemoveCategory = async (req, res) => {
    try {
        const id = req.params.id;

        // Xóa các bản ghi liên kết trước
        await removeLinkedRecords(id);

        // Tiến hành xóa danh mục
        const query = `DELETE from categories WHERE cat_id=${id} RETURNING *`;
        const result = await connect.query(query);

        if (result.rows.length === 0) {
            return res.json({
                message: "Xóa thất bại"
            });
        }

        const data = result.rows[0];
        return res.json({
            message: "Xóa thành công",
            data
        });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Lỗi API' });
    }
};

// Hàm xóa các bản ghi liên kết
async function removeLinkedRecords(categories) {
    // Cập nhật các bảng liên kết với ràng buộc khóa ngoại
    const linkedTables = ['products'] // Thay thế bằng danh sách các bảng liên kết

    for (const table of linkedTables) {
        const query = `UPDATE ${table} SET cat_id = NULL WHERE cat_id = ${categories}`;
        await connect.query(query);
    }
}

//update
export const UpdateCategory = async (req, res) => {
    try {
        const id = req.params.id
        const { name, image } = req.body
        let sql = `UPDATE categories SET name='${name}', image='${image}' WHERE cat_id=${id} RETURNING *`
        connect.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Update category that bai' })
            }
            const data = result.rows[0]
            return res.status(200).json({ message: 'Update category thanh cong', data })
        })
    } catch (err) {
        return res.status(500).json({ message: 'Loi api' })
    }
}


export const GetProductByCategory = async (req, res) => {
    try {
        const id = req.params.id
        let sql = `SELECT * FROM products WHERE cat_id=${id}`
        connect.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Loi khi tim product theo category', err })
            }
            const products = result.rows
            return res.json({ message: 'Lay thanh cong', products })
        })
    } catch (err) {
        return res.status(500).json({ message: "Loi api", err })
    }
}
