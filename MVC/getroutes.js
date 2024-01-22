const con=require("../database");
const queryAsync = (sql) => {
    return new Promise((resolve, reject) => {
      con.query(sql ,(err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  async function getuser(request,response)
  {
    try {
    let username=await queryAsync(`select username from users where id=${request.session.userid}`);
    username=username[0];
    response.status(200);
    response.json({name:username,id:request.session.userid});
    } catch (error) {
      console.log(error);
      response.status(400).send();
    }
  }
  function getdash(request,response)
  {
    if (request.session.login) {
      if(request.session.verified)
      response.render("dashboard2");
      else
      response.render("login", { error: null });

  }
    else {
      response.render("login", { error: null });
    }
  }
  async function getmessage(request,response){
    try {
      console.log(request.query.groupid);
      const data=await queryAsync(`select u.id,u.username,m.content,m.create_time from messages as m,users as u where m.sender=u.id and groupid=${request.query.groupid}`);
      response.status(200).json(data);
    } catch (error) {
      console.log(error);
      response.status(400).send();
    }
  }

  async function groupreq(request,response)
  {
      try {
        let data2=await queryAsync(`SELECT g.groupid,r.reqid,g.name,u.username FROM requests as r,users as u,groups as g WHERE r.reqby=u.id and r.groupid=g.groupid and r.reqto=${request.session.userid} and r.status="pending";`);
        response.status(200); 
        response.json(data2);
      } catch (error) {
        console.log(error);
        response.status(400).send(); 
      }
  }
  function getlogout(request, response) {
    request.session.destroy();
    response.redirect("/login");
  }
  function getallreq(request,response)
  {
    if (request.session.login) {
      if(request.session.verified)
      response.render("request");
      else
      response.render("login", { error: null });

  }
    else {
      response.render("login", { error: null });
    }  
  }
function getlogin(request, response) {
    if (request.session.login) {
        if(request.session.verified)
        response.redirect("/");
        else
        response.render("login", { error: null });

    }
      else {
        response.render("login", { error: null });
      }
    }
    function getsignup(request, response) {
        if (request.session.login) {
          response.redirect("/");
        }
        else {
          response.render("signup", { error: null });
        }
      }
      function gethome(request, response) {
        if(request.session.login){
            if(request.session.verified)
            {
                response.render("dashboard");}
            else
            response.redirect("/waiting");
            }
        else
        response.redirect("/login");
      }
      function getverify(request, response) {
        const token = request.query.tokken;
        queryAsync(`update users set verified=${true} where id=${token}`).then(response)
        {
            request.session.login=false;
          request.session.verified = true;
          response.render("verified");
        }
      }
      function getwaiting(request, response) {
        if (request.session.verified)
          response.redirect("/");
        else
          response.render("waiting");
      }
      async function getgroups(request,response)
      {
        try {
          let data2=await queryAsync(`SELECT g.groupid,g.name,g.createdby FROM participant p JOIN groups g ON p.groupid = g.groupid WHERE p.participantid =${request.session.userid};`);
          response.status(200);
          response.json(data2);
        } catch (error) {
          console.log(error);
          response.status(400).send();
        }
      }
      module.exports={
          getlogin,
          getsignup,
          gethome,
          getverify,
          getwaiting,
          getgroups,
          getallreq,
          groupreq,
          getlogout,
          getmessage,
          getuser,
          getdash
        }