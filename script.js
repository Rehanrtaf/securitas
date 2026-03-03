// 1. Data Saham
// 1. Data Saham & Aset Kripto (Dengan Logo)
// 1. Data Saham & Aset Kripto (Dengan Harga Pasar Saat Ini & Logo)
// Asumsi Kurs: 1 USD = Rp 16.300
const stockData = [
    { ticker: "BBCA", value: 672500000, color: '#d4af37', logo: "https://logo.clearbit.com/bca.co.id", price: 9950, type: 'ID_STOCK' },
    { ticker: "NVDA", value: 281400000, color: '#76b900', logo: "https://logo.clearbit.com/nvidia.com", price: 2119000 /* ~$130 */, type: 'US_STOCK' },
    { ticker: "BRPT", value: 142200000, color: '#2ecc71', logo: "https://logo.clearbit.com/barito.co.id", price: 1120, type: 'ID_STOCK' },
    { ticker: "ETH", value: 97550000, color: '#627eea', logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png", price: 55420000 /* ~$3400 */, type: 'CRYPTO' },
    { ticker: "TLKM", value: 85000000, color: '#e74c3c', logo: "https://logo.clearbit.com/telkom.co.id", price: 3100, type: 'ID_STOCK' },
    { ticker: "ASII", value: 72000000, color: '#3498db', logo: "https://logo.clearbit.com/astra.co.id", price: 4600, type: 'ID_STOCK' },
    { ticker: "GOTO", value: 45000000, color: '#00ff88', logo: "https://logo.clearbit.com/gotocompany.com", price: 50, type: 'ID_STOCK' },
    { ticker: "BBNI", value: 68000000, color: '#f39c12', logo: "https://logo.clearbit.com/bni.co.id", price: 5200, type: 'ID_STOCK' },
    { ticker: "UNVR", value: 31000000, color: '#9b59b6', logo: "https://logo.clearbit.com/unilever.co.id", price: 2800, type: 'ID_STOCK' },
    { ticker: "ADRO", value: 54000000, color: '#1abc9c', logo: "https://logo.clearbit.com/adaro.com", price: 2900, type: 'ID_STOCK' },
    { ticker: "AMMN", value: 92000000, color: '#34495e', logo: "https://logo.clearbit.com/amman.co.id", price: 11000, type: 'ID_STOCK' },
    { ticker: "ICBP", value: 58000000, color: '#ecf0f1', logo: "https://logo.clearbit.com/indofood.com", price: 10500, type: 'ID_STOCK' }
];

// --- PENGATURAN MATA UANG GLOBAL ---
let isUSD = false;
const USD_EXCHANGE_RATE = 16300; // Asumsi 1 USD = Rp 16.300

// Fungsi untuk mengganti mata uang saat sakelar diklik
function toggleCurrency() {
    const toggle = document.getElementById('currency-toggle');
    if (!toggle) return;
    
    isUSD = toggle.checked;
    
    // Ubah warna label IDR / USD agar menyala sesuai pilihan
    document.getElementById('label-idr').classList.toggle('active', !isUSD);
    document.getElementById('label-usd').classList.toggle('active', isUSD);
    
    // Render ulang seluruh tabel dan saldo dengan format baru
    renderTable();
}

// Mesin Pemformat Uang Otomatis (Mengubah IDR ke USD secara instan)
// 4. Render Tabel Aset (Terkoneksi dengan Konverter Mata Uang)
function renderTable() {
    const tableBody = document.getElementById('stock-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    let totalValue = 0;

    stockData.forEach((stock, index) => {
        totalValue += stock.value;
        
        // KALKULASI JUMLAH KEPEMILIKAN
        let amountText = "";
        let totalShares = stock.value / stock.price;

        if (stock.type === 'ID_STOCK') {
            let lots = Math.floor(totalShares / 100);
            amountText = `${lots.toLocaleString('id-ID')} Lot`;
        } else if (stock.type === 'CRYPTO') {
            amountText = `${totalShares.toFixed(4)} ETH`;
        } else {
            amountText = `${totalShares.toFixed(2)} Shares`;
        }

        // Simulasi rata-rata harga beli (IDR)
        const avgPriceIDR = stock.price * (0.85 + (Math.random() * 0.1)); 
        const profitIDR = stock.value - (totalShares * avgPriceIDR);
        const isProfit = profitIDR >= 0;

        const animationDelay = index * 0.1;

        tableBody.innerHTML += `
            <tr style="animation-delay: ${animationDelay}s; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="display: flex; align-items: center; gap: 12px; padding: 12px 15px; cursor: pointer;" onclick="openFocusModal('${stock.ticker}', ${stock.value}, '${stock.color}')">
                    <img src="${stock.logo}" 
                         style="width: 26px; height: 26px; min-width: 26px; border-radius: 50%; object-fit: contain; background-color: #ffffff; border: 1px solid #444; padding: 2px;" 
                         onerror="this.src='https://cdn-icons-png.flaticon.com/512/2666/2666505.png'" 
                         alt="${stock.ticker}">
                    <span style="font-weight: bold; color: #fff; letter-spacing: 1px;">${stock.ticker}</span>
                </td>
                
                <td style="padding: 12px 15px;">${amountText}</td>
                
                <td style="padding: 12px 15px;">${formatMoney(avgPriceIDR)}</td>
                
                <td class="sensitive-data" style="padding: 12px 15px; color: ${stock.color}; font-weight: bold;">${formatMoney(stock.value)}</td>
                
                <td class="sensitive-data" style="padding: 12px 15px; color: ${isProfit ? '#00ff88' : '#ff3b30'}; font-weight: bold;">
                    ${isProfit ? '+' : ''}${formatMoney(Math.abs(profitIDR))}
                </td>
                
                <td style="padding: 12px 15px;">
                    <button class="btn-action btn-buy" onclick="openModal('BUY', '${stock.ticker}')" style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; color: #00ff88; padding: 5px 10px; border-radius: 4px; font-size: 10px; cursor: pointer;">BUY</button>
                    <button class="btn-action btn-sell" onclick="openModal('SELL', '${stock.ticker}')" style="background: rgba(255, 59, 48, 0.1); border: 1px solid #ff3b30; color: #ff3b30; padding: 5px 10px; border-radius: 4px; font-size: 10px; margin-left: 5px; cursor: pointer;">SELL</button>
                </td>
            </tr>
        `;
    });

    // Update Saldo Utama di Header Dashboard (Konversi Otomatis)
    const totalBal = document.getElementById('total-balance');
    const totalProf = document.getElementById('total-profit-val');
    
    if(totalBal) totalBal.innerText = formatMoney(totalValue);
    if(totalProf) totalProf.innerText = formatMoney(totalValue * 0.12); // Simulasi Profit 12%
}
// Deklarasikan variabel grafik agar bisa diakses fitur ubah warna
let perfChartInstance;

// 2. Inisialisasi Grafik
function initCharts() {
    // --- Grafik Garis (Performance) ---


    // --- Grafik Donat (Allocation) ---
    const ctxAlloc = document.getElementById('allocationChart').getContext('2d');
    new Chart(ctxAlloc, {
        type: 'doughnut',
        data: {
            labels: stockData.map(s => s.ticker),
            datasets: [{
                data: stockData.map(s => s.value),
                backgroundColor: stockData.map(s => s.color),
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#a0a0a0', padding: 20 } }
            }
        }
    });
}
// 3. Format Uang Rupiah
function formatIDR(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

// 4. Render Tabel Aset & Tombol Aksi (Versi Lengkap & Rapi)
// 4. Render Tabel Aset & Tombol Aksi (Anti-Glitch Logo)
// 4. Render Tabel Aset (Perhitungan Lot/Shares Presisi dari Harga Pasar)
function renderTable() {
    const tableBody = document.getElementById('stock-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    let totalValue = 0;

    stockData.forEach((stock, index) => {
        totalValue += stock.value;
        
        // KALKULASI JUMLAH KEPEMILIKAN BERDASARKAN HARGA SAAT INI
        let amountText = "";
        let totalShares = stock.value / stock.price; // Jumlah lembar / koin

        if (stock.type === 'ID_STOCK') {
            // Jika Saham Indonesia, tampilkan dalam bentuk LOT (1 Lot = 100 lembar)
            let lots = Math.floor(totalShares / 100);
            amountText = `${lots.toLocaleString('id-ID')} Lot`;
        } else if (stock.type === 'CRYPTO') {
            // Jika Kripto, tampilkan dengan 4 angka desimal
            amountText = `${totalShares.toFixed(4)} ETH`;
        } else {
            // Jika Saham AS (Fraksional), tampilkan dengan 2 desimal
            amountText = `${totalShares.toFixed(2)} Shares`;
        }

        // Simulasi rata-rata harga beli (Avg Price) sedikit lebih rendah untuk ilusi Profit
        const avgPrice = stock.price * (0.85 + (Math.random() * 0.1)); 
        const profit = stock.value - (totalShares * avgPrice);
        const isProfit = profit >= 0;

        const animationDelay = index * 0.1;

        tableBody.innerHTML += `
            <tr style="animation-delay: ${animationDelay}s; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="display: flex; align-items: center; gap: 12px; padding: 12px 15px; cursor: pointer;" onclick="openFocusModal('${stock.ticker}', ${stock.value}, '${stock.color}')">
                    <img src="${stock.logo}" 
                         style="width: 26px; height: 26px; min-width: 26px; border-radius: 50%; object-fit: contain; background-color: #ffffff; border: 1px solid #444; padding: 2px;" 
                         onerror="this.src='https://cdn-icons-png.flaticon.com/512/2666/2666505.png'" 
                         alt="${stock.ticker}">
                    <span style="font-weight: bold; color: #fff; letter-spacing: 1px;">${stock.ticker}</span>
                </td>
                
                <td style="padding: 12px 15px;">${amountText}</td>
                
                <td style="padding: 12px 15px;">Rp ${avgPrice.toLocaleString('id-ID', {maximumFractionDigits: 0})}</td>
                
                <td class="sensitive-data" style="padding: 12px 15px; color: ${stock.color}; font-weight: bold;">Rp ${stock.value.toLocaleString('id-ID')}</td>
                
                <td class="sensitive-data" style="padding: 12px 15px; color: ${isProfit ? '#00ff88' : '#ff3b30'}; font-weight: bold;">
                    ${isProfit ? '+' : ''}Rp ${profit.toLocaleString('id-ID', {maximumFractionDigits: 0})}
                </td>
                
                <td style="padding: 12px 15px;">
                    <button class="btn-action btn-buy" onclick="openModal('BUY', '${stock.ticker}')" style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; color: #00ff88; padding: 5px 10px; border-radius: 4px; font-size: 10px; cursor: pointer;">BUY</button>
                    <button class="btn-action btn-sell" onclick="openModal('SELL', '${stock.ticker}')" style="background: rgba(255, 59, 48, 0.1); border: 1px solid #ff3b30; color: #ff3b30; padding: 5px 10px; border-radius: 4px; font-size: 10px; margin-left: 5px; cursor: pointer;">SELL</button>
                </td>
            </tr>
        `;
    });

    // Update Dashboard Header
    const totalBal = document.getElementById('total-balance');
    const totalProf = document.getElementById('total-profit-val');
    if(totalBal) totalBal.innerText = 'Rp ' + totalValue.toLocaleString('id-ID');
    if(totalProf) totalProf.innerText = 'Rp ' + (totalValue * 0.12).toLocaleString('id-ID');
}

// 5. Logika Modal Pop-up Interaktif
function openModal(action, ticker) {
    const modal = document.getElementById('transactionModal');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');

    const actionColor = action === 'BUY' ? '#00ff88' : '#d4af37';

    title.innerText = `${action} ORDER - ${ticker}`;
    message.innerHTML = `Anda akan mengeksekusi order <strong style="color: ${actionColor};">${action}</strong> untuk aset saham <strong style="color: #fff;">${ticker}</strong> di harga pasar saat ini.<br><br>Apakah Anda ingin melanjutkan?`;

    // Reset tombol jika sebelumnya sudah sukses
    const confirmBtn = document.querySelector('.btn-confirm');
    confirmBtn.style.display = "inline-block";
    confirmBtn.innerText = "Eksekusi";
    document.querySelector('.btn-cancel').innerText = "Batal";

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('transactionModal');
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('modal-message').innerHTML = "Detail transaksi akan muncul di sini.";
    }, 300);
}

function confirmTransaction() {
    const message = document.getElementById('modal-message');
    const confirmBtn = document.querySelector('.btn-confirm');

    confirmBtn.innerText = "Memproses...";
    confirmBtn.style.opacity = "0.7";

    setTimeout(() => {
        message.innerHTML = `
            <div style="text-align:center;">
                <span style="font-size:40px; color:#d4af37;">✓</span><br>
                <strong style="color: #d4af37; font-size: 18px;">Transaksi Berhasil Dieksekusi!</strong><br><br>
                <span style="color: #a0a0a0;">Sistem MG Securitas telah memproses pesanan Anda dan akan tercatat di History.</span>
            </div>
        `;
        confirmBtn.style.opacity = "1";
        confirmBtn.style.display = "none";
        document.querySelector('.btn-cancel').innerText = "Tutup";
    }, 1500);
}

// 7. Fungsi Jam & Tanggal Real-Time
function updateClock() {
    const now = new Date();

    // Format Tanggal (Contoh: 25 Feb 2026)
    const optionsDate = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', optionsDate);

    // Format Waktu (Contoh: 14:05:09)
    const timeString = now.toLocaleTimeString('id-ID', { hour12: false });

    document.getElementById('current-date').innerText = dateString;
    document.getElementById('current-time').innerText = timeString;
}

// Jalankan fungsi updateClock setiap 1 detik (1000 milidetik)
setInterval(updateClock, 1000);

// 10. Fungsi Running Stock Ticker
function initTicker() {
    const tickerContent = document.getElementById('ticker-content');
    let tickerHTML = '';
    if (!tickerContent) return;

    // Looping data saham yang ada
    stockData.forEach(stock => {
        // Simulasi fluktuasi harga acak (naik/turun)
        const isUp = Math.random() > 0.3; // 70% kemungkinan hijau
        const changePct = (Math.random() * 4).toFixed(2);
        const colorClass = isUp ? 'ticker-up' : 'ticker-down';
        const arrow = isUp ? '▲' : '▼';
        const sign = isUp ? '+' : '-';

        tickerHTML += `
            <div class="ticker-item">
                <span style="color: #fff;">${stock.ticker}</span> 
                <span class="${colorClass}">${arrow} ${sign}${changePct}%</span>
            </div>
        `;
    });

    // Kita gandakan isinya agar pergerakan pitanya tidak terputus (seamless loop)
    tickerContent.innerHTML = tickerHTML + tickerHTML + tickerHTML;
}

// 13. Fungsi Dream Asset Tracker
function initDreamAsset() {
    // Menghitung total seluruh aset portofolio
    let totalValue = stockData.reduce((sum, stock) => sum + stock.value, 0);
    const targetValue = 4500000000; // Target Harga GT-R R35: Rp 4,5 Miliar

    // Kalkulasi persentase
    let progressPct = (totalValue / targetValue) * 100;
    if (progressPct > 100) progressPct = 100; // Maksimal 100%

    // Set teks nominal dan persentase
    document.getElementById('current-saved').innerText = `Terkumpul: ${formatIDR(totalValue)}`;
    document.getElementById('progress-pct').innerText = progressPct.toFixed(1) + '%';

    // Jalankan animasi bar dengan sedikit jeda agar terlihat keren
    setTimeout(() => {
        document.getElementById('dream-progress').style.width = progressPct + '%';
    }, 600);
}

// 14. Fungsi AI Market Sentiment Indicator
function initAISentiment() {
    const badge = document.getElementById('ai-sentiment-badge');
    const text = document.getElementById('ai-text');

    // Simulasi AI sedang menganalisis selama 2 detik pertama
    setTimeout(() => {
        // AI mulai memberikan sinyal (Update setiap 5 detik)
        setInterval(() => {
            // Karena ini portofolio mewah, kita buat 70% kemungkinan Bullish
            const isBullish = Math.random() > 0.3;

            if (isBullish) {
                badge.className = 'ai-sentiment bullish';
                text.innerText = 'AI Sentiment: BULLISH';
            } else {
                badge.className = 'ai-sentiment bearish';
                text.innerText = 'AI Sentiment: BEARISH';
            }
        }, 5000);

        // Eksekusi pertama kali setelah loading
        badge.className = 'ai-sentiment bullish';
        text.innerText = 'AI Sentiment: BULLISH';

    }, 2000);
}

// 15. Fungsi Render Riwayat Aktivitas (Timeline)
const activitiesData = [
    { type: 'dividend', title: 'Dividen Tunai BBCA', desc: 'Pembayaran dividen final tahun buku 2025.', value: '+ Rp 15.500.000', time: 'Hari ini, 09:30 WIB', colorClass: 'dividend', valClass: 'positive' },
    { type: 'buy', title: 'Beli NVDA (Nvidia)', desc: 'Eksekusi order beli di harga pasar ($720/lembar).', value: '- Rp 164.000.000', time: 'Kemarin, 21:15 WIB', colorClass: 'buy', valClass: 'negative' },
    { type: 'sell', title: 'Jual BRPT (Barito Pacific)', desc: 'Take profit parsial otomatis (500 Lot).', value: '+ Rp 49.000.000', time: '23 Feb 2026, 10:45 WIB', colorClass: 'sell', valClass: 'positive' },
    { type: 'buy', title: 'Auto-Invest AMMN', desc: 'Pembelian rutin bulanan terpicu oleh sistem.', value: '- Rp 15.000.000', time: '20 Feb 2026, 09:00 WIB', colorClass: 'buy', valClass: 'negative' }
];

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    let html = '';
    if (!container) return;

    activitiesData.forEach((act, index) => {
        const delay = index * 0.15; // Jeda animasi agar muncul berurutan
        html += `
            <div class="timeline-item" style="animation-delay: ${delay}s">
                <div class="timeline-dot ${act.colorClass}"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-title">${act.title}</span>
                        <span class="timeline-time">${act.time}</span>
                    </div>
                    <p class="timeline-desc">${act.desc}</p>
                    <span class="timeline-value ${act.valClass} sensitive-data">${act.value}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 18. Fungsi Penggerak Grafik Real-Time (Live Chart)
function startLiveChart() {
    setInterval(() => {
        if (!perfChartInstance) return;

        const chartData = perfChartInstance.data.datasets[0].data;
        const chartLabels = perfChartInstance.data.labels;

        // Ambil nilai terakhir di grafik
        let lastValue = chartData[chartData.length - 1];

        // Simulasi pergerakan pasar (Naik turun antara -20 sampai +35 juta)
        // Kita buat sedikit lebih condong naik (Bullish)
        let change = (Math.random() * 55) - 20;
        let newValue = lastValue + change;

        // Buat label waktu saat ini (Real-time)
        let now = new Date();
        let timeLabel = String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        // Masukkan data baru ke paling kanan
        chartLabels.push(timeLabel);
        chartData.push(newValue);

        // Hapus data paling kiri agar grafik terus berjalan (maksimal simpan 8 titik)
        if (chartLabels.length > 8) {
            chartLabels.shift();
            chartData.shift();
        }

        // Sinkronkan warna background jika tema diubah
        const currentColor = document.documentElement.style.getPropertyValue('--accent') || '#d4af37';
        perfChartInstance.data.datasets[0].borderColor = currentColor;

        // Update grafik agar bergerak
        perfChartInstance.update();

    }, 3000); // 3000 ms = grafik bergerak setiap 3 detik
}

// 18. MESIN CUSTOM CANDLESTICK (VERSI LENGKAP DENGAN AXIS)
let candleData = [];
const MAX_CANDLES = 45; // Kapasitas layar

function initCustomCandles() {
    let lastClose = 1200; // Harga awal simulasi
    let now = new Date();

    // Buat data masa lalu (mundur 30 titik, tiap titik = 1 menit)
    for (let i = 30; i >= 0; i--) {
        let open = lastClose;
        let close = open + (Math.random() * 40 - 20);
        let high = Math.max(open, close) + (Math.random() * 20);
        let low = Math.min(open, close) - (Math.random() * 20);

        // Kalkulasi waktu mundur (60000 milidetik = 1 Menit)
        let pastTime = new Date(now.getTime() - (i * 60000));
        let timeStr = String(pastTime.getHours()).padStart(2, '0') + ':' +
            String(pastTime.getMinutes()).padStart(2, '0'); // Hanya Jam dan Menit (HH:MM)

        candleData.push({ open, high, low, close, time: timeStr });
        lastClose = close;
    }
    renderCustomCandles();
    startLiveCustomCandles();
}

function renderCustomCandles() {
    const candleContainer = document.getElementById('custom-candlestick');
    const yAxisContainer = document.getElementById('custom-y-axis');
    const xAxisContainer = document.getElementById('custom-x-axis');
    const gridContainer = document.getElementById('custom-grid');
    if (!candleContainer) return;

    let minPrice = Math.min(...candleData.map(d => d.low));
    let maxPrice = Math.max(...candleData.map(d => d.high));
    let range = maxPrice - minPrice;
    if (range === 0) range = 1;

    // Ruang atas dan bawah (Padding)
    minPrice -= range * 0.1;
    maxPrice += range * 0.1;
    range = maxPrice - minPrice;

    // 1. Render Sumbu Y (Harga) & Grid Garis
    let yHTML = '';
    let gridHTML = '';
    const gridCount = 4; // Jumlah garis horizontal
    for (let i = 0; i <= gridCount; i++) {
        let priceTarget = minPrice + (range * (i / gridCount));
        let percent = (i / gridCount) * 100;

        yHTML += `<div class="y-label" style="bottom: ${percent}%">${Math.round(priceTarget)}</div>`;
        gridHTML += `<div class="grid-line-h" style="bottom: ${percent}%"></div>`;
    }
    yAxisContainer.innerHTML = yHTML;
    gridContainer.innerHTML = gridHTML;

    // 2. Render Lilin & Sumbu X (Waktu)
    let candleHTML = '';
    let xHTML = '';
    const totalCandleWidth = 12 + 8; // Lebar lilin (12px) + Gap (8px)

    candleData.forEach((data, index) => {
        const isBullish = data.close >= data.open;
        const typeClass = isBullish ? 'bullish' : 'bearish';

        const highPct = ((data.high - minPrice) / range) * 100;
        const lowPct = ((data.low - minPrice) / range) * 100;
        const openPct = ((data.open - minPrice) / range) * 100;
        const closePct = ((data.close - minPrice) / range) * 100;

        const wickBottom = lowPct;
        const wickHeight = highPct - lowPct;
        const bodyBottom = Math.min(openPct, closePct);
        const bodyHeight = Math.max(openPct, closePct) - bodyBottom || 0.5;

        candleHTML += `
            <div class="candle-group ${typeClass}">
                <div class="candle-wick" style="bottom: ${wickBottom}%; height: ${wickHeight}%;"></div>
                <div class="candle-body" style="bottom: ${bodyBottom}%; height: ${bodyHeight}%;"></div>
            </div>
        `;

        // Atur posisi Waktu di bawah, tampilkan teks tiap 5 lilin agar tidak bertumpuk
        if (index % 5 === 0 || index === candleData.length - 1) {
            // Hitung posisi absolut dari kanan
            let rightPos = (candleData.length - 1 - index) * totalCandleWidth + 6;
            xHTML += `<div class="x-label" style="right: ${rightPos}px">${data.time}</div>`;
        }
    });

    candleContainer.innerHTML = candleHTML;
    xAxisContainer.innerHTML = xHTML;
}

function startLiveCustomCandles() {
    // 1. Getarkan harga live (Tetap bergetar setiap 1 detik agar terasa hidup)
    setInterval(() => {
        let currentCandle = candleData[candleData.length - 1];
        let fluctuation = (Math.random() * 10) - 5; // Getarannya dibuat sedikit lebih halus

        currentCandle.close += fluctuation;
        if (currentCandle.close > currentCandle.high) currentCandle.high = currentCandle.close;
        if (currentCandle.close < currentCandle.low) currentCandle.low = currentCandle.close;

        renderCustomCandles();
    }, 1000);

    // 2. Tambah lilin & waktu baru (Sekarang setiap 1 Menit)
    setInterval(() => {
        let lastClose = candleData[candleData.length - 1].close;
        let now = new Date();
        let timeStr = String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0'); // Format HH:MM

        candleData.push({ open: lastClose, high: lastClose, low: lastClose, close: lastClose, time: timeStr });

        if (candleData.length > MAX_CANDLES) candleData.shift();
    }, 60000); // 60000 ms = Lilin baru muncul per 1 menit (60 detik)
}
// 9. Fungsi Download Dashboard (PNG)
function downloadDashboard() {
    const dashboard = document.querySelector('.content'); // Target area yang akan difoto
    const btn = document.querySelector('.btn-download');

    // Ubah teks tombol agar terlihat seperti sedang loading
    btn.innerHTML = 'Memproses...';
    btn.style.opacity = '0.7';

    // Proses pengambilan gambar (Screenshot)
    html2canvas(dashboard, {
        backgroundColor: '#0a0a0a', // Mengikuti warna background utama
        scale: 2 // Scale 2 membuat gambar yang dihasilkan berkualitas tinggi/HD
    }).then(canvas => {
        // Proses pembuatan file gambar
        const link = document.createElement('a');
        link.download = 'Portfolio_MG_Securitas_Rehan.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Kembalikan tombol seperti semula setelah selesai
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download Report`;
        btn.style.opacity = '1';
    });
}

// 12. Fungsi Detail Aset "Focus Mode"
function openFocusModal(ticker, value, color) {
    const modal = document.getElementById('focusModal');

    // Setel data ke dalam panel
    const title = document.getElementById('focus-ticker');
    title.innerText = `${ticker} - ASSET OVERVIEW`;
    title.style.color = color; // Warnanya menyesuaikan identitas saham

    document.getElementById('focus-value').innerText = formatIDR(value);
    document.getElementById('focus-shares').innerText = (value / 10000).toFixed(0) + " Lot";

    // Simulasi persentase profit khusus untuk modal ini
    const randomProfit = (Math.random() * 15 + 2).toFixed(2);
    const returnEl = document.getElementById('focus-return');
    returnEl.innerText = `+${randomProfit}%`;
    returnEl.style.color = '#00ff88'; // Warna hijau profit

    // Tampilkan modal dengan animasi
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeFocusModal() {
    const modal = document.getElementById('focusModal');
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 16. Fungsi Biometric Security Simulator (DIPERBARUI UNTUK DEFCON)
function openBiometric(actionType) {
    if (typeof playPremiumClick === "function") playPremiumClick();

    const modal = document.getElementById('biometricModal');
    const title = document.getElementById('bio-action-title');
    const fpIcon = document.getElementById('fp-icon');
    const scanLine = document.getElementById('scan-line');
    const statusText = document.getElementById('bio-status');
    const trackingBox = document.getElementById('tracking-box');

    // Tambahkan style z-index tinggi agar modal biometrik muncul di atas overlay DEFCON
    modal.style.zIndex = '9999';

    title.innerText = `${actionType.toUpperCase()} - SECURE ACCESS`;
    fpIcon.classList.remove('verified');
    scanLine.classList.remove('hidden');
    statusText.innerText = "Scanning fingerprint...";
    statusText.classList.remove('success');

    startWebcam();

    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('show'); }, 10);

    if (typeof playScannerHum === "function") setTimeout(() => { playScannerHum(); }, 200);

    setTimeout(() => {
        if (typeof playSuccessBeep === "function") playSuccessBeep();

        scanLine.classList.add('hidden');
        fpIcon.classList.add('verified');
        statusText.innerText = "✓ IDENTITY VERIFIED";
        statusText.classList.add('success');

        if (trackingBox) {
            trackingBox.classList.remove('scanning');
            trackingBox.classList.add('locked');
        }


        // --- LOGIKA SYSTEM LOGIN (BARU) ---
        if (actionType === 'SYSTEM LOGIN') {
            const gateway = document.getElementById('gateway-screen');
            const app = document.getElementById('secure-app');

            // Animasi memudar ke atas
            gateway.style.opacity = '0';
            gateway.style.transform = 'translateY(-50px)';

            setTimeout(() => {
                gateway.style.display = 'none';
                app.style.display = 'flex'; // Munculkan dashboard
                switchView('dashboard'); // Pastikan tab yang aktif adalah dashboard

                // Mainkan suara welcome jika ada
                if (typeof playSuccessBeep === "function") setTimeout(playSuccessBeep, 500);
            }, 800); // Tunggu animasi pudar selesai
        }

        // --- LOGIKA MEMATIKAN DEFCON ---
        if (isDefconActive && actionType === 'DEFCON OVERRIDE') {
            isDefconActive = false;
            stopDefconAlarm(); // Matikan sirine

            document.body.classList.remove('defcon-active');
            document.getElementById('defcon-overlay').style.display = 'none';

            // Kembalikan saldo asli yang diacak
            const sensitiveElements = document.querySelectorAll('.sensitive-data');
            sensitiveElements.forEach((el, index) => {
                el.innerText = originalDataCache[index];
                el.style.color = ''; // Kembalikan warna default
            });
        }

        setTimeout(() => {
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; stopWebcam(); }, 300);
        }, 1500);

    }, 2500);
}
// 17. Fungsi Bespoke Theme Switcher
function changeTheme(hexColor) {

    // 17. Fungsi Bespoke Theme Switcher
    function changeTheme(hexColor) {
        playPremiumClick(); // <-- Tambahkan baris ini

        document.documentElement.style.setProperty('--accent', hexColor);
    }
    // 1. Ubah variabel CSS global (--accent)
    document.documentElement.style.setProperty('--accent', hexColor);

    // 2. Ubah warna Grafik Performa
    if (perfChartInstance) {
        perfChartInstance.data.datasets[0].borderColor = hexColor;

        // Konversi warna Hex ke RGBA untuk background grafik yang transparan
        let r = parseInt(hexColor.slice(1, 3), 16);
        let g = parseInt(hexColor.slice(3, 5), 16);
        let b = parseInt(hexColor.slice(5, 7), 16);

        perfChartInstance.data.datasets[0].backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
        perfChartInstance.update(); // Render ulang grafik
    }
}

