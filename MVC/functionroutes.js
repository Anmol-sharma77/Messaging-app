const session = require("express-session");
const con = require("../database");
const mailer = require("../mails/send mails");
const { request, response } = require("express");
const bcrypt=require('bcrypt');
const salt=10;
con.connect(function (error) {
  if (error) console.log(error);
});
async function accept(data, callback) {
  try {
    const date=createdate(Date(Date.now()));
    queryAsync(`update requests set status="accept" where reqid=${data.reqid}`);
    queryAsync(`insert into participant values(${data.userid},${data.groupid},'${date}',1)`);
    callback();
    return;
  } catch (error) {
    console.log(error);
    callback(error);
    return;
  }
}

async function checklogin(log, callback) {
  var d = await queryAsync(`select * from users where mail='${log.mail}'`);
  if (d.length == 0) {
    callback("Wrong credentials", null);
    return;
  }
  else {
    bcrypt.compare(log.password.toString(),d[0].pass,(err,response)=>{
      if(err)
      {
        console.log(1234);
        callback("Wrong credentials", null);
      }
      else if(response)
      {
        callback(null, d);
        return;
      }
      console.log(1234);
        callback("Wrong credentials", null);
    })
  }
}
async function creategroup(data, callback) {
  try {
    const date=createdate(Date(Date.now()));
    queryAsync(`insert into groups values(${data.groupid},'${date}',"${data.name}",${data.userid},0)`);
    queryAsync(`insert into participant values(${data.userid},${data.groupid},'${date}',1)`);
    callback();
  } catch (error) {
    console.log(error);
    callback(error);
  }
}
async function search(name, callback) {
  try {
    const data = await queryAsync(`select * from users where mail="${name}" or username="${name}"`);
    callback(null, data);
    return;
  } catch (error) {
    callback(error);
    return;
  }
}
async function addmessage(data, callback) {
  try {
    let data2=await queryAsync(`select * from participant where participantid=${data.id} and groupid=${data.gid}`);
    if(data2.length==0)
    {
      callback("Something went wrong");
      return;
    }
    id = Math.random();
    const date=createdate(data.create_time);
    const query=`INSERT INTO messages VALUES (${id}, ${data.id}, '${date}', "${data.content}", ${data.gid})`;
    const query2=`Update groups set messcount=messcount+1 where groupid=${data.gid}`;
    const query3=`Update users set messcount=messcount+1 where id=${data.id}`;
    queryAsync(query);
    queryAsync(query2);
    queryAsync(query3);
    callback();
    return;
  } catch (error) {
    console.log(error);
    callback(error);
    return;
  }
}
function createdate(d)
{
  const date = new Date(d);
    const formattedDate = date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
    return formattedDate;
}
async function saveuser(user, callback) {
  var d = await queryAsync(`select * from users where mail='${user.mail}'`);
  if (d.length != 0) {
    callback("email Exist");
    return;
  }
  else {
    const pass=user.password;
    bcrypt.hash(pass,salt,(err,hash)=>{
      if(err)
      {
        console.log(err);
        callback(err);
        return;
      }
      else
      {
        user.userid = Math.random();
        id = user.userid;
        user.verified = false;
        con.query("insert into users values('" + id + "','" + user.username + "','" + user.mail + "','" + hash + "','" + user.region + "','" + user.verified + "',0)", async function (error, result) {
          if (error) {
            console.log(error);
            callback(error);
            return;
          }
          else {
            var result = await mailer.sendmail([{ Email: user.mail, Name: user.username }], `Wellcome to Groupify ${"http://localhost:8000/verify"}?tokken=${id}`);
            callback();
            return;
          }
        });
      }
    })
  }
}
function leave(gid,userid,callback)
{
  try {
    queryAsync(`delete from participant where groupid=${gid} and participantid=${userid}`);
    queryAsync(`delete from requests where groupid=${gid} and reqto=${userid}`);
    callback();
  } catch (error) {
    console.log(error);
    callback(error);
  }
}
async function addreq(data, callback) {
  try {
    id = Math.random();
    const data2 = await queryAsync(`select * from requests where reqto=${data.reqid} and groupid=${data.groupid}`);
    console.log(data2);
    if (data2.length == 0) {
      const date=createdate(Date(Date.now()));
      await queryAsync(`Insert into requests values(${data.userid},${data.reqid},${data.groupid},"${date}",${id},"pending")`);
      callback();
    }
    else {
      callback("someting went wrong");
      return;
    }
    return;
  } catch (error) {
    console.log(error);
    callback(error);
    return;
  }
}
const queryAsync = (sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
module.exports={
  checklogin,
  saveuser,
  creategroup,
  search,
  addreq,
  accept,
  addmessage,
  leave
}