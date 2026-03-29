<?php
try {
    $db = new PDO('sqlite:backend/api/database/qrmenu.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('ALTER TABLE admin_users ADD COLUMN login_attempts INTEGER DEFAULT 0');
    echo "SUCCESS\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
