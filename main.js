// Ana Sayfa JavaScript

// Öncelikle localStorage'dan menuData'yı yüklemeyi dene
try {
    const storedMenuData = localStorage.getItem('menuData');
    if (storedMenuData) {
        const parsedMenuData = JSON.parse(storedMenuData);
        // Basit bir doğrulama: days ve dateRange alanları var mı?
        if (parsedMenuData && parsedMenuData.days && parsedMenuData.dateRange) {
            window.menuData = parsedMenuData;
            console.log('menuData localStorage\'dan yüklendi.');
        } else {
            console.warn('localStorage\'daki menuData formatı bozuk, varsayılan kullanılıyor.');
        }
    } else {
        console.log('localStorage\'da menuData bulunamadı, js/menu-data.js\'deki varsayılan kullanılacak.');
    }
} catch (error) {
    console.error('localStorage\'dan menuData yüklenirken hata oluştu:', error);
}

// Yemek zamanları için ikonlar ve başlıklar
const mealIcons = {
    sabah: '<i class="fas fa-sun"></i>',
    ogle: '<i class="fas fa-utensils"></i>',
    aksam: '<i class="fas fa-moon"></i>'
};

const mealTitles = {
    sabah: 'Sabah Kahvaltısı',
    ogle: 'Öğle Yemeği',
    aksam: 'Akşam Yemeği'
};

