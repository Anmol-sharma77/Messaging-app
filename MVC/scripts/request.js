const div = document.getElementById("div1");
const back = document.getElementById("back");
const div2 = document.getElementById("oops");
getreq(function (error, data) {
    console.log(data);
    if (error) {
        console.log(error);
    } else if (data.length == 0) {
        div.style.display = "none";
        div2.style.display = "block";
    }
    else
    data.forEach(function (x) {
        addtodom(x);
        console.log(x);
    });
});
back.addEventListener("click", function (event) {
    window.location.href = "/";
});
function getreq(callback) {
    fetch("/groupreq").then(function (response) {
        if (response.status === 401) {
            throw new Error("something went wrong");
        }
        return response.json();
    }).then(function (pr) {
        callback(null, pr);
    }).catch(function (error) {
        callback(error, null);
    });
}
function addtodom(data)
{
    const divv = document.createElement("div");
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const btn1 = document.createElement("button");
    divv.setAttribute("class", "product-container");
    btn1.setAttribute("class", "btn");
    h2.innerHTML="Group Name:"+data.name;
    p.innerHTML="Requested by:"+data.username;
    btn1.innerHTML="Accept";
    div.appendChild(divv);
    divv.appendChild(h2);
    divv.appendChild(p);
    divv.appendChild(btn1);
    btn1.addEventListener("click",function(e){
        fetch("/acceptreq",{
            method:"POST",
            headers:{ "Content-Type": "application/json" },
            body: JSON.stringify({reqid:data.reqid,groupid:data.groupid}),
        }).then(function (response){
            if (response.status === 200) {
              div.removeChild(divv);
            }
             else {
              callback("Something went wrong");
            }
          });
    })
}