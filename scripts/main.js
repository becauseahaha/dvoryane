document.querySelectorAll('.js-popup-show').forEach((el) => {
    el.addEventListener('click', () => {
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
    el.addEventListener('click', () => {
        hidePopup('popup-menu');
        document.getElementById(el.dataset.target).scrollIntoView({ behavior: "smooth" });
    })
})

const reservationForm = document.getElementById('reservation-form');
reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let data = {};
    data['name'] = reservationForm.querySelector('input[name="name"]').value;
    data['phone'] = reservationForm.querySelector('input[name="phone"]').value;
    data['guests'] = reservationForm.querySelector('input[name="guests"]').value;
    data['date'] = reservationForm.querySelector('input[name="date"]').value;
    data['time'] = reservationForm.querySelector('select[name="time"]').value;
    // console.log(data);
    // return;
    // fetch("https://killboard-1.com/kb/mailer.php", {
    //     method: "POST",
    //     headers: { "Content-type": "application/json" },
    //     body: JSON.stringify(data)
    // });
    fetch("https://killboard-1.com/kb/mailer.php?" + new URLSearchParams(data).toString())
    .then(function(serverPromise) { 
        serverPromise.json()
        .then(function(data) { 
            hidePopup('popup-reservation');
            showPopup('popup-reservation-success');
        });
    });
})

document.addEventListener('DOMContentLoaded', () => {

    // Keep native datepicker for mobile
    // if (document.body.clientWidth > 420) {
        const picker = datepicker('.js-datepicker', {
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
    // } else {
    //     document.querySelectorAll('.js-datepicker').forEach((el) => {
    //         el.type = 'date';
    //     })
    // }

    // Stylize selects
    customSelect('select');

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
        threshold: 0.7
    })
    elementsToAnimate.forEach((el) => {
        observer.observe(el);
    })

    // Fullscreen logo animation
    setTimeout(() => {
        document.getElementById('fullscreen-logo').style.opacity = 0;
    }, 3000)
    document.getElementById('fullscreen-logo').addEventListener('transitionend', (e) => {
        e.target.remove();
        document.body.classList.remove('init')
    }, {
        once: true
    })
})

