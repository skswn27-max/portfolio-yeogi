// =============================================
// 이난주 포트폴리오 · IP · 콜라보 기획
// =============================================

// 모바일 메뉴 토글
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// 메뉴 클릭 시 닫기
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// 스크롤 시 네비게이션 스타일 변경
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =============================================
// 타이핑 효과
// =============================================
const typingPhrases = [
    '여배우 패딩',
    'Essential Set-Up',
    '클래식을 입은 올냥이'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeEffect() {
    const target = document.getElementById('typing-target');
    if (!target) return;

    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
        target.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
    } else {
        target.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000; // 완성 후 대기
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        typingSpeed = 500; // 다음 문장 전 대기
    }

    setTimeout(typeEffect, typingSpeed);
}

// =============================================
// 스크롤 애니메이션 (Intersection Observer)
// =============================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // 스킬바 애니메이션 처리
            const skillBars = entry.target.querySelectorAll('.skill-bar-fill[data-width]');
            skillBars.forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
                bar.classList.add('animated');
            });
            
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// 기존 fade-in 옵저버도 유지
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// =============================================
// 숫자 카운팅 애니메이션
// =============================================
function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    if (isNaN(target)) return;
    
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (target - start) * eased);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// =============================================
// 초기화
// =============================================
function showHashedCase() {
    const articles = document.querySelectorAll('article[id]');
    if (!articles.length) return;

    let id = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    if (!id) {
        id = 'olivebe';
        if (history.replaceState) {
            history.replaceState(null, '', '#olivebe');
        }
    }
    const match = document.getElementById(id);
    const matchedArticle = match ? match.closest('article') : document.getElementById('olivebe');

    articles.forEach((article) => {
        article.hidden = Boolean(matchedArticle) && article !== matchedArticle;
    });

    if (matchedArticle) {
        window.scrollTo(0, 0);
    }
    syncCaseRail();
}

document.addEventListener('DOMContentLoaded', () => {
    showHashedCase();
    // 타이핑 효과 시작
    setTimeout(typeEffect, 1000);
    
    // data-animate 요소 관찰
    document.querySelectorAll('[data-animate]').forEach(el => {
        scrollObserver.observe(el);
    });
    
    // 기존 fade-in 적용 (카테고리 페이지 제외)
    const isCategoryPage = document.querySelector('.cat-hero');
    if (!isCategoryPage) {
        document.querySelectorAll('.project-item, .capability-item, .skill-block, .stat-item, .contact-link').forEach(el => {
            el.classList.add('fade-in');
            fadeObserver.observe(el);
        });
    }
    
    // 숫자 카운팅 관찰
    document.querySelectorAll('[data-count]').forEach(el => {
        counterObserver.observe(el);
    });
    
    // 스킬카드 전체 컨테이너 관찰 (스킬바 애니메이션)
    document.querySelectorAll('.skill-cards').forEach(el => {
        scrollObserver.observe(el);
    });
    
    // 인스타그램 임베드
    const instagramScript = document.querySelector('script[data-instgrm-embed]');
    if (instagramScript) {
        instagramScript.addEventListener('load', ensureInstagramEmbeds, { once: true });
    }
    ensureInstagramEmbeds();
});

window.addEventListener('hashchange', showHashedCase);

// 인스타그램 임베드 렌더링 보장
const processInstagramEmbeds = () => {
    if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
        window.instgrm.Embeds.process();
        return true;
    }
    return false;
};

const ensureInstagramEmbeds = () => {
    if (processInstagramEmbeds()) return;
    
    let attempts = 0;
    const maxAttempts = 30;
    const intervalId = setInterval(() => {
        attempts++;
        if (processInstagramEmbeds() || attempts >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, 300);
    
    window.addEventListener('load', () => {
        setTimeout(processInstagramEmbeds, 500);
        setTimeout(processInstagramEmbeds, 1500);
        setTimeout(processInstagramEmbeds, 3000);
    });
};

// CSS에 fade-in 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    .fade-in:nth-child(1) { transition-delay: 0s; }
    .fade-in:nth-child(2) { transition-delay: 0.1s; }
    .fade-in:nth-child(3) { transition-delay: 0.2s; }
    .fade-in:nth-child(4) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.closest('.case-rail') || this.closest('.case-pager')) {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 히어로 타이틀 글자 애니메이션 효과
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
}

// =============================================
// 다크/라이트 모드 토글 (RE:FEEEL 스타일)
// =============================================
const darkModeToggle = document.getElementById('darkModeToggle');
const heroSection = document.querySelector('.hero');

let isDarkMode = true; // 기본: 라이트 히어로 (hero-light)

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (heroSection) {
            if (isDarkMode) {
                heroSection.classList.remove('hero-dark-on');
                darkModeToggle.textContent = '🌙';
            } else {
                heroSection.classList.add('hero-dark-on');
                darkModeToggle.textContent = '☀️';
            }
        }
    });
}

// =============================================
// 활성 네비게이션 링크 하이라이트
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => observerNav.observe(section));

function syncCaseRail() {
    const rail = document.querySelector('.case-rail');
    if (!rail) return;
    const hash = window.location.hash || '#olivebe';
    rail.querySelectorAll('a').forEach((link) => {
        link.classList.toggle('is-current', link.getAttribute('href') === hash);
    });
}

window.addEventListener('hashchange', syncCaseRail);
syncCaseRail();
