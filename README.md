# Adana Suluca Açık Ceza İnfaz Kurumu - Haftalık Yemek Listesi

Bu proje, Adana Suluca Açık Ceza İnfaz Kurumu'nun haftalık yemek listesini gösteren responsive bir web uygulamasıdır. Uygulama, yemek listesini JSON formatında saklar ve kullanıcıya estetik bir arayüz sunar.

## Özellikler

- Responsive tasarım (mobil, tablet ve masaüstü cihazlarda uyumlu)
- Haftalık yemek listesi görüntüleme
- Admin paneli ile yemek listesi yönetimi
- Yemek listesini JSON formatında dışa/içe aktarma
- Animasyonlar ve görsel efektler
- Slider ile görsel sunumu

## Dosya Yapısı

```
├── index.html          # Ana sayfa
├── admin.html          # Yönetim paneli
├── css/
│   ├── style.css       # Ana stil dosyası
│   └── admin.css       # Yönetim paneli stilleri
├── js/
│   ├── menu-data.js    # Yemek listesi verileri
│   ├── main.js         # Ana sayfa JavaScript
│   └── admin.js        # Yönetim paneli JavaScript
└── images/
    ├── food1.svg       # Yemek görseli 1
    ├── food2.svg       # Yemek görseli 2
    └── food3.svg       # Yemek görseli 3
```

## Kullanım

### Ana Sayfa

Ana sayfa (`index.html`), haftalık yemek listesini görüntüler. Sayfa yüklendiğinde, yemek listesi otomatik olarak gösterilir ve slider çalışmaya başlar.

### Yönetim Paneli

Yönetim paneli (`admin.html`), yemek listesini düzenlemek için kullanılır. Panelde şu özellikler bulunur:

1. **Yemek Listesi Düzenleme**: Haftalık yemek listesini düzenleme
2. **Tarih Ayarları**: Yemek listesi tarih aralığını güncelleme
3. **Dışa/İçe Aktarma**: Yemek listesini JSON formatında dışa/içe aktarma
4. **Önizleme**: Düzenlenen yemek listesini önizleme

## Kurulum

Bu proje, herhangi bir sunucu gerektirmez ve GitHub Pages üzerinde yayınlanabilir. Kurulum için şu adımları izleyin:

1. Projeyi GitHub'a yükleyin
2. GitHub Pages ayarlarından yayınlayın

Ya da yerel bir web sunucusu kullanarak projeyi çalıştırabilirsiniz:

```bash
# Python ile basit bir HTTP sunucusu başlatma
python -m http.server
```

## Özelleştirme

### Yemek Listesi Verilerini Güncelleme

Yemek listesi verileri `js/menu-data.js` dosyasında bulunur. Bu dosyayı manuel olarak düzenleyebilir veya admin panelini kullanarak güncelleyebilirsiniz.

### Stilleri Özelleştirme

Uygulamanın görünümünü özelleştirmek için `css/style.css` dosyasını düzenleyebilirsiniz. Ana renkler ve diğer stil değişkenleri dosyanın başında `:root` seçicisi içinde tanımlanmıştır.

## Tarayıcı Uyumluluğu

Uygulama, modern tarayıcıların tüm sürümleriyle uyumludur:

- Chrome
- Firefox
- Safari
- Edge

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## İletişim

Herhangi bir soru veya geri bildirim için lütfen iletişime geçin.