import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
dotenv.config()
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

let port = process.env.PORT || 6000

let app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:["https://e-commerce-frontend-a0py.onrender.com" , "https://e-commerce-admin-84ee.onrender.com"],
  credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(port,()=>{
  console.log(`Hello From Server on Port ${port}`)
  connectDb()
})
