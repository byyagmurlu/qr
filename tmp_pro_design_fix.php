<?php
require_once __DIR__ . '/backend/api/core/Database.php';
$db = \Core\Database::getInstance();

$newSettings = [
    ['header_layout', 'centered', 'text'],
    ['header_opacity', '0.8', 'number'],
    ['header_height', '120', 'number'],
    ['footer_layout', '3', 'number'],
    ['social_whatsapp', '', 'text'],
    ['social_instagram', '', 'text'],
    ['social_facebook', '', 'text'],
    ['social_maps', '', 'text'],
    ['google_font', 'Outfit', 'text'],
];

foreach ($newSettings as [$key, $val, $type]) {
    $check = $db->fetchOne("SELECT id FROM site_settings WHERE setting_key = ?", [$key]);
    if (!$check) {
        $db->execute("INSERT INTO site_settings (setting_key, setting_value, setting_type, is_editable) VALUES (?, ?, ?, ?)",
            [$key, $val, $type, 1]);
    }
}

echo "Pro design settings added!\n";
