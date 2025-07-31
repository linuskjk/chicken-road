<?php
$user = $_POST['user'] ?? '';
$pass = $_POST['pass'] ?? '';
$file = "users/$user.json";

if (!file_exists($file)) {
  echo json_encode(['error' => 'User not found']);
  exit;
}

$data = json_decode(file_get_contents($file), true);

if (!password_verify($pass, $data['password'])) {
  echo json_encode(['error' => 'Wrong password']);
  exit;
}

echo json_encode(['status' => 'ok', 'money' => $data['money']]);
