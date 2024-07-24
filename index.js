var express = require("express");
let app = express();
let nodemailer = require("nodemailer");
app.use(express.static("public"));
var fileuploader = require("express-fileupload");
app.use(express.urlencoded(true));
app.use(fileuploader());
var mysql2 = require("mysql2");
let config = {
  host: "bfdugplpcosdptsoacoz-mysql.services.clever-cloud.com",
  user: "uycmes4mql8ou8rt",
  password: "faQvP1yMEJ05xjqOyHdF",
  database: "bfdugplpcosdptsoacoz",
  dateStrings: true,
  keepAliveInitialDelay:10000,
  enableKeepAlive: true,
};
var mysql = mysql2.createConnection(config);
app.use(express.urlencoded(true));
app.listen(2024, function () {
  console.log("Server Started of Project :)");
});
mysql.connect(function (err) {
  if (err == null) console.log("Connected To Database Successfuly");
  else console.log(err.message + "  ########");
});
let path = __dirname;
app.get("/", function (req, resp) {
  resp.sendFile(path + "/public/index.html");
});

//Using AJAX we can Check Filled Data without refreshing page;
app.get("/check-user-existance", function (req, resp) {
  let email = req.query.txtEmail;
  mysql.query(
    "Select *from users where email=?",
    [email],
    function (err, resultJasonArray) {
      if (err == null) {
        if (resultJasonArray.length) {
          resp.send("username already exists!");
        } else {
          resp.send("");
        }
      } else {
        console.log(err.message);
      }
    }
  );
});
app.get("/send-to-sql", function (req, resp) {
  mysql.query(
    "insert into users(email,pwd,utype) values(?,?,?)",
    [req.query.txtEmail, req.query.txtPwd, req.query.txtcombo],
    function (err) {
      if (err == null) resp.send(true);
      else resp.send(false);
    }
  );
});
app.get("/check-user", function (req, resp) {
  let txtloginEmail = req.query.txtloginEmail;
  let txtloginPwd = req.query.txtloginPwd;
  if(!txtloginEmail || !txtloginPwd)
  {
    resp.send("Invalid Id or Password");
    return;
  }
  mysql.query(
    "Select *from users where email=? and pwd = ?",
    [txtloginEmail, txtloginPwd],
    function (err, resultJasonArray) {
      if (err != null) {
        resp.send(err.message);
        return;
      }
      if (resultJasonArray.length == 0) {
        resp.send("Invalid Id or Password");
        return;
      }
      if (resultJasonArray[0].status == 1) {
        resp.send(resultJasonArray[0].utype);
      } else {
        resp.send("U R BLOCKED!!!!");
        return;
      }
    }
  );
});

app.get("/to-influencer-profile", function (req, resp) {
  resp.sendFile(path + "/public/Infl-Profile.html");
});
app.post("/send-pofile-details-to-sql", function (req, resp) {
  let emailid = req.body.email;
  let fname = req.body.firstName;
  let lname = req.body.lastName;
  let fullname = req.body.firstName + " " + req.body.lastName;
  let gender = req.body.gender;
  let dob = req.body.dob;
  let address = req.body.address;
  let city = req.body.city;
  let zipcode = req.body.zipCode;
  let contact = req.body.contactNumber;
  let fields = req.body.interests;
  let str;
  if (Array.isArray(fields)) {
    str = "";
    for (i = 0; i < fields.length; i++) {
      str += fields[i] + ",";
    }
  } else str = fields;
  let instaid = req.body.instagramId;
  let youtubeid = req.body.youtubeId;
  let picpath;
  if (req.files) {
    picpath = req.files.ppic.name;
    let filepath = path + "/public/uploads/" + picpath;
    req.files.ppic.mv(filepath);
  } else {
    picpath = "not Uploaded";
  }
  let others = req.body.moreInterests;
  mysql.query(
    "insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      emailid,
      fname,
      lname,
      fullname,
      gender,
      dob,
      address,
      city,
      zipcode,
      contact,
      str,
      instaid,
      youtubeid,
      picpath,
      others,
    ],
    function (err) {
      if (err == null) resp.send("Data Saved to SQL");
      else resp.send(err.message);
    }
  );
});

