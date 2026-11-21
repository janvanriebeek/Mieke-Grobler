(function () {
    var STORAGE_KEY = 'mieke-lang';

    function readStoredLang() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null;
        }
    }

    function storeLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (error) {
            // Private browsing can block storage. The toggle still works for this visit.
        }
    }

    function sourceValue(el, suffix) {
        if (!suffix) {
            return el.textContent;
        }
        if (suffix === 'aria') {
            return el.getAttribute('aria-label');
        }
        return el.getAttribute(suffix);
    }

    function textOf(lang, el, suffix) {
        var afName = suffix ? 'data-af-' + suffix : 'data-af';
        var enName = suffix ? 'data-en-' + suffix : 'data-en';
        if (!el.hasAttribute(enName)) {
            el.setAttribute(enName, (sourceValue(el, suffix) || '').trim());
        }
        return el.getAttribute(lang === 'af' ? afName : enName);
    }

    function applyLanguage(lang) {
        lang = lang === 'af' ? 'af' : 'en';
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-af]').forEach(function (el) {
            var value = textOf(lang, el);
            if (value != null) {
                el.textContent = value;
            }
        });

        document.querySelectorAll('[data-af-content]').forEach(function (el) {
            var value = textOf(lang, el, 'content');
            if (value != null) {
                el.setAttribute('content', value);
            }
        });

        document.querySelectorAll('[data-af-alt]').forEach(function (el) {
            var value = textOf(lang, el, 'alt');
            if (value != null) {
                el.setAttribute('alt', value);
            }
        });

        document.querySelectorAll('[data-af-aria]').forEach(function (el) {
            var value = textOf(lang, el, 'aria');
            if (value != null) {
                el.setAttribute('aria-label', value);
            }
        });

        var waText = document.body.getAttribute(lang === 'af' ? 'data-wa-af' : 'data-wa-en');
        if (waText) {
            var href = 'https://wa.me/27649006282?text=' + encodeURIComponent(waText);
            document.querySelectorAll('.js-whatsapp').forEach(function (link) {
                link.setAttribute('href', href);
            });
        }

        document.querySelectorAll('[data-set-lang]').forEach(function (button) {
            button.setAttribute('aria-pressed', button.getAttribute('data-set-lang') === lang ? 'true' : 'false');
        });

        var status = document.getElementById('formStatus');
        if (status && !status.hidden) {
            status.textContent = textOf(lang, status);
        }

        storeLang(lang);
    }

    document.querySelectorAll('[data-set-lang]').forEach(function (button) {
        button.addEventListener('click', function () {
            applyLanguage(button.getAttribute('data-set-lang'));
        });
    });

    var mailLabels = {
        en: {
            title: 'Extra classes enquiry',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            subject: 'Subject',
            message: 'Message'
        },
        af: {
            title: 'Navraag oor ekstra klasse',
            name: 'Naam',
            email: 'E-pos',
            phone: 'Nommer',
            subject: 'Vak',
            message: 'Boodskap'
        }
    };

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var lang = document.documentElement.lang === 'af' ? 'af' : 'en';
            var labels = mailLabels[lang];
            var data = new FormData(contactForm);
            var name = String(data.get('name') || '').trim();
            var email = String(data.get('email') || '').trim();
            var phone = String(data.get('phone') || '').trim();
            var subject = String(data.get('subject') || '').trim();
            var message = String(data.get('message') || '').trim();
            var subjectLine = subject ? labels.title + ': ' + subject : labels.title + ' - ' + name;
            var body = [
                labels.name + ': ' + name,
                labels.email + ': ' + email,
                labels.phone + ': ' + (phone || '-'),
                labels.subject + ': ' + (subject || '-'),
                '',
                message
            ].join('\n');

            window.location.href = 'mailto:miekegrobler03@gmail.com?subject=' +
                encodeURIComponent(subjectLine) + '&body=' + encodeURIComponent(body);

            var status = document.getElementById('formStatus');
            if (status) {
                status.hidden = false;
                status.textContent = textOf(lang, status);
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            var targetId = anchor.getAttribute('href');
            if (!targetId || targetId.length < 2) {
                return;
            }
            var target = document.querySelector(targetId);
            if (!target) {
                return;
            }
            event.preventDefault();
            var nav = document.querySelector('nav');
            var offset = (nav ? nav.offsetHeight : 80) + 16;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    var revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(function (element) {
            observer.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add('is-visible');
        });
    }

    applyLanguage(readStoredLang() === 'af' ? 'af' : 'en');
})();
