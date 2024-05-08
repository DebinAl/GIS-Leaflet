<?php 

function getConnection(): PDO {
    $host = "localhost";
    $port = 3306;
    $database = "db_2105551107";
    $username = "2105551107";
    $password = "2105551107";

    return new PDO("mysql:host=$host:$port;dbname=$database", $username, $password);
}