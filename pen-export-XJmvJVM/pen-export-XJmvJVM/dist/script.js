/* ========= 유틸 ========= */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

/* ========= 사이드바 토글 (모바일) ========= */
const sidebar = $('#sidebar');
$('#menuToggle')?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

/* ========= 다크모드 ========= */
const root = document.documentElement;
const DARK_KEY = 'gw_dark';
const initDark = () => {
  const saved = localStorage.getItem(DARK_KEY);
  if (saved === '1') root.classList.add('dark');
  $('#darkToggle').setAttribute('aria-pressed', saved === '1' ? 'true' : 'false');
};
initDark();

$('#darkToggle')?.addEventListener('click', () => {
  const isDark = root.classList.toggle('dark');
  localStorage.setItem(DARK_KEY, isDark ? '1' : '0');
  $('#darkToggle').setAttribute('aria-pressed', isDark ? 'true' : 'false');
});

/* ========= 체크리스트(로컬 저장) ========= */
function bindChecklist(wrapper){
  const key = wrapper.dataset.key || 'checklist';
  const inputs = $$('input[type="checkbox"]', wrapper);
  // 로드
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  inputs.forEach(chk => {
    chk.checked = !!saved[chk.value];
    chk.addEventListener('change', () => {
      saved[chk.value] = chk.checked;
      localStorage.setItem(key, JSON.stringify(saved));
    });
  });
}
$$('.checklist').forEach(bindChecklist);

/* ========= 스크롤 시 현재 섹션 하이라이트 ========= */
const tocLinks = $$('#toc a');
const sections = tocLinks.map(a => $(a.getAttribute('href')));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = tocLinks.find(a => a.getAttribute('href') === id);
    if (entry.isIntersecting){
      tocLinks.forEach(a => a.classList.remove('active'));
      link?.classList.add('active');
    }
  });
}, {rootMargin: "0px 0px -70% 0px", threshold: 0});
sections.forEach(sec => sec && observer.observe(sec));

/* ========= 맨 위로 ========= */
$('#scrollTop')?.addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ========= 간단 검색 (제목/본문/목차) ========= */
const searchInput = $('#searchInput');
if (searchInput){
  const items = $$('.section, .card, .accordion, .toc li');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    items.forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = (q === '' || text.includes(q)) ? '' : 'none';
    });
  });
}

/* ========= 접근성: 키보드 포커스 스타일 개선 ========= */
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Tab') document.body.classList.add('show-focus');
});