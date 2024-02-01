const session = require("express-session");
const con = require("../database");
const mailer = require("../mails/send mails");
const { request } = require("express");
con.connect(function (error) {
  if (error) console.log(error);
});
async function accept(data, callback) {
  try {
    queryAsync(`update requests set status="accept" where reqid=${data.reqid}`);
    queryAsync(`insert into participant values(${data.userid},${data.groupid},'${Date(Date.now())}')`);
    callback();
    return;
  } catch (error) {
    console.log(error);
    callback(error);
    return;
  }
}

async function checklogin(log, callback) {
  var d = await queryAsync(`select * from users where mail='${log.mail}' AND pass='${log.password}'`);
  if (d.length == 0) {
    callback("Wrong credentials", null);
    return;
  }
  else {
    callback(null, d);
    return;
  }
}
async function creategroup(data, callback) {
  try {
    queryAsync(`insert into groups values(${data.groupid},'${Date(Date.now())}',"${data.name}",${data.userid},0)`);
    queryAsync(`insert into participant values(${data.userid},${data.groupid},'${Date(Date.now())}')`);
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
  console.log(Date(Date.now()));
  try {
    id = Math.random();
    const date = new Date(data.create_time);
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
    const query=`INSERT INTO messages VALUES (${id}, ${data.id}, '${formattedDate}', "${data.content}", ${data.gid})`;
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
async function saveuser(user, callback) {
  var d = await queryAsync(`select * from users where mail='${user.mail}'`);
  if (d.length != 0) {
    callback("email Exist");
    return;
  }
  else {
    user.userid = Math.random();
    id = user.userid;
    //   user.verified=false;
    console.log(user);
    user.verified = false;
    con.query("insert into users values('" + id + "','" + user.username + "','" + user.mail + "','" + user.password + "','" + user.region + "','" + user.verified + "',0)", async function (error, result) {
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
}
async function addreq(data, callback) {
  try {
    id = Math.random();
    const data2 = await queryAsync(`select * from requests where reqto=${data.reqid} and groupid=${data.groupid}`);
    console.log(data2);
    if (data2.length == 0) {
      await queryAsync(`Insert into requests values(${data.userid},${data.reqid},${data.groupid},"${Date(Date.now())}",${id},"pending")`);
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
  addmessage
}