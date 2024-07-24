create database project;
use project;
create table users(email varchar(60) primary key, pwd varchar(50), utype varchar(20), status int DEFAULT 1);
select *from users;
INSERT INTO users (email, pwd, utype) VALUES ('sanchitmansa12@gmail.com', 'securepassword', 'admin');
truncate table users;
update users set status = 0 where email = "sanchitmansa12@gmail.com";
create table iprofile(emailid varchar(60) primary key, fname varchar(60), lname varchar(60), gender varchar(10), dob date , address varchar(300), city varchar(50), zipcode varchar(60), contact varchar(15), fields varchar(200), instaid varchar(300), youtubeid varchar(300),  picpath varchar(200), others varchar(500));
select * from iprofile;
drop table iprofile;