// --- 20. ACOUSTIC UI (SOUND ENGINE) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Suara "Tik" elegan (Kaca/Kristal)
function playPremiumClick() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime); // Volume sangat lembut
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// Suara Dengungan Scanner Biometrik
function playScannerHum() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, audioCtx.currentTime); // Frekuensi bass rendah
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.5); // Fade in
    gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 2.5); // Fade out
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 2.5);
}

// Suara "Beep" Sukses
function playSuccessBeep() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1800, audioCtx.currentTime + 0.1); // Naik nada
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// --- 21. FUNGSI SENSOR MATA (PRIVACY BLUR) ---
let isHidden = false;
function toggleVisibility() {
    playPremiumClick(); // Mainkan suara saat diklik

    isHidden = !isHidden;
    const sensitiveElements = document.querySelectorAll('.sensitive-data');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');

    sensitiveElements.forEach(el => {
        if (isHidden) {
            el.style.filter = 'blur(6px)';
            el.style.opacity = '0.5';
            el.style.transition = 'all 0.3s ease';
        } else {
            el.style.filter = 'none';
            el.style.opacity = '1';
        }
    });

    if (isHidden) {
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    } else {
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
    }
}

// --- 22. VIP CONCIERGE ENGINE ---
function toggleConcierge() {
    // Bunyikan suara klik jika fungsi audio sudah tersedia
    if (typeof playPremiumClick === "function") playPremiumClick();

    const panel = document.getElementById('concierge-panel');
    panel.classList.toggle('show');

    // Auto-focus ke input teks saat dibuka
    if (panel.classList.contains('show')) {
        setTimeout(() => { document.getElementById('concierge-text').focus(); }, 300);
    }
}