app.get("/find-user-details", function (req, resp) {
  let emailid = req.query.email;
  mysql.query(
    "select * from iprofile where emailid =?",
    [emailid],
    function (err, resultJsonAry) {
      if (err != null) {
        resp.send(err.message);
        return;
      }
      console.log(resultJsonAry);
      resp.send(resultJsonAry); //sending array of json object 0-1
    }
  );
});
app.post("/update-pofile-details-to-sql", function (req, resp) {
  let emailid = req.body.email;
  let fname = req.body.firstName;
  let lname = req.body.lastName;
  let fullname = req.body.firstName + " " + req.body.lastName;
  let gender = req.body.gender;
  let dob = req.body.dob;
  let address = req.body.address;
  let city = req.body.city;
  let zipcode = req.body.zipCode;
  let contact = req.body.contactNumber;
  let fields = req.body.interests;
  let str;
  if (Array.isArray(fields)) {
    str = "";
    for (i = 0; i < fields.length; i++) {
      str += fields[i] + ",";
    }
  } else str = fields;
  let instaid = req.body.instagramId;
  let youtubeid = req.body.youtubeId;
  let picpath;
  if (req.files) {
    picpath = req.files.ppic.name;
    let path = __dirname + "/public/uploads/" + picpath;
    req.files.ppic.mv(path);
  } else {
    picpath = req.body.hdn;
  }
  let others = req.body.moreInterests;
  mysql.query(
    "update iprofile set fname=?, lname=?,fullname=?, gender=?, dob=?, address=?, city =?, zipcode =?, contact =?, fields =?, instaid =?, youtubeid =?, picpath =?, others =? where emailid =?",
    [
      fname,
      lname,
      fullname,
      gender,
      dob,
      address,
      city,
      zipcode,
      contact,
      str,
      instaid,
      youtubeid,
      picpath,
      others,
      emailid,
    ],
    function (err, result) {
      if (err == null) {
        //no error
        if (result.affectedRows >= 1) {
          // resp.send(result);
          resp.send("Your Data Updated");
        } else resp.send("Invalid Email ID");
      } else resp.send(err.message);
    }
  );
});
app.get("/insert-influencer-booking", function (req, resp) {
  let emailid = req.query.emailid;
  let eventtitle = req.query.eventtitle;
  let doe = req.query.doe;
  let tos = req.query.tos;
  let city = req.query.city;
  let venue = req.query.venue;
  // console.log(/eventtile);
  mysql.query(
    "insert into events(emailid, eventtitle, doe, tos, city, venue) values(?,?,?,?,?,?)",
    [emailid, eventtitle, doe, tos, city, venue],
    function (err) {
      if (err == null) resp.send("Data Saved");
      else resp.send(err.message);
    }
  );
});
app.get("/user-change-password", function (req, resp) {
  let email = req.query.email;
  let pwd = req.query.pwd;
  let newpwd = req.query.newpwd;
  console.log(
    `Received email: ${email}, old password: ${pwd}, new password: ${newpwd}`
  );
  mysql.query(
    "update users set pwd = ? where email = ? and pwd = ?",
    [newpwd, email, pwd],
    function (err, result) {
      if (err == null) {
        if (result.affectedRows) resp.send("Password changed");
        else resp.send("Invalid Password");
      } else {
        resp.send(err.message);
      }
    }
  );
});
app.get("/forgot-user-password", function (req, resp) {
  let email = req.query.txtEmail;
  mysql.query(
    "select * from users where email = ?",
    [email],
    function (err, resultJsonAry) {
      if (err == null) {
        if (resultJsonAry.length == 0) {
          resp.send("Invalid ID");
        } else {
          let pwd = resultJsonAry[0].pwd;
          let toemail = email;
          let subject = "Recovery Password Email";
          let emailUser = "sanchitmansa12@gmail.com";
          let emailPass = "ugxx nbcz komu yarv";
          let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: emailUser,
              pass: emailPass
            },
          });
          let mailOptions = {
            from: email,
            to: toemail,
            subject: subject,
            text: pwd
          };
          transporter.sendMail(mailOptions, (error) => {
            if (error == null) {
              resp.send("Email sent successfully!");
              return;
            }
            resp.send(error.message);
            
          });
        }
        return;
      } else {
        resp.send(err.message);
      }
      // console.log(resultJsonAry);
    }
  );
});
app.get("/Admin-dash",function(req,resp){
    resp.sendFile(path + "/public/Admin-Dash.html");
});
app.get("/all-user-record",function(req,resp){
  resp.sendFile(path + "/public/Admin-Users.html");
});
app.get("/fetch-all-users",function(req,resp){
      mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null)
        {
          resp.send(err.message);
          return;
        }
        resp.send(resultJsonAry);
      });
});
app.get("/fetch-status-unblock-user",function(req,resp){
  mysql.query("update  users set status = ? where email=?",[1,req.query.email],function(err){
    if(err!=null)
    {
      console.log(err.message);
      return;
    }
    resp.send("Unblocked");
  });
});
app.get("/fetch-status-block-user",function(req,resp){
  mysql.query("update  users set status = ? where email=?",[0,req.query.email],function(err){
    if(err!=null)
    {
      console.log(err.message);
      return;
    }
    resp.send("blocked");
  });
});
app.get("/delete-user",function(req,resp){
  mysql.query("delete from users where email=?",[req.query.email],function(err){
    if(err!=null)
    {
      console.log(err.message);
      return;
    }
    
  });
  
  mysql.query("delete from iprofile where emailid=?",[req.query.email],function(err){
    if(err!=null)
    {
      console.log(err.message);
      return;
    }
    
  });
  resp.send("Deleted");
});
app.get("/inluencer-console",function(req,resp){
  resp.sendFile(path + "/public/Admin-all-influ.html");
});
app.get("/fetch-all-influencer",function(req,resp){
  mysql.query("select * from iprofile",function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });
});
app.get("/fetch-searched-user",function(req,resp){
  mysql.query("select * from users where email = ?",[req.query.email],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });

});
app.get("/fetch-searched-iprofile",function(req,resp){
  mysql.query("select * from iprofile where emailid = ?",[req.query.email],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });

});

