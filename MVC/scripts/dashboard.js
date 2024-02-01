const startdate=document.getElementById("start-date");
const enddate=document.getElementById("end-date");
const trg=document.getElementById("groups");
const trr=document.getElementById("regions");
const tru=document.getElementById("users");
function gettop(start,end,callback)
{
    fetch("/gettop?start="+start+"&end="+end).then(function(response){
        if(response.status==400)
        {
            throw new Error("Something went wrong");
        }
        return response.json();
    }).then(function(data){
        callback(null, data);
    }).catch(function(error){
        callback(error,null);
    })
}
function updateDashboard() {
    const sdate= new Date(startdate.value)
    const edate =new Date(enddate.value);
    trg.innerHTML='';
    trr.innerHTML='';
    tru.innerHTML='';
    gettop(sdate,edate,function(err,data){
        if(err)
        {
            console.log("Error found");
        }
        else
        {
            console.log(data);
            const groups=data.group;
            const users=data.users;
            const region=data.region;
            console.log(groups,users,region);
            groups.forEach(function(element){
                addtrg(element);
            });
            region.forEach(function (element){
                addtrr(element);
            });
            users.forEach(function(element){
                addtru(element);
            });
        }
    }); 
}
function addtrg(data)
{
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.innerHTML=data.name;
    tr.appendChild(td);
    trg.appendChild(tr);
}
function addtru(data)
{
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.innerHTML=data.username;
    tr.appendChild(td);
    tru.appendChild(tr);
}
function addtrr(data)
{
    const tr=document.createElement("tr");
    const td=document.createElement("td");
    td.innerHTML=data.region;
    tr.appendChild(td);
    trr.appendChild(tr);
}