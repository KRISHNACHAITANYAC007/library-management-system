<?php
include "db.php";

$result = $conn->query("SELECT * FROM books");

$books = [];

while($row = $result->fetch_assoc()){
$books[] = $row;
}

echo json_encode($books);
?>