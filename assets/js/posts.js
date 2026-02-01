let currentPage = 1;
const itemsPerPage = 10;
let filteredPosts = [];
let deletePostId = null;

function loadPosts() {
    const posts = getAllPosts();
    filteredPosts = posts;
    renderPosts();
}

function filterPosts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    const posts = getAllPosts();
    filteredPosts = posts.filter(post => {
        const matchSearch = post.title.toLowerCase().includes(search);
        const matchCategory = !category || post.category === category;
        const matchStatus = !status || post.status === status;
        return matchSearch && matchCategory && matchStatus;
    });
    
    currentPage = 1;
    renderPosts();
}

function renderPosts() {
    const tbody = document.getElementById('postsTable');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);
    
    tbody.innerHTML = paginatedPosts.map(post => `
        <tr>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${post.title}</div>
                <div class="text-xs text-gray-500">${post.excerpt.substring(0, 60)}...</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${post.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'published' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${post.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${new Date(post.publishDate).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="editPost('${post.id}')" class="text-green-600 hover:text-green-900">
                    <i data-lucide="edit" class="w-4 h-4"></i>
                </button>
                <button onclick="openDeleteModal('${post.id}')" class="text-red-600 hover:text-red-900">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    lucide.createIcons();
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, filteredPosts.length);
    
    document.getElementById('showingStart').textContent = filteredPosts.length > 0 ? start : 0;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalRecords').textContent = filteredPosts.length;
    
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
    renderPosts();
}

function openPostModal() {
    document.getElementById('postModal').classList.add('active');
    document.getElementById('modalTitle').textContent = 'New Post';
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('postDate').value = formatDate(new Date());
    lucide.createIcons();
}

function closePostModal() {
    document.getElementById('postModal').classList.remove('active');
}

function editPost(id) {
    const posts = getAllPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    document.getElementById('postModal').classList.add('active');
    document.getElementById('modalTitle').textContent = 'Edit Post';
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postImage').value = post.featuredImage;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postTags').value = post.tags.join(', ');
    document.getElementById('postStatus').value = post.status;
    document.getElementById('postDate').value = formatDate(post.publishDate);
    document.getElementById('metaTitle').value = post.metaTitle || '';
    document.getElementById('metaDescription').value = post.metaDescription || '';
    
    lucide.createIcons();
}

function savePost(event) {
    event.preventDefault();
    
    const id = document.getElementById('postId').value;
    const category = document.getElementById('newCategory').value.trim() || document.getElementById('postCategory').value;
    
    const post = {
        id: id || generateId(),
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        excerpt: document.getElementById('postExcerpt').value,
        featuredImage: document.getElementById('postImage').value,
        category: category,
        tags: document.getElementById('postTags').value.split(',').map(t => t.trim()),
        status: document.getElementById('postStatus').value,
        publishDate: document.getElementById('postDate').value,
        metaTitle: document.getElementById('metaTitle').value,
        metaDescription: document.getElementById('metaDescription').value,
        updatedAt: new Date().toISOString()
    };
    
    const posts = getAllPosts();
    if (id) {
        const index = posts.findIndex(p => p.id === id);
        posts[index] = post;
    } else {
        posts.unshift(post);
    }
    
    saveAllPosts(posts);
    closePostModal();
    loadPosts();
    populateCategoryFilter();
    showToast(id ? 'Post updated successfully!' : 'Post created successfully!');
}

function openDeleteModal(id) {
    deletePostId = id;
    document.getElementById('deleteModal').classList.add('active');
    lucide.createIcons();
}

function closeDeleteModal() {
    deletePostId = null;
    document.getElementById('deleteModal').classList.remove('active');
}

function confirmDelete() {
    if (!deletePostId) return;
    
    const posts = getAllPosts();
    const filteredPosts = posts.filter(p => p.id !== deletePostId);
    saveAllPosts(filteredPosts);
    
    closeDeleteModal();
    loadPosts();
    showToast('Post deleted successfully!');
}

function populateCategoryFilter() {
    const posts = getAllPosts();
    const categories = [...new Set(posts.map(p => p.category))];
    const filter = document.getElementById('categoryFilter');
    const currentValue = filter.value;
    
    filter.innerHTML = '<option value="">All Categories</option>' + 
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    filter.value = currentValue;
}

function formatText(type) {
    const textarea = document.getElementById('postContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';
    
    switch(type) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'heading':
            formattedText = `## ${selectedText}`;
            break;
        case 'list':
            formattedText = `- ${selectedText}`;
            break;
        case 'link':
            formattedText = `[${selectedText}](url)`;
            break;
        case 'image':
            formattedText = `![alt text](${selectedText})`;
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.focus();
}

function previewPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const image = document.getElementById('postImage').value;
    
    let html = '<div class="prose">';
    if (image) {
        html += `<img src="${image}" alt="${title}">`;
    }
    html += `<h1>${title}</h1>`;
    html += content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/\*(.*?)\*/g, '<em>$1</em>')
                   .replace(/##\s(.*)/g, '<h2>$1</h2>')
                   .replace(/^-\s(.*)$/gm, '<li>$1</li>')
                   .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
                   .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')
                   .replace(/\n/g, '</p><p>');
    html += '</div>';
    
    document.getElementById('previewContent').innerHTML = html;
    document.getElementById('previewModal').classList.add('active');
    lucide.createIcons();
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('active');
}