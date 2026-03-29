<?php
require_once __DIR__ . '/backend/api/core/Database.php';
$db = \Core\Database::getInstance();

// Add menu_layout setting if not exists
$check = $db->fetchOne("SELECT id FROM site_settings WHERE setting_key = 'menu_layout'");
if (!$check) {
    $db->execute("INSERT INTO site_settings (setting_key, setting_value, setting_type, is_editable) VALUES (?, ?, ?, ?)",
        ['menu_layout', 'v1', 'text', 1]);
}

// Add primary_color and secondary_color for "Elementor-like" customization
$settings = [
    ['primary_color', '#2d5016', 'color'],
    ['secondary_color', '#d4a574', 'color'],
    ['header_layout', 'centered', 'text'],
    ['footer_text', 'Keyifli lezzetler dileriz.', 'text'],
];

foreach ($settings as [$key, $val, $type]) {
    $check = $db->fetchOne("SELECT id FROM site_settings WHERE setting_key = ?", [$key]);
    if (!$check) {
        $db->execute("INSERT INTO site_settings (setting_key, setting_value, setting_type, is_editable) VALUES (?, ?, ?, ?)",
            [$key, $val, $type, 1]);
    }
}

echo "Design settings added!\n";