function handleConciergeInput(event) {
    // Kirim pesan saat tombol Enter ditekan
    if (event.key === 'Enter') sendConciergeMessage();
}

function sendConciergeMessage() {
    const inputField = document.getElementById('concierge-text');
    const text = inputField.value.trim();
    if (!text) return;

    if (typeof playPremiumClick === "function") playPremiumClick();

    const messagesContainer = document.getElementById('concierge-messages');

    // 1. Tampilkan pesan dari User (Louzy)
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerText = text;
    messagesContainer.appendChild(userMsg);

    // Bersihkan kotak teks dan scroll ke bawah
    inputField.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 2. Simulasi AI sedang "berpikir" dan merespons setelah 1.2 detik
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';

        // Logika Respon Dinamis Sederhana
        let response = "I've logged your request, Louzy. My quantum algorithms are analyzing the optimal execution route.";

        const textLower = text.toLowerCase();
        if (textLower.includes('market') || textLower.includes('pasar')) {
            response = "The market is currently showing a bullish divergence. I highly recommend holding your main tech equities.";
        } else if (textLower.includes('balance') || textLower.includes('saldo')) {
            response = "Your portfolio remains highly liquid and completely secure within the MG Securitas ultra-vault.";
        } else if (textLower.includes('buy') || textLower.includes('beli')) {
            response = "Preparing a buy order. Please specify the ticker symbol and the volume of lots you'd like to acquire.";
        }

        aiMsg.innerText = response;
        messagesContainer.appendChild(aiMsg);

        // Bunyikan suara 'beep' elegan saat AI membalas
        if (typeof playSuccessBeep === "function") playSuccessBeep();

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200);
}

// --- 23. DEFCON LOCKDOWN ENGINE ---
let isDefconActive = false;
let defconAlarmInterval;
let originalDataCache = {}; // Untuk menyimpan saldo asli

// Sirine Alarm (Dua Nada)
function playDefconAlarm() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    let isHighTone = false;

    defconAlarmInterval = setInterval(() => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'square'; // Suara kasar khas alarm
        osc.frequency.setValueAtTime(isHighTone ? 600 : 400, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Volume sedang
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);

        isHighTone = !isHighTone;
    }, 500); // Berbunyi tiap setengah detik
}

function stopDefconAlarm() {
    clearInterval(defconAlarmInterval);
}

function triggerDefcon() {
    if (isDefconActive) return; // Jika sudah aktif, abaikan
    isDefconActive = true;

    playDefconAlarm(); // Nyalakan sirine

    // Aktifkan visual darurat
    document.body.classList.add('defcon-active');

    // Tampilkan overlay pelindung
    const overlay = document.getElementById('defcon-overlay');
    overlay.style.display = 'flex';
    // Pointer-events dikembalikan agar tombol biometrik di dalam overlay bisa diklik
    overlay.style.pointerEvents = 'all';

    // Acak Saldo menjadi Kode Matrix (Visual Encryption)
    const sensitiveElements = document.querySelectorAll('.sensitive-data');
    sensitiveElements.forEach((el, index) => {
        // Simpan data asli
        originalDataCache[index] = el.innerText;
        // Ganti dengan teks error/enkripsi
        el.innerText = 'ERR_0x' + Math.floor(Math.random() * 999999).toString(16).toUpperCase();
        el.style.color = '#ff3b30'; // Ubah warna jadi merah
    });
}

// --- 24. SPA NAVIGATION ENGINE (DIPERBARUI UNTUK MARKET) ---
function switchView(viewName) {
    if (typeof isOrderBookRunning !== "undefined" && !isOrderBookRunning && typeof startDarkPoolBot === "function") {
            startDarkPoolBot(); 
        }

    // 1. PENDAFTARAN RUANGAN (Pastikan baris ini ada!)
    const dashboard = document.getElementById('dashboard-view');
    const market = document.getElementById('market-view');
    const history = document.getElementById('history-view');
    const settings = document.getElementById('settings-view');
    const analytics = document.getElementById('analytics-view'); // <-- WAJIB ADA

    // 2. PENDAFTARAN TOMBOL (Pastikan baris ini ada!)
    const navDash = document.getElementById('nav-dashboard');
    const navMarket = document.getElementById('nav-market');
    const navHist = document.getElementById('nav-history');
    const navSet = document.getElementById('nav-settings');
    const navAnalytics = document.getElementById('nav-analytics'); // <-- WAJIB ADA

    // 3. RESET SEMUA (Matikan semua ruangan & tombol)
    dashboard.style.display = 'none';
    market.style.display = 'none';
    history.style.display = 'none';
    settings.style.display = 'none';
    if (analytics) analytics.style.display = 'none'; // <-- WAJIB ADA

    navDash.classList.remove('active');
    navMarket.classList.remove('active');
    navHist.classList.remove('active');
    navSet.classList.remove('active');
    if (navAnalytics) navAnalytics.classList.remove('active'); // <-- WAJIB ADA

    // 4. LOGIKA PILIHAN (Ini adalah kodemu yang sudah benar)
    if (viewName === 'history') {
        history.style.display = 'block'; navHist.classList.add('active');
        if (typeof renderQuantumLedger === "function") renderQuantumLedger();
    } else if (viewName === 'settings') {
        settings.style.display = 'block'; navSet.classList.add('active');
    } else if (viewName === 'market') {
        market.style.display = 'block'; navMarket.classList.add('active');
        if (typeof isOrderBookRunning !== "undefined" && !isOrderBookRunning && typeof startDarkPoolBot === "function") {
            startDarkPoolBot();
        }
        if (typeof startLiveTape === "function") startLiveTape(); // <-- NYALAKAN TAPE DI SINI
    } else if (viewName === 'analytics') {
        if (analytics) analytics.style.display = 'block';
        if (navAnalytics) navAnalytics.classList.add('active');
    } else {
        dashboard.style.display = 'block'; navDash.classList.add('active');
    }
}
// --- 25. QUANTUM LEDGER GENERATOR ---
function renderQuantumLedger() {
    const tbody = document.getElementById('ledger-body');
    tbody.innerHTML = ''; // Bersihkan tabel

    const operations = ['BUY: NVDA (50 Lots)', 'SELL: BBCA (100 Lots)', 'DEPOSIT: WIRE TX', 'WITHDRAW: OFFSHORE', 'BUY: BTC (2.5)'];
    const statuses = ['verified', 'verified', 'verified', 'verified', 'pending', 'failed'];

    // Hasilkan 15 data histori transaksi acak
    for (let i = 0; i < 15; i++) {
        // Buat Txn Hash acak (contoh: 0x8F9A...B3C1)
        const hashPart1 = Math.random().toString(16).substr(2, 6).toUpperCase();
        const hashPart2 = Math.random().toString(16).substr(2, 4).toUpperCase();
        const hash = `0x${hashPart1}...${hashPart2}`;

        // Buat IP Address asal (Node) acak
        const ip = `192.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`;

        // Atur Tanggal mundur
        let d = new Date();
        d.setHours(d.getHours() - (i * 14)); // Mundur beberapa jam per data
        const dateStr = String(d.getDate()).padStart(2, '0') + '/' +
            String(d.getMonth() + 1).padStart(2, '0') + '/' +
            d.getFullYear() + ' ' +
            String(d.getHours()).padStart(2, '0') + ':' +
            String(d.getMinutes()).padStart(2, '0');

        const op = operations[Math.floor(Math.random() * operations.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const amount = 'Rp ' + (Math.floor(Math.random() * 800) + 50).toLocaleString('id-ID') + '.000.000';

        // Tentukan warna berdasarkan tipe operasi
        let opClass = '';
        if (op.includes('BUY')) opClass = 'op-buy';
        else if (op.includes('SELL')) opClass = 'op-sell';
        else opClass = 'op-depo';

        // Render ke dalam baris HTML
        const tr = document.createElement('tr');

        tr.onclick = () => openReceipt(dateStr, hash, op, amount, ip, status);
        tr.innerHTML = `
        <td style="font-family: 'Courier New', monospace; font-size: 11px;">${dateStr}</td>
        <td class="hash-text">${hash}</td>
        <td class="${opClass}">${op}</td>
        <td style="font-weight: 600;">${amount}</td>
        <td class="ip-text">[IP: ${ip}]</td>
        <td><span class="badge ${status}">${status.toUpperCase()}</span></td>
        `;
        tbody.appendChild(tr);
    }
}

// --- 26. CLASSIFIED DOSSIER ENGINE ---
function openReceipt(date, hash, op, amount, ip, status) {
    if (typeof playPremiumClick === "function") playPremiumClick();

    const modal = document.getElementById('receipt-modal');
    const body = document.getElementById('receipt-body');

    // Simulasi Kalkulasi Biaya Jaringan (0.15% dari nominal)
    const baseAmountStr = amount.replace(/\D/g, ''); // Ambil angkanya saja
    const baseAmount = parseInt(baseAmountStr);
    const fee = (baseAmount * 0.0015).toLocaleString('id-ID');

    // Tentukan warna status untuk struk
    let statusColor = '#fff';
    if (status === 'verified') statusColor = 'var(--green)';
    if (status === 'pending') statusColor = '#ffcc00';
    if (status === 'failed') statusColor = '#ff3b30';

    // Cetak isi struk
    body.innerHTML = `
    <div class="receipt-row"><span class="receipt-label">TIMESTAMP:</span> <span class="receipt-value">${date}</span></div>
    <div class="receipt-row"><span class="receipt-label">TXN HASH:</span> <span class="receipt-value" style="color: var(--accent);">${hash}</span></div>
    <div class="receipt-row"><span class="receipt-label">OPERATION:</span> <span class="receipt-value">${op}</span></div>
    <div class="receipt-row"><span class="receipt-label">ORIGIN NODE:</span> <span class="receipt-value">${ip}</span></div>
    <div class="receipt-row"><span class="receipt-label">NET STATUS:</span> <span class="receipt-value" style="color: ${statusColor};">${status.toUpperCase()}</span></div>
    <br>
    <div class="receipt-row"><span class="receipt-label">GROSS VOLUME:</span> <span class="receipt-value">${amount}</span></div>
    <div class="receipt-row"><span class="receipt-label">NETWORK FEE (0.15%):</span> <span class="receipt-value">Rp ${fee}</span></div>
    <hr style="border: 0; border-top: 1px dashed #333; margin: 15px 0;">
    <div class="receipt-row"><span class="receipt-label">NET EXECUTED:</span> <span class="receipt-value" style="font-size: 16px; color: var(--accent);">${amount}</span></div>
    `;

    modal.style.display = 'flex';
}

function closeReceipt() {
    if (typeof playPremiumClick === "function") playPremiumClick();
    document.getElementById('receipt-modal').style.display = 'none';
}

// --- 27. PROFILE PICTURE LIGHTBOX ENGINE ---
function openProfileModal() {
    // Bunyikan suara jika ada
    if (typeof playPremiumClick === "function") playPremiumClick();

    const modal = document.getElementById('profile-modal');
    const modalImg = document.getElementById('large-profile-img');
    // Ambil elemen avatar kecil
    const smallAvatar = document.querySelector('.profile-avatar');

    // 1. Ambil URL gambar dari CSS background-image avatar kecil
    const style = window.getComputedStyle(smallAvatar);
    let bgImage = style.backgroundImage; // Hasilnya seperti: url("...")

    // 2. Bersihkan string agar hanya tersisa URL-nya saja
    // Menghapus 'url("' di depan dan '")' di belakang menggunakan Regex
    bgImage = bgImage.replace(/^url\(['"](.+)['"]\)/, '$1');

    // 3. Pasang URL tersebut ke tag gambar besar di modal
    modalImg.src = bgImage;

    // 4. Tampilkan modal dengan layout flex agar ke tengah
    modal.style.display = "flex";
}

function closeProfileModal(event) {
    // Fungsi ini dipanggil saat area modal diklik.
    // Kita harus cek: Apakah yang diklik itu area gelapnya ATAU tombol close?
    // Jika yang diklik adalah gambarnya sendiri, jangan ditutup.
    if (event && event.target.id !== 'profile-modal' && !event.target.classList.contains('close-profile')) {
        return;
    }

    if (typeof playPremiumClick === "function") playPremiumClick();
    document.getElementById('profile-modal').style.display = "none";
}

// Bonus: Tutup dengan tombol ESC di keyboard
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        const modal = document.getElementById('profile-modal');
        if (modal.style.display === "flex") {
            // Simulasikan klik pada background gelap
            closeProfileModal({ target: { id: 'profile-modal' } });
        }
    }
});

// --- 28. 3D HOLOGRAPHIC CARD ENGINE ---
const cardContainer = document.getElementById('holo-card-container');
const card = document.getElementById('holo-card');
const shine = document.getElementById('holo-shine');

if (cardContainer && card && shine) {
    // Saat mouse bergerak di atas kartu
    cardContainer.addEventListener('mousemove', (e) => {
        // Dapatkan dimensi dan posisi wadah kartu
        const rect = cardContainer.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Hitung posisi mouse relatif terhadap titik tengah kartu
        const centerX = rect.left + width / 2;
        const centerY = rect.top + height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // 1. Hitung Rotasi Kartu (Maksimal tilt 18 derajat)
        // Mouse ke kanan (X positif) -> Rotasi sumbu Y positif (miring kanan)
        const rotateY = (mouseX / (width / 2)) * 18;
        // Mouse ke bawah (Y positif) -> Rotasi sumbu X negatif (miring depan/nunduk)
        const rotateX = (mouseY / (height / 2)) * -18;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // 2. Hitung Pergeseran Cahaya Hologram
        // Cahaya bergerak berlawanan arah dengan kemiringan agar realistis
        const shineX = 50 - (mouseX / width) * 100; // Gerak horizontal (0% - 100%)
        const shineY = 50 - (mouseY / height) * 100; // Gerak vertikal (0% - 100%)

        shine.style.backgroundPosition = `${shineX}% ${shineY}%`;
    });

    // Saat mouse keluar, kembalikan kartu ke posisi semula dengan mulus
    cardContainer.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        shine.style.backgroundPosition = `50% 50%`; // Cahaya kembali ke tengah
        card.style.transition = 'transform 0.5s ease-out, background-position 0.5s ease-out';

        // Kembalikan transisi cepat setelah reset selesai agar responsif lagi
        setTimeout(() => {
            card.style.transition = 'transform 0.1s ease-out, background-position 0.1s ease-out';
        }, 500);
    });
}

