const express = require("express");
const mongoose = require("mongoose");

const Customer = require("./models/customer.model");

const app = express();
mongoose.set("strictQuery", false);


if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const PORT = process.env.PORT || 3000;
const conn = process.env.CONNECTION;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const customer = new Customer({
    name: "Hero",
    industry: "Marvel"
});

app.get("/api/customers", async (req, res)=>{
    try{
        const result = await Customer.find();
        res.send(result);
    }catch(ex){
        res.status(500).json({error: ex.message});
    }
});

app.get("/api/customers/:id", async(req, res) => {
    try{
        const customerID = req.params;
        const customer = await Customer.findById(customerID);

        if(customer != null || !undefined){
            res.json({customer: customer});
            res.status(200)
        }
        res.status(404).json({error: "Customer not found!!!"})
    }catch(ex){
        res.status(500).json({error: ex.message});
    }
})

app.post("/api/customer", async (req, res) => {
    try{
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201);
    }
    catch(ex){
        res.status(500).json({error: ex.message});
    }
    
});

app.put("/api/customer/:id", async(req, res) => {
    try{
        const customerID = req.params;

        const result =  await Customer.replaceOne({_id: customerID}, req.body);

        res.status(201).json({updateCount: result.modifiedCount});
    }catch(ex){
        res.status(500).json({error: ex.message})
    }
})

app.delete("/api/customer/:id", async(req, res)=>{
    try{
        const customerID = req.params
        const result = await Customer.deleteOne({_id: customerID});

        res.status(201).json({deleteCount: result.deletedCount});
    }
    catch(ex){
        res.status(500).json({error: ex.message})
    }
})

const start = async() => {
    try{
        await mongoose.connect(conn);

        app.listen(PORT, ()=>{
            console.log("App Is Running");
        });
    }
    catch(ex){
        console.log(ex.message);
    }
    
}

start();

