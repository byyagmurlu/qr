<?php
require_once 'backend/api/core/Database.php';
require_once 'backend/api/models/Product.php';
require_once 'backend/api/models/Translation.php';
$p = new Models\Product();
$p->getAllPublic('en');
echo "Done";
