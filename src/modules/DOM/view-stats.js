function viewStatsHandler() {
    const statsCont = document.querySelector('.stats-cont');
    const winsCont = document.querySelector('.wins-cont');
    const lossesCont = document.querySelector('.losses-cont');

    // Expand the stats container
    if (statsCont.classList.contains('minimized')) {
        statsCont.classList.add('fade-in-border');

        setTimeout(() => {
            winsCont.classList.add('fade-in');
            lossesCont.classList.add('fade-in');

            statsCont.classList.remove('minimized');
            setTimeout(() => {
                statsCont.classList.remove('fade-in-border');
                winsCont.classList.remove('fade-in');
                lossesCont.classList.remove('fade-in');
            }, 600);
        }, 250);
    } else {
        winsCont.classList.add('fade-out');
        lossesCont.classList.add('fade-out');

        setTimeout(() => {
            statsCont.classList.add('fade-out-border');

            statsCont.classList.add('minimized');
            setTimeout(() => {
                statsCont.classList.remove('fade-out-border');
                winsCont.classList.remove('fade-out');
                lossesCont.classList.remove('fade-out');
            }, 300);
        }, 550);
    }
}

export default function viewStatsEvent() {
    const statsIcon = document.querySelector('.stats-icon');

    statsIcon.addEventListener('click', viewStatsHandler);
}
