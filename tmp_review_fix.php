<?php
require_once __DIR__ . '/backend/api/core/Database.php';
$db = \Core\Database::getInstance();

$check = $db->fetchOne("SELECT id FROM site_settings WHERE setting_key = 'review_link'");
if (!$check) {
    $db->execute("INSERT INTO site_settings (setting_key, setting_value, setting_type, is_editable) VALUES (?, ?, ?, ?)",
        ['review_link', '', 'text', 1]);
}

echo "Review link setting added!\n";
