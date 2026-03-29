<?php
require_once 'backend/api/core/Database.php';
require_once 'backend/api/models/Translation.php';
$m = new Models\Translation();
$m->set('en', 'product', 23, 'serving_size', 'Test Portion EN');
$m->set('en', 'allergen', 1, 'name', 'Test Allergen EN');
echo "Done";
