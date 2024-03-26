<?php 

function getConnection(): PDO {
    $host = "gis_2105551107.local.net";
    $port = 3306;
    $database = "db_2105551107";
    $username = "2105551107";
    $password = "2105551107";

    return new PDO("mysql:host=$host:$port;dbname=$database", $username, $password);
}