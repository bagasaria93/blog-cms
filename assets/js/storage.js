function getAllPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
}

function saveAllPosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function getAllProjects() {
    const projects = localStorage.getItem('portfolioProjects');
    return projects ? JSON.parse(projects) : [];
}

function saveAllProjects(projects) {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

function getAllMedia() {
    const media = localStorage.getItem('mediaLibrary');
    return media ? JSON.parse(media) : [];
}

function saveAllMedia(media) {
    localStorage.setItem('mediaLibrary', JSON.stringify(media));
}

function initializeData() {
    if (!localStorage.getItem('blogPosts')) {
        localStorage.setItem('blogPosts', JSON.stringify(samplePosts));
    }
    if (!localStorage.getItem('portfolioProjects')) {
        localStorage.setItem('portfolioProjects', JSON.stringify(sampleProjects));
    }
    if (!localStorage.getItem('mediaLibrary')) {
        localStorage.setItem('mediaLibrary', JSON.stringify(sampleMedia));
    }
}

if (typeof samplePosts !== 'undefined') {
    initializeData();
}