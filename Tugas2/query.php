<?php

require_once __DIR__ . "/DBConnection.php";

//try to establish a connection to a database
try {
    $connection = getConnection();
} catch (PDOException $e) {
    echo "Error connecting to database: " . $e->getMessage() . PHP_EOL;
    return;
}

// Query untuk mengambil data
$sql_query = "SELECT id, nama, alamat, latitude, longitude FROM points";

try {
    $result = $connection->query($sql_query);
    
    $data = [];
    foreach ($result as $row) {
        $data[] = [
            'id' => $row['id'],
            'nama' => $row['nama'],
            'alamat' => $row['alamat'],
            'latitude' => $row['latitude'],
            'longitude' => $row['longitude']
        ];
    }

    // Konversi array menjadi JSON
    header('Content-Type: application/json');
    echo json_encode($data);
} catch (PDOException $e) {
    echo "Error when querying data: " . $e->getMessage() . PHP_EOL;
}

$connection = null;