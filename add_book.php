<?php
include "db.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){

$title = $_POST["title"] ?? "";
$author = $_POST["author"] ?? "";
$edition = $_POST["edition"] ?? "";
$quantity = $_POST["quantity"] ?? 0;

$sql = "INSERT INTO books (title,author,edition,quantity) 
VALUES ('$title','$author','$edition','$quantity')";

if($conn->query($sql) === TRUE){
echo "success";
}
else{
echo "error";
}

}

?>