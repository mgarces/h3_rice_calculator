function setLang(lang) {
  document.documentElement.lang = lang;

  // Update all elements with data-en/data-pt
  document.querySelectorAll('[data-en], [data-pt]').forEach(el => {
    if (lang === 'en' && el.dataset.en) {
      el.textContent = el.dataset.en;
    } else if (lang === 'pt' && el.dataset.pt) {
      el.textContent = el.dataset.pt;
    }
  });

  // Update footer with HTML (for the link)
  var footer = document.querySelector('.site-footer');
  if (footer) {
    footer.innerHTML = lang === 'en' ? footer.getAttribute('data-en') : footer.getAttribute('data-pt');
  }

  // Update warning message
  var warning = document.getElementById('warning');
  if (warning) {
    warning.textContent = lang === 'en' ? warning.getAttribute('data-en') : warning.getAttribute('data-pt');
  }

  // Update results if visible
  if (!document.getElementById('results').classList.contains('hidden')) {
    calculate();
  }

  // Update active button
  document.getElementById('langPT').classList.toggle('active', lang === 'pt');
  document.getElementById('langEN').classList.toggle('active', lang === 'en');
}

function calculate() {
  const rice = parseFloat(document.getElementById('riceInput').value);
  const warning = document.getElementById('warning');
  if (isNaN(rice) || rice <= 0) {
    document.getElementById('results').classList.add('hidden');
    warning.classList.add('hidden');
    return;
  }

  if (rice > 5000) {
    warning.classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
    return;
  } else {
    warning.classList.add('hidden');
  }

  // Calculations
  const water = (rice * 1.53).toFixed(0);
  const butter = (rice * (6.8 / 90)).toFixed(1);
  const oil = (rice * (2.75 / 90)).toFixed(1);

  // Language detection
  const lang = document.documentElement.lang === 'en' ? 'en' : 'pt';

  // Ingredient labels and images
  const items = [
    {
      key: 'water',
      img: 'static/images/water_small.png'
    },
    {
      key: 'butter',
      img: 'static/images/butter_small.png'
    },
    {
      key: 'oil',
      img: 'static/images/oil_small.png'
    }
  ];

  const labels = {
    en: {
      water: 'Water',
      butter: 'Butter',
      oil: 'Oil',
      unitWater: 'mL',
      unitButter: 'g',
      unitOil: 'g'
    },
    pt: {
      water: 'Água',
      butter: 'Manteiga',
      oil: 'Óleo',
      unitWater: 'mL',
      unitButter: 'g',
      unitOil: 'g'
    }
  };

  const values = {
    water: `${water} ${labels[lang].unitWater}`,
    butter: `${butter} ${labels[lang].unitButter}`,
    oil: `${oil} ${labels[lang].unitOil}`
  };

  // Output with images
  const resultsList = document.getElementById('results-list');
  resultsList.innerHTML = items.map(item => `
    <div class="result-item">
      <img src="${item.img}" alt="${labels[lang][item.key]}">
      <div class="result-label">${labels[lang][item.key]}</div>
      <div class="result-value">${values[item.key]}</div>
    </div>
  `).join('');
  document.getElementById('results').classList.remove('hidden');
}

// Set default language on load
window.onload = function() {
  setLang(document.documentElement.lang || 'pt');

  // Enable calculation on Enter key
  document.getElementById('riceInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      calculate();
    }
  });
};
