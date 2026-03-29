<?php
require_once 'core/Database.php';
require_once 'config/config.php';
$db = \Core\Database::getInstance();
$db->execute("DELETE FROM translations");
echo "All translations cleared. You can now re-run the AI Translation.\n";
