# Chicago RP Staff Application Form

Tek sayfalık, tamamen İngilizce, Google Forms görünümlü başvuru formu.
**Backend gerektirir** — `server.py` (Python) ile çalışır. Önerilen host: **Render**.
Ziyaretçiler formu düzenleyemez; sorular yalnızca koddan (`app.js`) değiştirilir.

## Render'a deploy

1. Bu projeyi GitHub'a it (tüm dosyalar).
2. https://render.com → **New → Web Service** → GitHub reponu bağla.
3. Ayarlar:
   - **Runtime:** Python
   - **Build Command:** (boş bırak — gerek yok)
   - **Start Command:** `python3 server.py`
4. **Environment** sekmesine şu değişkenleri ekle (gizli tutulur, kodda görünmez):

   | Key | Value |
   |---|---|
   | `EMAIL_METHOD` | `formsubmit` |
   | `EMAIL_TO` | seninmailin@gmail.com |

   (Alternatif yöntemler: `web3forms` + `WEB3FORMS_ACCESS_KEY`, `formspree` + `FORMSPREE_FORM_ID`, `smtp` + `SMTP_USER`/`SMTP_PASS`.)
5. Deploy bitince Render sana `https://....onrender.com` adresi verir → form orada.

> Not: `PORT` değişkenini Render otomatik verir; `server.py` onu okur (0.0.0.0'a bağlar).

## E-posta aktivasyonu (FormSubmit — tek seferlik)

1. Formu bir kez doldurup gönder.
2. `EMAIL_TO`'ya yazdığın mailde **"Activate Form"** başlıklı mail gelir
   (spam'e de bak) → linke **BİR KEZ** tıkla.
3. Ondan sonra tüm başvurular otomatik gelir.

## Özellikler

- **IP kaydı + ban:** aynı IP'den 48 saat içinde ikinci başvuru engellenir
  (sunucu tarafında, aşılamaz). 2 gün sonra ban kalkar.
- **IP silme:** IP, başvurudan 7 gün sonra kayıttan otomatik silinir.
- **Başvuru kaydı:** `submissions.json` içinde tutulur (ip, zaman, tarayıcı, cevaplar).
- **E-posta:** her başvuru FormSubmit üzerinden mailine düşer.
- **Otomatik kaydetme:** cevaplar tarayıcıda (localStorage) saklanır; Alt+F4
  yapıp dönünce geri yüklenir.
- **Discord/Roblox doğrulama:** kullanıcı bilgileri girince sunucu API'den
  avatar + isim çekip "Is this the correct user?" diye sorar.
- **Ülke seçici:** ~250 ülke/bölge (bayrak resmi + GMT offset), yazarken arama.

## Render bilinen sınırlar

- **Free tier:** servis 15 dk boşta kalınca uykuya geçer; ilk istekte ~30-60 sn
  açılması sürer (soğuk başlatma).
- **Dosya sistemi geçicidir:** Render yeniden deploy'da dosyaları sıfırlayabilir;
  yani `submissions.json` kaybolabilir. Asıl kayıt mailindir. Kalıcı veritabanı
  istersen Supabase/Postgres bağlayabilirim.

## Soruları / bölümleri düzenleme

`app.js` üstündeki `FORM_CONFIG.sections` dizisini düzenle. Bölüm = başlık +
açıklama + sorular:

```js
{ id: "s1", title: "Personal Information", description: "...",
  questions: [ { id: "q1", type: "text", title: "...", required: true } ] }
```

Soru tipleri: `text`, `paragraph`, `multiple_choice`, `checkboxes`, `dropdown`,
`linear_scale`, `country`.
- Seçenekli: `options: ["A","B"]` · Skala: `scaleMax: 5` · Sayı: `inputType:"number"`, `min`, `max`.

## Ülke seçici

- `countries.json` (~250 ülke/bölge; bayrak resmi + timezone, GMT+3 formatı).
- Listeyi güncellemek için `gen_countries.py` → `python3 gen_countries.py`.

## Sayfalar

- `index.html` — form (altta Privacy Policy linki + Discord ikonu).
- `privacy_policy.html` — gizlilik politikası.
