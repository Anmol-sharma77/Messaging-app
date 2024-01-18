function gethomepage(request,response){
    response.sendFile(__dirname+"/scripts/homepage.js");
  }
  function grrequest(request,response)
  {
    response.sendFile(__dirname+"/scripts/request.js");
  }
  module.exports={
    gethomepage,
    grrequest
  }