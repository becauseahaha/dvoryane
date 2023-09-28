<?php
define('EMAIL', 'because.ahaha@gmail.com'); // КОМУ БУДЕТ ПРИХОДИТЬ РЕЗЕРВ

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

$message = "
<p>Имя: <b>{$_GET['name']}</b></p>
<p>Телефон: <b>{$_GET['phone']}</b></p>
<p>Гостей: <b>{$_GET['guests']}</b></p>
<p>Дата и время: <b>{$_GET['date']} {$_GET['time']}</b></p>
";

mail(EMAIL, 'Резерв', $message, $headers);

echo json_encode([]);