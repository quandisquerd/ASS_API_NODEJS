import express from "express";
import pool from "./connect";
import cors from "cors";
import RouterCategories from "./router/category"
import RouterProduct from "./router/product"
import RouterUsers from "./router/user"
import RouterCart from "./router/cart"
import RouterComments from "./router/comments"
import RouterCheckout from "./router/checkout"
import RouterBill from './router/bill'
import RouterRecyclebin from './router/recyclebin'

const app = express();

// middleware
app.use(express.json());
// app.use(cors());
// const corsOptions = {
//     origin: 'https://9f75-27-79-142-23.ngrok-free.app', // Replace with your origin
//     methods: 'GET,POST',
//     optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Cho phép tất cả các nguồn truy cập
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE'); // Các phương thức được phép
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Các tiêu đề được phép
    next();
});

// router

app.use('/api', RouterCategories)
app.use('/api', RouterProduct)
app.use('/api', RouterUsers)
app.use('/api', RouterCart)
app.use('/api', RouterComments)
app.use('/api', RouterCheckout)
app.use('/api', RouterBill)
app.use('/api', RouterRecyclebin)

pool.connect((err) => {
    if (err) {
        console.log('that bai');
    }
    console.log('Thanh cong');
})



export const viteNodeApp = app;