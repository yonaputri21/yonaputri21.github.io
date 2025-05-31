const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.querySelectorAll('.skill-card, .project-card').forEach((el) => {
    el.classList.add('hidden');
    observer.observe(el);
});

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const x = e.pageX - card.offsetLeft;
        const y = e.pageY - card.offsetTop;

        card.style.transform = `
            perspective(1000px)
            rotateX(${(y - card.offsetHeight/2) / 10}deg)
            rotateY(${-(x - card.offsetWidth/2) / 10}deg)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
    });
});