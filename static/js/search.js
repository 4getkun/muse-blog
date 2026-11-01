(function () {
  var input = document.getElementById('search-input');
  var form = document.getElementById('search-form');
  var status = document.getElementById('search-status');
  var results = document.getElementById('search-results');
  var index = null;

  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function excerpt(text, q) {
    var lower = text.toLowerCase();
    var pos = q ? lower.indexOf(q.toLowerCase()) : -1;
    var start = pos > 40 ? pos - 40 : 0;
    var snippet = text.slice(start, start + 110);
    if (start > 0) snippet = '…' + snippet;
    if (start + 110 < text.length) snippet += '…';
    return snippet;
  }

  function card(item, q) {
    var d = item.date.split('-');
    var year = d[0], month = parseInt(d[1], 10), day = parseInt(d[2], 10);
    return '<article class="post-card"><a class="card-link" href="' + esc(item.url) + '">' +
      '<div class="card-date-badge" aria-hidden="true">' +
      '<span class="badge-month">' + month + '月</span>' +
      '<span class="badge-day">' + day + '</span>' +
      '<span class="badge-year">' + year + '</span></div>' +
      '<div class="card-body"><h3 class="card-title">' + esc(item.title) + '</h3>' +
      '<p class="card-excerpt">' + esc(excerpt(item.text, q)) + '</p>' +
      '<div class="card-meta"><span class="read-more">続きを読む →</span></div>' +
      '</div></a></article>';
  }

  function run() {
    var q = input.value.trim();
    if (!index) return;
    if (!q) {
      status.textContent = 'キーワードを入力すると、記事のタイトルと本文から探します。';
      results.innerHTML = '';
      return;
    }
    var ql = q.toLowerCase();
    var hits = index.filter(function (item) {
      return item.title.toLowerCase().indexOf(ql) >= 0 || item.text.toLowerCase().indexOf(ql) >= 0;
    });
    status.textContent = '「' + q + '」の検索結果：' + hits.length + '件';
    results.innerHTML = hits.map(function (item) { return card(item, q); }).join('');
  }

  fetch('/index.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      index = data;
      var q = new URLSearchParams(location.search).get('q');
      if (q) input.value = q;
      run();
    })
    .catch(function () {
      status.textContent = '検索インデックスを読み込めませんでした。';
    });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    history.replaceState(null, '', q ? '/search/?q=' + encodeURIComponent(q) : '/search/');
    run();
  });
  input.addEventListener('input', run);
})();