// Sayfa yüklendiğinde çalışacak ana fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yükleme animasyonu
    document.body.classList.add('page-loaded');
    
    // Tema ayarını kontrol et ve butonu ayarla
    checkTheme();
    setupThemeToggle(); // updateThemeButtonIcons'ı zaten çağırıyor
    
    // Yemek listesini göster
    if (typeof renderMenuList === 'function') {
        renderMenuList();
    }
    
    // Hover efektlerini ekle
    if (typeof addHoverEffects === 'function') {
        addHoverEffects();
    }

    // JSON Yükleme ve İndirme butonlarını ayarla
    if (typeof setupJsonControls === 'function') {
        setupJsonControls();
    }

    // Örnek JSON şablonunu göster
    if (typeof displayJsonTemplate === 'function') {
        displayJsonTemplate();
    }

    // Aktif günü vurgula ve kaydır (renderMenuList içinde de çağrılabilir ama ilk yükleme için burada da olabilir)
    if (typeof highlightCurrentDayAndScroll === 'function') {
        highlightCurrentDayAndScroll();
    }

    // Animasyonlar için IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.menu-day, .feature-card, .nutrition-card, .section-title, .section-subtitle').forEach(el => {
        observer.observe(el);
    });
    
    // Scroll progress bar'ı ekle
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // CSS animasyonları için stil ekle (Bu kısım zaten vardı, tekrar eklenmesine gerek yoksa kaldırılabilir)
    // Ancak tek DOMContentLoaded içinde olması daha iyi.
    const style = document.createElement('style');
    style.textContent = `
        /* Sayfa yükleme animasyonu */
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        body.page-loaded {
            opacity: 1;
        }
        /* Scroll progress bar */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: var(--gradient-primary); /* CSS değişkeni tanımlı olmalı */
            z-index: 9999;
            width: 0%;
            transition: width 0.2s ease;
        }
        /* Element animasyonları */
        .menu-day, .feature-card, .section-title, .section-subtitle {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .menu-day.animate, .feature-card.animate, .section-title.animate, .section-subtitle.animate {
            opacity: 1;
            transform: translateY(0);
        }
        /* Hover efektleri */
        .menu-day.hover-active {
            transform: translateY(-10px) scale(1.02); /* Hafifçe ayarlandı */
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); /* Hafifçe ayarlandı */
        }
        /* Gecikmeli animasyonlar */
        .menu-day:nth-child(1) { transition-delay: 0.1s; }
        .menu-day:nth-child(2) { transition-delay: 0.2s; }
        .menu-day:nth-child(3) { transition-delay: 0.3s; }
        .menu-day:nth-child(4) { transition-delay: 0.4s; }
        .menu-day:nth-child(5) { transition-delay: 0.5s; }
        .menu-day:nth-child(6) { transition-delay: 0.6s; }
        .menu-day:nth-child(7) { transition-delay: 0.7s; }
        
        .feature-card:nth-child(1) { transition-delay: 0.1s; }
        .feature-card:nth-child(2) { transition-delay: 0.2s; }
        .feature-card:nth-child(3) { transition-delay: 0.3s; }
        .feature-card:nth-child(4) { transition-delay: 0.4s; }
        
        /* Tema değiştirme butonu stilleri */
        .theme-switch {
            margin-left: auto; 
        }
        .theme-toggle-btn {
            background: var(--theme-button-bg, rgba(128, 128, 128, 0.1)); 
            border: 1px solid var(--theme-button-border-color, rgba(128, 128, 128, 0.2)); 
            color: var(--icon-color, var(--text-color)); 
            cursor: pointer;
            font-size: 1.1rem; /* İkon boyutu (örn: ~17-18px) */
            border-radius: 50%;
            width: 38px; /* Buton genişliği biraz küçültüldü */
            height: 38px; /* Buton yüksekliği biraz küçültüldü */
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden; 
            padding: 0; 
            transition: background-color 0.3s ease, border-color 0.3s ease; /* Geçiş eklendi */
        }
        .theme-toggle-btn:hover {
            background: var(--theme-button-hover-bg, rgba(128, 128, 128, 0.25));
            border-color: var(--theme-button-hover-border-color, rgba(128, 128, 128, 0.35));
        }
        body.light-theme .theme-toggle-btn {
             background: var(--theme-button-light-bg, rgba(0, 0, 0, 0.05)); 
             border-color: var(--theme-button-light-border-color, rgba(0, 0, 0, 0.1)); 
        }
        body.light-theme .theme-toggle-btn:hover {
             background: var(--theme-button-light-hover-bg, rgba(0, 0, 0, 0.12));
             border-color: var(--theme-button-light-hover-border-color, rgba(0, 0, 0, 0.22));
             /* Açık temada butonun kendi ikon rengini de burada belirleyebiliriz, eğer --icon-color değişkeni çalışmıyorsa */
             /* color: #2c3e50; */ /* Örnek koyu renk, --icon-color değişkenine güvenmek daha iyi */
        }

        /* Açık temada tema değiştirici ikonlarının rengini kesin olarak ayarlama */
        body.light-theme .theme-toggle-btn .fas {
            color: var(--icon-color, #34495e); /* --icon-color değişkenini kullan, yoksa fallback koyu renk */
        }

        .theme-toggle-btn .fas, /* Font Awesome solid ikonlarını hedefle */
        .theme-toggle-btn .fa-sun, 
        .theme-toggle-btn .fa-moon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
            transition: opacity 0.3s ease, transform 0.3s ease;
            line-height: 1; 
            font-weight: 900; /* Font Awesome 6 Solid için genellikle 900 */
            z-index: 1; /* İkonların buton arka planının üzerinde olmasını sağla */
        }
        .theme-toggle-btn .fa-sun {
            /* Başlangıçta görünür (koyu tema) */
            opacity: 1; 
        }
        .theme-toggle-btn .fa-moon {
            /* Başlangıçta gizli */
            opacity: 0;
            transform: translate(-50%, -50%) rotate(-90deg);
        }
        body.light-theme .theme-toggle-btn .fa-sun {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(90deg);
        }
        body.light-theme .theme-toggle-btn .fa-moon {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg);
        }

        /* Veri Yönetimi Bölümü Stilleri */
        .data-controls-section {
            padding: 20px 0;
            background-color: var(--background-alt-color, #f9f9f9); /* Temaya göre değişen alternatif arka plan */
            border-bottom: 1px solid var(--border-color, #eee);
        }
        .data-controls-section h2 {
            text-align: center;
            margin-bottom: 25px;
            color: var(--heading-color, #333);
        }
        .controls-flex-container {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            gap: 20px;
            flex-wrap: wrap; /* Küçük ekranlarda alt alta gelmesi için */
        }
        .control-group {
            flex-basis: 45%; /* İki sütun gibi davranması için, aralıkla beraber */
            min-width: 280px; /* Küçük ekranlarda minimum genişlik */
            padding: 15px;
            background-color: var(--card-bg-color, #fff);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .control-group label.btn, .control-group button.btn {
            display: block;
            width: 100%;
            margin-bottom: 10px;
            text-align: center;
            padding: 12px 15px;
            font-size: 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .btn-primary {
            background-color: var(--primary-color, #007bff);
            color: white;
            border: none;
        }
        .btn-primary:hover {
            background-color: var(--primary-dark-color, #0056b3);
            transform: translateY(-2px);
        }
        .btn-secondary {
            background-color: var(--secondary-color, #6c757d);
            color: white;
            border: none;
        }
        .btn-secondary:hover {
            background-color: var(--secondary-dark-color, #545b62);
            transform: translateY(-2px);
        }
        .control-info {
            font-size: 0.85rem;
            color: var(--text-muted-color, #666);
            margin-top: 0;
            text-align: center;
        }
        .json-template-info {
            margin-top: 30px;
            padding: 15px;
            background-color: var(--card-bg-color, #fff);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .json-template-info p strong {
             display: block;
             margin-bottom: 10px;
             text-align: center;
             font-size: 1.1rem;
        }
        #json-template-output {
            background-color: var(--code-bg-color, #f5f5f5); 
            border: 1px solid var(--border-color, #ddd); 
            padding: 15px;
            border-radius: 4px; 
            white-space: pre-wrap; 
            word-wrap: break-word; 
            max-height: 250px; /* Biraz daha yüksek */ 
            overflow-y: auto;
            color: var(--code-text-color, #333);
        }

        /* Genel İyileştirmeler */
        header .container {
            display: flex;
            justify-content: space-between; /* Logo ve tema butonu arasını açar */
            align-items: center;
        }
        header nav {
            /* Nav artık sadece tema butonunu içerdiği için özel bir ayara gerek kalmayabilir*/
            /* Gerekirse display: flex; align-items: center; eklenebilir */
        }

        /* Aktif Gün Vurgulama Stili */
        .menu-day.active-day {
            background-color: var(--active-day-dark-bg-color, #2E3A4D); /* Koyu tema için yumuşak mavi/gri */
            border: 2px solid var(--active-day-dark-border-color, #4A5B70); /* Koyu tema için biraz daha belirgin kenarlık */
            box-shadow: 0 6px 18px rgba(0,0,0,0.2);
            transform: scale(1.03); /* Hafifçe büyütme efekti */
            transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }
        body.light-theme .menu-day.active-day {
            background-color: var(--active-day-light-bg-color, #E0F2F7); /* Açık tema için açık camgöbeği/mavi */
            border-color: var(--active-day-light-border-color, #B3DCEF); /* Açık tema için biraz daha belirgin kenarlık */
            color: var(--active-day-light-text-color, #333); /* Açık tema için metin rengi, gerekirse ayarlanabilir */
        }
    `;
    // document.head.appendChild(style); // Bu satır zaten `index.html`'de linklenen CSS'ler ve `js/main.js` içindeki diğer stil eklemeleri ile çakışabilir.
                                       // Eğer bu stiller ayrı bir CSS dosyasında yönetilmiyorsa ve dinamik eklenmesi gerekiyorsa kalabilir.
                                       // Ancak tema buton stilleri için ayrı bir CSS dosyası veya mevcut style.css kullanmak daha iyi olabilir.
                                       // Şimdilik bu dinamik stil eklemesini koruyorum, ancak idealde CSS dosyasına taşınmalı.
    if (!document.querySelector('style[data-dynamic-styles]')) { // Tekrar eklenmesini önlemek için
        style.setAttribute('data-dynamic-styles', 'true');
        document.head.appendChild(style);
    }
});


