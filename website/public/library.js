let authors = [];
let books = [];
let pendingDelete = null; // { kind: 'book' | 'author', id }

document.addEventListener('DOMContentLoaded', function () {
    setupBookModal();
    setupAuthorModal();
    setupDeleteModal();
    loadAll();
});

// ---------- helpers ----------
function $(id) { return document.getElementById(id); }

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text === null || text === undefined ? '' : text;
    return div.innerHTML;
}

function show(modalId) { $(modalId).style.display = 'flex'; }
function hide(modalId) { $(modalId).style.display = 'none'; }

function clearErrors(...ids) { ids.forEach(id => { $(id).textContent = ''; }); }

// every API call goes through here: a logged-out user is sent to /login
async function api(url, options) {
    const response = await fetch(url, options);
    if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Not logged in');
    }
    let data = {};
    try { data = await response.json(); } catch (e) { /* no body */ }
    return { ok: response.ok, data };
}

function showPageError(message) { $('pageError').textContent = message || ''; }

async function uploadImage(kind, id, file) {
    const { ok, data } = await api(`/api/${kind}/${id}/image`, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
    });
    return ok ? '' : (data.error || 'Image upload failed');
}

function thumb(url, label) {
    if (!url) return '<div class="thumb thumb-empty">no image</div>';
    return `<img class="thumb" src="${escapeHtml(url)}" alt="${escapeHtml(label)}">`;
}

// ---------- F2.1: show both tables ----------
async function loadAll() {
    try {
        const [a, b] = await Promise.all([api('/api/authors'), api('/api/books')]);
        if (!a.ok || !b.ok) {
            showPageError('Could not load the library. Check that problem2_DDL.sql and problem2_DML.sql were run.');
            return;
        }
        showPageError('');
        authors = a.data.authors;
        books = b.data.books;
        renderAuthors();
        renderBooks();
    } catch (error) {
        console.error('Error loading library:', error);
    }
}

function authorName(id) {
    const author = authors.find(a => a.author_id === id);
    return author ? author.name : '';
}

function renderBooks() {
    const body = $('booksBody');
    body.innerHTML = '';
    $('booksEmpty').style.display = books.length === 0 ? 'block' : 'none';
    $('booksTable').style.display = books.length === 0 ? 'none' : 'table';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${thumb(book.image, book.title)}</td>
            <td>${book.book_id}</td>
            <td>${escapeHtml(book.title)}</td>
            <td>${Number(book.price).toFixed(2)}</td>
            <td>${book.author_id}<span class="muted"> ${escapeHtml(authorName(book.author_id))}</span></td>
            <td class="actions">
                <button class="btn btn-secondary btn-small" data-edit="${book.book_id}">Edit</button>
                <button class="btn btn-danger btn-small" data-delete="${book.book_id}">Delete</button>
            </td>`;
        row.querySelector('[data-edit]').addEventListener('click', () => openBookModal(book.book_id));
        row.querySelector('[data-delete]').addEventListener('click', () => openDeleteModal('book', book.book_id));
        body.appendChild(row);
    });
}

function renderAuthors() {
    const body = $('authorsBody');
    body.innerHTML = '';
    $('authorsEmpty').style.display = authors.length === 0 ? 'block' : 'none';
    $('authorsTable').style.display = authors.length === 0 ? 'none' : 'table';

    authors.forEach(author => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${thumb(author.image, author.name)}</td>
            <td>${author.author_id}</td>
            <td>${escapeHtml(author.name)}</td>
            <td>${escapeHtml(author.country)}</td>
            <td class="actions">
                <button class="btn btn-secondary btn-small" data-edit="${author.author_id}">Edit</button>
                <button class="btn btn-danger btn-small" data-delete="${author.author_id}">Delete</button>
            </td>`;
        row.querySelector('[data-edit]').addEventListener('click', () => openAuthorModal(author.author_id));
        row.querySelector('[data-delete]').addEventListener('click', () => openDeleteModal('author', author.author_id));
        body.appendChild(row);
    });
}

// ---------- F2.2 / F2.3: add and edit a book ----------
function fillAuthorSelect(selectedId) {
    const select = $('bookAuthor');
    select.innerHTML = '';
    if (authors.length === 0) {
        select.innerHTML = '<option value="">Add an author first</option>';
        return;
    }
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author.author_id;
        option.textContent = `${author.author_id} - ${author.name}`;
        if (author.author_id === selectedId) option.selected = true;
        select.appendChild(option);
    });
}

function openBookModal(bookId) {
    clearErrors('bookTitleError', 'bookPriceError', 'bookAuthorError', 'bookImageError');
    $('bookImage').value = '';
    const book = bookId ? books.find(b => b.book_id === bookId) : null;
    $('bookModalTitle').textContent = book ? 'Edit Book' : 'Add Book';
    $('bookId').value = book ? book.book_id : '';
    $('bookTitle').value = book ? book.title : '';
    $('bookPrice').value = book ? Number(book.price).toFixed(2) : '';
    fillAuthorSelect(book ? book.author_id : null);
    show('bookModal');
}

