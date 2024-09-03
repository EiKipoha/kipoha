document.addEventListener("DOMContentLoaded", function () {
    const pages = document.querySelectorAll('.page');
    const sidebarLinks = document.querySelectorAll('.sidebar ul li');
    let currentPage = document.querySelector('.page.active');

    pages.forEach(page => {
        page.style.opacity = 0;
    });

    setTimeout(function () {
        document.getElementById('loading-screen').style.opacity = 0;
        setTimeout(function () {
            document.getElementById('loading-screen').style.display = 'none';

            currentPage.style.opacity = 1;
            currentPage.classList.add('fade-in');
            setTimeout(() => {
                currentPage.classList.remove('fade-in');
            }, 1000); 
        }, 600);  
    }, 3000);  

    let lastActivePage = localStorage.getItem('activePage');
    if (lastActivePage) {
        const targetPage = document.getElementById(lastActivePage);
        currentPage.classList.remove('active');
        targetPage.classList.add('active');
        currentPage = targetPage;

        sidebarLinks.forEach(link => {
            if (link.getAttribute('data-target') === lastActivePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            const target = this.getAttribute('data-target');

            sidebarLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            const targetPage = document.getElementById(target);
            if (targetPage !== currentPage) {
                document.body.style.overflow = target === 'about' ? 'hidden' : 'auto';

                currentPage.classList.remove('active');
                currentPage.classList.add('fade-out');
                setTimeout(() => {
                    currentPage.classList.remove('fade-out');
                    currentPage.style.opacity = 0;
                    currentPage = targetPage;
                    currentPage.style.opacity = 1;
                    currentPage.classList.add('fade-in');
                    currentPage.classList.add('active');
                    setTimeout(() => {
                        currentPage.classList.remove('fade-in');
                        // Убедитесь, что прокрутка к началу страницы происходит после завершения анимации
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 0); // Добавьте небольшую задержку
                    }, 300); // Убедитесь, что это значение соответствует времени анимации
                    localStorage.setItem('activePage', target);
                }, 300);
            }
        });
    });

    async function getGithubAvatarUrl(username) {
        const apiUrl = `https://api.github.com/users/${username}`;
        
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Ошибка при получении данных пользователя: ${response.statusText}`);
            }
            
            const userData = await response.json();
            return userData.avatar_url;
        } catch (error) {
            console.error(error);
            return 'profile-image.png'; 
        }
    }

    async function setGithubAvatar(username) {
        const avatarImg = document.getElementById('profile-avatar');
        const avatarUrl = await getGithubAvatarUrl(username);
        avatarImg.src = avatarUrl;
    }

    const githubUsername = 'kipoha';
    setGithubAvatar(githubUsername);
});
