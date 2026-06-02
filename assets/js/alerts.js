/**
 * Low stock JavaScript alerts — runs on admin dashboard pages
 */

(async function checkLowStock() {
  const pill = document.getElementById('stockStatus');
  if (!pill || !window.NovaApp) return;

  try {
    const { data } = await NovaApp.apiFetch('products.php?low_stock=1');
    const items = data.data || [];
    const count = items.length;

    if (count === 0) {
      pill.textContent = 'Stock levels OK';
      pill.classList.remove('warning');
      return;
    }

    pill.textContent = `${count} low stock alert${count > 1 ? 's' : ''}`;
    pill.classList.add('warning');

    const names = items
      .slice(0, 5)
      .map((p) => `${p.name} (${p.quantity}/${p.min_stock_level})`)
      .join('\n• ');

    const more = count > 5 ? `\n…and ${count - 5} more` : '';
    const message = `⚠ LOW STOCK WARNING\n\n${count} product(s) at or below minimum level:\n\n• ${names}${more}`;

    window.alert(message);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nova Shop — Low Stock', {
        body: `${count} items need restocking`,
        icon: undefined,
      });
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  } catch (err) {
    pill.textContent = 'Stock check unavailable';
    console.warn('Low stock check failed', err);
  }
})();
