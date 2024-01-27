

gettop(function(err,data){
    if(err)
    {
        console.log("Error found");
    }
    else
    {
        console.log(data);
    }
});
function gettop(callback)
{
    fetch("/gettop").then(function(response){
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