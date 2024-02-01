const socket=io(); 
const div1 = document.getElementById("contactList");
const newgroup = document.getElementById("newgroup");
const inpdiv = document.getElementById("inpbox");
const head = document.getElementById('chatHeader');
const body = document.getElementById('chatBody');
const groupcreate = document.getElementById("groupcreate");
const chat = document.getElementById("chat");
const createbtn = document.getElementById("createbtn");
const request = document.getElementById("request");
const searchResults = document.getElementById('searchResults');
const msginp = document.getElementById('messageInput');
const addicon = document.getElementById("addicon");
const results = document.getElementById('result');
var groupopen = null;
var username;
var userid;
getuser();
getgroup(function (error, data) {
    if (error) {
        console.log(error);
    }
    else {
        data.forEach(element => {
            addtodom(element);
        });
    }
});
function getuser() {
    fetch("/getuser").then(function (response) {
        if (response.status == 200) {
            return response.json();
        }
    }).then(function (user) {
        console.log(user);
        username = user.name.username;
        userid=user.id;
        // console.log(username,userid);
    }).catch(function (err) {
        console.log("error");
    });
}
newgroup.addEventListener("click", function (e) {
    groupcreate.style.display = "block";
    chat.style.display = "none";

});
createbtn.addEventListener("click", function (e) {
    console.log(123);
    let name = document.getElementById("groupInput").value;
    if (name.trim() == '') {
        alert("Group Name cannot be empty");
    }
    else {
        let obj = { name: name, groupid: Math.random() }
        groupmade(obj, function (error) {
            if (error) {
                console.log("Something Went wrong");
            }
            else {
                addtodom(obj);
            }
        })
    }
});
function groupmade(obj, callback) {
    fetch("/creategroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
    }).then(function (response) {
        if (response.status === 200) {
            callback();
        }
        else {
            callback("Something went wrong");
        }
    });
}
function getgroup(callback) {
    fetch("/groups").then(function (response) {
        if (response.status == 400) {
            throw new Error("something went wrong");
        }
        return response.json();
    }).then(function (data) {
        console.log(data);
        callback(null, data);
    }).catch(function (error) {
        console.log('Error:', error);
        callback(error, null);
    });
}
function addtodom(item) {
    const divv = document.createElement("div");
    divv.setAttribute("class", "contact-item");
    divv.innerHTML = item.name;
    div1.appendChild(divv);
    divv.addEventListener("click", function (e) {
        msginp.style.display = "block";
        addicon.style.display = "block";
        groupopen = item.groupid;
        groupcreate.style.display = "none";
        socket.emit("joingroup",groupopen);
        chat.style.display = "block";
        inpdiv.style.display = "block";
        head.innerHTML = item.name;
        body.innerHTML = 'chat messages for ' + item.name;
        fetch("/getmessage?groupid=" + item.groupid).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            data.forEach((d) => {
                addtochat(d);
            })
        }).catch((error) => {
            console.log("error");
        })
    });
}
function scrollToBottom() {
    const chatContainer = document.getElementById("chatBody");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
function sendMessage() {
    var messageInput = msginp.value;
    if (messageInput.trim() == '') {
        alert("enter somthing");
    }
    else{
        const time=Date(Date.now());
        const obj = { content: messageInput, username: username, id:userid,create_time:time,gid:groupopen};
        // fetch("/addpost", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ content: messageInput, groupid: groupopen,time:time})
        // }).then(function (res) {
        //     if (res.status == 200) {
        //         addtochat(obj);
        //     }
        //     else {
        //         console.log("something went wrong");
        //     }
        // });
        socket.emit("msgfromuser",obj);
        addtochat(obj);
        scrollToBottom();
        msginp.value='';
    }
}

socket.on("send",(data)=>{
    addtochat(data);
})

function openAddParticipantModal() {
    document.getElementById('userSearchModal').style.display = 'flex';
}

function closeUserSearchModal() {
    document.getElementById('userSearchModal').style.display = 'none';
}
function searchUsers() {
    var userSearchInput = document.getElementById('userSearchInput').value;
    if (userSearchInput == '') {
        alert("Enter something");
    }
    else {
        fetch("/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: userSearchInput }),
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
        }).then(function (data) {
            results.innerHTML = "";
            data.forEach(function (d) {
                addtodom2(d);
            })
        }).catch(function (error) {
            console.log(error);
        })
    }
    // searchResults.innerHTML = `<p>Results for: ${userSearchInput}</p>
    //                            <ul>
    //                                <li>User 1</li>
    //                                <li>User 2</li>
    //                                <!-- Add more results as needed -->
    //                            </ul>`;
}
function addtodom2(data) {
    console.log(data);
    const li = document.createElement('li');
    const i = document.createElement('i');
    const p=document.createElement('p');
    i.setAttribute("class", "fas fa-user-plus");
    i.style.float = "right";
    li.innerHTML = data.username;
    li.appendChild(i);
    results.appendChild(li);
    i.addEventListener("click", function (e) {
        fetch("/sendreq", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reqid: data.id, groupid: groupopen })
        }).then(function (response) {
            if (response.status === 200) {
                console.log("request sent");
            }
            else {
                console.log("error");
                p.style.color="red";
                p.innerHTML="already added";
                results.appendChild(p);
                setTimeout(function(){
                    results.removeChild(p);
                },3000)
            }
        })
    });
}
function addtochat(message) {
    const chatdiv1 = document.createElement("div");
    const p = document.createElement("span");
    const p2 = document.createElement("span");
    const p3 = document.createElement("span");
    if(message.id==userid)
    {
    chatdiv1.setAttribute("class", "message-sent2");
    }
    else
    chatdiv1.setAttribute("class", "message-sent");
    p.setAttribute("class", "message-content");
    p2.innerHTML = message.username + ":-<br>";
    p.innerHTML = message.content;
    const dateObject = new Date(message.create_time);
    const timeString = dateObject.toLocaleTimeString('en-US', { hour12: false });
    p3.innerHTML = timeString;
    p3.setAttribute("class","time")
    body.appendChild(chatdiv1);
    chatdiv1.appendChild(p2);
    chatdiv1.appendChild(p);
    chatdiv1.appendChild(p3);
    scrollToBottom();
}