// --- 29. DARK POOL ORDER BOOK BOT ---
let isOrderBookRunning = false;

function generateOrderRows(type) {
    let html = '';
    let currentTotal = 0;
    const basePrice = 64500.00; // Harga simulasi Bitcoin

    // Asks (Jual) harga berurut turun dari atas ke bawah
    // Bids (Beli) harga berurut turun dari atas ke bawah
    for (let i = 0; i < 7; i++) {
        let priceOffset = type === 'ask' ? (7 - i) * 3.5 : (i + 1) * 3.5;
        let price = (basePrice + (type === 'ask' ? priceOffset : -priceOffset)).toFixed(2);
        let size = (Math.random() * 1.5 + 0.01).toFixed(4);
        currentTotal += parseFloat(size);

        html += `<div class="ob-row" id="${type}-${i}">
            <span class="price">${price}</span>
            <span class="size">${size}</span>
            <span class="total">${currentTotal.toFixed(4)}</span>
            </div>`;
    }
    return html;
}

function startDarkPoolBot() {
    isOrderBookRunning = true;
    const asksContainer = document.getElementById('ob-asks');
    const bidsContainer = document.getElementById('ob-bids');
    const spreadEl = document.getElementById('ob-spread');

    // Render awal angka
    asksContainer.innerHTML = generateOrderRows('ask');
    bidsContainer.innerHTML = generateOrderRows('bid');

    // Interval bergetar super cepat (setiap 300ms)
    setInterval(() => {
        // Secara acak serang 1 baris Jual dan 1 baris Beli
        const askIdx = Math.floor(Math.random() * 7);
        const bidIdx = Math.floor(Math.random() * 7);

        const askRow = document.getElementById(`ask-${askIdx}`);
        const bidRow = document.getElementById(`bid-${bidIdx}`);

        if (askRow) {
            askRow.children[1].innerText = (Math.random() * 1.5 + 0.01).toFixed(4); // Ubah Size
            askRow.classList.remove('flash-red');
            void askRow.offsetWidth; // Trigger reflow agar animasi bisa berulang
            askRow.classList.add('flash-red');
        }

        if (bidRow) {
            bidRow.children[1].innerText = (Math.random() * 1.5 + 0.01).toFixed(4);
            bidRow.classList.remove('flash-green');
            void bidRow.offsetWidth;
            bidRow.classList.add('flash-green');
        }

        // Getarkan nilai Spread
        spreadEl.innerText = `SPREAD: $${(2.0 + Math.random()).toFixed(2)}`;

    }, 300);
}

// --- 31. OFFSHORE PROXY ROUTER ENGINE ---
function initiateOffshoreTransfer() {
    if (typeof playPremiumClick === "function") playPremiumClick();

    const modal = document.getElementById('offshore-modal');
    const terminal = document.getElementById('offshore-terminal');
    const progress = document.getElementById('offshore-progress');

    // 1. Bersihkan sistem untuk simulasi baru
    terminal.innerHTML = '> Initiating untraceable transfer sequence...<br>';
    progress.style.width = '0%';
    for (let i = 1; i <= 5; i++) {
        let node = document.getElementById('node-' + i);
        if (node) node.classList.remove('active');
    }
    for (let i = 1; i <= 4; i++) {
        let line = document.getElementById('line-' + i);
        if (line) line.classList.remove('active');
    }

    // 2. Munculkan Layar
    modal.style.display = 'flex';

    // Putar suara dengungan laser/scanner
    if (typeof playScannerHum === "function") playScannerHum();

    // 3. Skenario Garis Waktu Perjalanan Uang (Waktu dalam milidetik)
    const logs = [
        { time: 500, text: "> Origin IP Spoofed: HQ-ID -> 45.33.x.x", node: 1 },
        { time: 1000, text: "> Bouncing to Cayman Islands (Node 409A)...", line: 1 },
        { time: 1500, text: "> Cayman Node Reached. Mixing funds via Dark Pool...", node: 2 },
        { time: 2200, text: "> Routing to Zurich Bank (Swiss Subnet)...", line: 2 },
        { time: 2800, text: "> Zurich Vault accessed. Encrypting ledger...", node: 3 },
        { time: 3500, text: "> Forwarding to Panama Proxy server...", line: 3 },
        { time: 4200, text: "> Panama Proxy active. Stripping metadata...", node: 4 },
        { time: 4800, text: "> Finalizing destination untraceable wallet...", line: 4 },
        { time: 5500, text: "> TRANSFER COMPLETE. ALL TRACES WIPED.", node: 5, finish: true }
    ];

    // Animasi Progress Bar
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        currentProgress += 2;
        if (currentProgress <= 100) progress.style.width = currentProgress + '%';
    }, 110);

    // Jalankan eksekusi teks dan lampu secara berurutan
    logs.forEach(step => {
        setTimeout(() => {
            // Cetak teks ke terminal & auto-scroll ke bawah
            terminal.innerHTML += step.text + '<br>';
            terminal.scrollTop = terminal.scrollHeight;

            // Nyalakan lampu Node dan Garis
            if (step.node) document.getElementById('node-' + step.node).classList.add('active');
            if (step.line) document.getElementById('line-' + step.line).classList.add('active');

            // Jika Selesai
            if (step.finish) {
                if (typeof playSuccessBeep === "function") playSuccessBeep();
                clearInterval(progressInterval);
                progress.style.width = '100%';

                // Tutup layar otomatis setelah 3 detik
                setTimeout(() => { closeOffshoreTransfer(); }, 3000);
            }
        }, step.time);
    });
}

function closeOffshoreTransfer() {
    if (typeof playPremiumClick === "function") playPremiumClick();
    document.getElementById('offshore-modal').style.display = 'none';
}

// --- 32. REDACTED DECODER ENGINE ---
const hackerChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

// Inisialisasi semua teks yang disensor saat halaman dimuat
document.querySelectorAll('.redacted-text').forEach(el => {
    const targetText = el.dataset.text;

    // Saat awal, ubah teks asli menjadi deretan balok hitam pekat
    el.innerText = "█".repeat(targetText.length);

    // Saat Mouse Masuk -> Mulai Decoding
    el.addEventListener('mouseenter', event => {
        let iterations = 0;
        event.target.classList.add('decoding');
        clearInterval(event.target.dataset.interval);

        event.target.dataset.interval = setInterval(() => {
            event.target.innerText = targetText.split("")
                .map((letter, index) => {
                    // Jika indeks huruf sudah dilewati iterasi, tampilkan huruf aslinya
                    if (index < iterations) {
                        return targetText[index];
                    }
                    // Jika belum, tampilkan huruf acak
                    return hackerChars[Math.floor(Math.random() * hackerChars.length)];
                })
                .join("");

            // Hentikan jika seluruh teks sudah terkuak
            if (iterations >= targetText.length) {
                clearInterval(event.target.dataset.interval);
            }

            iterations += 1 / 3; // Kecepatan efek decoding (semakin kecil, semakin lama hurufnya berputar)
        }, 30); // Kecepatan update frame (milidetik)
    });

    // Saat Mouse Keluar -> Kembalikan ke Balok Hitam
    el.addEventListener('mouseleave', event => {
        clearInterval(event.target.dataset.interval);
        event.target.classList.remove('decoding');
        event.target.innerText = "█".repeat(targetText.length);
    });
});

// --- 33. VIP LENS ENGINE (WEBCAM) ---
let webcamStream = null;

async function startWebcam() {
    const videoContainer = document.getElementById('video-container');
    const videoElement = document.getElementById('webcam-video');
    const fpIcon = document.getElementById('fp-icon');
    const trackingBox = document.getElementById('tracking-box');

    try {
        // Minta Izin Akses Kamera ke Browser
        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = webcamStream;

        // Tampilkan Kamera, Sembunyikan Sidik Jari
        videoContainer.style.display = 'block';
        if (fpIcon) fpIcon.style.display = 'none';

        // Mulai animasi kotak pelacak
        trackingBox.classList.remove('locked');
        trackingBox.classList.add('scanning');

    } catch (err) {
        console.warn("Akses Kamera ditolak atau tidak tersedia. Menggunakan Sidik Jari cadangan.", err);
        // Jika kamera tidak ada/ditolak, tetap gunakan sidik jari lama
        videoContainer.style.display = 'none';
        if (fpIcon) fpIcon.style.display = 'block';
    }
}

function stopWebcam() {
    // Matikan lampu kamera jika proses selesai
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
    }
    document.getElementById('tracking-box').classList.remove('scanning', 'locked');
}

// --- 34. QUANTUM OVERCLOCK ENGINE ---
let isQuantumActive = false;

function toggleQuantumOverclock() {
    isQuantumActive = !isQuantumActive;
    const btn = document.getElementById('quantum-switch');
    const body = document.body;

    if (isQuantumActive) {
        btn.classList.add('active');
        body.classList.add('theme-quantum');
        playCyberSynthSound(); // Nyalakan suara booting server siber
    } else {
        btn.classList.remove('active');
        body.classList.remove('theme-quantum');
        if (typeof playPremiumClick === "function") playPremiumClick();
    }
}

// Simulasi Suara High-Frequency Cyber Synth (Booting/Overclock)
function playCyberSynthSound() {
    if (typeof audioCtx === 'undefined') return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'square';
    osc2.type = 'sawtooth';

    // Efek frekuensi tinggi melengking lalu mereda (seperti server menyala paksa)
    osc1.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.1);
    osc1.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);

    osc2.frequency.setValueAtTime(850, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(2100, audioCtx.currentTime + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.5);
    osc2.stop(audioCtx.currentTime + 0.5);
}

