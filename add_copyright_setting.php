<?php
require_once 'backend/api/core/Database.php';
$db = Core\Database::getInstance();
$db->execute("INSERT OR IGNORE INTO site_settings (setting_key, setting_value, setting_type, is_editable) VALUES ('footer_copyright', '© 2024 Yedideğirmenler. Tüm Hakları Saklıdır.', 'text', 1)");
echo "Done";
