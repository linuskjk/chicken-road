# 🐔🔥 Chicken Road – The Risky Casino Clicker

Welcome to **Chicken Road**, a thrilling, web-based mini casino game where every click is a gamble and each step could bring you riches... or a fiery roast!

---

## 🎮 Gameplay

- You control a brave little **chicken**.
- Each click attempts to cross one **dangerous lane**.
- **Flames** may burn the chicken if you're unlucky.
- Survive and your **multiplier increases**!
- Play up to **20 rounds per run**.
- Walk away anytime to **cash out your profits**.

It's a high-stakes game of nerves, strategy, and pure chicken luck.

---

## 🛠 Features

- 🔐 **Account system** (username & password)
- 💰 **In-game currency** saved on server per user
- 🔄 **Persistent data** (money, session stats)
- 🔥 Animated **flames and chicken movement**
- 📱 Fully responsive — works on mobile & desktop
- 🎨 Styled like a retro arcade casino
- 💾 Optional: Export/import codes to share progress

---

## 🗂 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP + JSON file storage
- **Storage**: User data stored in `accounts/` folder on your server
- **Security**: No external APIs used — everything self-hosted

---

## 🚀 How to Run Locally

1. 🔧 Make sure you have a PHP server (like XAMPP, WAMP, or built-in PHP server)
2. 📁 Clone or extract this project into your `htdocs` (or equivalent) folder.
3. 🖥 Start your server and visit:

https://linuskjk.synology.me/chicken-road

4. ✅ Create an account and start playing!

---

## 🧩 Folder Structure

chicken-road/
├── index.html # Main game file
├── style.css # Styling and animations
├── script.js # Game logic and UI
├── /assets # Images & flame/chicken sprites
├── /php # Backend endpoints
│ ├── login.php
│ ├── register.php
│ ├── save_money.php
│ ├── load_money.php
│ └── account_utils.php
└── /accounts # JSON files per user (saved on server)

yaml
Copy
Edit

---

## ⚙️ Server Setup Notes

- All user data is stored as `.json` files in `/accounts`.
- Make sure this folder is **writable** by the PHP server.
- No database or external dependencies are required.

---

## 💡 Future Ideas (Optional)

- 🏆 Leaderboards (local or global)
- 🎁 Daily login rewards
- 🐔 Unlockable skins or backgrounds
- 🧠 AI-generated random events per round
- 🔒 2FA (two-factor authentication)
- 💬 In-game chat with taunts or win messages
