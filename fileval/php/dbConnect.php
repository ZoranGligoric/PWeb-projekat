<?php
$connection = mysqli_connect('localhost', 'root', '');
if (!$connection){
    die("Database Connection Failed" . $connection->error);
}
$select_db = mysqli_select_db($connection, 'db');
if (!$select_db){
    die("Database Selection Failed" . $connection->error);
}
?>