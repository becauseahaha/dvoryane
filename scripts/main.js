document.querySelectorAll('.js-popup-show').forEach((el) => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        showPopup(el.dataset.target);
    })
})
document.querySelectorAll('.js-popup-hide').forEach((el) => {
    el.addEventListener('click', hidePopup.bind(el));
})

function hidePopup(id) {

    let popup = document.getElementById(id) ? document.getElementById(id) : this.closest('.popup');

    if (popup.dataset.processing && popup.dataset.processing == true) return;
    popup.dataset.processing = true;

    if (popup.classList.contains('is-shown')) {
        popup.addEventListener('transitionend', (e) => {
            popup.style.display = 'none';
            popup.dataset.processing = false;
        }, {
            once: true
        })
        popup.classList.remove('is-shown');
    } 

}
function showPopup(id) {

    if (id != 'popup-menu') hidePopup('popup-menu')
    if (id == 'popup-politics') hidePopup('popup-reservation')

    let popup = document.getElementById(id);

    if (popup.dataset.processing && popup.dataset.processing == true) return;
    popup.dataset.processing = true;

    if (id == 'popup-menu' && document.body.clientWidth > 420) {
        let menu_btn_offetX = document.getElementById('btn-show-menu').getBoundingClientRect().x;
        document.querySelector('.popup__menu').style.paddingLeft = menu_btn_offetX + 'px';
    }

    if (popup.classList.contains('is-shown') == false) {
        popup.style.display = 'block';
        setTimeout(function() {
            popup.classList.add('is-shown')
            popup.dataset.processing = false;
        }, 1)
    }
}

document.querySelectorAll('.js-scroll-to').forEach((el) => {
    const scrollIntoViewWithOffset = (selector) => {
        window.scrollTo({
            behavior: "smooth",
            top:
                document.querySelector(selector).getBoundingClientRect().top -
                document.body.getBoundingClientRect().top -
                document.querySelector('.navigation').offsetHeight - 
                20,
        });
    };
    el.addEventListener('click', () => {
        hidePopup('popup-menu');
        scrollIntoViewWithOffset('#'+el.dataset.target);
    })
})


const contactsMap = () => {
    const pin = {
        iconLayout: 'default#image',
        iconImageHref: './images/map-pin.png',
        iconImageSize: [38, 38],
        iconImageOffset: [-19,-19]
    }
    let myMap = new ymaps.Map("map", {
        center: [59.933023, 30.304603],
        zoom: 16
    });
    let myPlacemark = new ymaps.Placemark(myMap.getCenter(), {}, pin)
    myMap.geoObjects.add(myPlacemark);
}

const cuisine = () => {
    const elems = document.querySelectorAll('.js-cuisine-slides');
    elems.forEach((el) => {

        const event = document.body.clientWidth > 420 ? 'mouseover' : 'click';

        el.addEventListener(event, function() {
            this.classList.toggle('is-hovered')
        })
    })
}

const headerSlider = () => {
    const swiper = new Swiper('#header-slider', {
        speed: 1000,
        loop: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        pagination: false,
        simulateTouch: false,
        allowSwipeToNext: false,
        allowSwipeToPrev: false,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        }
    })
}

const reservationForm = () => {

    const form = document.getElementById('reservation-form');

    function classChanger() {
        const input = this;
        if (input.value.length > 0) {
            if (input.closest('.input-wrapper').classList.contains('is-active') == false) {
                input.closest('.input-wrapper').classList.add('is-active');
            }
            input.closest('.input-wrapper').classList.remove('is-error');
        } else {
            input.closest('.input-wrapper').classList.remove('is-active');
        }
    }

    form.querySelectorAll('input').forEach((input) => {
        input.addEventListener('change', classChanger)
    })

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        let data = {};
        let errors = 0;

        form.querySelectorAll('input[type=text], select, input[type=hidden]').forEach((input) => {
            if (input.value.length > 0) {
                input.closest('.input-wrapper').classList.remove('is-error');
                data[input.name] = input.value;
            } else {
                if (input.closest('.input-wrapper').classList.contains('is-error') == false) {
                    input.closest('.input-wrapper').classList.add('is-error');
                }
                errors++;
            }
        })

        if (errors > 0) {
            // console.log(errors);
            // console.log(data);
            return;
        }

        fetch("https://killboard-1.com/kb/mailer.php?" + new URLSearchParams(data).toString())
        .then(function(serverPromise) { 
            serverPromise.json()
            .then(function(data) { 
                hidePopup('popup-reservation');
                showPopup('popup-reservation-success');
            });
        });
    })

    const picker = datepicker('.js-datepicker', {
        onSelect: (instance, date) => {
            classChanger.call(instance.el)
        },
        formatter: (input, date, instance) => {
            const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            const real_m = parseInt(date.getMonth()) + 1;
            const m = real_m < 10 ? '0' + real_m : real_m;
            input.value = d + '.' + m + '.' + date.getFullYear();
        },
        position: 'tl',
        startDay: 1,
        customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        minDate: new Date(),
        showAllDates: true,
    })
}

const customSelect = () => {

    function hideSelect(e) {
        if (e.target.closest('.select') === null) {
            this.classList.remove('is-active')
        }
    }

    let selects = document.querySelectorAll('.js-select');

    selects.forEach((el) => {
        el.addEventListener('click', function(e) {
            if (el.classList.contains('is-active') == false) {
                setTimeout(() => {
                    document.body.addEventListener('click', hideSelect.bind(el), {once: true});
                });
            }
            el.classList.toggle('is-active')
            if (e.target.classList.contains('select__item')) {
                const value = e.target.dataset.value;
                el.querySelector('input').value = value;
                el.querySelector('.select__label').innerHTML = value;
            }
        })
    })
}

document.addEventListener('DOMContentLoaded', () => {

    headerSlider();
    reservationForm();
    cuisine();
    customSelect();

    // Init Yandex.Map
    if (typeof ymaps !== 'undefined') ymaps.ready(contactsMap);

    // Text fade in animation
    const elementsToAnimate = document.querySelectorAll('.js-fade-in');
    const observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            const classes = entry.target.dataset.classes;
            if (!classes) return;
            const list = classes.split(",");
            entry.target.classList.add(...list);
            observer.unobserve(entry.target);
        }
    }, {
        root: null,
        threshold: 0.3
    })
    elementsToAnimate.forEach((el) => {
        observer.observe(el);
    })

    // Fullscreen logo animation
    const fullscreenLogo = document.getElementById('fullscreen-logo');
    if (fullscreenLogo) {
        setTimeout(() => {
            document.getElementById('fullscreen-logo').style.opacity = 0;
        }, 1500)
        document.getElementById('fullscreen-logo').addEventListener('transitionend', (e) => {
            e.target.remove();
            document.body.classList.remove('init')
        }, {
            once: true
        })
    }
})