// Yemek listesini HTML olarak oluşturma fonksiyonu
function renderMenuList() {
    const menuContainer = document.querySelector('.menu-container');
    if (!menuContainer) {
        console.error('Menu container not found!');
        return;
    }
    if (!menuData || !menuData.days || menuData.days.length === 0) {
        console.warn('Menu data is empty or not available.');
        menuContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Yemek listesi şu anda mevcut değil.</p>';
        return;
    }
    
    menuContainer.innerHTML = ''; // Önce mevcut içeriği temizle
    
    const sectionSubtitle = document.querySelector('.section-subtitle');
    if (sectionSubtitle && menuData.dateRange) {
        sectionSubtitle.textContent = menuData.dateRange + ' tarihleri arası';
    }
    
    menuData.days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'menu-day';
        dayElement.dataset.date = day.date; // Aktif günü bulmak için data attribute eklendi
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.innerHTML = `<h3>${day.name}</h3><p>${day.date}</p>`;
        dayElement.appendChild(dayHeader);
        
        const mealsContainer = document.createElement('div');
        mealsContainer.className = 'meals-container'; // Yemek zamanları için ek bir sarmalayıcı

        Object.keys(day.meals).forEach(mealTime => {
            const mealTimeElement = document.createElement('div');
            mealTimeElement.className = `meal-time meal-time-${mealTime}`; // mealTime'a özel class
            
            const mealTimeHeader = document.createElement('h4');
            mealTimeHeader.innerHTML = `${mealIcons[mealTime] || ''} ${mealTitles[mealTime] || mealTime}`;
            mealTimeElement.appendChild(mealTimeHeader);
            
            const mealItemsElement = document.createElement('ul'); // div yerine ul kullanmak daha semantik
            mealItemsElement.className = 'meal-items';
            
            day.meals[mealTime].forEach(item => {
                const mealItemElement = document.createElement('li'); // div yerine li
                mealItemElement.className = 'meal-item';
                mealItemElement.textContent = item;
                mealItemsElement.appendChild(mealItemElement);
            });
            
            mealTimeElement.appendChild(mealItemsElement);
            mealsContainer.appendChild(mealTimeElement);
        });
        dayElement.appendChild(mealsContainer);
        menuContainer.appendChild(dayElement);
    });
    
    // Hover efektlerini yeniden ekle (eğer dinamik olarak eklenen elemanlar için gerekliyse)
    if (typeof addHoverEffects === 'function') {
        addHoverEffects(); 
    }

    // Yemek listesi oluşturulduktan sonra aktif günü vurgula ve kaydır
    if (typeof highlightCurrentDayAndScroll === 'function') {
        highlightCurrentDayAndScroll();
    }
}

