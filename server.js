const express = require("express");

const app=express();

app.use(express.static("uploads"));

const con=require("./database");

const getroutes=require("./MVC/getroutes");

const jsroutes=require("./MVC/jsroutes");

const postroutes=require("./MVC/postroutes");

// const delroutes=require("./MVC/Routes/delroutes");

const multer=require("multer");

const ejs=require("ejs");

app.set("view engine","ejs");

const session = require("express-session");

const upload = multer({ dest: 'uploads/' });

  app.listen(8000,function(error)
  {
    if(error)
    console.log(error);
    else
    console.log("Server is running on port 8000");
  });

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(upload.any());

const storage = multer.memoryStorage();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
}); 

app.use(express.urlencoded({extended:true}));

// <------------------GET REQUESTS------------------>

app.get("/",getroutes.gethome);

// app.get("/selreq",getroutes.getselreq);

// app.get("/seller",getroutes.getsellersign);

// app.get("/selreqdata",getroutes.selreqdata);

// app.get("/deliverer",getroutes.deliverer);

// app.get("/distributers",getroutes.distributer)

// app.get("/selreq.js",jsroutes.getselreqjs);

// app.get("/signstyle.css",getroutes.getsignstyle);

// app.get("/dashboard",getroutes.getdash);

// app.get("/dashboard.js",jsroutes.getdashjs);

// app.get("/style.css",getroutes.getstyle);

// app.get("/products",getroutes.getproducts);

app.get("/login",getroutes.getlogin);

app.get("/signup",getroutes.getsignup);

// app.get("/cart",getroutes.getcart);

// app.get("/waiting2",getroutes.waiting2);

// app.get("/cart.js",jsroutes.getcartsjs);

// app.get("/admin",getroutes.getadmin);

app.get("/logout",getroutes.getlogout);

app.get("/getuser",getroutes.getuser);

app.get("/dashboard",getroutes.getdash);

// app.get("/cancelorder",getroutes.cancelorder);

// app.get("/cancelorders",getroutes.cancelorders);

// app.get("/deliveredorder",getroutes.deliveredorder);

// app.get("/deliversorders",getroutes.deliversorders);

// app.get("/totalproduct",getroutes.totalproduct);

// app.get("/forgot",getroutes.getforgot);

app.get("/waiting",getroutes.getwaiting);

// app.get("/forgotpass",getroutes.getforgotpass);

// app.get("/newpass.js",jsroutes.getnewpassjs);

// app.get("/newpass",getroutes.getnewpass);

// app.get("/404",getroutes.get404);

// app.get("/adminproducts",getroutes.getadminproducts);

// app.get("/cartproduct",getroutes.getcartproducts);

// app.get("/admin.js",jsroutes.getadminjs);

// app.get("/sellers",getroutes.getseller);

// app.get("/seller.js",jsroutes.getseller);

// app.get("/sellerproducts",getroutes.sellerpro);

app.get("/verify",getroutes.getverify);

// app.get("/productrequest",getroutes.proreq);

// app.get("/proreqdata",getroutes.proreqdata);

// app.get("/productrequest.js",jsroutes.proreq);

// app.get("/pendingrequest",getroutes.pendingrequest);

// app.get("/rejectrequest",getroutes.rejectrequest);

// app.get("/allrequest",getroutes.allrequest);

// app.get("/sellerpage",getroutes.sellerpage);

// app.get("/allseller",getroutes.allsellers);

// app.get("/allusers",getroutes.allusers);

// app.get("/monthlyreport",getroutes.monthlyreport);

// app.get("/buyproducts",getroutes.buyproducts);

// app.get("/getreport",getroutes.getreport);

// app.get("/buyproduct",getroutes.buyproduct);

// app.get("/myorders",getroutes.myorders);

app.get("/groups",getroutes.getgroups);

// app.get("/myorders.js",jsroutes.myorders);

// app.get("/orders",getroutes.orders);

// app.get("/buyrequest",getroutes.buyrequest);

// app.get("/buyorders",getroutes.buyorders);

// app.get("/deliverorders",getroutes.deliverorders);

// app.get("/approveorder",getroutes.approveorder);

// app.get("/approveorders",getroutes.approveorders);

app.get("/getmessage",getroutes.getmessage);

app.get("/requests",getroutes.getallreq);

app.get("/request.js",jsroutes.grrequest);

app.get("/homepage.js",jsroutes.gethomepage);

app.get("/dashboard.js",jsroutes.getdash);

app.get("/groupreq",getroutes.groupreq);

// app.get("/dispatchedorders",getroutes.dispatchedorders);

// app.get("/cancel",getroutes.cancelpage);

// app.get("*",getroutes.getstar);

// // <------------------POST REQUESTS------------------>

// app.post("/addsub",postroutes.postaddsub);

// app.post("/deliverbydistributer",postroutes.deliverbydistributer);

// app.post("/buycart",postroutes.buycart);

// app.post("/cancelproduct",postroutes.cancelproduct);

// app.post("/carts",postroutes.postcarts);

// app.post("/deliveredbydeliverer",postroutes.deliveredbydeliverer);

// app.post("/seller",postroutes.postseller);

app.post("/acceptreq",postroutes.acceptreq);

// app.post("/approvebyseller",postroutes.approvebyseller);

// app.post("/dispatchbyseller",postroutes.dispatchbyseller);

// app.post("/update",postroutes.postupdate);

// app.post("/aprove",postroutes.postaprove);

// app.post("/approveproduct",postroutes.approveproduct);

app.post("/login",postroutes.postlogin);

app.post("/signup",postroutes.postsignup);

app.post("/creategroup",postroutes.postcreategroup);

app.post("/search",postroutes.searching);

app.post("/sendreq",postroutes.sendreq);

app.post("/addpost",postroutes.addpost);

// app.post("/forgots",postroutes.postforgots);

// app.post("/changepass",postroutes.postchangepass);

// app.post("/product",postroutes.postproduct);

// <------------------DELETE REQUESTS------------------>

// app.delete("/delpro",delroutes.delpro);

// app.delete("/delcart",delroutes.delcart);

// app.delete("/reject",delroutes.postreject);

// app.delete("/rejectproduct",delroutes.rejectproduct);