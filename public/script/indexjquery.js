$(document).ready(function (){ 
        $("#txtsignupEmail").blur(function()
            {
                // alert();
                let obj={
                    type:"get",
                    url:"/check-user-existance",
                    data:{
                        txtEmail:$("#txtsignupEmail").val()
                    }
                }
                $.ajax(obj).done(function(resp){
                    $("#errEmail").html(resp);
                    $("#errEmail").css("color","red");
                }).fail(function(err){
                    alert(JSON.stringify(err));
                });
            });
        $("#txtsignupEmail").blur(function () {
          var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          let emailval = $(this).val();
          if (pattern.test(emailval) && emailval != "") {
            $("#txtvalidEmail").html("");
          }
          else
          {
            $("#txtvalidEmail").html("invalid email");
            $("#txtvalidEmail").css("color","red");
            
            
          }
        });
        $("#txtsignupPwd").blur(function () {
          let check = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
          let pwdval = $(this).val();
          if ((check.test(pwdval)) && pwdval != "") {
            $("#txtvalidPwd").html("");
            }
            else
            {
                $("#txtvalidPwd").html("fill strong password");
                $("#txtvalidPwd").css("color","red");
                
            }
        });
        $("#eye").mousedown(function()
        {
            // alert();
          if($("#txtsignupPwd").prop("type") == "password")
          {
            $(this).removeClass("fa-solid fa-eye").addClass("fa-solid fa-eye-slash");
            $("#txtsignupPwd").prop("type","text");
          }
        });
        $("#eye").mouseup(function(){
          if($("#txtsignupPwd").prop("type") == "text")
          {
            $(this).removeClass("fa-solid fa-eye-slash").addClass("fa-solid fa-eye");
            $("#txtsignupPwd").prop("type","password");
          }
        });
        $("#btnSignup").click(function () {
            if($("#txtvalidPwd").html() == "" && $("#txtvalidEmail").html() == "" && $("#comboSignup").val() != "Select" &&  $("#txtsignupPwd").val()!= "" && $("#txtsignupEmail").val()!= "" )
            {
                let obj1={
                    type:"get",
                    url:"/send-to-sql",
                    data:{
                        txtEmail:$("#txtsignupEmail").val(),
                        txtPwd: $("#txtsignupPwd").val(),
                        txtcombo: $("#comboSignup").val()
                    }
                }
                $.ajax(obj1).done(function(resp){
                    if(resp)
                        $(".newmodal").html("Account Registered Please Click On Login to Continue").css("color","green");

                    else
                    {
                      if($("#errEmail").html() == "username already exists!")
                        $(".newmodal").html("Account Already Exists Click On Login to Continue").css("color","red");
                    } 
                }).fail(function(err){
                    alert(JSON.stringify(err));
                });
            }
            else
            {
              
              $(".newmodal").html("Fill all Details Correct!").css("color","red");
                return;
            }
            $('#modalSignup').modal('hide');
        });
        
}); 
