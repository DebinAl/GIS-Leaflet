<?php

require_once __DIR__ . "/DBConnection.php";

//try to establish a connection to a database
try {
    $connection = getConnection();
} catch (PDOException $e) {
    echo "Error connecting to database: " . $e->getMessage() . PHP_EOL;
    return;
}

//getting the value from javascript
if (isset ($_POST)) {
    $data = file_get_contents("php://input");
    $data = json_decode($data, true);

    if ($data["jenis"] == "insert") {
        $id = $data["id"];
        $nama = $data["nama"];
        $alamat = $data["alamat"];
        $lat = $data["lat"];
        $lng = $data["lng"];

        $sql_insert = <<<SQL
            INSERT INTO points (id, nama, alamat, latitude, longitude)
            VALUES ('$id', '$nama', '$alamat', '$lat', '$lng')
            ON DUPLICATE KEY UPDATE nama = "$nama", alamat = "$alamat";
        SQL;

        try {
            echo "Row affected: " . $connection->exec($sql_insert);
        } catch (PDOException $e) {
            echo "Error when inserting data: " . $e->getMessage() . PHP_EOL;
        }

    } elseif ($data["jenis"] == "delete") {
        $id = $data["id"];
        
        $sql_delete = "DELETE FROM points WHERE id = '$id'";
        
        try {
            echo "Row affected: " . $connection->exec($sql_delete);
        } catch (PDOException $e) {
            echo "Error when deleting data: " . $e->getMessage() . PHP_EOL;
        }
    }
}




$connection = null;