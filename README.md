# Simple Chat App with React + TypeScript + Vite

Code ini merupakan contoh dari implementasi integrasi API berdasarkan video yang sudah aku buat:
1.  [Video Login API](https://www.tiktok.com/@programmer_toddler/video/7469115930132352274?is_from_webapp=1&sender_device=pc&web_id=7452189884342846994)
2. [Video Chat Websocket](https://www.tiktok.com/@programmer_toddler/video/7470020222515186999?is_from_webapp=1&sender_device=pc&web_id=7452189884342846994)


Web apps yang aku buat ini sangat simple, hanya ada proses login dan bagian chat. Tanpa router, tanpa state management, tanpa persist data & tanpa logout process.
Kalian bisa kembangkan codenya, apa aja sih yang bisa dikembangkan?
1. Simpan akses token ke localstorage & proses logout (hapus token dari localstorage)
2. Simpan akses token menggunakan redux + redux persist & proses logout (hapus token dari redux persist)
3. Gunakan React Router untuk handle routing page
4. Implementasi protected route sehingga halaman chat tidak bisa di akses oleh user yang belum login


## Cara Clone & Running
### Clone Code
Copy script di bawah ini ke terminal atau command prompt kalian
```
git clone https://github.com/Quadra-Karya-Santosa/chat-example.git && cd /chat-example
```

### Running Project
Lakukan instalasi modules dengan script ini:
```
yarn install
```
Running dengan script ini:
```
yarn dev
```
Lalu kalian tinggal buka browser dan [click link ini](http://localhost:3000)

Selamat belajar & explore