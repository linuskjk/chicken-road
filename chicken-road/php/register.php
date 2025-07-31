<?php
$user = $_POST['user'] ?? '';
$pass = $_POST['pass'] ?? '';

if (!$user || !$pass) {
  echo json_encode(['error' => 'Missing fields']);
  exit;
}

$file = "users/$user.json";
if (file_exists($file)) {
  echo json_encode(['error' => 'User already exists']);
  exit;
}

$data = [
  'password' => password_hash($pass, PASSWORD_DEFAULT),
  'money' => 10.0
];
file_put_contents($file, json_encode($data));
echo json_encode(['status' => 'ok']);
