<?php
include "db.php";

$title = $_POST['title'];
$author = $_POST['author'];
$edition = $_POST['edition'];
$quantity = $_POST['quantity'];

$sql = "INSERT INTO books(title,author,edition,quantity)
VALUES('$title','$author','$edition','$quantity')";

$conn->query($sql);

echo "success";
?>