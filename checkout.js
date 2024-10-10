document.addEventListener("DOMContentLoaded", () => {
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');

    confirmOrderBtn.addEventListener('click', () => {
        // Here you can add payment validation logic if required
        // For simplicity, we assume that the payment details are correct
        alert('Payment details submitted. Redirecting to order success page.');

        // Redirect to the order success page
        window.location.href = 'ordersuccess.html';
    });
});
