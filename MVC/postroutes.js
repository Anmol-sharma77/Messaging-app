const { query } = require("express");
const functionroutes=require("./functionroutes");
var format = /^(?=.*[-#$.%&@!+=\\*])(?=.*\d)/;
function postsignup(request,response){
    const data=request.body;
    if(data.mail===""||data.username===""||data.password==="")
    {
      response.render("signup",{error:"Please enter something"});
    }
    else if(data.password.length>=8&&data.password.match(format)){
      functionroutes.saveuser(data,function(err)
    {
      if(err)
      {
        response.render("signup",{error:"Email is already exist"});
      }
      else{
        response.status(200);
        response.redirect("/login");
      }
    })
    }
    else{
      response.render("signup",{error:"Password should be atleast 8 characters long and contain a number and special character"});
    }
    
  }

  function acceptreq(request,response)
  {
    const data=request.body;
    data.userid=request.session.userid;
    functionroutes.accept(data,function(error){
      if(error)
      {
        response.status(400).send();
      }
      else{
        response.status(200).send();
      } 
    })
  }
  function addpost(request,response)
  {
    let data=request.body;
    data.userid=request.session.userid;
    functionroutes.addmessage(data,function(err){
      if(!err)
      {
        response.status(200).send();
      }
      else
      {
        response.status(400).send();
      }
    })
  }

  function postlogin(request,response)
  {
    const log=request.body;
    if(log.mail===""&&log.password==="")
    {
      response.render("login",{error:"Please enter details"});
    }
    functionroutes.checklogin(log,function(error,user){
      if(error)
      {
        response.status(200);
        response.render("login",{error:"Invalid credentials"});
        response.send();
      }
      else{
        response.status(200);
        user=user[0];
        request.session.login=true;
        request.session.userid=user.id;
        request.session.username=user.username;
        request.session.verified=user.verified;
        response.redirect("/");
      }
    })
  }
  function postcreategroup(request,response)
  {
    data=request.body;
    data.userid=request.session.userid;
    functionroutes.creategroup(data,function(err){
      if(err)
      {
        response.status(400).send();
      }
      else
      {
        response.status(200).send();
      }
    })
  }
  function searching(request,response)
  {
    const name = request.body.name;
    functionroutes.search(name,function(err,data)
    {
      if(err)
      {
        response.status(400).send();
      }
      else{
        response.status(200).json(data);
      }
    })
  }
  function sendreq(request,response)
  {
    var body=request.body;
    body.userid=request.session.userid;
    functionroutes.addreq(body,function(err){
      if(err)
      {
        response.status(400).send();
      }
      else
      {
        response.status(200).send();

      }
    })
  }
  module.exports={
    postlogin,
    postsignup,
    postcreategroup,
    searching,
    sendreq,
    acceptreq,
    addpost
  }