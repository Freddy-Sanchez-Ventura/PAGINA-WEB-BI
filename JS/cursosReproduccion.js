// script.js
document.addEventListener('DOMContentLoaded', function() {
    const treeView = document.querySelector('.tree-view');
    const videoFrame = document.getElementById('videoFrame');
    const listItems = treeView.querySelectorAll('a[data-video-url]');
    const carets = treeView.querySelectorAll('.caret');

    carets.forEach(caret => {
        caret.addEventListener('click', function() {
            const nestedList = this.nextElementSibling;
            if (nestedList && nestedList.classList.contains('nested')) {
                nestedList.classList.toggle('active');
                this.classList.toggle('caret-down');
            }
        });
    });

    listItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const videoUrl = this.getAttribute('data-video-url');
            videoFrame.src = videoUrl;

            const currentActive = document.querySelector('.tree-view a.active-link');
            if (currentActive) {
                currentActive.classList.remove('active-link');
            }
            this.classList.add('active-link');
        });
    });

    const initialActiveLink = document.querySelector('.tree-view a.active-link');
    if (!initialActiveLink && listItems.length > 0) {
        listItems[0].classList.add('active-link');
    }
});