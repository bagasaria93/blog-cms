let currentPage = 1;
const itemsPerPage = 9;
let filteredProjects = [];
let deleteProjectId = null;

function loadProjects() {
    const projects = getAllProjects();
    filteredProjects = projects;
    renderProjects();
}

function filterProjects() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    const projects = getAllProjects();
    filteredProjects = projects.filter(project => {
        const matchSearch = project.name.toLowerCase().includes(search) || 
                          project.description.toLowerCase().includes(search);
        const matchCategory = !category || project.category === category;
        const matchStatus = !status || project.status === status;
        return matchSearch && matchCategory && matchStatus;
    });
    
    currentPage = 1;
    renderProjects();
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProjects = filteredProjects.slice(start, end);
    
    grid.innerHTML = paginatedProjects.map(project => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <img src="${project.featuredImage}" alt="${project.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">${project.name}</h3>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${project.status}
                    </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">${project.description.substring(0, 100)}...</p>
                <div class="flex flex-wrap gap-1 mb-3">
                    ${project.techStack.slice(0, 3).map(tech => `
                        <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">${tech}</span>
                    `).join('')}
                    ${project.techStack.length > 3 ? `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">+${project.techStack.length - 3}</span>` : ''}
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div class="flex space-x-2">
                        ${project.projectUrl ? `<a href="${project.projectUrl}" target="_blank" class="text-green-600 hover:text-green-800"><i data-lucide="external-link" class="w-4 h-4"></i></a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="text-green-600 hover:text-green-800"><i data-lucide="github" class="w-4 h-4"></i></a>` : ''}
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editProject('${project.id}')" class="text-green-600 hover:text-green-900">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                        </button>
                        <button onclick="openDeleteModal('${project.id}')" class="text-red-600 hover:text-red-900">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, filteredProjects.length);
    
    document.getElementById('showingStart').textContent = filteredProjects.length > 0 ? start : 0;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalRecords').textContent = filteredProjects.length;
    
    const pagination = document.getElementById('pagination');
    let buttons = '';
    
    if (currentPage > 1) {
        buttons += `<button onclick="changePage(${currentPage - 1})" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">Previous</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            buttons += `<button class="px-3 py-1 bg-green-600 text-white rounded">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            buttons += `<button onclick="changePage(${i})" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            buttons += `<span class="px-2">...</span>`;
        }
    }
    
    if (currentPage < totalPages) {
        buttons += `<button onclick="changePage(${currentPage + 1})" class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">Next</button>`;
    }
    
    pagination.innerHTML = buttons;
}

function changePage(page) {
    currentPage = page;
    renderProjects();
}

function openProjectModal() {
    document.getElementById('projectModal').classList.add('active');
    document.getElementById('modalTitle').textContent = 'New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    lucide.createIcons();
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

function editProject(id) {
    const projects = getAllProjects();
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    document.getElementById('projectModal').classList.add('active');
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('techStack').value = project.techStack.join(', ');
    document.getElementById('projectUrl').value = project.projectUrl || '';
    document.getElementById('githubUrl').value = project.githubUrl || '';
    document.getElementById('demoUrl').value = project.demoUrl || '';
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectStatus').value = project.status;
    document.getElementById('featuredImage').value = project.featuredImage;
    document.getElementById('galleryImages').value = project.gallery.join('\n');
    
    lucide.createIcons();
}

function saveProject(event) {
    event.preventDefault();
    
    const id = document.getElementById('projectId').value;
    const galleryText = document.getElementById('galleryImages').value;
    const galleryArray = galleryText ? galleryText.split('\n').filter(url => url.trim()) : [];
    
    const project = {
        id: id || generateId(),
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        techStack: document.getElementById('techStack').value.split(',').map(t => t.trim()),
        projectUrl: document.getElementById('projectUrl').value,
        githubUrl: document.getElementById('githubUrl').value,
        demoUrl: document.getElementById('demoUrl').value,
        category: document.getElementById('projectCategory').value,
        status: document.getElementById('projectStatus').value,
        featuredImage: document.getElementById('featuredImage').value,
        gallery: galleryArray,
        updatedAt: new Date().toISOString()
    };
    
    const projects = getAllProjects();
    if (id) {
        const index = projects.findIndex(p => p.id === id);
        projects[index] = project;
    } else {
        projects.unshift(project);
    }
    
    saveAllProjects(projects);
    closeProjectModal();
    loadProjects();
    showToast(id ? 'Project updated successfully!' : 'Project created successfully!');
}

function openDeleteModal(id) {
    deleteProjectId = id;
    document.getElementById('deleteModal').classList.add('active');
    lucide.createIcons();
}

function closeDeleteModal() {
    deleteProjectId = null;
    document.getElementById('deleteModal').classList.remove('active');
}

function confirmDelete() {
    if (!deleteProjectId) return;
    
    const projects = getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== deleteProjectId);
    saveAllProjects(filteredProjects);
    
    closeDeleteModal();
    loadProjects();
    showToast('Project deleted successfully!');
}