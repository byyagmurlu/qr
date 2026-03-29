# QR Menü — cPanel Deployment Kılavuzu

## 📁 Klasör Yapısı (cPanel'de)

```
public_html/
│
├── index.html              ← frontend build çıktısı (dist/ içeriği)
├── assets/                 ← frontend build assets
├── .htaccess               ← frontend SPA routing için
│
└── api/                    ← backend klasörü
    ├── .htaccess           ← API yönlendirme için
    ├── index.php
    ├── config/
    │   └── config.php      ← ⚠️ config.example.php'den kopyalanır, MYSQL bilgileri girilir
    ├── controllers/
    ├── core/
    ├── models/
    ├── seeds/
    └── uploads/
```

---

## 🚀 Adım Adım Kurulum

### 1. Frontend Build (Lokal Makinede)

```bash
cd frontend
npm run build
```

`frontend/dist/` klasörü oluşur. İçindekiler `public_html/` köküne yüklenir.

### 2. Backend'i cPanel'e Yükle

`backend/api/` klasörünün tüm içeriğini `public_html/api/` klasörüne yükleyin.

### 3. `config.php` Oluştur

`public_html/api/config/config.example.php` dosyasını `config.php` olarak kopyalayın ve MySQL bilgilerini doldurun:

```php
define('DB_DRIVER', 'mysql');
define('DB_HOST', 'localhost');
define('DB_USER', 'cpanel_db_kullanici');
define('DB_PASS', 'gizli_sifre');
define('DB_NAME', 'cpanel_db_adi');

define('JWT_SECRET', 'COK_GIZLI_UZUN_BIR_STRING_BURAYA');
define('GEMINI_API_KEY', 'GEMINI_API_ANAHTARINIZ');
define('ALLOWED_ORIGINS', 'https://yourdomain.com');
```

### 4. MySQL Veritabanı Oluştur

cPanel'de:
1. "MySQL Databases" → Yeni veritabanı oluştur
2. Kullanıcı oluştur + veritabanına bağla
3. PHP ile schema oluştur (aşağıdaki komutu çalıştır):

```bash
php api/seeds/Seeder.php
```

### 5. .htaccess Dosyaları

`public_html/.htaccess` (SPA routing):

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

`public_html/api/.htaccess` (API routing):

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [QSA,L]
```

### 6. `vite.config.js` Production URL'ini Güncelle

`frontend/vite.config.js` yerine frontend'de API URL'i ayarla.  
`frontend/src/services/api.js` dosyasında base URL'i production'a çevir:

```js
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

ve `.env.production` oluştur:

```
VITE_API_URL=https://yourdomain.com/api
```

---

## 🔐 Güvenlik Kontrol Listesi (Production)

- [ ] `JWT_SECRET` değiştirildi (en az 32 karakter rastgele string)
- [ ] `GEMINI_API_KEY` set edildi
- [ ] `ALLOWED_ORIGINS` sadece sizin domaininiz (`https://yourdomain.com`)
- [ ] `error_reporting` kapalı (`ini_set('display_errors', 0)`)
- [ ] `uploads/` klasörü yazılabilir ama PHP çalıştıramaz
- [ ] HTTPS aktif (SSL sertifikası)
- [ ] Admin şifresi değiştirildi (varsayılan `admin123` kullanılmıyor)
- [ ] SQLite dosyası `public_html` dışında (MySQL'e geçince bu sorun ortadan kalkar)

---

## 📊 Önemli Notlar

- **Şifreler:** bcrypt (cost=12) ile hash'lenir — MD5/SHA1 kullanılmaz, çok daha güvenli.
- **Login kilidi:** 5 başarısız denemede 15 dakika hesap kilitlenir.
- **JWT:** 7 gün geçerli, `HS256` ile imzalanır.
- **SQL Injection:** Tüm sorgular PDO prepared statement kullanır.
- **XSS:** Response headers ile korunur.