// --- 35. SHADOW NODE INTERLINK ENGINE ---
function activateNode(name, liq, reg, stat) {
    if (typeof playPremiumClick === "function") playPremiumClick();

    // 1. Buka Panel Intelijen
    const panel = document.getElementById('intel-panel');
    panel.classList.add('open');

    // 2. Injeksi Data ke dalam Panel
    document.getElementById('intel-title').innerText = "NODE: " + name;
    document.getElementById('intel-liq').innerText = liq;
    document.getElementById('intel-reg').innerText = reg;
    document.getElementById('intel-stat').innerText = stat;

    // 3. Animasi Terminal Hacking Mini
    const logPanel = document.getElementById('intel-log');
    logPanel.innerHTML = '> Establishing secure uplink...<br>';

    setTimeout(() => {
        logPanel.innerHTML += '> Bypassing local firewalls...<br>';
        if (typeof playScannerHum === "function") playScannerHum();
    }, 400);

    setTimeout(() => {
        logPanel.innerHTML += '> <span style="color:#00f3ff;">Data stream locked.</span><br>';
        if (typeof playSuccessBeep === "function") playSuccessBeep();
    }, 1200);
}

function closeNode() {
    if (typeof playPremiumClick === "function") playPremiumClick();
    document.getElementById('intel-panel').classList.remove('open');
}

// --- 36. GHOST LEDGER DECRYPTION ENGINE ---
function decryptRow(btnElement) {
    if (typeof playScannerHum === "function") playScannerHum();

    // Cari baris (row) tempat tombol ini ditekan
    const row = btnElement.closest('.l-row');
    // Temukan semua teks yang dienkripsi di baris tersebut
    const encryptedCells = row.querySelectorAll('.encrypted-data');
    const hackerChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

    // Ubah status tombol menjadi proses dekripsi
    btnElement.innerText = "DECRYPTING...";
    btnElement.style.color = "#00f3ff";
    btnElement.style.borderColor = "#00f3ff";

    // Eksekusi efek peretasan pada teks
    encryptedCells.forEach(cell => {
        const realText = cell.getAttribute('data-real');
        let iterations = 0;

        const interval = setInterval(() => {
            cell.innerText = realText.split("").map((letter, index) => {
                if (index < iterations) { return realText[index]; } // Huruf asli
                return hackerChars[Math.floor(Math.random() * hackerChars.length)]; // Huruf acak
            }).join("");

            // Hentikan jika seluruh kata sudah terbuka
            if (iterations >= realText.length) {
                clearInterval(interval);
                cell.classList.add('decrypted'); // Berikan efek bersinar
            }

            iterations += 1 / 3; // Kecepatan efek decoding
        }, 30);
    });

    // Kunci tombol menjadi VERIFIED setelah 1.5 detik (estimasi waktu dekripsi selesai)
    setTimeout(() => {
        if (typeof playSuccessBeep === "function") playSuccessBeep();
        btnElement.innerText = "VERIFIED";
        btnElement.classList.add('done');
        btnElement.style.color = "#000"; // Reset warna agar ikut CSS class .done
    }, 1500);
}

// --- 37. MULTI-CURRENCY ENGINE ---
// Patokan Kurs (Bisa kamu ubah sesuai kondisi asli)
const exchangeRateUSD = 15800;

function toggleCurrency() {
    const isUSD = document.getElementById('currency-toggle').checked;
    const labelIDR = document.getElementById('label-idr');
    const labelUSD = document.getElementById('label-usd');

    // Update warna teks indikator
    if (isUSD) {
        labelIDR.classList.remove('active');
        labelUSD.classList.add('active');
    } else {
        labelIDR.classList.add('active');
        labelUSD.classList.remove('active');
    }

    // Cari semua elemen yang memiliki class 'money'
    document.querySelectorAll('.money').forEach(el => {
        // Ambil nilai angka mentahnya dari atribut data-value
        const baseValue = parseFloat(el.getAttribute('data-value'));
        if (isNaN(baseValue)) return; // Lewati jika tidak ada angkanya

        if (isUSD) {
            // Konversi ke USD
            const converted = baseValue / exchangeRateUSD;
            // Format angka menjadi mata uang Dollar resmi (contoh: $101,335.44)
            el.innerText = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(converted);
        } else {
            // Kembalikan ke format IDR murni (contoh: Rp 1.601.100.000)
            el.innerText = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(baseValue);
        }
    });

    // Suara klik profesional jika ada
    if (typeof playPremiumClick === "function") playPremiumClick();
}

// --- 38. GLOBAL LANGUAGE ENGINE ---
function toggleLanguage() {
    const isID = document.getElementById('lang-toggle').checked;
    const labelEN = document.getElementById('label-en');
    const labelID = document.getElementById('label-id');

    // Update warna indikator EN/ID
    if (isID) {
        labelEN.classList.remove('active');
        labelID.classList.add('active');
    } else {
        labelEN.classList.add('active');
        labelID.classList.remove('active');
    }

    // Ganti semua teks yang memiliki class 'translatable'
    document.querySelectorAll('.translatable').forEach(el => {
        if (isID) {
            // Jika ID menyala, ambil teks dari data-id
            el.innerText = el.getAttribute('data-id');
        } else {
            // Jika EN menyala (default), ambil teks dari data-en
            el.innerText = el.getAttribute('data-en');
        }
    });

    if (typeof playPremiumClick === "function") playPremiumClick();
}

// --- 39. LIVE ANALYTICS PROCESSING ENGINE ---
function startLiveAnalytics() {
    setInterval(() => {
        // Cari semua bar yang memiliki class 'ai-bar' di dalam Analytics
        const aiBars = document.querySelectorAll('.analytics-grid .ai-bar');

        if (aiBars.length > 0) {
            aiBars.forEach(bar => {
                // Ambil ukuran bar saat ini
                let currentWidth = parseFloat(bar.style.width);

                // Hasilkan fluktuasi acak antara -1.5% hingga +1.5%
                let jitter = (Math.random() * 3) - 1.5;
                let newWidth = currentWidth + jitter;

                // Jaga agar angkanya tetap masuk akal (batas atas bawah)
                if (newWidth > 98) newWidth = 98;
                if (newWidth < 60) newWidth = 60;

                bar.style.width = newWidth + '%';

                // Cari angka persen di sebelah kanannya dan update secara real-time
                const labelElement = bar.parentElement.previousElementSibling;
                if (labelElement) {
                    const pctSpan = labelElement.querySelector('span:last-child');
                    if (pctSpan && pctSpan.innerText.includes('%')) {
                        pctSpan.innerText = newWidth.toFixed(1) + '%';
                    }
                }
            });
        }
    }, 2000); // Lakukan kalkulasi ulang setiap 2 detik
}

// --- 40. GLOBAL INTEL FEED ENGINE ---
const intelMessages = [
    "[SECURE] FED considering emergency rate cut. 75% probability detected.",
    "[DARK POOL] 50,000 NVDA lots accumulated by unknown Swiss node.",
    "[RUMOR] Hostile takeover imminent in Asian tech sector. Capital ready.",
    "[ALERT] Massive crypto wallet movement: 15,000 BTC transferred to cold storage.",
    "[INTEL] Middle-East sovereign fund allocating $5B to AI infrastructure.",
    "[SYSTEM] Encrypted handshake established with Tokyo Node 04.",
    "[WHALE WATCH] Unusually high volume detected on Gold (XAU) spot market.",
    "[CLASSIFIED] Main HQ ID node detecting unauthorized ping. Firewall holding."
];

function startIntelFeed() {
    const feedElement = document.getElementById('intel-feed-text');
    if (!feedElement) return;

    let msgIndex = 0;

    function typeMessage(message) {
        // Kosongkan dan siapkan kursor
        feedElement.innerText = "> ";
        feedElement.classList.add('typing-cursor');

        let charIndex = 0;

        // Mainkan suara ketikan mesin secara pelan jika ada
     

        // Mesin Ketik Otomatis
        const typeInterval = setInterval(() => {
            feedElement.innerText += message.charAt(charIndex);
            charIndex++;

            if (charIndex >= message.length) {
                clearInterval(typeInterval); // Berhenti mengetik
                feedElement.classList.remove('typing-cursor'); // Matikan kursor

                // Tunggu 5 detik, lalu ketik pesan berikutnya
                setTimeout(() => {
                    msgIndex = (msgIndex + 1) % intelMessages.length;
                    typeMessage(intelMessages[msgIndex]);
                }, 5000);
            }
        }, 40); // 40ms adalah kecepatan ketikan per huruf
    }

    // Mulai ketikan pertama setelah delay 2 detik
    setTimeout(() => {
        typeMessage(intelMessages[0]);
    }, 2000);
}

// --- 41. X-RAY DEEP SCAN PROTOCOL ---
let isXrayActive = false;

// Dengarkan ketukan keyboard (Shift + X)
document.addEventListener('keydown', function (event) {
    if (event.shiftKey && (event.key === 'X' || event.key === 'x')) {
        event.preventDefault(); // Mencegah fungsi browser bawaan
        toggleXrayMode();
    }
});

function toggleXrayMode() {
    const body = document.body;
    const scanner = document.getElementById('xray-scanner');

    if (!isXrayActive) {
        isXrayActive = true;

        // Putar suara pemindai sonar frekuensi tinggi
        playXraySound();

        // Jatuhkan laser pemindai
        scanner.classList.remove('scanning');
        void scanner.offsetWidth; // Trigger reflow
        scanner.classList.add('scanning');

        // Tepat saat laser melewati layar (delay 400ms), lucuti desainnya menjadi X-Ray
        setTimeout(() => {
            body.classList.add('theme-xray');
        }, 400);

    } else {
        // Matikan X-Ray dan kembalikan ke wujud normal
        isXrayActive = false;
        scanner.classList.remove('scanning');
        body.classList.remove('theme-xray');

        if (typeof playPremiumClick === "function") playPremiumClick();
    }
}

// Mesin Pembuat Suara Sonar X-Ray
function playXraySound() {
    if (typeof audioCtx === 'undefined') return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sawtooth';
    // Suara melengking turun dengan cepat (efek laser scan)
    osc.frequency.setValueAtTime(3000, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.5);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.1); // Volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
}

// --- 42. DEEP-DIVE ASSET SCANNER ENGINE ---
function handleAssetSearch(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('asset-search');
        const ticker = input.value.trim().toUpperCase();

        if (ticker !== "") {
            input.value = ""; // Kosongkan kolom
            input.blur(); // Hilangkan fokus keyboard
            startDeepScan(ticker);
        }
    }
}

function startDeepScan(ticker) {
    // Putar suara pemindai
    if (typeof playScannerHum === "function") playScannerHum();

    const overlay = document.getElementById('scanner-overlay');
    const tickerName = document.getElementById('scan-ticker-name');
    const loadingSec = document.getElementById('scanner-loading');
    const resultSec = document.getElementById('scanner-result');

    // Setel nama aset yang dicari
    tickerName.innerText = ticker;

    // Reset tampilan kembali ke mode loading
    loadingSec.style.display = 'block';
    resultSec.style.display = 'none';

    // Munculkan Panel
    overlay.classList.add('show');

    // Simulasi Penggalian Data selama 2 Detik
    setTimeout(() => {
        loadingSec.style.display = 'none';
        resultSec.style.display = 'block';

        if (typeof playSuccessBeep === "function") playSuccessBeep();

        // Hasilkan Data Fundamental "Pintar" secara Acak
        const peRatio = (Math.random() * 40 + 5).toFixed(2);
        const volM = (Math.random() * 50 + 1).toFixed(1);
        const instHold = (Math.random() * 40 + 40).toFixed(1); // 40% - 80% kepemilikan institusi
        const aiScore = Math.random();

        document.getElementById('scan-pe').innerText = peRatio;
        document.getElementById('scan-vol').innerText = volM + "M";
        document.getElementById('scan-inst').innerText = instHold + "%";

        const aiEl = document.getElementById('scan-ai');
        if (aiScore > 0.6) {
            aiEl.innerText = "STRONG BUY";
            aiEl.style.color = "#00ff88";
        } else if (aiScore > 0.3) {
            aiEl.innerText = "ACCUMULATE";
            aiEl.style.color = "#ffd700";
        } else {
            aiEl.innerText = "DISTRIBUTION";
            aiEl.style.color = "#ff3b30";
        }

    }, 2000); // Durasi pemindaian (2000ms)
}

function closeScanner(event, forceClose = false) {
    // Tutup jika mengklik latar belakang hitam ATAU tombol [X] ditekan
    if (forceClose || (event && event.target.id === 'scanner-overlay')) {
        if (typeof playPremiumClick === "function") playPremiumClick();
        document.getElementById('scanner-overlay').classList.remove('show');
    }
}

// --- 43. TAX-SHIELD PROTOCOL ENGINE ---
function runTaxShieldScan() {
    // Suara klik
    if (typeof playPremiumClick === "function") playPremiumClick();

    // Ganti tampilan ke mode loading
    document.getElementById('tax-shield-idle').style.display = 'none';
    document.getElementById('tax-shield-active').style.display = 'block';
    document.getElementById('tax-loading').style.display = 'block';
    document.getElementById('tax-results').style.display = 'none';

    // Suara pemindai berjalan
    if (typeof playScannerHum === "function") playScannerHum();

    // Simulasi audit pajak selama 2.5 detik
    setTimeout(() => {
        document.getElementById('tax-loading').style.display = 'none';
        document.getElementById('tax-results').style.display = 'block';

        // Suara sukses
        if (typeof playSuccessBeep === "function") playSuccessBeep();
    }, 2500);
}

