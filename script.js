const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ------------------------------------------------------- hero: people cards */

const PEOPLE = [
  { initials: 'SS', name: 'Samuel Spencer', role: 'Creative Director', color: '#473BF0', spark: 'M0 20 Q10 4 20 16 T40 12 T60 18' },
  { initials: 'KL', name: 'Kit Lehmann', role: 'Data Analyst', color: '#7b8794', spark: 'M0 14 Q15 10 25 16 T45 12 T60 14' },
  { initials: 'AE', name: 'Abigail Emm', role: 'Product Manager', color: '#68d585', spark: 'M0 22 Q12 20 22 12 T42 10 T60 4' }
];

const peopleRoot = $('#people');

if (peopleRoot) {
  peopleRoot.innerHTML = PEOPLE
    .map(
      (p, i) => `
      <div class="person${i === 0 ? ' is-active' : ''}" tabindex="0" role="button">
        <span class="avatar" style="background:${p.color}">${p.initials}</span>
        <b>${p.name}</b>
        <span>${p.role}</span>
        <svg viewBox="0 0 60 28" preserveAspectRatio="none" aria-hidden="true">
          <path d="${p.spark}" fill="none" stroke="${p.color}" stroke-width="1.5" />
        </svg>
      </div>`
    )
    .join('');

  const selectPerson = (card) => {
    $$('.person', peopleRoot).forEach((el) => el.classList.remove('is-active'));
    card.classList.add('is-active');
  };

  peopleRoot.addEventListener('click', (e) => {
    const card = e.target.closest('.person');
    if (card) selectPerson(card);
  });

  peopleRoot.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.person');
    if (!card) return;
    e.preventDefault();
    selectPerson(card);
  });
}

/* -------------------------------------------------------------- faq accordion */

const FAQS = [
  {
    q: 'What services does Veyra offer?',
    a: 'We provide design, development, content, and digital support to help businesses build, launch, and grow their digital presence.'
  },
  {
    q: 'Can you work with our existing team?',
    a: 'Absolutely. We can work alongside your internal team or take ownership of specific projects, depending on what you need.'
  },
  {
    q: 'Do you work with startups and growing businesses?',
    a: 'Yes. We work with businesses at different stages, from early stage ideas and new brands to established companies looking for additional creative and digital support.'
  },
  {
    q: 'Can I hire Veyra for an ongoing project?',
    a: 'Yes. We offer both project based engagements and ongoing support, giving you access to the expertise you need as your business evolves.'
  }
];

const faqRoot = $('#faq');

if (faqRoot) {
  faqRoot.innerHTML = FAQS.map(
    (f, i) => `
    <div class="faq__item${i === 0 ? ' is-open' : ''}">
      <button class="faq__q" type="button" id="faq-q-${i}" aria-expanded="${i === 0}" aria-controls="faq-a-${i}">
        ${f.q}
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" /></svg>
      </button>
      <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
        <div><p>${f.a}</p></div>
      </div>
    </div>`
  ).join('');

  faqRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq__q');
    if (!btn) return;

    const item = btn.closest('.faq__item');
    const willOpen = !item.classList.contains('is-open');

    $$('.faq__item', faqRoot).forEach((el) => {
      el.classList.remove('is-open');
      $('.faq__q', el).setAttribute('aria-expanded', 'false');
    });

    if (willOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

/* -------------------------------------------------------------- mobile nav */

const nav = $('#nav');
const burger = $('#burger');

if (nav && burger) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------- modal + form */

const modal = $('#modal');
const form = $('#project-form');
const toast = $('#toast');

let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

if (modal) {
  $$('[data-open]').forEach((btn) => btn.addEventListener('click', () => modal.showModal()));

  $('#modal-cancel').addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  const setError = (id, message) => {
    const el = $(`[data-err="${id}"]`);
    if (el) el.textContent = message;
  };

  const rules = {
    'f-name': (v) => (v.trim() ? '' : 'Enter your name.'),
    'f-email': (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter a valid email, like name@company.com.'),
    'f-message': (v) => (v.trim().length >= 10 ? '' : 'Add a few details so we can prepare (10+ characters).')
  };

  if (form) {
    Object.keys(rules).forEach((id) => {
      const input = $('#' + id);
      if (!input) return;
      input.addEventListener('input', () => setError(id, ''));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let ok = true;
      Object.keys(rules).forEach((id) => {
        const input = $('#' + id);
        const message = input ? rules[id](input.value) : 'Required.';
        setError(id, message);
        if (message) ok = false;
      });

      if (!ok) return;

      modal.close();
      form.reset();
      showToast("Project sent. We'll reply within one business day.");
    });
  }
}