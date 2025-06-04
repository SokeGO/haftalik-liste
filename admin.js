// Yönetim Paneli JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tema ayarını kontrol et
    checkTheme();
    
    // Tema değiştirme butonunu ayarla
    setupThemeToggle();
    
    // Giriş işlemlerini ayarla
    setupLogin();
    
    // Admin sekmelerini başlat
    initAdminTabs();
    
    // Menü düzenleyiciyi oluştur
    renderMenuEditor();
    
    // Tarih ayarlarını başlat
    initDateSettings();
    
    // Dışa/İçe aktarma işlevlerini başlat
    initExportImport();
    
    // Önizleme sekmesini başlat
    initPreview();
    
    // Kaydet ve sıfırla butonlarını başlat
    initAdminActions();
});

// Admin sekmeleri arasında geçiş
function initAdminTabs() {
    const tabItems = document.querySelectorAll('.admin-menu li');
    const tabContents = document.querySelectorAll('.admin-tab');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            // Aktif sekme sınıfını kaldır
            tabItems.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Tıklanan sekmeyi aktif yap
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Menü düzenleyiciyi oluştur
function renderMenuEditor() {
    const menuEditor = document.querySelector('.menu-editor');
    if (!menuEditor) return;
    
    // Her gün için düzenleme alanı oluştur
    menuData.days.forEach((day, dayIndex) => {
        const editorDay = document.createElement('div');
        editorDay.className = 'editor-day';
        editorDay.dataset.dayIndex = dayIndex;
        
        // Gün başlığı
        const dayHeader = document.createElement('div');
        dayHeader.className = 'editor-day-header';
        dayHeader.innerHTML = `
            <h4>${day.name} (${day.date})</h4>
        `;
        editorDay.appendChild(dayHeader);
        
        // Yemek zamanları
        Object.keys(day.meals).forEach(mealTime => {
            const mealTimeElement = document.createElement('div');
            mealTimeElement.className = 'editor-meal-time';
            mealTimeElement.dataset.mealTime = mealTime;
            
            // Yemek zamanı başlığı
            const mealHeader = document.createElement('div');
            mealHeader.className = 'editor-meal-header';
            mealHeader.innerHTML = `
                <h5>${mealIcons[mealTime]} ${mealTitles[mealTime]}</h5>
            `;
            mealTimeElement.appendChild(mealHeader);
            
            // Yemek listesi
            const mealItemsElement = document.createElement('div');
            mealItemsElement.className = 'editor-meal-items';
            
            day.meals[mealTime].forEach((item, itemIndex) => {
                const mealItemElement = document.createElement('div');
                mealItemElement.className = 'editor-meal-item';
                mealItemElement.innerHTML = `
                    <input type="text" value="${item}" data-item-index="${itemIndex}">
                    <button type="button" class="remove-meal-item"><i class="fas fa-times"></i></button>
                `;
                mealItemsElement.appendChild(mealItemElement);
            });
            
            // Yeni yemek ekleme butonu
            const addMealItem = document.createElement('div');
            addMealItem.className = 'add-meal-item';
            addMealItem.innerHTML = `<i class="fas fa-plus"></i> Yemek Ekle`;
            addMealItem.addEventListener('click', function() {
                addNewMealItem(mealItemsElement, dayIndex, mealTime);
            });
            
            mealTimeElement.appendChild(mealItemsElement);
            mealTimeElement.appendChild(addMealItem);
            editorDay.appendChild(mealTimeElement);
        });
        
        menuEditor.appendChild(editorDay);
    });
    
    // Yemek silme butonlarını etkinleştir
    initRemoveMealItems();
    
    // Yemek düzenleme inputlarını etkinleştir
    initEditMealItems();
}

// Yemek silme butonlarını etkinleştir
function initRemoveMealItems() {
    const removeButtons = document.querySelectorAll('.remove-meal-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mealItem = this.parentElement;
            const mealItems = mealItem.parentElement;
            const mealTime = mealItems.parentElement.dataset.mealTime;
            const dayIndex = mealItems.parentElement.parentElement.dataset.dayIndex;
            const itemIndex = mealItem.querySelector('input').dataset.itemIndex;
            
            // Yemeği diziden sil
            menuData.days[dayIndex].meals[mealTime].splice(itemIndex, 1);
            
            // DOM'dan kaldır
            mealItem.remove();
            
            // Kalan öğelerin indekslerini güncelle
            updateMealItemIndexes(mealItems, dayIndex, mealTime);
        });
    });
}

