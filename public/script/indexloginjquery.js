$(document).ready(function () {
  $("#txtloginEmail").blur(function () {
    // alert();
    let obj = {
      type: "get",
      url: "/check-user-existance",
      data: {
        txtEmail: $("#txtloginEmail").val(),
      },
    };
    $.ajax(obj)
      .done(function (resp) {
        if (resp != "username exists!") {
          $("#errloginEmail").css("color", "red");
        } else {
          $("#errloginEmail").html("");
        }
      })
      .fail(function (err) {
        alert(JSON.stringify(err));
      });
  });

  $("#forgotPwd").dblclick(function () {
    // alert();
    let obj = {
      type: "get",
      url: "/forgot-user-password",
      data: {
        txtEmail: $("#txtloginEmail").val(),
      }
    };
    $.ajax(obj).done(function (resp) {
        alert(resp);
      })
      .fail(function (err) {
        alert(JSON.stringify(err));
      });
  });
  //email validation
  $("#txtloginEmail").blur(function () {
    var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let emailval = $(this).val();
    if (pattern.test(emailval) && emailval != "") {
      $("#txtvalidEmail").html("");
    } else {
      $("#txtvalidEmail").html("invalid email");
      $("#txtvalidEmail").css("color", "red");
    }
  });

  //password validation
  $("#txtloginPwd").blur(function () {
    let check = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    let pwdval = $(this).val();
    if (check.test(pwdval) && pwdval != "") {
      $("#txtvalidPwd").html("");
    } else {
      $("#txtvalidPwd").html("fill strong password");
      $("#txtvalidPwd").css("color", "red");
    }
  });

  //eye image
  $("#eyelogin").mousedown(function () {
    // alert();
    if ($("#txtloginPwd").prop("type") == "password") {
      $(this).removeClass("fa-solid fa-eye").addClass("fa-solid fa-eye-slash");
      $("#txtloginPwd").prop("type", "text");
    }
  });
  $("#eyelogin").mouseup(function () {
    if ($("#txtloginPwd").prop("type") == "text") {
      $(this).removeClass("fa-solid fa-eye-slash").addClass("fa-solid fa-eye");
      $("#txtloginPwd").prop("type", "password");
    }
  });
  //login button
  $("#btnLogin").click(function () {
    let obj1 = {
      type: "get",
      url: "/check-user",
      data: {
        txtloginEmail: $("#txtloginEmail").val(),
        txtloginPwd: $("#txtloginPwd").val(),
      }
    };
    $.ajax(obj1)
      .done(function (resp) {
        
          if(resp === "Influencer")
          {
            $('#modalLogin').modal('hide');
            localStorage.setItem("ActiveUser",$("#txtloginEmail").val());
            location.href="Infl-Dash.html";
          }
            else if(resp === "Customer")
          {
            $('#modalLogin').modal('hide');
            localStorage.setItem("ActiveUser",$("#txtloginEmail").val());
            location.href="Customer-Dash.html";
          }
          else if( resp === "U R BLOCKED!!!!")
          {
            $('#modalLogin').modal('hide');
           alert("You Are Blocked!!!!");
          }
          else if(resp === "Invalid Id or Password")
          {
            alert("Invalid Id or Password");
          }
          
          
        
      })
      .fail(function (err) {
        alert(JSON.stringify(err));
      });
  });
  
});
