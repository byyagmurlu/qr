<?php
$c = file_get_contents('manual_bulk_out.txt');
$c = mb_convert_encoding($c, 'UTF-8', 'UTF-16LE');
echo $c;
