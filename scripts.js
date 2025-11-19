const profiles = [
    {
        name: "Jennie Kim",
        age: 28,
        image: "img/image.jpeg"
    },
    {
        name: "Сарантуяа",
        age: 19,
        image: "img/profile2.jpg"
    },
    {
        name: "Марал",
        age: 18,
        image: "img/profile3.jpg"
    },
    {
        name: "Хулан",
        age: 21,
        image: "img/profile4.jpg"
    },
    {
        name: "Тэмүүжин",
        age: 20,
        image: "img/profile5.jpg"
    }
];

let currentProfileIndex = 0;
const profileElement = document.querySelector('.profile');
const profileImage = document.querySelector('.profile img');
const profileName = document.querySelector('.profile h1');
const profileAge = document.querySelector('.profile p');


const refreshButton = document.querySelector('.buttons button:nth-child(1)');
const heartButton = document.querySelector('.buttons button:nth-child(2)');
const closeButton = document.querySelector('.buttons button:nth-child(3)');


function updateProfile() {
    if (currentProfileIndex >= profiles.length) {
        currentProfileIndex = 0;
    }

    const currentProfile = profiles[currentProfileIndex];

    profileElement.style.opacity = '0';

    setTimeout(() => {
        profileImage.src = currentProfile.image;
        profileName.textContent = currentProfile.name;
        profileAge.textContent = currentProfile.age;

        profileElement.style.opacity = '1';
    }, 300);
}

profileElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

refreshButton.addEventListener('click', () => {
    refreshButton.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        refreshButton.style.transform = 'rotate(0deg)';
    }, 300);

    updateProfile();
});


heartButton.addEventListener('click', () => {

    heartButton.style.transform = 'scale(1.2)';
    profileElement.style.transform = 'translateX(100px) rotate(10deg)';

    setTimeout(() => {
        heartButton.style.transform = 'scale(1)';
        profileElement.style.transform = 'translateX(0) rotate(0)';

        currentProfileIndex++;
        updateProfile();

        console.log('Liked:', profiles[currentProfileIndex - 1].name);
    }, 300);
});
closeButton.addEventListener('click', () => {
    closeButton.style.transform = 'rotate(90deg)';
    profileElement.style.transform = 'translateX(-100px) rotate(-10deg)';

    setTimeout(() => {
        closeButton.style.transform = 'rotate(0deg)';
        profileElement.style.transform = 'translateX(0) rotate(0)';

        currentProfileIndex++;
        updateProfile();

        console.log('Passed:', profiles[currentProfileIndex - 1].name);
    }, 300);
});


refreshButton.style.transition = 'transform 0.3s ease';
heartButton.style.transition = 'transform 0.3s ease';
closeButton.style.transition = 'transform 0.3s ease';

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        closeButton.click();
    } else if (e.key === 'ArrowRight') {
        heartButton.click();
    } else if (e.key === ' ') {
        e.preventDefault();
        refreshButton.click();
    }
});

let touchStartX = 0;
let touchEndX = 0;

profileElement.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

profileElement.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
        closeButton.click();
    }

    if (touchEndX > touchStartX + swipeThreshold) {
        heartButton.click();
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content, .dropdown-content-school');
        const buttons = content.querySelectorAll('button');
        const countSpan = dropdown.querySelector('.selected-count');

        dropbtn.addEventListener('click', function (e) {
            e.stopPropagation();

            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('open');
                }
            });

            dropdown.classList.toggle('open');
        });

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('selected');

                const selectedCount = content.querySelectorAll('button.selected').length;

                if (selectedCount > 0) {
                    countSpan.textContent = selectedCount;
                    countSpan.style.display = 'inline-block';
                } else {
                    countSpan.style.display = 'none';
                }
            });
        });
    });

    document.addEventListener('click', function () {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    });
});