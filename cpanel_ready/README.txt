# YEDİDEĞİRMENLER TABİAT PARKI - QRMENÜ CPANEL KURULUM DOSYALARI

Bu klasör, "www.yedidegirmenler.com/menu" adresinde cPanel sunucunuzda (veya herhangi bir paylaşımlı sunucuda) doğrudan çalışacak şekilde SİZE ÖZEL DEĞİŞKELERLE hazırlanmıştır. Veritabanı bilgileriniz tam olarak konfigüre edilmiştir.

## KURULUM ADIMLARI

### 1. Dosyaların Yüklenmesi
1. cPanel'e giriş yapın ve "Dosya Yöneticisi"ne (File Manager) gidin.
2. `public_html` klasörünü açın. İçerisinde `menu` adında bir klasör oluşturun (ya da ana dizine direkt atacaksanız klasörsüz devam edin).
3. Bu klasörün (cpanel_ready) İÇİNDEKİ tüm dosyaları (api/, assets/, .htaccess, index.html vb.) doğrudan oluşturduğunuz `menu` klasörünün içine YÜKLEYİN.

### 2. Veritabanının Kurulması (MySQL - yediridvan_qr)
1. cPanel'de "MySQL® Veritabanları" sayfasına gidin.
2. Veritabanını oluşturun: `yediridvan_qr`
3. Kullanıcı oluşturun: `yediridvan_qr` (Şifre: `$)@k~cL5?Dv2` )
4. Kullanıcıyı oluşturduğunuz veritabanına BAĞLAYIN (Tüm Ayrıcalıklar/All Privileges).
5. cPanel anasayfasından "phpMyAdmin"e girin.
6. Sol listeden `yediridvan_qr` isimli veritabanını seçin.
7. Üst menüden "İçe Aktar" (Import) seçeneğine tıklayın.
8. Yüklediğiniz dosyalar arasındaki `qrmenu_cpanel.sql` dosyasını seçip "Git" (Go) tuşuna basarak aktarımı tamamlayın.
*(Mevcut tüm ürün, görsel ve kategoriler bu dosya sayesinde veri tabanınıza kopyalanacak)*.

---

## ⚡ HEPSİ BU KADAR!
Tebrikler! frontend (react) / API endpoint / database bilgileri vs her şeyi güncel ve size özel cPanele uygun hale getirildi. Artık ayarlarla uğraşmanıza gerek yoktur, direk dosyaları "menu" dizinine yüklemeniz yetecektir.

**Yönetim Paneli Giriş Bilgileri:**
- **URL:** https://www.yedidegirmenler.com/menu/admin/login
- **Kullanıcı adı:** admin
- **Şifre:** admin123
*(Lütfen giriş yaptıktan sonra "Profil & Güvenlik" sekmesinden şifrenizi mutlaka değiştirin!)*
