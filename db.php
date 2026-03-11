<?php

$conn = new mysqli("localhost","root","","lms_db");

if($conn->connect_error){
die("Database Connection Failed");
}

?>