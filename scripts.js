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

class ProfileSwipe {
    constructor() {
        this.currentProfileIndex = 0;
        this.profileElement = document.querySelector('.profile');
        this.profileImage = document.querySelector('.profile img');
        this.profileName = document.querySelector('.profile h1');
        this.profileAge = document.querySelector('.profile p');
        this.refreshButton = document.querySelector('.buttons button:nth-child(1)');
        this.heartButton = document.querySelector('.buttons button:nth-child(2)');
        this.closeButton = document.querySelector('.buttons button:nth-child(3)');

        this.init();
    }

    init() {
        this.setupTransitions();
        this.attachEventListeners();
        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    setupTransitions() {
        this.profileElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        this.refreshButton.style.transition = 'transform 0.3s ease';
        this.heartButton.style.transition = 'transform 0.3s ease';
        this.closeButton.style.transition = 'transform 0.3s ease';
    }

    updateProfile() {
        if (this.currentProfileIndex >= profiles.length) {
            this.currentProfileIndex = 0;
        }

        const currentProfile = profiles[this.currentProfileIndex];
        this.profileElement.style.opacity = '0';

        setTimeout(() => {
            this.profileImage.src = currentProfile.image;
            this.profileName.textContent = currentProfile.name;
            this.profileAge.textContent = currentProfile.age;
            this.profileElement.style.opacity = '1';
        }, 300);
    }

    refresh() {
        this.refreshButton.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.refreshButton.style.transform = 'rotate(0deg)';
        }, 300);
        this.updateProfile();
    }

    like() {
        this.heartButton.style.transform = 'scale(1.2)';
        this.profileElement.style.transform = 'translateX(100px) rotate(10deg)';

        setTimeout(() => {
            this.heartButton.style.transform = 'scale(1)';
            this.profileElement.style.transform = 'translateX(0) rotate(0)';

            console.log('Liked:', profiles[this.currentProfileIndex].name);
            this.currentProfileIndex++;
            this.updateProfile();
        }, 300);
    }

    pass() {
        this.closeButton.style.transform = 'rotate(90deg)';
        this.profileElement.style.transform = 'translateX(-100px) rotate(-10deg)';

        setTimeout(() => {
            this.closeButton.style.transform = 'rotate(0deg)';
            this.profileElement.style.transform = 'translateX(0) rotate(0)';

            console.log('Passed:', profiles[this.currentProfileIndex].name);
            this.currentProfileIndex++;
            this.updateProfile();
        }, 300);
    }

    attachEventListeners() {
        this.refreshButton.addEventListener('click', () => this.refresh());
        this.heartButton.addEventListener('click', () => this.like());
        this.closeButton.addEventListener('click', () => this.pass());
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.pass();
            } else if (e.key === 'ArrowRight') {
                this.like();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.refresh();
            }
        });
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.profileElement.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.profileElement.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;

        if (endX < startX - swipeThreshold) {
            this.pass();
        }

        if (endX > startX + swipeThreshold) {
            this.like();
        }
    }
}

class DropdownFilter {
    constructor() {
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.setupClickOutside();
    }

    attachEventListeners() {
        this.dropdowns.forEach(dropdown => {
            const dropbtn = dropdown.querySelector('.dropbtn');
            const content = dropdown.querySelector('.dropdown-content, .dropdown-content-school');
            const buttons = content.querySelectorAll('button');
            const countSpan = dropdown.querySelector('.selected-count');

            dropbtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(dropdown);
            });

            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSelection(button, content, countSpan);
                });
            });
        });
    }

    toggleDropdown(currentDropdown) {
        this.dropdowns.forEach(dropdown => {
            if (dropdown !== currentDropdown) {
                dropdown.classList.remove('open');
            }
        });

        currentDropdown.classList.toggle('open');
    }

    toggleSelection(button, content, countSpan) {
        button.classList.toggle('selected');

        const selectedCount = content.querySelectorAll('button.selected').length;

        if (selectedCount > 0) {
            countSpan.textContent = selectedCount;
            countSpan.style.display = 'inline-block';
        } else {
            countSpan.style.display = 'none';
        }
    }

    setupClickOutside() {
        document.addEventListener('click', () => {
            this.dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        });
    }

    getSelectedFilters() {
        const filters = {};

        this.dropdowns.forEach(dropdown => {
            const dropdownTitle = dropdown.querySelector('.dropbtn h1').textContent;
            const selectedButtons = dropdown.querySelectorAll('button.selected');

            if (selectedButtons.length > 0) {
                filters[dropdownTitle] = Array.from(selectedButtons).map(btn =>
                    btn.querySelector('h2').textContent
                );
            }
        });

        return filters;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const profileSwipe = new ProfileSwipe();
    const dropdownFilter = new DropdownFilter();

    const filterButton = document.querySelector('.filter');
    if (filterButton) {
        filterButton.addEventListener('click', () => {
            const selectedFilters = dropdownFilter.getSelectedFilters();
            console.log('Selected Filters:', selectedFilters);
        });
    }
});