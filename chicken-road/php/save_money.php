<?php
$user = $_POST['user'] ?? '';
$money = floatval($_POST['money'] ?? 0);
$file = "users/$user.json";

if (!file_exists($file)) {
  echo json_encode(['error' => 'User not found']);
  exit;
}

$data = json_decode(file_get_contents($file), true);
$data['money'] = $money;
file_put_contents($file, json_encode($data));
echo json_encode(['status' => 'ok']);
