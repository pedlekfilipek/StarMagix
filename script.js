// ==== Użytkownicy i hasła ====
const users = {
    'Amelia': {password: 'a123', role: 'user'},
    'Natalia': {password: 'n123', role: 'user'},
    'Zosia': {password: 'z123', role: 'user'},
    'Ola': {password: 'o123', role: 'user'},
    'Magdzia': {password: 'm123', role: 'user'},
    'Aga': {password: 'aga123', role: 'operator'},
    'Filip': {password: 'f123', role: 'operator'}
};

// ==== LOGOWANIE ====
const loginForm = document.getElementById('loginForm');
const error = document.getElementById('error');

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if(users[username] && users[username].password === password){
            localStorage.setItem('username', username);
            localStorage.setItem('role', users[username].role);
            window.location.href = 'koncert.html';
        } else {
            error.textContent = "Nieprawidłowe dane!";
        }
    });
}

// ==== KONCERT ====
window.onload = function(){
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if(!username) { window.location.href = 'index.html'; }

    const userDisplay = document.getElementById('userDisplay');
    if(userDisplay) userDisplay.textContent = `Zalogowany: ${username} (${role})`;

    const rows = document.querySelectorAll('#participants tbody tr');

    rows.forEach(row => {
        const name = row.dataset.name;
        const attendance = row.querySelector('.attendance');
        const reason = row.querySelector('.reason');
        const plusBtn = row.querySelector('.plus');
        const minusBtn = row.querySelector('.minus');
        const plusCount = row.querySelector('.plus-count');
        const minusCount = row.querySelector('.minus-count');

        // załaduj zapisane dane
        const saved = localStorage.getItem(name);
        if(saved){
            const obj = JSON.parse(saved);
            attendance.checked = obj.attendance;
            reason.value = obj.reason;
            plusCount.textContent = obj.plus;
            minusCount.textContent = obj.minus;
        }

        // operatorzy mogą dawać plusy/minusy
        if(role !== 'operator'){
            plusBtn.disabled = true;
            minusBtn.disabled = true;
        }

        plusBtn.addEventListener('click', () => plusCount.textContent = parseInt(plusCount.textContent)+1);
        minusBtn.addEventListener('click', () => minusCount.textContent = parseInt(minusCount.textContent)+1);

        // uczestnicy widzą tylko siebie
        if(role === 'user' && username !== name){
            row.style.display = 'none';
        }
    });

    // ==== ZAPISZ OBECNOŚĆ ====
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        rows.forEach(row => {
            const name = row.dataset.name;
            const attendance = row.querySelector('.attendance').checked;
            const reason = row.querySelector('.reason').value;
            const plus = parseInt(row.querySelector('.plus-count').textContent);
            const minus = parseInt(row.querySelector('.minus-count').textContent);

            localStorage.setItem(name, JSON.stringify({attendance, reason, plus, minus}));
        });
        alert('Zapisano obecność!');
    });

    // ==== RESET NIEOBECNOŚCI (tylko operator) ====
    const resetBtn = document.getElementById('resetBtn');
    if(role !== 'operator'){
        resetBtn.style.display = 'none';
    }
    resetBtn.addEventListener('click', () => {
        ['Amelia','Natalia','Zosia','Ola','Magdzia'].forEach(u => {
            const saved = localStorage.getItem(u);
            if(saved){
                const obj = JSON.parse(saved);
                obj.attendance = false;
                obj.reason = '';
                localStorage.setItem(u, JSON.stringify(obj));
            }
        });
        location.reload();
    });
}