// --- 44. VIP CONCIERGE PROTOCOL ENGINE ---
function dispatchConcierge() {
    const msgInput = document.getElementById('concierge-message');
    const categoryInput = document.getElementById('concierge-category');
    const statusDiv = document.getElementById('concierge-status');

    // Cegah pengiriman jika pesan kosong
    if (msgInput.value.trim() === "") {
        msgInput.style.borderColor = "#ff3b30";
        setTimeout(() => msgInput.style.borderColor = "#333", 1000);
        return;
    }

    if (typeof playPremiumClick === "function") playPremiumClick();

    // Kunci terminal saat proses pengiriman
    msgInput.disabled = true;
    categoryInput.disabled = true;

    // Tampilkan status peretasan
    statusDiv.style.display = "block";
    statusDiv.style.color = "#00f3ff";
    statusDiv.innerHTML = "> Encrypting transmission via Node 01...";

    if (typeof playScannerHum === "function") playScannerHum();

    // Simulasi rute pengiriman satelit
    setTimeout(() => {
        statusDiv.innerHTML = "> Routing to Global Concierge Desk...";
    }, 1200);

    // Konfirmasi pengiriman berhasil
    setTimeout(() => {
        if (typeof playSuccessBeep === "function") playSuccessBeep();
        statusDiv.style.color = "#00ff88";
        statusDiv.innerHTML = "> [DELIVERED] Executive agent will execute your directive shortly.";

        // Bersihkan terminal setelah 4 detik
        setTimeout(() => {
            msgInput.value = "";
            msgInput.disabled = false;
            categoryInput.disabled = false;
            statusDiv.style.display = "none";
        }, 4000);
    }, 3000);
}
// --- 45. HIGH-FREQUENCY ORDER BOOK & TAPE ENGINE ---
const basePrice = 142.50;

// function generateOrderBook() {
//     const asksContainer = document.getElementById('ob-asks');
//     const bidsContainer = document.getElementById('ob-bids');
//     if (!asksContainer || !bidsContainer) return;

//     let asksHTML = '';
//     let bidsHTML = '';
//     let totalAskVol = 0;
//     let totalBidVol = 0;

//     // Generate Asks (Harga lebih tinggi, urutan menurun)
//     for (let i = 5; i >= 1; i--) {
//         let price = (basePrice + (i * 0.05)).toFixed(2);
//         let size = Math.floor(Math.random() * 500) + 50;
//         totalAskVol += size;
//         let depth = Math.min((totalAskVol / 3000) * 100, 100);

//         asksHTML += `
//         <div class="ob-row ask-row">
//             <div class="depth-bar ask-bg" style="width: ${depth}%"></div>
//             <span class="ask-price">${price}</span>
//             <span>${size}</span>
//             <span>${totalAskVol}</span>
//         </div>`;
//     }

//     // Generate Bids (Harga lebih rendah, urutan menurun)
//     for (let i = 1; i <= 5; i++) {
//         let price = (basePrice - (i * 0.05)).toFixed(2);
//         let size = Math.floor(Math.random() * 500) + 50;
//         totalBidVol += size;
//         let depth = Math.min((totalBidVol / 3000) * 100, 100);

//         bidsHTML += `
//         <div class="ob-row bid-row">
//             <div class="depth-bar bid-bg" style="width: ${depth}%"></div>
//             <span class="bid-price">${price}</span>
//             <span>${size}</span>
//             <span>${totalBidVol}</span>
//         </div>`;
//     }

//     asksContainer.innerHTML = asksHTML;
//     bidsContainer.innerHTML = bidsHTML;
// }

// function simulateMarketActivity() {
//     // 1. Acak Buku Pesanan setiap 800ms
//     setInterval(() => {
//         generateOrderBook();

//         // Buat efek kedip acak pada salah satu baris
//         const allRows = document.querySelectorAll('.ob-row');
//         if (allRows.length > 0) {
//             let randomRow = allRows[Math.floor(Math.random() * allRows.length)];
//             randomRow.classList.add(randomRow.classList.contains('ask-row') ? 'flash-ask' : 'flash-bid');
//             setTimeout(() => {
//                 randomRow.classList.remove('flash-ask', 'flash-bid');
//             }, 300);
//         }
//     }, 800);

//     // 2. Tambahkan Transaksi Live (Tape) setiap 400ms - 1500ms
//     setInterval(() => {
//         const tapeFeed = document.getElementById('live-tape-feed');
//         if (!tapeFeed) return;

//         let isBuy = Math.random() > 0.5;
//         let priceOffset = (Math.random() * 0.10) - 0.05;
//         let executedPrice = (basePrice + priceOffset).toFixed(2);
//         let executedVol = Math.floor(Math.random() * 300) + 10;

//         let now = new Date();
//         let timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

//         let newRow = document.createElement('div');
//         newRow.className = 'tape-row';
//         newRow.innerHTML = `
//             <span>${timeStr}</span>
//             <span style="color: ${isBuy ? '#00ff88' : '#ff3b30'}">${executedPrice}</span>
//             <span>${executedVol}</span>
//         `;

//         tapeFeed.prepend(newRow); // Masukkan di paling atas

//         // Hapus baris paling bawah agar tidak memenuhi memori (maksimal 10 baris)
//         if (tapeFeed.children.length > 10) {
//             tapeFeed.removeChild(tapeFeed.lastChild);
//         }
//     }, Math.random() * 1000 + 400);
// }

// --- 46. STANDALONE CRYPTO LIVE TAPE ENGINE ---
function startLiveTape() {
    const tapeFeed = document.getElementById('live-tape-feed');
    if (!tapeFeed) return;

    // Cegah mesin berjalan ganda jika menu diklik berkali-kali
    if (tapeFeed.dataset.running === "true") return;
    tapeFeed.dataset.running = "true";

    let currentTapePrice = 64514.00; // Mengikuti harga Order Book kamu

    function addTapeRow() {
        let isBuy = Math.random() > 0.5;
        let priceOffset = (Math.random() * 6.00) - 3.00;
        currentTapePrice = currentTapePrice + priceOffset;
        let executedVol = (Math.random() * 3 + 0.1).toFixed(4); // Format Lot Kripto

        let now = new Date();
        let timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        let newRow = document.createElement('div');
        newRow.className = 'tape-row';
        newRow.innerHTML = `
            <span>${timeStr}</span>
            <span style="color: ${isBuy ? '#00ff88' : '#ff3b30'}; font-weight: bold;">${currentTapePrice.toFixed(2)}</span>
            <span>${executedVol}</span>
        `;

        // Tembakkan baris baru ke posisi paling atas
        tapeFeed.prepend(newRow);

        // Hapus baris paling bawah jika lebih dari 12 baris (mencegah lag memori)
        if (tapeFeed.children.length > 12) {
            tapeFeed.removeChild(tapeFeed.lastChild);
        }

        // === UBAH JEDA MENJADI 1 MENIT (60.000 MILIDETIK) ===
        setTimeout(addTapeRow, 60000); 
    }

    // Nyalakan mesin tembak pertama kali
    addTapeRow();
}

// --- 47. GHOST ACCOUNT GENERATOR ENGINE ---
function generateGhostAccount() {
    // Putar suara sistem
    if (typeof playPremiumClick === "function") playPremiumClick();
    if (typeof playScannerHum === "function") playScannerHum();
    
    // Ubah tombol jadi mode "Loading"
    const btn = document.querySelector('button[onclick="generateGhostAccount()"]');
    btn.innerText = "ROUTING NEW NODE...";
    btn.style.opacity = "0.7";
    btn.disabled = true;
    
    // Beri jeda 0.8 detik untuk simulasi peretasan
    setTimeout(() => {
        if (typeof playSuccessBeep === "function") playSuccessBeep();
        
        const list = document.getElementById('ghost-account-list');
        
        // Data Bank Rahasia Acak
        const banks = ["ZURICH PRIVATE VAULT", "CAYMAN ISLAND TRUST", "PANAMA OFFSHORE LLC", "BAHAMAS SECURE NODE", "SINGAPORE SHADOW ACC", "MONACO WEALTH HUB"];
        const bank = banks[Math.floor(Math.random() * banks.length)];
        
        // Buat nomor acak yang terlihat asli
        const accNum = Math.floor(1000000000 + Math.random() * 9000000000).toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ");
        const swift = (bank.substring(0,4).replace(/\s/g, '') + ["X","Z","Q"][Math.floor(Math.random()*3)] + "XXX").toUpperCase();
        const route = Math.floor(100000000 + Math.random() * 900000000);
        
        // Rakit Kartu HTML-nya
        const cardHTML = `
            <div class="ghost-account-card">
                <div class="ghost-header">
                    <span class="ghost-bank">🏛 ${bank}</span>
                    <span class="ghost-status">UNTRACEABLE</span>
                </div>
                <div class="ghost-details">
                    <div><span>ACCOUNT NUMBER</span><strong>${accNum}</strong></div>
                    <div><span>SWIFT CODE</span><strong>${swift}</strong></div>
                    <div><span>ROUTING / SORT</span><strong>${route}</strong></div>
                    <div><span>ENCRYPTION</span><strong>AES-256 / SECURE</strong></div>
                </div>
            </div>
        `;
        
        // Dorong kartu baru ke posisi paling atas
        list.insertAdjacentHTML('afterbegin', cardHTML);
        
        // Hapus kartu paling bawah jika sudah lebih dari 4 (agar tidak memenuhi layar)
        if(list.children.length > 4) {
            list.removeChild(list.lastElementChild);
        }
        
        // Kembalikan tombol ke keadaan semula
        btn.innerText = "INITIATE GHOST PROTOCOL";
        btn.style.opacity = "1";
        btn.disabled = false;
        
    }, 800); 
}

// --- 48. SESSION TERMINATION ENGINE ---
function terminateSession(btn) {
    if (typeof playPremiumClick === "function") playPremiumClick();
    
    // Ubah status tombol
    btn.innerText = "REVOKING...";
    btn.style.color = "#ff3b30";
    btn.style.borderColor = "#ff3b30";
    
    // Suara proses peretasan (opsional)
    if (typeof playScannerHum === "function") playScannerHum();

    setTimeout(() => {
        const sessionItem = btn.closest('.session-item');
        
        // Animasi memudar dan tergeser ke kanan
        sessionItem.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        sessionItem.style.opacity = "0";
        sessionItem.style.transform = "translateX(30px)";
        
        if (typeof playSuccessBeep === "function") playSuccessBeep();
        
        // Hapus elemen HTML secara permanen setelah animasi selesai
        setTimeout(() => {
            sessionItem.remove();
        }, 400);
        
    }, 1000); // Waktu eksekusi pemutusan (1 detik)
}

// --- 49. MACRO-ECONOMIC NEWS TERMINAL ENGINE ---
const macroNewsDatabase = [
    { text: "FED announces unexpected 25bps rate cut; global markets rally.", type: "bullish" },
    { text: "SEC approves new regulatory framework for Dark Pool routing.", type: "neutral" },
    { text: "Global supply chain disruption impacts Asian semiconductor sectors.", type: "urgent" },
    { text: "Nvidia (NVDA) reports Q4 earnings beating estimates by 18%.", type: "bullish" },
    { text: "Flash crash detected in European equity markets. Liquidity draining.", type: "urgent" },
    { text: "Middle-East sovereign wealth fund allocates $5B to AI infrastructure.", type: "bullish" },
    { text: "U.S. Treasury yields drop to 6-month low amid cooling inflation data.", type: "neutral" },
    { text: "Liberty Walk announces limited edition GT-R 35 bodykit pre-orders.", type: "bullish" },
    { text: "Unidentified whale moves $500M BTC to cold storage.", type: "neutral" },
    { text: "IMF warns of slowing economic growth in Eurozone markets.", type: "urgent" }
];

function startMacroNewsFeed() {
    const feedContainer = document.getElementById('macro-news-feed');
    if (!feedContainer) return;
    
    // Mencegah mesin berjalan ganda
    if (feedContainer.dataset.running === "true") return;
    feedContainer.dataset.running = "true";

    function addNewsItem() {
        const news = macroNewsDatabase[Math.floor(Math.random() * macroNewsDatabase.length)];
        let now = new Date();
        let timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let newRow = document.createElement('div');
        newRow.className = `news-item ${news.type}`;
        newRow.innerHTML = `<span class="news-time">[${timeStr}]</span><span class="news-text">${news.text}</span>`;
        
        feedContainer.prepend(newRow); // Dorong berita ke paling atas
        
        // Hapus berita paling bawah jika lebih dari 5 (agar tidak penuh)
        if (feedContainer.children.length > 5) {
            feedContainer.removeChild(feedContainer.lastChild);
        }

        // Jika berita krisis (urgent), mainkan suara dengungan pelan
        if (news.type === 'urgent' && typeof playScannerHum === 'function') {
            playScannerHum();
        }

        // Gulirkan berita baru secara acak antara 5 hingga 10 detik
        setTimeout(addNewsItem, Math.random() * 5000 + 5000);
    }

    addNewsItem(); // Nyalakan mesin pencetak
}
// --- 50. FLASH-CRASH SNIPER BOT ENGINE ---
let isSniperArmed = false;

