import { menuArray } from './data.js';

let selectedItems = [];

const modalContainer = document.getElementById('modal-container');
const paymentModal = document.getElementById('payment-modal');
const loadingModal = document.getElementById('loading-modal');
const thankYouModal = document.getElementById('thank-you-modal');
const payNowBtn = document.getElementById('pay-now-btn');
const completeOrderBtn = document.getElementById('complete-order-btn');
const paymentForm = document.getElementById('payment-form');

document.addEventListener('click', function (e) {
    if (e.target.dataset.button) {
        handleButtonClick(e.target.dataset.button);
    }
    
    if (e.target.classList.contains('remove-item-btn')) {
        const index = parseInt(e.target.dataset.index, 10);
        handleRemoveButtonClick(index);
    }

    if (e.target.id === 'complete-order-btn') {
        showPaymentModal();
    }

    if (e.target.id === 'pay-now-btn') {
        showLoadingModal();
        setTimeout(() => {
            showThankYouModal();
            setTimeout(resetApp, 3000);
        }, 3000);
    }
});

function handleButtonClick(buttonId) {
    const cleanButtonId = buttonId.replace(',', '');
    const targetMenuObj = menuArray.find(item => item.id === parseInt(cleanButtonId, 10));
    selectedItems.push(targetMenuObj);
    renderSelectedItems();
}

function handleRemoveButtonClick(index) {
    selectedItems.splice(index, 1);
    renderSelectedItems();
}

function renderSelectedItems() {
    const orderContainer = document.getElementById('your-order-container');
    orderContainer.innerHTML = '';

    if (selectedItems.length > 0) {
        let itemsHtml = '';

        selectedItems.forEach(function (item, index) {
            itemsHtml += `
                <div class="your-order-container-inner">
                    <p class="name-of-item">${item.name}</p>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                </div>
            `;
        });

        orderContainer.innerHTML = itemsHtml;
    } else {
        orderContainer.innerHTML = '<p>Your order is empty.</p>';
    }

    updateTotalAmount();
}

function updateTotalAmount() {
    const totalAmountElement = document.getElementById('total-amount');
    const totalAmount = selectedItems.reduce((total, item) => total + item.price, 0);
    totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
}

function getFeedHtml() {
    let feedHtml = '';

    menuArray.forEach(function (menu) {
        feedHtml += `
            <div class="main-menu">
                <div class="menu-item-inner">
                    <span class="item-emoji">${menu.emoji}</span>
                    <div>
                        <p class="item-name">${menu.name}</p>
                        <p class="item-ingredients">${menu.ingredients.join(', ')}</p>
                        <p class="item-price">$${menu.price.toFixed(2)}</p>
                        <button class="add-item-btn" data-button="${menu.id}">+</button>
                    </div> 
                </div>
            </div>
        `;
    });

    return feedHtml;
}

function render() {
    const menuContainer = document.getElementById('menu');
    if (!menuContainer) {
        console.error('Menu container not found.');
        return;
    }
    menuContainer.innerHTML = getFeedHtml();
}

function showPaymentModal() {
    modalContainer.style.display = 'block';
    paymentModal.style.display = 'block';
    modalContainer.addEventListener('click', function (e) {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
}

function showLoadingModal() {
    loadingModal.style.display = 'block';
}

function showThankYouModal() {
    const nameInput = document.getElementById('name');
    const userName = nameInput.value;
    thankYouModal.style.display = 'block';
    document.getElementById('thank-you-message').textContent = `Thank you, ${userName}! Your order will be on its way soon!`;
}

function closeModal() {
    modalContainer.style.display = 'none';
    paymentModal.style.display = 'none';
    loadingModal.style.display = 'none';
    thankYouModal.style.display = 'none';
    modalContainer.removeEventListener('click', closeModal);
}

function clearInputFields() {
    const nameInput = document.getElementById('name');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    nameInput.value = '';
    cardNumberInput.value = '';
    expiryDateInput.value = '';
    cvvInput.value = '';
}

function resetApp() {
    selectedItems = [];
    renderSelectedItems();
    clearInputFields();
    closeModal();
}

function showRequiredMessage(input) {
    input.setCustomValidity('This field is required');
}

document.addEventListener('DOMContentLoaded', function () {
    const cardNumberInput = document.getElementById('cardNumber');
    const cvvInput = document.getElementById('cvv');
    const expiryDateInput = document.getElementById('expiryDate');

    cardNumberInput.addEventListener('click', function () {
        showRequiredMessage(cardNumberInput);
    });

    cvvInput.addEventListener('click', function () {
        showRequiredMessage(cvvInput);
    });

    expiryDateInput.addEventListener('click', function () {
        showRequiredMessage(expiryDateInput);
    });
});

function validateNumericInput(input) {
    input.setCustomValidity('');
    const numericValue = input.value.replace(/[^0-9]/g, '');
    input.value = numericValue;
}

function validateExpiryDate(input) {
    input.setCustomValidity('');
    const expiryValue = input.value.replace(/[^0-9\/]/g, '');
    input.value = expiryValue;
}

render();
