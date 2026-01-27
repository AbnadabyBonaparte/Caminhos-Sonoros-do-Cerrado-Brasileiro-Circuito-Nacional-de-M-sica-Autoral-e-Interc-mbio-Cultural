// ==========================================
// CAMINHOS SONOROS DO CERRADO BRASILEIRO
// JavaScript Principal
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // CONFIGURAÇÕES INICIAIS
    // ==========================================
    
    const fixedCta = document.getElementById('fixedCta');
    const backToTop = document.getElementById('backToTop');
    const participacaoForm = document.getElementById('participacaoForm');
    const formMessage = document.getElementById('formMessage');
    
    // ==========================================
    // SMOOTH SCROLL PARA LINKS INTERNOS
    // ==========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================
    // FIXED CTA E BACK TO TOP - SCROLL BEHAVIOR
    // ==========================================
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Mostra/oculta Fixed CTA após rolar 300px
        if (currentScroll > 300) {
            fixedCta.classList.add('visible');
        } else {
            fixedCta.classList.remove('visible');
        }
        
        // Mostra/oculta Back to Top após rolar 500px
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        lastScroll = currentScroll;
    });
    
    // Back to Top - Click Event
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==========================================
    // ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER)
    // ==========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.numero-card, .cronograma-card, .atividade-card, .contato-item, .galeria-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ==========================================
    // HERO SCROLL INDICATOR
    // ==========================================
    
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const sobreSection = document.getElementById('sobre');
            if (sobreSection) {
                sobreSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ==========================================
    // FORMULÁRIO DE PARTICIPAÇÃO
    // ==========================================
    
    if (participacaoForm) {
        participacaoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta dos dados do formulário
            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                interesse: document.getElementById('interesse').value,
                mensagem: document.getElementById('mensagem').value,
                timestamp: new Date().toISOString()
            };
            
            // Validação básica
            if (!formData.nome || !formData.email || !formData.cidade || !formData.estado || !formData.interesse) {
                showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Validação de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Simula envio do formulário (aqui você conectaria com backend ou API)
            console.log('Dados do formulário:', formData);
            
            // Feedback de sucesso
            showFormMessage('Obrigado! Seu interesse foi registrado. Em breve entraremos em contato.', 'success');
            
            // Limpa o formulário
            participacaoForm.reset();
            
            // Opcional: Enviar dados para Google Sheets, backend, etc.
            // enviarParaBackend(formData);
        });
    }
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Remove mensagem após 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
        
        // Scroll suave até a mensagem
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // ==========================================
    // LAZY LOADING PARA IMAGENS
    // ==========================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ==========================================
    // CONTADOR ANIMADO PARA NÚMEROS
    // ==========================================
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString('pt-BR');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString('pt-BR');
            }
        }, 16);
    }
    
    // Observa números para animar quando visíveis
    const numeroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const valor = entry.target.textContent.replace(/[^0-9]/g, '');
                if (valor) {
                    animateCounter(entry.target, parseInt(valor));
                    entry.target.dataset.animated = 'true';
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.numero-valor').forEach(el => {
        if (el.textContent.match(/\d/)) {
            numeroObserver.observe(el);
        }
    });
    
    // ==========================================
    // GALERIA - MODAL (OPCIONAL)
    // ==========================================
    
    const galeriaItems = document.querySelectorAll('.galeria-item');
    
    galeriaItems.forEach(item => {
        item.addEventListener('click', function() {
            // Aqui você pode implementar um modal de galeria
            console.log('Clicou na imagem da galeria');
            // Exemplo: abrir lightbox, modal, etc.
        });
    });
    
    // ==========================================
    // TRACKING DE EVENTOS (OPCIONAL - ANALYTICS)
    // ==========================================
    
    function trackEvent(category, action, label) {
        // Integração com Google Analytics, Meta Pixel, etc.
        console.log('Event tracked:', { category, action, label });
        
        // Exemplo Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }
    
    // Track clicks nos botões CTA
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('CTA', 'click', this.textContent.trim());
        });
    });
    
    // Track envio do formulário
    if (participacaoForm) {
        participacaoForm.addEventListener('submit', function() {
            trackEvent('Formulário', 'submit', 'Participação');
        });
    }
    
    // ==========================================
    // PARALLAX SUAVE NO HERO (OPCIONAL)
    // ==========================================
    
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
    
    // ==========================================
    // ACESSIBILIDADE - KEYBOARD NAVIGATION
    // ==========================================
    
    // Melhora navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC fecha modais (se implementados)
        if (e.key === 'Escape') {
            // Fechar modais, overlays, etc.
        }
    });
    
    // ==========================================
    // PREVENÇÃO DE SPAM NO FORMULÁRIO
    // ==========================================
    
    let formSubmitCount = 0;
    const maxSubmits = 3;
    const submitTimeout = 60000; // 1 minuto
    
    if (participacaoForm) {
        const originalSubmit = participacaoForm.onsubmit;
        participacaoForm.addEventListener('submit', function(e) {
            formSubmitCount++;
            
            if (formSubmitCount > maxSubmits) {
                e.preventDefault();
                showFormMessage('Você atingiu o limite de envios. Aguarde alguns minutos.', 'error');
                return false;
            }
            
            // Reset contador após timeout
            setTimeout(() => {
                formSubmitCount = 0;
            }, submitTimeout);
        });
    }
    
    // ==========================================
    // CONSOLE ART (BRANDING)
    // ==========================================
    
    console.log('%c🎵 Caminhos Sonoros do Cerrado Brasileiro', 'font-size: 20px; font-weight: bold; color: #A3472C;');
    console.log('%cCircuito Nacional de Música Autoral e Intercâmbio Cultural', 'font-size: 14px; color: #C68C38;');
    console.log('%cProjeto Funarte 2026 | Instituto Varanda', 'font-size: 12px; color: #6E8B59;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3D4E6B;');
    
    // ==========================================
    // PERFORMANCE MONITORING
    // ==========================================
    
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`⏱️ Página carregada em ${loadTime}ms`);
        
        // Opcional: Enviar para analytics
        // trackEvent('Performance', 'page_load', loadTime);
    });
    
    // ==========================================
    // SERVICE WORKER (PWA - OPCIONAL)
    // ==========================================
    
    if ('serviceWorker' in navigator) {
        // Descomente para habilitar PWA
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('Erro ao registrar Service Worker:', error);
            });
        */
    }
    
});