function setupBookModal() {
    $('addBookBtn').addEventListener('click', () => openBookModal(null));
    $('cancelBook').addEventListener('click', () => hide('bookModal'));
    $('bookModal').addEventListener('click', e => { if (e.target === $('bookModal')) hide('bookModal'); });

    $('bookForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        clearErrors('bookTitleError', 'bookPriceError', 'bookAuthorError', 'bookImageError');

        const id = $('bookId').value;
        const payload = {
            title: $('bookTitle').value.trim(),
            price: $('bookPrice').value.trim(),
            author_id: $('bookAuthor').value
        };

        // client-side checks (the server checks again)
        let bad = false;
        if (!payload.title) { $('bookTitleError').textContent = 'Title is required'; bad = true; }
        else if (payload.title.length > 150) { $('bookTitleError').textContent = 'Title is too long (150 characters at most)'; bad = true; }
        if (payload.price === '') { $('bookPriceError').textContent = 'Price is required'; bad = true; }
        else if (isNaN(Number(payload.price)) || Number(payload.price) < 0) { $('bookPriceError').textContent = 'Price must be a number of 0 or more'; bad = true; }
        if (!payload.author_id) { $('bookAuthorError').textContent = 'Author is required'; bad = true; }
        if (bad) return;

        try {
            const { ok, data } = await api(id ? `/api/books/${id}` : '/api/books', {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!ok) {
                const errs = data.errors || {};
                $('bookTitleError').textContent = errs.title || '';
                $('bookPriceError').textContent = errs.price || '';
                $('bookAuthorError').textContent = errs.author_id || (data.error || '');
                return;
            }
            const file = $('bookImage').files[0];
            if (file) {
                const imageError = await uploadImage('books', id || data.id, file);
                if (imageError) { $('bookImageError').textContent = imageError; await loadAll(); return; }
            }
            hide('bookModal');
            loadAll();
        } catch (error) {
            console.error('Error saving book:', error);
            $('bookTitleError').textContent = 'Failed to save the book';
        }
    });
}

// ---------- F2.2 / F2.3: add and edit an author ----------
function openAuthorModal(authorId) {
    clearErrors('authorNameError', 'authorCountryError', 'authorImageError');
    $('authorImage').value = '';
    const author = authorId ? authors.find(a => a.author_id === authorId) : null;
    $('authorModalTitle').textContent = author ? 'Edit Author' : 'Add Author';
    $('authorId').value = author ? author.author_id : '';
    $('authorName').value = author ? author.name : '';
    $('authorCountry').value = author && author.country ? author.country : '';
    show('authorModal');
}

function setupAuthorModal() {
    $('addAuthorBtn').addEventListener('click', () => openAuthorModal(null));
    $('cancelAuthor').addEventListener('click', () => hide('authorModal'));
    $('authorModal').addEventListener('click', e => { if (e.target === $('authorModal')) hide('authorModal'); });

    $('authorForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        clearErrors('authorNameError', 'authorCountryError', 'authorImageError');

        const id = $('authorId').value;
        const payload = { name: $('authorName').value.trim(), country: $('authorCountry').value.trim() };

        if (!payload.name) { $('authorNameError').textContent = 'Name is required'; return; }
        if (payload.name.length > 100) { $('authorNameError').textContent = 'Name is too long (100 characters at most)'; return; }

        try {
            const { ok, data } = await api(id ? `/api/authors/${id}` : '/api/authors', {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!ok) {
                const errs = data.errors || {};
                $('authorNameError').textContent = errs.name || (data.error || '');
                $('authorCountryError').textContent = errs.country || '';
                return;
            }
            const file = $('authorImage').files[0];
            if (file) {
                const imageError = await uploadImage('authors', id || data.id, file);
                if (imageError) { $('authorImageError').textContent = imageError; await loadAll(); return; }
            }
            hide('authorModal');
            loadAll();
        } catch (error) {
            console.error('Error saving author:', error);
            $('authorNameError').textContent = 'Failed to save the author';
        }
    });
}

// ---------- F2.4 / F2.5: remove a book / remove an author ----------
function openDeleteModal(kind, id) {
    pendingDelete = { kind, id };
    if (kind === 'book') {
        const book = books.find(b => b.book_id === id);
        $('deleteTitle').textContent = 'Delete Book';
        $('deleteMessage').textContent = `Are you sure you want to delete the book "${book ? book.title : id}"?`;
    } else {
        const author = authors.find(a => a.author_id === id);
        const count = books.filter(b => b.author_id === id).length;
        $('deleteTitle').textContent = 'Delete Author';
        $('deleteMessage').textContent = `Are you sure you want to delete "${author ? author.name : id}"? ` +
            `All the books of this author (${count}) will be deleted too.`;
    }
    show('deleteModal');
}

function setupDeleteModal() {
    $('cancelDelete').addEventListener('click', () => { pendingDelete = null; hide('deleteModal'); });
    $('deleteModal').addEventListener('click', e => {
        if (e.target === $('deleteModal')) { pendingDelete = null; hide('deleteModal'); }
    });

    $('confirmDelete').addEventListener('click', async function () {
        if (!pendingDelete) return;
        const { kind, id } = pendingDelete;
        try {
            const { ok, data } = await api(`/api/${kind === 'book' ? 'books' : 'authors'}/${id}`, { method: 'DELETE' });
            pendingDelete = null;
            hide('deleteModal');
            if (!ok) showPageError(data.error || 'Delete failed');
            loadAll();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    });
}