function armSniperBot() {
    if (typeof playPremiumClick === "function") playPremiumClick();
    
    const panel = document.querySelector('.sniper-panel');
    const btn = document.getElementById('btn-arm-sniper');
    const status = document.getElementById('sniper-status');
    const indicator = panel.querySelector('.live-indicator');
    
    // Jika posisi belum aktif -> AKTIFKAN (ARM)
    if (!isSniperArmed) {
        isSniperArmed = true;
        panel.classList.add('armed');
        panel.classList.remove('executing');
        
        btn.innerText = "DISARM PROTOCOL";
        btn.style.color = "#fff";
        btn.style.borderColor = "#555";
        btn.style.background = "transparent";
        
        indicator.innerText = "ARMED";
        indicator.style.animation = "pulseBearish 1s infinite";
        
        status.style.color = "#ff3b30";
        status.innerHTML = "> SENSORS ARMED. QUANTUM LINK ESTABLISHED.<br>> Scanning dark pools for anomalous liquidity drops...";
        
        if (typeof playScannerHum === "function") playScannerHum();
        
        // Bot mengintai. Flash crash akan disimulasikan terjadi secara acak antara 6 - 12 detik
        const crashTime = Math.random() * 6000 + 6000;
        
        panel.dataset.sniperTimeout = setTimeout(() => {
            // Cek apakah user sempat membatalkan (disarm) sebelum crash terjadi
            if(!isSniperArmed) return;
            
            // --- FASE EKSEKUSI FLASH CRASH ---
            panel.classList.add('executing');
            if (typeof playDefconAlarm === "function") playDefconAlarm(); // Pakai suara sirine 
            
            indicator.innerText = "EXECUTING";
            indicator.style.animation = "none";
            indicator.style.background = "#ff3b30";
            indicator.style.color = "#000";
            
            status.style.color = "#00ff88";
            status.innerHTML = "> FLASH CRASH DETECTED! MARKET ANOMALY AT $59,850.<br>> INJECTING $250,000 BLOCK TRADE...";
            
            // Konfirmasi Sukses Setelah Eksekusi
            setTimeout(() => {
                panel.classList.remove('executing');
                panel.classList.remove('armed');
                if (typeof stopDefconAlarm === "function") stopDefconAlarm();
                if (typeof playSuccessBeep === "function") playSuccessBeep();
                
                indicator.innerText = "SECURED";
                indicator.style.background = "transparent";
                indicator.style.color = "#00ff88";
                indicator.style.borderColor = "#00ff88";
                
                status.innerHTML = "> TARGET ACQUIRED.<br>> 4.177 BTC secured at bottom. Transferring to vault.";
                
                btn.innerText = "RESET SNIPER";
                btn.style.color = "#00f3ff";
                btn.style.borderColor = "#00f3ff";
                btn.style.background = "rgba(0,243,255,0.1)";
                
                isSniperArmed = false; // Kembalikan ke state awal agar bisa di-reset
            }, 1800);
            
        }, crashTime);
        
    } else {
        // Jika posisi sudah aktif -> BATALKAN (DISARM)
        isSniperArmed = false;
        panel.classList.remove('armed');
        panel.classList.remove('executing');
        clearTimeout(panel.dataset.sniperTimeout);
        if (typeof stopDefconAlarm === "function") stopDefconAlarm();
        
        btn.innerText = "ARM SNIPER PROTOCOL";
        btn.style.color = "#ff3b30";
        btn.style.borderColor = "#ff3b30";
        btn.style.background = "rgba(255,59,48,0.1)";
        
        indicator.innerText = "OFFLINE";
        indicator.style.animation = "none";
        indicator.style.color = "#ff3b30";
        indicator.style.borderColor = "#ff3b30";
        
        status.style.color = "#888";
        status.innerHTML = "> Bot offline.<br>> Protocol aborted by executive command.";
    }
}

// --- 51. OFFSHORE TAX SHIELD REBALANCER ---
function rebalanceTaxShield(btn) {
    if (typeof playPremiumClick === "function") playPremiumClick();
    if (typeof playScannerHum === "function") playScannerHum();
    
    // Kunci tombol dan ubah visualnya
    const originalText = btn.innerHTML;
    btn.innerHTML = "> ROUTING CAPITAL ACROSS NODES...";
    btn.style.background = "#00f3ff";
    btn.style.color = "#000";
    btn.style.pointerEvents = "none";
    
    // Simulasi proses komputasi rute (1.5 detik)
    setTimeout(() => {
        if (typeof playSuccessBeep === "function") playSuccessBeep();
        
        // Eksekusi Berhasil
        btn.innerHTML = "> REBALANCE COMPLETE. TAX RATE SECURED AT 0.4%";
        btn.style.background = "rgba(0, 255, 136, 0.1)";
        btn.style.borderColor = "#00ff88";
        btn.style.color = "#00ff88";
        
        // Kembalikan ke normal setelah 3 detik
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "rgba(0, 243, 255, 0.05)";
            btn.style.borderColor = "#00f3ff";
            btn.style.color = "#00f3ff";
            btn.style.pointerEvents = "auto";
        }, 3000);
        
    }, 1500);
}

// --- 52. ASSET INSPECTION ENGINE (DATABASE & MODAL) ---

const assetDatabase = {
    'bmw': {
        title: "BMW M4 G82 Competition",
        value: "Rp 2.800.000.000",
        status: "<span style='color:#00ff88;'>SECURED / GARAGED</span>",
        desc: "> IDENTIFICATION: <b style='color:#00f3ff;'>PLAT AE 1706 GH</b><br>> COLOR: <b style='color:#3498db;'>SAPPHIRE BLUE</b><br>> ENGINE: 3.0L Twin-Turbo Inline-6 (S58)<br>> CLEARANCE: Owner Authorized. Fully Insured.",
        // Tautan gambar BMW M4 Biru Keren
        image: "bmw.png" 
    },
    'gtr': {
        title: "Nissan GT-R R35 Liberty Walk",
        value: "Rp 4.500.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> BODYKIT: LB-Silhouette WORKS GT 35GT-RR<br>> STATUS: Sourcing overseas import logistics.<br>> ALLOCATION: Awaiting fund clearing from Dark Pool gains.",
        image: "gtr.jpeg"
    },
    'house': {
        title: "Private Residence (Smart Home)",
        value: "Rp 3.500.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> TYPE: Modern Minimalist Architecture<br>> SPECS: Underground Garage, Biometric Security, Server Room.<br>> LOCATION: Undisclosed Premium Sector.",
        image: "jet.jpeg"
    },
    'svj': {
        title: "Lamborghini Aventador SVJ",
        value: "Rp 16.500.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> ENGINE: 6.5L L539 V12<br>> RARITY: Limited Edition Track-Focused Hypercar.<br>> LOGISTICS: Tier 1 Over-the-counter block trade required.",
        image: "lambo.jpeg"
    },
    'supra': {
        title: "Toyota Supra MK5 LBWK",
        value: "Rp 1.650.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> KIT: Liberty Walk Supreme<br>> MODS: Air suspension, custom forged wheels, titanium exhaust.<br>> CLEARANCE: Pending Market Liquidity.",
        image: "mk5.jpeg"
    },
    'camera': {
        title: "Sony 8K Rig + 24MP Fisheye Lens",
        value: "Rp 250.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> OPTICS: 24 Megapixel Ultra-Wide Fisheye.<br>> RIG: Full cinematic cage, V-Mount battery system.<br>> PURPOSE: High-end automotive documentation.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
    },
    'rolex': {
        title: "Rolex Daytona Cosmograph",
        value: "Rp 600.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> MATERIAL: Oystersteel and yellow gold.<br>> CALIBRE: 4130, Manufacture Rolex.<br>> TYPE: Tangible Safe-Haven Asset.",
        image: "rolex.jpeg"
    },
    'patek': {
        title: "Patek Philippe Nautilus 5711",
        value: "Rp 1.800.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> STATUS: Extremely illiquid. Waitlist heavily guarded.<br>> MOVEMENT: Mechanical self-winding.<br>> ACTION: Deploying proxies for acquisition.",
        image: "patek.jpeg"
    },
    'jet': {
        title: "Gulfstream G280 Private Jet",
        value: "Rp 350.000.000.000",
        status: "<span style='color:#ffcc00; animation: pulseBullish 2s infinite;'>ACQUISITION TARGET</span>",
        desc: "> RANGE: 3,600 nm (New York to London).<br>> CAPACITY: Up to 10 passengers.<br>> REGISTRATION: Offshore shell corporation holding.",
        image: "jet.jpeg"
    }
};