// ==========================================
// FUNÇÃO AUXILIAR: ENVIAR DADOS PARA BACKEND
// ==========================================

async function enviarParaBackend(formData) {
    try {
        // Exemplo de envio para API REST
        const response = await fetch('/api/participacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao enviar dados');
        }
        
        const result = await response.json();
        console.log('Dados enviados com sucesso:', result);
        return result;
        
    } catch (error) {
        console.error('Erro ao enviar para backend:', error);
        throw error;
    }
}

// ==========================================
// FUNÇÃO AUXILIAR: ENVIAR PARA GOOGLE SHEETS
// ==========================================

async function enviarParaGoogleSheets(formData) {
    // Exemplo usando Google Apps Script Web App
    const scriptURL = 'SEU_SCRIPT_URL_AQUI';
    
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        console.log('Dados enviados para Google Sheets:', result);
        return result;
        
    } catch (error) {
        console.error('Erro ao enviar para Google Sheets:', error);
        throw error;
    }
}

// ==========================================
// UTILITÁRIOS GERAIS
// ==========================================

// Debounce function para performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detectar se é mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Log de device info
console.log('📱 Dispositivo:', isMobile() ? 'Mobile' : 'Desktop');
console.log('🌐 Navegador:', navigator.userAgent.split(')')[0].split('(')[1]);
