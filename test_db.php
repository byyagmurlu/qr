<?php
require_once 'backend/api/config/config.php';
require_once 'backend/api/core/Database.php';
require_once 'backend/api/models/User.php';

use Models\User;

try {
    $u = new User();
    $user = $u->findByUsername('admin');
    print_r($user);
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