function openAssetModal(assetKey) {
    if (typeof playPremiumClick === "function") playPremiumClick();
    if (typeof playScannerHum === "function") playScannerHum();
    
    const data = assetDatabase[assetKey];
    if(!data) return;

    // Masukkan data ke dalam panel HTML
    document.getElementById('am-id').innerText = "NODE-" + Math.floor(Math.random() * 9000 + 1000);
    document.getElementById('am-image').src = data.image;
    document.getElementById('am-title').innerText = data.title;
    document.getElementById('am-value').innerText = data.value;
    document.getElementById('am-status').innerHTML = data.status;
    document.getElementById('am-desc').innerHTML = data.desc;

    // Munculkan panel dengan efek transisi yang BENAR
    const modal = document.getElementById('asset-modal');
    modal.style.display = 'flex';
    
    // Memberikan jeda 10ms agar CSS bisa menjalankan animasi opacity
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeAssetModal() {
    if (typeof playPremiumClick === "function") playPremiumClick();
    const modal = document.getElementById('asset-modal');
    
    // Jalankan efek pudar terlebih dahulu
    modal.classList.remove('show');
    
    // Tunggu sampai layar benar-benar pudar, baru hilangkan elemennya (mencegah macet)
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// --- 53. TIER BENEFITS EXPLORER ENGINE ---
const tierData = {
    'silver': {
        title: 'SILVER TIER PRIVILEGES',
        color: '#a0a0a0',
        benefits: [
            '<span style="color: #a0a0a0;">✓</span> Standard Market Routing',
            '<span style="color: #a0a0a0;">✓</span> Basic Asset Analytics',
            '<span style="color: #a0a0a0;">✓</span> Standard Trade Commission (0.15%)',
            '<span style="color: #555;">✕ <del>Dark Pool Access</del></span>',
            '<span style="color: #555;">✕ <del>VIP Concierge Desk</del></span>'
        ]
    },
    'gold': {
        title: 'GOLD TIER PRIVILEGES',
        color: '#DAA520',
        benefits: [
            '<span style="color: #DAA520;">✓</span> Priority Market Routing',
            '<span style="color: #DAA520;">✓</span> Advanced AI Sentiment Analysis',
            '<span style="color: #DAA520;">✓</span> Reduced Trade Commission (0.05%)',
            '<span style="color: #DAA520;">✓</span> 1 Offshore Node Authorization',
            '<span style="color: #555;">✕ <del>VIP Concierge Desk</del></span>'
        ]
    },
    'platinum': {
        title: 'PLATINUM TIER PRIVILEGES',
        color: '#b0c4de',
        benefits: [
            '<span style="color: #b0c4de;">✓</span> 0% Trade Commission (Zero-Fee)',
            '<span style="color: #b0c4de;">✓</span> Standard Dark Pool Order Routing',
            '<span style="color: #b0c4de;">✓</span> Wealth Advisor Link (Business Hours)',
            '<span style="color: #b0c4de;">✓</span> 3 Offshore Node Authorizations',
            '<span style="color: #555;">✕ <del>Automated Tax-Shield Protocol</del></span>'
        ]
    },
    'omega': {
        title: 'VIP OMEGA PRIVILEGES',
        color: '#d4af37',
        benefits: [
            '<span style="color: #00ff88;">✓</span> 0% Trade Commission (Zero-Fee)',
            '<span style="color: #00ff88;">✓</span> Priority Dark Pool Order Routing',
            '<span style="color: #00ff88;">✓</span> 24/7 Dedicated Concierge Access',
            '<span style="color: #00ff88;">✓</span> Automated Tax-Shield Protocol',
            '<span style="color: #00ff88;">✓</span> Offshore Node Transfers (Unlimited)'
        ]
    }
};

function showTierBenefits(tierKey, badgeElement) {
    if (typeof playPremiumClick === "function") playPremiumClick();
    if (typeof playScannerHum === "function") playScannerHum();
    
    // Hapus efek membesar dari semua lencana
    document.querySelectorAll('.tier-badge').forEach(b => {
        b.classList.remove('active-tier-select');
    });
    
    // Buat lencana yang diklik menjadi membesar dan menyala
    badgeElement.classList.add('active-tier-select');
    
    const box = document.getElementById('tier-benefits-box');
    const title = document.getElementById('tier-benefits-title');
    const list = document.getElementById('tier-benefits-list');
    
    const data = tierData[tierKey];
    
    // Meredupkan teks lama
    list.style.opacity = 0;
    title.style.opacity = 0;
    
    setTimeout(() => {
        // Ganti warna bingkai kotak sesuai warna logam tier-nya
        box.style.borderColor = data.color;
        box.style.boxShadow = `inset 0 0 20px ${data.color}20`; 
        
        // Ganti teks dan warnanya
        title.innerText = data.title;
        title.style.color = data.color;
        list.innerHTML = data.benefits.map(b => `<li>${b}</li>`).join('');
        
        // Terangkan kembali teks baru
        list.style.opacity = 1;
        title.style.opacity = 1;
    }, 200); // Jeda 0.2 detik agar transisinya terlihat mewah
}

// --- 54. OBSIDIAN CARD COMMAND ENGINE ---
let isCardFrozen = false;
let burnerInterval;

function toggleCardFreeze() {
    if (typeof playPremiumClick === "function") playPremiumClick();
    
    const card = document.getElementById('obsidian-card');
    const btn = document.getElementById('btn-freeze');
    
    isCardFrozen = !isCardFrozen;
    
    if (isCardFrozen) {
        if (typeof playDefconAlarm === "function") playDefconAlarm(); // Suara error/lock
        card.classList.add('frozen-card');
        btn.innerHTML = "> UNFREEZE ASSET";
        btn.style.color = "#00f3ff";
        btn.style.borderColor = "#00f3ff";
        btn.style.background = "rgba(0, 243, 255, 0.1)";
    } else {
        if (typeof playSuccessBeep === "function") playSuccessBeep();
        card.classList.remove('frozen-card');
        btn.innerHTML = "> INITIATE CARD FREEZE";
        btn.style.color = "#aaa";
        btn.style.borderColor = "#444";
        btn.style.background = "rgba(0,0,0,0.5)";
    }
}

function generateBurnerCard() {
    if (isCardFrozen) return; // Tidak bisa buat burner jika kartu beku
    if (typeof playScannerHum === "function") playScannerHum();
    
    const numDisplay = document.getElementById('card-num');
    let ticks = 0;
    
    // Hentikan animasi sebelumnya jika tombol diklik berulang
    clearInterval(burnerInterval);
    numDisplay.style.color = "#00ff88";
    
    // Animasi angka acak ala hacker
    burnerInterval = setInterval(() => {
        let randNum = "";
        for(let i=0; i<4; i++) {
            randNum += Math.floor(1000 + Math.random() * 9000) + (i<3 ? " " : "");
        }
        numDisplay.innerText = randNum;
        ticks++;
        
        // Berhenti setelah 15 putaran (sekitar 0.7 detik)
        if (ticks > 15) {
            clearInterval(burnerInterval);
            if (typeof playSuccessBeep === "function") playSuccessBeep();
            numDisplay.style.color = "#fff";
        }
    }, 50);
}

// --- 55. QUANTUM YIELD FORECASTER ENGINE (CANVAS) ---
function initQuantumChart() {
    const canvas = document.getElementById('quantumChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Menyesuaikan ukuran kanvas secara dinamis dengan lebar layarmu
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Bersihkan layar
    ctx.clearRect(0, 0, w, h);

    // 2. Gambar Grid (Garis Kotak-Kotak Latar Belakang)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for(let i=0; i<w; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for(let i=0; i<h; i+=30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // 3. Kalkulasi Titik Data (Kurva Eksponensial Bunga Majemuk)
    const points = [];
    for(let i=0; i<=w; i+=10) {
        let x = i;
        let normalizedX = i / w;
        // Rumus eksponensial: melandai di awal, meroket tajam di akhir
        let y = h - (Math.pow(normalizedX, 2.5) * (h - 40)) - 20; 
        points.push({x, y});
    }

    // 4. Gambar Efek Gradient Bercahaya di Bawah Kurva
    let grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0, 255, 136, 0.4)'); // Hijau menyala di atas
    grad.addColorStop(1, 'rgba(0, 255, 136, 0.0)'); // Transparan di bawah

    ctx.beginPath();
    ctx.moveTo(points[0].x, h);
    for(let pt of points) { ctx.lineTo(pt.x, pt.y); }
    ctx.lineTo(points[points.length-1].x, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 5. Gambar Garis Kurva Utama
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(let pt of points) { ctx.lineTo(pt.x, pt.y); }
    
    ctx.strokeStyle = '#00ff88'; // Warna Neon Hijau
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff88'; // Efek Glow
    ctx.stroke();
    
    // Reset shadow agar tidak mengganggu gambar lain
    ctx.shadowBlur = 0; 
}

// Tambahkan animasi CSS untuk garis pemindai (Scan Line)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes scanRight {
        0% { left: 0%; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { left: 100%; opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// Pastikan grafik digambar saat halaman Analytics dibuka
// Jika belum terbiasa dengan observer, kita gunakan cara paling aman: deteksi interval
setInterval(() => {
    const analyticsView = document.getElementById('analytics-view');
    const canvas = document.getElementById('quantumChart');
    if (analyticsView && analyticsView.style.display === 'block' && canvas && canvas.width !== canvas.parentElement.clientWidth) {
        initQuantumChart();
    }
}, 500);

// --- 56. PRE-IPO DEAL COMMITMENT ENGINE ---
function commitCapital(btn, company, amount) {
    // 1. Kunci tombol dan mulai verifikasi
    btn.innerHTML = "> VERIFYING FUNDS...";
    btn.style.borderColor = "#00f3ff";
    btn.style.color = "#00f3ff";
    btn.style.background = "rgba(0, 243, 255, 0.1)";
    btn.disabled = true;
    
    // 2. Tahap transfer (simulasi 1 detik)
    setTimeout(() => {
        btn.innerHTML = "> ALLOCATING " + amount;
        
        // 3. Posisi diamankan (simulasi 1.5 detik kemudian)
        setTimeout(() => {
            btn.innerHTML = "✓ POSITION SECURED";
            btn.style.borderColor = "#00ff88";
            btn.style.color = "#00ff88";
            btn.style.background = "rgba(0, 255, 136, 0.1)";
            
            // Tutup alokasi agar terlihat kuota sudah penuh dibeli oleh Anda
            const itemContainer = btn.closest('.deal-item');
            const bar = itemContainer.querySelector('.allocation-fill');
            const statusText = itemContainer.querySelector('p:last-of-type');
            const availableText = itemContainer.querySelector('.deal-metrics b');
            
            if(bar) {
                bar.style.width = "100%";
                bar.style.background = "#ff3b30";
                bar.style.boxShadow = "0 0 8px #ff3b30";
            }
            if(statusText) {
                statusText.innerText = "100% SUBSCRIBED (CLOSED)";
                statusText.style.color = "#ff3b30";
            }
            if(availableText) {
                availableText.innerText = "CLOSED";
                availableText.style.color = "#888";
            }
            
        }, 1500);
    }, 1000);
}

// --- 57. GLOBAL MARKET DATABANK ENGINE ---
const globalAssets = [
    // CRYPTO
    { sym: "BTC/USD", name: "Bitcoin", cls: "CRYPTO", price: 64512.40, chg: 2.4 },
    { sym: "ETH/USD", name: "Ethereum", cls: "CRYPTO", price: 3450.15, chg: 1.8 },
    { sym: "SOL/USD", name: "Solana", cls: "CRYPTO", price: 145.20, chg: -0.5 },
    { sym: "XRP/USD", name: "Ripple", cls: "CRYPTO", price: 0.584, chg: 0.2 },
    { sym: "BNB/USD", name: "Binance Coin", cls: "CRYPTO", price: 580.30, chg: 1.1 },
    { sym: "DOGE/USD", name: "Dogecoin", cls: "CRYPTO", price: 0.125, chg: -2.1 },
    
    // US EQUITIES (TECH & AUTO)
    { sym: "NVDA", name: "NVIDIA Corp.", cls: "EQUITY US", price: 125.40, chg: 4.2 },
    { sym: "AAPL", name: "Apple Inc.", cls: "EQUITY US", price: 185.30, chg: 0.1 },
    { sym: "MSFT", name: "Microsoft", cls: "EQUITY US", price: 420.15, chg: -0.3 },
    { sym: "TSLA", name: "Tesla Inc.", cls: "EQUITY US", price: 210.80, chg: -1.2 },
    { sym: "MSTR", name: "MicroStrategy", cls: "EQUITY US", price: 1450.00, chg: 5.6 },
    { sym: "META", name: "Meta Platforms", cls: "EQUITY US", price: 495.20, chg: 1.4 },
    { sym: "AMZN", name: "Amazon.com", cls: "EQUITY US", price: 178.90, chg: 0.8 },
    { sym: "GOOGL", name: "Alphabet Inc.", cls: "EQUITY US", price: 165.40, chg: -0.7 },
    
    // ID EQUITIES (BLUECHIP)
    { sym: "BBCA.JK", name: "Bank Central Asia", cls: "EQUITY ID", price: 9850, chg: 0.5 },
    { sym: "BMRI.JK", name: "Bank Mandiri", cls: "EQUITY ID", price: 6500, chg: 1.2 },
    { sym: "BBRI.JK", name: "Bank Rakyat Indo", cls: "EQUITY ID", price: 4800, chg: -0.4 },
    { sym: "BBNI.JK", name: "Bank Negara Indo", cls: "EQUITY ID", price: 5200, chg: 0.8 },
    { sym: "TLKM.JK", name: "Telkom Indonesia", cls: "EQUITY ID", price: 3100, chg: -1.5 },
    { sym: "ASII.JK", name: "Astra International", cls: "EQUITY ID", price: 4650, chg: 0.2 },
    
    // COMMODITIES & INDEX
    { sym: "XAU/USD", name: "Gold (Ounce)", cls: "COMMODITY", price: 2450.10, chg: 0.8 },
    { sym: "XAG/USD", name: "Silver (Ounce)", cls: "COMMODITY", price: 29.40, chg: 1.5 },
    { sym: "USO/USD", name: "WTI Crude Oil", cls: "COMMODITY", price: 82.30, chg: -0.6 },
    { sym: "SPX", name: "S&P 500 Index", cls: "INDEX", price: 5430.50, chg: 0.4 }
];

function initMarketDatabank() {
    const grid = document.getElementById('live-asset-grid');
    if (!grid) return;
    
    // Cetak semua baris aset ke dalam tabel
    grid.innerHTML = '';
    globalAssets.forEach((asset, index) => {
        const isPositive = asset.chg >= 0;
        const chgColor = isPositive ? '#00ff88' : '#ff3b30';
        const chgSign = isPositive ? '+' : '';
        
        // Format harga (koma untuk ribuan, titik untuk desimal)
        const priceStr = asset.price > 1000 ? asset.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : asset.price.toFixed(3);
        
        const rowHTML = `
            <tr class="ticker-row" id="ticker-${index}">
                <td class="ticker-sym">${asset.sym}</td>
                <td class="ticker-name">${asset.name}</td>
                <td><span class="ticker-class">${asset.cls}</span></td>
                <td class="ticker-price" id="price-${index}">${priceStr}</td>
                <td class="ticker-chg" id="chg-${index}" style="color: ${chgColor};">${chgSign}${asset.chg.toFixed(2)}%</td>
            </tr>
        `;
        grid.insertAdjacentHTML('beforeend', rowHTML);
    });

    // Mesin Simulasi Harga (Berjalan setiap 1 detik)
    setInterval(() => {
        // Pilih 3 sampai 6 aset secara acak untuk diubah harganya
        const numTicks = Math.floor(Math.random() * 4) + 3;
        
        for(let i=0; i<numTicks; i++) {
            const index = Math.floor(Math.random() * globalAssets.length);
            const asset = globalAssets[index];
            
            // Tentukan arah pergerakan (naik atau turun)
            const isUp = Math.random() > 0.5;
            const volatility = asset.price * 0.001; // Pergerakan 0.1%
            const changeAmt = Math.random() * volatility;
            
            asset.price = isUp ? asset.price + changeAmt : asset.price - changeAmt;
            
            // Update elemen HTML
            const priceEl = document.getElementById(`price-${index}`);
            if(priceEl) {
                priceEl.innerText = asset.price > 1000 ? asset.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : asset.price.toFixed(3);
                
                // Hapus class animasi lama, lalu paksa browser memuat ulang animasi baru
                priceEl.classList.remove('tick-up', 'tick-down');
                void priceEl.offsetWidth; // Trik ajaib untuk me-reset animasi CSS
                priceEl.classList.add(isUp ? 'tick-up' : 'tick-down');
            }
        }
    }, 1200); // Eksekusi setiap 1.2 detik
}

// --- AUTO-IGNITE MACRO NEWS ENGINE ---
const macroHeadlines = [
    { source: "BLOOMBERG", text: "FED signals potential 50bps rate cut in upcoming FOMC meeting.", impact: "HIGH" },
    { source: "SEC.GOV", text: "New regulatory framework approved for Dark Pool liquidity routing.", impact: "HIGH" },
    { source: "REUTERS", text: "Global supply chain disruptions ease as Asian shipping routes normalize.", impact: "LOW" },
    { source: "WSJ", text: "Tech giants face new antitrust probes in European markets.", impact: "MED" },
    { source: "FINANCIAL T.", text: "Oil prices surge 4% amid rising geopolitical tensions in the Middle East.", impact: "HIGH" },
    { source: "INSIDER", text: "Whale alert: $1.2B worth of BTC moved from dormant wallet to exchange.", impact: "HIGH" },
    { source: "NIKKEI", text: "Bank of Japan considers abandoning negative interest rate policy.", impact: "MED" }
];

function forceStartMacroNews() {
    const feedContainer = document.getElementById('macro-news-feed');
    if (!feedContainer || feedContainer.dataset.running === "true") return;
    
    feedContainer.dataset.running = "true";

    function addNewsItem() {
        const news = macroHeadlines[Math.floor(Math.random() * macroHeadlines.length)];
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        let impactClass = "impact-low";
        if (news.impact === "HIGH") impactClass = "impact-high";
        if (news.impact === "MED") impactClass = "impact-med";
        
        const newRow = document.createElement('div');
        newRow.className = 'news-row';
        newRow.innerHTML = `
            <span class="news-time" style="color:#888;">${timeStr}</span>
            <span class="news-source" style="color:#d4af37; font-weight:bold; font-size:10px;">[${news.source}]</span>
            <span class="news-headline" style="color:#eee;">${news.text}</span>
            <span class="news-impact ${impactClass}" style="text-align:center; font-size:10px; padding:4px; border-radius:4px;">${news.impact} IMPACT</span>
        `;
        
        feedContainer.prepend(newRow);
        if (feedContainer.children.length > 5) feedContainer.removeChild(feedContainer.lastChild);
        
        setTimeout(addNewsItem, Math.random() * 4000 + 3000); // Tembak berita tiap 3-7 detik
    }

    // Tembak 4 berita instan saat pertama kali menyala
    for(let i=0; i<4; i++) { setTimeout(addNewsItem, i * 200); }
}

// MESIN PEMANTAU OTOMATIS: Mengecek setiap 1 detik apakah layar Market sedang dibuka
setInterval(() => {
    const marketView = document.getElementById('market-view');
    if (marketView && marketView.style.display === 'block') {
        forceStartMacroNews();
    }
}, 1000);

// Panggil fungsi ini saat sistem dimuat
setTimeout(initMarketDatabank, 1000);

// Panggil sekali saat sistem pertama kali dimuat
setTimeout(initQuantumChart, 1000);

// --- GLOBAL MUTE OVERRIDE (SILENT MODE) ---
window.playPremiumClick = function() {};
window.playScannerHum = function() {};
window.playSuccessBeep = function() {};
window.playDefconAlarm = function() {};
window.stopDefconAlarm = function() {};

window.onload = () => {
    renderTable();
    initCharts();
    initCustomCandles();
    updateClock();
    setInterval(updateClock, 1000);
    initTicker();
    initDreamAsset();
    initAISentiment();
    renderTimeline();
    startLiveAnalytics();
    startIntelFeed();
    // generateOrderBook & simulateMarketActivity telah dihapus agar tidak tabrakan.
};  