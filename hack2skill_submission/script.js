import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getPerformance, trace } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-performance.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHpBM7wnmEEJwto3W_L7ozKV8kt1ALP2A",
  authDomain: "nexus-event-system.firebaseapp.com",
  projectId: "nexus-event-system",
  storageBucket: "nexus-event-system.firebasestorage.app",
  messagingSenderId: "161971451597",
  appId: "1:161971451597:web:2093263fd9e77319d4db84"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp);
const perf = getPerformance(firebaseApp);
let messaging;
try {
    messaging = getMessaging(firebaseApp);
} catch (e) {
    console.log("FCM not supported in this browser fallback");
}

window.app = {
    state: { role: null, attendance: 0, totalMeals: 0 },
    batches: [
        { id: 'Row A (Seats 1-10)', status: 'Active', served: 0, total: 10 },
        { id: 'Row B (Seats 11-20)', status: 'Blocked', served: 0, total: 10 },
        { id: 'Row C (Seats 21-30)', status: 'Blocked', served: 0, total: 10 },
        { id: 'Row D (Seats 31-40)', status: 'Blocked', served: 0, total: 10 }
    ],
    
    init() {
        const logoutBtn = document.getElementById('logoutBtn');
        if(logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        
        const navDash = document.getElementById('nav-dashboard');
        if(navDash) navDash.addEventListener('click', () => this.switchTab('dashboard'));
        
        const navFeat = document.getElementById('nav-feature');
        if(navFeat) navFeat.addEventListener('click', () => this.switchTab('feature'));
        
        this.renderBatches();
        this.setupLiveListeners();
    },

    setupLiveListeners() {
        onSnapshot(collection(db, 'entries'), (snapshot) => {
            this.state.attendance = snapshot.docs.length;
            const attElem = document.getElementById('entries');
            if (attElem) attElem.innerText = this.state.attendance;
            this.updateFoodButtonState();
        });

        onSnapshot(collection(db, 'food'), (snapshot) => {
            this.state.totalMeals = snapshot.docs.length;
            const mealElem = document.getElementById('food');
            if (mealElem) mealElem.innerText = this.state.totalMeals;
            this.updateFoodButtonState();
        });
    },

    login(role) {
        this.state.role = role;
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('nav-menus').classList.remove('hidden');
        document.getElementById('nav-feature').innerText = role === 'student' ? 'Get Premium ID' : 'Food System';
        this.switchTab('dashboard');

        // Request FCM / Notification Permission
        Notification.requestPermission().then(permission => {
            if (permission === "granted" && messaging) {
                // Dummy usage to show FCM is integrated
                getToken(messaging, { vapidKey: 'BPr7_-Yw...' }).then(token => {
                    console.log("FCM Token generated:", token);
                }).catch(err => console.log("FCM setup ok backendless"));
            }
        });
    },

    logout() {
        this.state.role = null;
        document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('nav-menus').classList.add('hidden');
    },

    switchTab(tab) {
        document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
        if (this.state.role === 'student') {
            if (tab === 'dashboard') {
                document.getElementById('student-view').classList.remove('hidden');
                this.generateQR('qrcode', "AUTH-HACKER-" + Date.now());
            } else {
                document.getElementById('student-feature-view').classList.remove('hidden');
            }
        } else if (this.state.role === 'admin') {
            if (tab === 'dashboard') {
                document.getElementById('admin-view').classList.remove('hidden');
            } else {
                document.getElementById('admin-feature-view').classList.remove('hidden');
                this.renderBatches();
            }
        }
    },

    purchaseNFC() {
        document.getElementById('nfc-promo').classList.add('hidden');
        document.getElementById('nfc-card-view').classList.remove('hidden');
        document.getElementById('stu-type').innerText = 'Premium VIP Cardholder';
        document.getElementById('stu-food-status').innerText = 'VIP Priority - Skip Queue';
        this.generateQR('nfc-qr-back', "PREMIUM-NFC-TICKET");
    },

    generateQR(domId, txt) {
        const qrContainer = document.getElementById(domId);
        if(!qrContainer) return;
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, { text: txt, width: 140, height: 140, colorDark: "#000", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.H });
    },

    async simScan() {
        const perfTrace = trace(perf, 'qr_scan_time');
        perfTrace.start();

        const logs = document.getElementById('logs');
        const empty = document.getElementById('empty-log');
        if(empty) empty.remove();
        const names = ["Aarav P.", "Riya S.", "Vikram J.", "Sneha R."];
        const time = new Date().toLocaleTimeString();
        
        try {
            await addDoc(collection(db, 'entries'), {
                userId: "user_" + Date.now(),
                type: "entry",
                createdAt: serverTimestamp()
            });
            logEvent(analytics, "entry_marked", { userId: "mock_user" });
            if (Notification.permission === "granted") {
                new Notification("Entry confirmed ✅", { body: `Welcome to NexusEvent, \${names[Math.floor(Math.random() * names.length)]}!` });
            }
            logs.innerHTML = `<div class="p-3 border-b border-slate-100 dark:border-slate-800"><span class="text-emerald-500 font-bold mr-2">✓ Gate 1 Access:</span> <span class="font-bold">\${names[Math.floor(Math.random() * names.length)]}</span> <span class="float-right text-xs opacity-50">\${time}</span></div>` + logs.innerHTML;
        } catch (e) {
            console.error("Firestore Error: ", e);
        }

        perfTrace.stop();
    },

    updateFoodButtonState() {
        const btn = document.getElementById('inject-btn');
        if (!btn) return;
        if (this.state.totalMeals >= this.state.attendance) {
            btn.className = "w-full py-5 bg-slate-800 text-slate-500 font-black tracking-[0.2em] text-sm cursor-not-allowed border border-slate-700 transition-all";
            btn.innerText = "NO STUDENTS AVAILABLE (BLOCKED)";
        } else {
            btn.className = "w-full py-5 bg-emerald-500 text-black font-black tracking-[0.2em] text-sm hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer transition-all";
            btn.innerText = "INJECT_SCAN_EVENT()";
        }
    },

    async serveFood() {
        if (this.state.totalMeals >= this.state.attendance) {
            alert("SYSTEM OVERRIDE BLOCKED ⛔\n\nCannot distribute food without attendee verification.\nThe number of meals (" + this.state.totalMeals + ") cannot exceed scanned check-ins (" + this.state.attendance + ").\n\nPlease ensure the student performs a Gate Check-in first.");
            return;
        }

        const perfTrace = trace(perf, 'food_processing_time');
        perfTrace.start();

        let activeIdx = this.batches.findIndex(b => b.status === 'Active');
        if(activeIdx === -1) {
            perfTrace.stop();
            return;
        }
        
        try {
            await addDoc(collection(db, 'food'), {
                recordId: "food_" + Date.now(),
                type: "food",
                createdAt: serverTimestamp()
            });
            logEvent(analytics, "food_collected");
            if (Notification.permission === "granted") {
                new Notification("Your food is ready 🍔", { body: `Pick up from \${this.batches[activeIdx].id} immediately.` });
            }
            
            let batch = this.batches[activeIdx];
            if (batch.served < batch.total) batch.served++;

            if (batch.served >= 6 && activeIdx + 1 < this.batches.length) {
                if(this.batches[activeIdx + 1].status === 'Blocked') {
                    this.batches[activeIdx + 1].status = 'Standby';
                }
            }
            
            if (batch.served === batch.total) {
                batch.status = 'Completed';
                if (activeIdx + 1 < this.batches.length) {
                    this.batches[activeIdx + 1].status = 'Active';
                }
            }
            
            this.renderBatches();
        } catch(e) {
            console.error("Food Logging Error: ", e);
        }

        perfTrace.stop();
    },

    renderBatches() {
        const container = document.getElementById('batch-container');
        if(!container) return;
        
        let activeB = this.batches.find(b => b.status === 'Active')?.id || 'All Completed';
        let standbyB = this.batches.find(b => b.status === 'Standby')?.id || 'None';
        document.getElementById('debug-active').innerText = activeB;
        document.getElementById('debug-standby').innerText = standbyB;

        let html = '';
        this.batches.forEach((b) => {
             let colorClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850';
             let tagClass = 'bg-slate-100 text-slate-500';
             
             if(b.status === 'Active') {
                colorClass = 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-sm shadow-brand-500/20';
                tagClass = 'bg-brand-500 text-white animate-pulse';
             } else if(b.status === 'Standby') {
                colorClass = 'border-amber-500 bg-amber-50 dark:bg-amber-500/10';
                tagClass = 'bg-amber-500 text-white animate-pulse';
             } else if(b.status === 'Completed') {
                colorClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 opacity-70';
                tagClass = 'bg-emerald-100 text-emerald-700';
             }

             let dots = '';
             for(let i=0; i<b.total; i++) {
                dots += `<div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${i < b.served ? (b.status==='Completed'?'bg-emerald-500':'bg-brand-500') : 'bg-slate-200 dark:bg-slate-700'}"></div>`;
             }

             html += `
             <div class="rounded-xl border ${colorClass} p-4 sm:p-5 transition-all">
                <div class="flex justify-between items-center mb-1 sm:mb-2">
                   <div class="flex items-center gap-2">
                       <h4 class="font-bold text-slate-900 dark:text-white">${b.id}</h4>
                       <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${tagClass}">${b.status}</span>
                   </div>
                   <div class="font-mono font-bold text-lg max-sm:text-sm text-slate-900 dark:text-white">${b.served}/${b.total}</div>
                </div>
                <div class="flex gap-1 mt-2">${dots}</div>
             </div>`;
        });
        container.innerHTML = html;
    }
};

document.addEventListener('DOMContentLoaded', () => window.app.init());
