const express = require('express');
const Blockchain = require('./blockchain');
const Block = require('./block');
const bodyParser = require('body-parser');

const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/blockchainDB");

//const {pubkeys,prikeys}= require('./keys');


const multer  = require('multer');
const upload = multer({ dest: './public/uploads/' });



const apub = "approver1";
const apri = "password";

const userSchema = mongoose.Schema({
    username : String,
    password : String
});

const User = mongoose.model("User", userSchema);

const objSchema = mongoose.Schema({
    key : String,
    data : String,
    dataid : String
});

const Obj = mongoose.model("Obj", objSchema);

const tempSchema = mongoose.Schema({
    temparr : [objSchema]
});

const Temp = mongoose.model("Temp", tempSchema);


const bkSchema = mongoose.Schema({
    timestamp : Number,
    lasthash : String,
    hash : String,
    id : String,
    data : String,
    dataid : String,
    nonce : Number,
    difficulty : Number
});

const Bk = mongoose.model("Bk" , bkSchema);

const bkChainSchema = mongoose.Schema({
    bchain : [bkSchema]
});

const BkChain = mongoose.model("BkChain", bkChainSchema);


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

Temp.find({}, (err,foundarrays)=>{
    if(foundarrays.length===0)
    {
        Temp.insertMany({temparr : []} , (err)=>{
            if(err)
            {
                console.log(err);
            }
        });
    }
});

BkChain.find({},(err,foundchain)=>{
    if(foundchain.length===0)
    {
        let gen = new Bk(Block.genesis());
        gen.save();
        BkChain.insertMany({bchain : [gen]}, (err)=>{
            if(err)
            {
                console.log(err);
            }
        });
    }
});


app.get('/', function(req,res){
    res.render('login', {});
});

app.get('/signup', function(req,res){
    res.render('signup', {});
});

app.post('/signup', (req,res)=>{
    const uname = req.body.uname;
    const pass = req.body.pass;
    User.findOne({username : uname} , (err,founduser)=>{
        if(founduser)
        {
            res.send('<script>alert("Username already exists!!"); window.location.href = "/"; </script>');
        }
        else
        {
            const newuser = User({
                username : uname,
                password : pass
            });
            newuser.save();
        }
    });
    res.send('<script>alert("Signup Successful!!"); window.location.href = "/"; </script>');
});

app.get('/blockchain', function(req,res){

    BkChain.findOne({},(err,foundchain)=>{
        res.json(foundchain.bchain);
    });
    
});



app.post('/approver', function(req,res){

    let selected = req.body.checkbox;

    Temp.findOne({}, (err,foundarr)=>{
        let temp = foundarr.temparr;

        if(selected!=null)
        {
            if(Array.isArray(selected))
            {

                BkChain.findOne({}, (err,foundchain)=>{

                    selected.forEach((item)=>{
                        const tobeinserted = temp[item];
                        const b = Blockchain.addBlock(foundchain.bchain[foundchain.bchain.length-1] , tobeinserted.key, tobeinserted.data, tobeinserted.dataid);
                        const newblock = new Bk(b);
                        foundchain.bchain.push(newblock);
                        newblock.save();
                    });
                    foundchain.save();
                });
                foundarr.temparr = foundarr.temparr.filter(function(item,index){
                    return !selected.includes(index.toString());
                });
                foundarr.save();
            }
            else
            {
                let x= temp[selected];
                BkChain.findOne({}, (err,foundchain)=>{
                    const b = Blockchain.addBlock(foundchain.bchain[foundchain.bchain.length-1] , x.key, x.data, x.dataid);
                    const newblock = new Bk(b);
                    newblock.save();
                    foundchain.bchain.push(newblock);
                    foundchain.save();
                });
                    
                foundarr.temparr = foundarr.temparr.filter((item,index)=>{
                    return (index.toString() !== selected);
                });                
                foundarr.save();
            }
            console.log("Inserted the selected items");
        }
        
        res.render('approver', {newListItems: foundarr.temparr});

    });

    
});

app.post('/ulogin', upload.single('data') , async (req,res) => {

    if(req.file !=null)
    {
        const uid = req.body.upubid;
        const upass = req.body.uprid;
        const infoid = req.file.filename;

        fs.readFile(__dirname + '/'+ req.file.path, 'utf-8', (err,infodata)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                User.findOne({username : uid}, (err,founduser)=>{
                    if(founduser)
                    {
                        if(founduser.password === upass)
                        {
                            Temp.findOne({}, (err,foundarr)=>{
                                const newobj = new Obj({key:uid,data:infodata,dataid:infoid});
                                foundarr.temparr.push(newobj);
                                foundarr.save();
                            });
                            res.send('<script>alert("Inserted Successfully!!"); window.location.href = "/"; </script>');
                        }
                        else
                        {
                            res.send('<script>alert("Incorrect Password!!"); window.location.href = "/"; </script>');
                        }
                    }
                    else
                    {
                        res.send('<script>alert("Username does not exist!!"); window.location.href = "/"; </script>');
                    }
                });
            }
        });

        await unlinkAsync(req.file.path);
    }
    else
    {
        await res.send('<script>alert("Please upload a file!!"); window.location.href = "/"; </script>');
    }

    

});

app.post('/alogin', function(req,res){
    const aid = req.body.apubid;
    const apass = req.body.aprid;
    if(aid===apub && apass===apri)
    {
        Temp.findOne({}, (err,foundarr)=>{
            res.render('approver', {newListItems: foundarr.temparr});
        });
    }
    else
    {
        res.send('<script>alert("Incorrect Credentials!!"); window.location.href = "/"; </script>');
    }
});


app.listen(3000, ()=>{
    console.log("Running on port 3000");
});

