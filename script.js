/* Script portfolio — Ahmad Galih Irwanto */
const header = document.querySelector('.header');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const backTop = document.getElementById('backTop');
const progress = document.getElementById('scrollProgress');
const toast = document.getElementById('toast');

/* Menu mobile */
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

/* Progress bar, shadow navbar, tombol kembali ke atas */
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0) + '%';
  backTop.classList.toggle('show', window.scrollY > 450);
  header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.getElementById('year').textContent = new Date().getFullYear();

/* Animasi muncul saat scroll */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Penanda menu aktif */
const navItems = document.querySelectorAll('.nav-links > a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

/* Notifikasi singkat */
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
}

/* Download CV: jika assets/CV.pdf belum ada (saat dibuka lewat server), tampilkan pesan */
document.querySelectorAll('[data-cv]').forEach(btn => {
  btn.addEventListener('click', async e => {
    if (!location.protocol.startsWith('http')) return; // buka langsung dari file: biarkan browser menangani
    e.preventDefault();
    try {
      const res = await fetch(btn.getAttribute('href'), { method: 'HEAD' });
      if (!res.ok) throw new Error('missing');
      const a = document.createElement('a');
      a.href = btn.getAttribute('href');
      a.download = btn.getAttribute('download') || 'CV.pdf';
      document.body.appendChild(a); a.click(); a.remove();
    } catch {
      showToast('File CV belum tersedia. Letakkan CV.pdf di folder assets.');
    }
  });
});