// Yemek düzenleme inputlarını etkinleştir
function initEditMealItems() {
    const mealInputs = document.querySelectorAll('.editor-meal-item input');
    mealInputs.forEach(input => {
        input.addEventListener('change', function() {
            const mealTime = this.closest('.editor-meal-time').dataset.mealTime;
            const dayIndex = this.closest('.editor-day').dataset.dayIndex;
            const itemIndex = this.dataset.itemIndex;
            
            // Yemek adını güncelle
            menuData.days[dayIndex].meals[mealTime][itemIndex] = this.value;
        });
    });
}

// Yeni yemek öğesi ekle
function addNewMealItem(mealItemsElement, dayIndex, mealTime) {
    // Yeni öğeyi veri yapısına ekle
    menuData.days[dayIndex].meals[mealTime].push('Yeni Yemek');
    
    // Yeni öğe indeksi
    const newItemIndex = menuData.days[dayIndex].meals[mealTime].length - 1;
    
    // DOM'a yeni öğe ekle
    const mealItemElement = document.createElement('div');
    mealItemElement.className = 'editor-meal-item';
    mealItemElement.innerHTML = `
        <input type="text" value="Yeni Yemek" data-item-index="${newItemIndex}">
        <button type="button" class="remove-meal-item"><i class="fas fa-times"></i></button>
    `;
    mealItemsElement.appendChild(mealItemElement);
    
    // Yeni eklenen öğenin input'una focus yap
    const input = mealItemElement.querySelector('input');
    input.focus();
    input.select();
    
    // Yeni eklenen öğenin silme butonunu etkinleştir
    const removeButton = mealItemElement.querySelector('.remove-meal-item');
    removeButton.addEventListener('click', function() {
        menuData.days[dayIndex].meals[mealTime].splice(newItemIndex, 1);
        mealItemElement.remove();
        updateMealItemIndexes(mealItemsElement, dayIndex, mealTime);
    });
    
    // Yeni eklenen öğenin input değişikliğini izle
    input.addEventListener('change', function() {
        menuData.days[dayIndex].meals[mealTime][newItemIndex] = this.value;
    });
}

// Yemek öğelerinin indekslerini güncelle
function updateMealItemIndexes(mealItemsElement, dayIndex, mealTime) {
    const inputs = mealItemsElement.querySelectorAll('input');
    inputs.forEach((input, index) => {
        input.dataset.itemIndex = index;
    });
}

// Tarih ayarlarını başlat
function initDateSettings() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const updateDatesButton = document.getElementById('update-dates');
    
    if (!startDateInput || !endDateInput || !updateDatesButton) return;
    
    // Mevcut tarih aralığını parse et
    const dateRange = menuData.dateRange.split('-');
    if (dateRange.length === 2) {
        const startParts = dateRange[0].split('.');
        const endParts = dateRange[1].split('.');
        
        if (startParts.length === 3 && endParts.length === 3) {
            // Tarih formatını yyyy-mm-dd'ye dönüştür
            const startDate = `${startParts[2]}-${startParts[1]}-${startParts[0]}`;
            const endDate = `${endParts[2]}-${endParts[1]}-${endParts[0]}`;
            
            startDateInput.value = startDate;
            endDateInput.value = endDate;
        }
    }
    
    // Tarih güncelleme butonunu etkinleştir
    updateDatesButton.addEventListener('click', function() {
        if (!startDateInput.value || !endDateInput.value) {
            alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
            return;
        }
        
        // Tarihleri dd.mm.yyyy formatına dönüştür
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        const formattedStartDate = `${String(startDate.getDate()).padStart(2, '0')}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${startDate.getFullYear()}`;
        const formattedEndDate = `${String(endDate.getDate()).padStart(2, '0')}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${endDate.getFullYear()}`;
        
        // Tarih aralığını güncelle
        menuData.dateRange = `${formattedStartDate}-${formattedEndDate}`;
        
        // Başarı mesajı göster
        alert('Tarih aralığı güncellendi!');
    });
}

