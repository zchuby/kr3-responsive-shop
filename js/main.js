// Скрипты магазина DECOTA: модальное окно заказа, фильтры каталога,
// галерея товара, кнопка «наверх» и обработка форм.

(function () {
  'use strict';

  // ---------- модальное окно быстрого заказа ----------
  var dialog = document.getElementById('order-dialog');

  function openDialog(productName) {
    if (!dialog) return;
    var productLine = document.getElementById('order-dialog-product');
    var message = document.getElementById('order-dialog-message');
    if (productLine) productLine.textContent = productName || '';
    if (message) message.hidden = true;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('.js-order');
    if (trigger) {
      openDialog(trigger.dataset.product);
    }
  });

  var closeButton = document.getElementById('order-dialog-close');
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      dialog.close();
    });
  }

  var dialogForm = document.getElementById('order-dialog-form');
  if (dialogForm) {
    dialogForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var message = document.getElementById('order-dialog-message');
      if (message) message.hidden = false;
      dialogForm.reset();
    });
  }

  // ---------- фильтры каталога ----------
  var grid = document.getElementById('catalog-grid');

  function applyFilters() {
    if (!grid) return;
    var cat = document.querySelector('input[name="cat"]:checked');
    var catValue = cat ? cat.value : 'all';
    var onlySale = document.getElementById('only-sale');
    var sort = document.getElementById('sort');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
    var visibleCount = 0;

    cards.forEach(function (cardEl) {
      var okCat = catValue === 'all' || cardEl.dataset.cat === catValue;
      var okSale = !onlySale || !onlySale.checked || cardEl.dataset.disc === '1';
      var visible = okCat && okSale;
      cardEl.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (sort && sort.value === 'asc') {
      cards.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
      cards.forEach(function (cardEl) { grid.appendChild(cardEl); });
    } else if (sort && sort.value === 'desc') {
      cards.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
      cards.forEach(function (cardEl) { grid.appendChild(cardEl); });
    }

    var empty = document.getElementById('catalog-empty');
    if (empty) empty.hidden = visibleCount !== 0;
  }

  var catalogSection = document.querySelector('.catalog-filters');
  if (catalogSection) {
    catalogSection.addEventListener('change', applyFilters);
  }

  var resetButton = document.getElementById('filters-reset');
  if (resetButton) {
    resetButton.addEventListener('click', function () {
      var allRadio = document.querySelector('input[name="cat"][value="all"]');
      if (allRadio) allRadio.checked = true;
      var onlySale = document.getElementById('only-sale');
      if (onlySale) onlySale.checked = false;
      var sort = document.getElementById('sort');
      if (sort) sort.value = 'default';
      applyFilters();
    });
  }

  // ---------- галерея на странице товара ----------
  var galleryMain = document.getElementById('gallery-main');
  var thumbs = document.querySelectorAll('.product-gallery__thumb');
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      if (galleryMain) galleryMain.src = thumb.dataset.src;
      thumbs.forEach(function (item) { item.classList.remove('product-gallery__thumb--active'); });
      thumb.classList.add('product-gallery__thumb--active');
    });
  });

  // ---------- кнопка «наверх» ----------
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('back-to-top--visible', window.scrollY > 600);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- обычные формы (страницы заказа и контактов) ----------
  function handleForm(formId, messageId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var message = document.getElementById(messageId);
      if (message) message.hidden = false;
      form.reset();
    });
  }

  handleForm('order-page-form', 'order-page-message');
  handleForm('contacts-form', 'contacts-message');
})();