app.get("/fetch-searched-influencer",function(req,resp){
  mysql.query("select * from iprofile where fullname like ? ",["%"+req.query.name+"%"],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry)
  });

});

app.get("/fetch-allcities-influencer",function(req,resp){
  mysql.query("select distinct city from iprofile ",function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });

});
app.get("/fetch-one-cities-influencer",function(req,resp){
  mysql.query("select distinct city from iprofile where fields like ? ",["%"+req.query.field+"%"],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });

});

app.get("/fetch-filter-cities-field",function(req,resp){
  console.log(req.query.field);
  console.log(req.query.city);
  mysql.query("select * from iprofile where fields like ? and city = ?",["%"+req.query.field+"%",req.query.city],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });

});
app.get("/fetch-filter-field",function(req,resp){
  console.log(req.query.field);
  // console.log(req.query.city);
  mysql.query("select * from iprofile where fields like ?",["%"+req.query.field+"%"],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });
});
app.get("/fetch-filter-city",function(req,resp){
  // console.log(req.query.field);
  console.log(req.query.city);
  mysql.query("select * from iprofile where city =  ?",[req.query.city],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });
});

app.get("/event-manager",function(req,resp){
    resp.sendFile(path + "/public/Event-Manager.html");
});
app.get("/fetch-all-events",function(req,resp){
  mysql.query("select * from events where emailid =  ? and doe >= current_date()",[req.query.email],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });

});
app.get("/delete-event",function(req,resp){
  mysql.query("delete from events where eventid =  ? ",[req.query.eventid],function(err,result){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send("deleted");
  });

});
app.get("/fetch-all-past-events",function(req,resp){
 
  mysql.query("select * from events where emailid =  ? AND doe < CURRENT_DATE()",[req.query.email],function(err,resultJsonAry){
    if(err!=null)
    {
      resp.send(err.message);
      return;
    }
    // console.log(resultJsonAry);
    resp.send(resultJsonAry);
  });

});

app.get("/send-cprofile-details-to-sql",function(req,resp){
  let email = req.query.email;
  let firstname = req.query.firstname;
  let lastname = req.query.lastname;
  let fullname = firstname +" "+lastname;
  let gender = req.query.gender;
  let city = req.query.city;
  let state = req.query.state;
  let mobile = req.query.mobile;
  let org = req.query.org;
  console.log(req.query);
  mysql.query(
    "insert into cprofile values(?,?,?,?,?,?,?,?,?)",
    [email,firstname,lastname,fullname,gender,city,mobile,state,org],
    function (err) {
      if (err == null) resp.send("Data Saved to SQL");
      else resp.send(err.message);
    }
  );
});
app.get("/update-cprofile-details-to-sql",function(req,resp){
  let email = req.query.email;
  let firstname = req.query.firstname;
  let lastname = req.query.lastname;
  let fullname = firstname +" "+lastname;
  let gender = req.query.gender;
  let city = req.query.city;
  let state = req.query.state;
  let mobile = req.query.mobile;
  let org = req.query.org;
  console.log(req.query);
  mysql.query(
    "update  cprofile set fname = ?, lname = ?, fullname=?, gender=?, city = ?, mobile=?, state=?, org = ? where emailid = ?",
    [firstname,lastname,fullname,gender,city,mobile,state,org,email],
    function (err) {
      if (err == null) resp.send("Data Updated to SQL");
      else resp.send(err.message);
    }
  );
});
app.get("/set-cprofile-details",function(req,resp){
  mysql.query(
    "select * from cprofile where emailid = ?",
    [req.query.email],
    function (err,resultJasonArray) {
      if (err == null) resp.send(resultJasonArray);
      else resp.send(err.message);
    }
  );
});
app.get("/to-Customer-profile",function(req,resp){
  resp.sendFile(path + "/public/Customer-Profile.html");
});
app.get("/to-find-influencer",function(req,resp){
  resp.sendFile(path + "/public/Influ-Finder.html");
});