// Dışa/İçe aktarma işlevlerini başlat
function initExportImport() {
    const exportButton = document.getElementById('export-json');
    const importFileInput = document.getElementById('import-file');
    const importButton = document.getElementById('import-json');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            if (typeof menuData !== 'undefined') {
                try {
                    const jsonString = JSON.stringify(menuData, null, 2);
                    const blob = new Blob([jsonString], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    // Tarih aralığından veya sabit bir isimden dosya adı oluşturulabilir
                    const dateRangeString = menuData.dateRange ? menuData.dateRange.replace(/\./g, '-') : 'yemek-listesi';
                    a.download = `menu-data-${dateRangeString}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    alert('Güncel yemek verileri ' + a.download + ' olarak indirildi.');
                } catch (error) {
                    console.error('Error preparing JSON for download:', error);
                    alert('Veriler indirilirken bir hata oluştu: ' + error.message);
                }
            } else {
                alert('İndirilecek yemek verisi bulunamadı.');
            }
        });
    }

    if (importFileInput && importButton && fileNameDisplay) {
        let selectedFile = null;

        importFileInput.addEventListener('change', function(event) {
            selectedFile = event.target.files[0];
            if (selectedFile) {
                fileNameDisplay.textContent = selectedFile.name;
                importButton.disabled = false;
            } else {
                fileNameDisplay.textContent = 'Dosya seçilmedi';
                importButton.disabled = true;
            }
        });

        importButton.addEventListener('click', function() {
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const newMenuData = JSON.parse(e.target.result);
                        if (newMenuData && newMenuData.days && Array.isArray(newMenuData.days) && newMenuData.dateRange) {
                            window.menuData = newMenuData; // Global menuData'yı güncelle
                            
                            // Değişikliği localStorage'a da kaydet ki index.html de alabilsin
                            localStorage.setItem('menuData', JSON.stringify(window.menuData));

                            if (typeof renderMenuEditor === 'function') {
                                document.querySelector('.menu-editor').innerHTML = ''; // Önceki editörü temizle
                                renderMenuEditor();
                            }
                            if (typeof updatePreview === 'function') {
                                updatePreview();
                            }
                            // Tarih ayarları inputlarını da güncelle
                            if (typeof initDateSettings === 'function') {
                                // initDateSettings fonksiyonu içindeki mantık doğrudan çağrılabilir veya ayrıştırılabilir.
                                const startDateInput = document.getElementById('start-date');
                                const endDateInput = document.getElementById('end-date');
                                if(startDateInput && endDateInput && menuData.dateRange) {
                                    const dateRange = menuData.dateRange.split('-');
                                    if (dateRange.length === 2) {
                                        const startParts = dateRange[0].split('.');
                                        const endParts = dateRange[1].split('.');
                                        if (startParts.length === 3 && endParts.length === 3) {
                                            startDateInput.value = `${startParts[2]}-${startParts[1]}-${startParts[0]}`;
                                            endDateInput.value = `${endParts[2]}-${endParts[1]}-${endParts[0]}`;
                                        }
                                    }
                                }
                            }
                            alert('Yeni yemek listesi başarıyla yüklendi. Menü düzenleyici ve önizleme güncellendi.');
                            fileNameDisplay.textContent = 'Dosya seçilmedi';
                            importButton.disabled = true;
                            selectedFile = null;
                            importFileInput.value = ''; // Dosya inputunu sıfırla
                        } else {
                            alert('Yüklenen JSON dosyasının formatı geçersiz. Lütfen dateRange ve days alanlarını kontrol edin.');
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
                reader.readAsText(selectedFile);
            }
        });
    }
}

// Önizleme sekmesini başlat
function initPreview() {
    const previewTab = document.getElementById('preview');
    if (!previewTab) return;
    
    // Önizleme sekmesine tıklandığında içeriği güncelle
    document.querySelector('[data-tab="preview"]').addEventListener('click', updatePreview);
}

// Önizleme içeriğini güncelle
function updatePreview() {
    const previewContainer = document.querySelector('#preview-tab .preview-container');
    if (!previewContainer) return;
    
    // Önizleme içeriğini temizle
    previewContainer.innerHTML = '';
    
    // Menü önizlemesini oluştur
    renderMenuList(previewContainer, menuData);
}

// Tema kontrol fonksiyonu
function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeStylesheet = document.getElementById('theme-style');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeStylesheet) {
            themeStylesheet.removeAttribute('disabled');
        }
    } else {
        document.body.classList.remove('light-theme');
        if (themeStylesheet) {
            themeStylesheet.setAttribute('disabled', true);
        }
    }
}

// Tema değiştirme butonu ayarlama fonksiyonu
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-style');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('light-theme')) {
                // Karanlık temaya geç
                document.body.classList.remove('light-theme');
                if (themeStylesheet) {
                    themeStylesheet.setAttribute('disabled', true);
                }
                localStorage.setItem('theme', 'dark');
            } else {
                // Açık temaya geç
                document.body.classList.add('light-theme');
                if (themeStylesheet) {
                    themeStylesheet.removeAttribute('disabled');
                }
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// Giriş işlemlerini ayarlama fonksiyonu
function setupLogin() {
    const loginOverlay = document.getElementById('login-overlay');
    const adminContent = document.getElementById('admin-content');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    
    // Daha önce giriş yapılmış mı kontrol et
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
        // Daha önce giriş yapılmışsa direkt içeriği göster
        loginOverlay.style.display = 'none';
        adminContent.style.display = 'block';
    }
    
    // Enter tuşu ile giriş yapma
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Giriş butonu ile giriş yapma
    if (loginBtn) {
        loginBtn.addEventListener('click', checkPassword);
    }
    
    // Şifre kontrolü fonksiyonu
    function checkPassword() {
        const password = passwordInput.value;
        
        if (password === '4353') {
            // Doğru şifre
            loginOverlay.style.display = 'none';
            adminContent.style.display = 'block';
            sessionStorage.setItem('isLoggedIn', 'true');
            loginError.textContent = '';
        } else {
            // Yanlış şifre
            loginError.textContent = 'Hatalı şifre! Lütfen tekrar deneyin.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
}

// Kaydet ve sıfırla butonlarını başlat
function initAdminActions() {
    const saveButton = document.getElementById('save-changes');
    const resetButton = document.getElementById('reset-changes');
    
    if (!saveButton || !resetButton) return;
    
    // Değişiklikleri kaydet butonu
    saveButton.addEventListener('click', function() {
        // Değişiklikleri localStorage'a kaydet
        localStorage.setItem('menuData', JSON.stringify(menuData));
        
        // Başarı mesajı göster
        alert('Değişiklikler başarıyla kaydedildi!');
    });
    
    // Değişiklikleri sıfırla butonu
    resetButton.addEventListener('click', function() {
        if (confirm('Tüm değişiklikler sıfırlanacak. Emin misiniz?')) {
            // localStorage'dan kayıtlı veriyi kontrol et
            const savedData = localStorage.getItem('menuData');
            if (savedData) {
                // Kayıtlı veriyi yükle
                const parsedData = JSON.parse(savedData);
                menuData.dateRange = parsedData.dateRange;
                menuData.days = parsedData.days;
                
                // Arayüzü yenile
                const menuEditor = document.querySelector('.menu-editor');
                menuEditor.innerHTML = '';
                renderMenuEditor();
                
                // Tarih ayarlarını güncelle
                initDateSettings();
                
                // Önizlemeyi güncelle
                updatePreview();
                
                alert('Değişiklikler sıfırlandı!');
            } else {
                alert('Kaydedilmiş bir veri bulunamadı!');
            }
        }
    });
}