<?php
$c = file_get_contents('bulk_debug.log');
$c = mb_convert_encoding($c, 'UTF-8', 'UTF-16LE');
echo $c;
