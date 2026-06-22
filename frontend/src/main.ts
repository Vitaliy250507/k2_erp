import { api } from './api.js';

const clientsListContainer = document.getElementById('clientsList') as HTMLDivElement;
const ordersListContainer = document.getElementById('ordersList') as HTMLDivElement;

const showAlert = (elementId: string, text: string, isSuccess: boolean) => {
    const alertBlock = document.getElementById(elementId) as HTMLDivElement;
    alertBlock.innerText = text;
    alertBlock.className = `alert-message ${isSuccess ? 'alert-success' : 'alert-error'}`;

    setTimeout(() => { alertBlock.className = 'alert-message'; }, 5000);
};


const buttons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.route-page');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        if (target) document.getElementById(target)?.classList.add('active');
    });
});


const refreshClientsList = async () => {
    try {
        const clients = await api.getClients();
        clientsListContainer.innerHTML = '';
        clients.forEach((c: any) => {
            const card = document.createElement('div');
            card.style.cssText = "background: #f8fafc; padding: 12px 18px; border-radius: 8px; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; display: flex; justify-content: space-between; align-items: center;";
            card.innerHTML = `<div><strong>${c.name}</strong><br><small style="color:#64748b">${c.email}</small></div><span style="font-weight:bold; color:#3b82f6">ID: ${c.id}</span>`;
            clientsListContainer.appendChild(card);
        });
    } catch (e) {}
};
refreshClientsList();


document.getElementById('clientForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('clientName') as HTMLInputElement).value;
    const email = (document.getElementById('clientEmail') as HTMLInputElement).value;

    try {
        const res = await api.createClient({ name, email });
        showAlert('clientAlert', `Клієнта "${res.name}" успішно створено з ID: ${res.id}!`, true);
        (document.getElementById('clientForm') as HTMLFormElement).reset();
        refreshClientsList();
    } catch (err: any) {
        const msg = err.error || err.message || "Не вдалося створити клієнта";
        showAlert('clientAlert', `Помилка: ${msg}`, false);
    }
});

document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = (document.getElementById('itemTitle') as HTMLInputElement).value;
    const price = parseFloat((document.getElementById('itemPrice') as HTMLInputElement).value);

    try {
        const res = await api.createItem({ title, price });
        showAlert('itemAlert', `Товар "${res.title}" успішно додано! Наданий ID: ${res.id}`, true);
        (document.getElementById('itemForm') as HTMLFormElement).reset();
    } catch (err: any) {
        const msg = err.error || err.message || "Не вдалося створити товар";
        showAlert('itemAlert', `Помилка: ${msg}`, false);
    }
});

document.getElementById('orderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const clientId = parseInt((document.getElementById('orderClientId') as HTMLInputElement).value);
    const itemsRaw = (document.getElementById('orderItems') as HTMLInputElement).value;
    const items = itemsRaw.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    try {
        const res = await api.createOrder({ client_id: clientId, items });
        showAlert('orderAlert', `Замовлення №${res.id} успішно оформлено! Сума: $${res.total_amount}`, true);
        (document.getElementById('orderForm') as HTMLFormElement).reset();
    } catch (err: any) {
        const msg = err.error || err.message || "Помилка бізнес-правил";
        showAlert('orderAlert', `Не вдалося створити замовлення: ${msg}`, false);
    }
});

document.getElementById('loadOrders')?.addEventListener('click', async () => {
    const clientId = parseInt((document.getElementById('searchClientId') as HTMLInputElement).value);
    if (isNaN(clientId)) return alert('Вкажіть числовий ID');

    try {
        const orders = await api.getClientOrders(clientId);
        ordersListContainer.innerHTML = '';

        if (!orders || orders.length === 0) {
            ordersListContainer.innerHTML = '<p style="color: #64748b; padding: 10px;">У цього клієнта немає замовлень.</p>';
            return;
        }

        orders.forEach((order: any) => {
            const block = document.createElement('div');
            block.style.cssText = "background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px;";
            const itemsList = order.items.map((i: any) => `${i.title} ($${i.price})`).join(', ');
            const date = new Date(order.created_at).toLocaleString('uk-UA');

            block.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-size:13px; color:#64748b; margin-bottom:8px;">
                    <span><strong>Замовлення №${order.id}</strong></span><span>${date}</span>
                </div>
                <div style="font-size:15px; margin-bottom:10px;"><strong>Товари:</strong> ${itemsList}</div>
                <div style="font-size:16px; font-weight:bold; text-align:right; color:#0f172a;">Сума: $${order.total_amount}</div>
            `;
            ordersListContainer.appendChild(block);
        });
    } catch (err: any) {
        alert("Не вдалося знайти замовлення для такого ID клієнта");
    }
});