// Tema kontrol fonksiyonu
function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeStylesheet = document.getElementById('theme-style'); // light-theme.css
    
    if (!themeStylesheet) {
        console.error('Theme stylesheet (theme-style) not found!');
        return;
    }

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeStylesheet.removeAttribute('disabled');
    } else {
        // Varsayılan olarak koyu tema (veya localStorage'da 'dark' varsa)
        document.body.classList.remove('light-theme');
        themeStylesheet.setAttribute('disabled', 'true');
    }
    // updateThemeButtonIcons(); // setupThemeToggle içinde çağrılacak
}

// Tema değiştirme butonu ayarlama fonksiyonu
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-style');

    if (!themeToggle || !themeStylesheet) {
        console.error('Theme toggle button or theme stylesheet not found!');
        return;
    }
    
    themeToggle.addEventListener('click', function() {
        const isLightTheme = document.body.classList.toggle('light-theme');
        if (isLightTheme) {
            themeStylesheet.removeAttribute('disabled');
            localStorage.setItem('theme', 'light');
        } else {
            themeStylesheet.setAttribute('disabled', 'true');
            localStorage.setItem('theme', 'dark');
        }
        // updateThemeButtonIcons(); // Bu artık CSS ile yönetiliyor, butona tıklayınca body class'ı değişince CSS stilleri otomatik uygulanacak.
                                  // Ancak JS ile ikonları doğrudan değiştirmek isterseniz çağırabilirsiniz.
                                  // CSS'de .theme-toggle-btn i stilleri ve body.light-theme .theme-toggle-btn i stilleri bunu hallediyor.
    });
    
    // İlk yüklemede buton ikonlarını doğru ayarlamak için (CSS zaten body class'ına göre yapıyor olmalı)
    // updateThemeButtonIcons(); 
}

// Tema değiştirme butonunun ikonlarını güncelleme fonksiyonu (Artık CSS ile yönetiliyor ama JS ile de yapılabilir)
// function updateThemeButtonIcons() {
//     const themeToggle = document.getElementById('theme-toggle');
//     if (!themeToggle) return;

//     const sunIcon = themeToggle.querySelector('.fa-sun');
//     const moonIcon = themeToggle.querySelector('.fa-moon');

//     if (!sunIcon || !moonIcon) return;

//     if (document.body.classList.contains('light-theme')) {
//         // Açık tema: Ay ikonunu göster, Güneş ikonunu gizle
//         sunIcon.style.opacity = '0';
//         sunIcon.style.transform = 'translate(-50%, -50%) rotate(90deg)';
//         moonIcon.style.opacity = '1';
//         moonIcon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
//     } else {
//         // Koyu tema: Güneş ikonunu göster, Ay ikonunu gizle
//         moonIcon.style.opacity = '0';
//         moonIcon.style.transform = 'translate(-50%, -50%) rotate(90deg)';
//         sunIcon.style.opacity = '1';
//         sunIcon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
//     }
// }


