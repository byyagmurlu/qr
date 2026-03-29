<?php
require_once __DIR__ . '/backend/api/core/Database.php';
$db = \Core\Database::getInstance();
try { @$db->execute("ALTER TABLE site_settings ADD COLUMN updated_by INTEGER"); } catch(Exception $e) {}
try { @$db->execute("ALTER TABLE site_settings ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP"); } catch(Exception $e) {}
try { @$db->execute("ALTER TABLE site_settings ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP"); } catch(Exception $e) {}
echo "Schema updated!\n";