// Hover efektlerini ekleme fonksiyonu
function addHoverEffects() {
    const menuDays = document.querySelectorAll('.menu-day');
    menuDays.forEach(day => {
        // Eski olay dinleyicilerini kaldır (eğer varsa, tekrar eklenmesini önlemek için)
        // Bu karmaşıklaşabilir, bunun yerine CSS :hover kullanmak daha basit olabilir.
        // Şimdilik basit bir class ekleme/çıkarma bırakıyorum.
        day.addEventListener('mouseenter', () => {
            day.classList.add('hover-active');
        });
        day.addEventListener('mouseleave', () => {
            day.classList.remove('hover-active');
        });
    });

    // Diğer hover efektleri eklenebilir (örn: .feature-card)
}

// Örnek JSON Şablonunu gösterme fonksiyonu
function displayJsonTemplate() {
    const templateOutputArea = document.getElementById('json-template-output');
    if (templateOutputArea && typeof menuData !== 'undefined') {
        try {
            // menuData objesini düzgün formatlı bir JSON string'ine çevir
            const jsonString = JSON.stringify(menuData, null, 2); // null ve 2 argümanları pretty-print için
            templateOutputArea.textContent = jsonString;
        } catch (error) {
            console.error('Error stringifying menuData for template:', error);
            templateOutputArea.textContent = 'Örnek JSON şablonu yüklenirken bir hata oluştu.';
        }
    }
}

// JSON yükleme ve indirme kontrollerini ayarlama fonksiyonu
function setupJsonControls() {
    const jsonUploadInput = document.getElementById('json-upload');
    const downloadJsonButton = document.getElementById('download-json-btn');

    if (jsonUploadInput) {
        jsonUploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const newMenuData = JSON.parse(e.target.result);
                        // Basit bir doğrulama (gerçek uygulamada daha kapsamlı olmalı)
                        if (newMenuData && newMenuData.days && Array.isArray(newMenuData.days)) {
                            window.menuData = newMenuData; // Global menuData'yı güncelle
                            renderMenuList(); // Listeyi yeniden oluştur
                            displayJsonTemplate(); // Yüklenen yeni verinin şablonunu da göster (isteğe bağlı)
                            alert('Yeni yemek listesi başarıyla yüklendi ve görüntülendi!');
                        } else {
                            alert('Yüklenen JSON dosyasının formatı geçersiz. Lütfen örnek şablona bakın.');
                        }
                    } catch (error) {
                        console.error('Error parsing JSON file:', error);
                        alert('JSON dosyası okunurken bir hata oluştu: ' + error.message);
                    }
                };
                reader.onerror = function() {
                    console.error('Error reading file.');
                    alert('Dosya okunurken bir hata oluştu.');
                };
                reader.readAsText(file);
            }
        });
    }

    if (downloadJsonButton) {
        downloadJsonButton.addEventListener('click', function() {
            if (typeof menuData !== 'undefined') {
                try {
                    const jsonString = JSON.stringify(menuData, null, 2);
                    const blob = new Blob([jsonString], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'menu-data.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    alert('Güncel yemek verileri menu-data.json olarak indirildi.');
                } catch (error) {
                    console.error('Error preparing JSON for download:', error);
                    alert('Veriler indirilirken bir hata oluştu: ' + error.message);
                }
            } else {
                alert('İndirilecek yemek verisi bulunamadı.');
            }
        });
    }
}

// Aktif Günü Vurgulama ve Kaydırma Fonksiyonu
function highlightCurrentDayAndScroll() {
    if (!menuData || !menuData.days) return;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için +1
    const year = today.getFullYear();
    const formattedToday = `${day}.${month}.${year}`;

    // Önceki aktif gün işaretini kaldır (varsa)
    const previouslyActive = document.querySelector('.menu-day.active-day');
    if (previouslyActive) {
        previouslyActive.classList.remove('active-day');
    }

    const menuDays = document.querySelectorAll('.menu-day[data-date]');
    let foundToday = false;
    menuDays.forEach(dayElement => {
        if (dayElement.dataset.date === formattedToday) {
            dayElement.classList.add('active-day');
            // Sayfanın ortasına doğru kaydırmak için ayarlar
            dayElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center', // 'start', 'center', 'end', or 'nearest'
                inline: 'nearest'
            });
            foundToday = true;
        }
    });

    if (foundToday) {
        console.log(`Bugünün tarihi (${formattedToday}) yemek listesinde bulundu ve vurgulandı.`);
    } else {
        console.log(`Bugünün tarihi (${formattedToday}) yemek listesinde bulunamadı.`);
    }
}

// Eğer admin.js gibi ayrı bir dosya yoksa ve admin.html ile ilgili
// scriptler buradaysa, onları da düzenlemek gerekebilir.
// Şimdilik sadece ana sayfa odaklı devam ediyorum.