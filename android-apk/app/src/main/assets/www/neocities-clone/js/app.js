// 全局变量
let currentCategory = 'objects';
let allItems = {};
let selectedItems = new Set();
let currentItems = [];

// DOM 元素
let tableBody, searchInput, selectedCountSpan, loadingDiv, noResultsDiv;

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化DOM元素
    tableBody = document.getElementById('tableBody');
    searchInput = document.querySelector('.searchTxt');
    selectedCountSpan = document.getElementById('selectedCount');
    loadingDiv = document.getElementById('loading');
    noResultsDiv = document.getElementById('noResults');
    
    initializeApp();
    setupEventListeners();
});

// 初始化应用
async function initializeApp() {
    console.log('Starting app initialization...');
    showLoading(true);
    await loadAllCategories();
    console.log('All categories loaded:', Object.keys(allItems));
    await loadCategory('objects');
    console.log('Objects category loaded, item count:', currentItems.length);
    showLoading(false);
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    searchInput.addEventListener('input', debounce(search, 300));
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            search();
        }
    });

    // 分类切换
    document.querySelectorAll('#categoryTabs .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });

    // 批量操作模态框
    const batchModal = new bootstrap.Modal(document.getElementById('batchModal'));
    window.batchModal = batchModal;
}

// 加载所有分类数据
async function loadAllCategories() {
    const categories = [
        'objects', 'big-craftables', 'tools', 'weapons', 'furniture',
        'boots', 'pants', 'shirts', 'hats', 'trinkets', 'mannequins',
        'flooring', 'wallpaper'
    ];

    for (const category of categories) {
        try {
            const response = await fetch(`./dist/${category}.json`);
            if (response.ok) {
                allItems[category] = await response.json();
                console.log(`Loaded ${category}: ${allItems[category].length} items`);
            } else {
                console.warn(`Failed to load ${category}.json`);
                allItems[category] = [];
            }
        } catch (error) {
            console.error(`Error loading ${category}:`, error);
            allItems[category] = [];
        }
    }
}

// 切换分类
async function switchCategory(category) {
    currentCategory = category;
    
    // 更新标签状态
    document.querySelectorAll('#categoryTabs .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // 清除选择和搜索
    clearSelection();
    searchInput.value = '';
    
    // 加载分类数据
    await loadCategory(category);
}

// 加载分类数据
async function loadCategory(category) {
    showLoading(true);
    
    if (!allItems[category]) {
        console.error(`Category ${category} not found`);
        showLoading(false);
        return;
    }
    
    currentItems = allItems[category];
    renderItems(currentItems);
    showLoading(false);
}

// 渲染物品列表
function renderItems(items) {
    console.log('renderItems called with:', items ? items.length : 'null', 'items');
    console.log('tableBody element:', tableBody);
    
    if (!tableBody) {
        console.error('tableBody element not found!');
        return;
    }
    
    if (!items || items.length === 0) {
        console.log('No items to render');
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">没有找到物品</td></tr>';
        showNoResults(true);
        return;
    }
    
    showNoResults(false);
    
    tableBody.innerHTML = items.map((item, index) => {
        const itemId = item.id || 'N/A';
        const itemName = getItemName(item);
        const itemImage = getItemImage(item);
        const isSelected = selectedItems.has(`${currentCategory}-${itemId}`);
        
        return `
            <tr class="item-row ${isSelected ? 'selected' : ''}" data-item-id="${itemId}" data-category="${currentCategory}">
                <td class="text-center">
                    <input type="checkbox" class="item-checkbox" 
                           ${isSelected ? 'checked' : ''}
                           onchange="toggleItemSelection('${currentCategory}-${itemId}', this)">
                </td>
                <td class="text-center">
                    <img src="${itemImage}" alt="${itemName}" class="item-image" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yNCAzMkMyOC40MTgzIDMyIDMyIDI4LjQxODMgMzIgMjRDMzIgMTkuNTgxNyAyOC40MTgzIDE2IDI0IDE2QzE5LjU4MTcgMTYgMTYgMTkuNTgxNyAxNiAyNEMxNiAyOC40MTgzIDE5LjU4MTcgMzIgMjQgMzJaIiBzdHJva2U9IiNERUUyRTYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'">
                </td>
                <td class="item-name">${itemName}</td>
                <td class="text-center">
                    <span class="item-id">${itemId}</span>
                </td>
                <td>
                    <div class="copy-buttons">
                        <button class="copy-btn" onclick="copyItemCode('${currentCategory}', '${itemId}', 'chicken')" 
                                title="复制宠物名称格式">🐔</button>
                        <button class="copy-btn" onclick="copyItemCode('${currentCategory}', '${itemId}', 'player')" 
                                title="复制玩家名称格式">👤</button>
                        <button class="copy-btn" onclick="copyItemCode('${currentCategory}', '${itemId}', 'chat')" 
                                title="复制聊天命令格式">💬</button>
                        <button class="copy-btn" onclick="showItemModal('${currentCategory}', '${itemId}')" 
                                title="自定义设置">⚙️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // 添加淡入动画
    setTimeout(() => {
        document.querySelectorAll('.item-row').forEach((row, index) => {
            row.style.animationDelay = `${index * 0.05}s`;
            row.classList.add('fade-in');
        });
    }, 100);
}

// 获取物品名称
function getItemName(item) {
    if (item.names) {
        // 优先使用中文名称
        if (item.names['data-zh-CN']) {
            return item.names['data-zh-CN'];
        }
        // 如果没有中文，使用英文
        if (item.names['data-en-US']) {
            return item.names['data-en-US'];
        }
        // 使用第一个可用的名称
        const firstLang = Object.keys(item.names)[0];
        if (firstLang && item.names[firstLang]) {
            return item.names[firstLang];
        }
    }
    if (item.name) {
        return item.name;
    }
    return 'Unknown Item';
}

// 获取物品图片
function getItemImage(item) {
    if (item.image) {
        return `data:image/png;base64,${item.image}`;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yNCAzMkMyOC40MTgzIDMyIDMyIDI4LjQxODMgMzIgMjRDMzIgMTkuNTgxNyAyOC40MTgzIDE2IDI0IDE2QzE5LjU4MTcgMTYgMTYgMTkuNTgxNyAxNiAyNEMxNiAyOC40MTgzIDE5LjU4MTcgMzIgMjQgMzJaIiBzdHJva2U9IiNERUUyRTYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
}

// 搜索功能
function search() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderItems(currentItems);
        return;
    }
    
    const filteredItems = currentItems.filter(item => {
        const itemName = getItemName(item).toLowerCase();
        const itemId = String(item.id || '').toLowerCase();
        return itemName.includes(searchTerm) || itemId.includes(searchTerm);
    });
    
    renderItems(filteredItems);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 切换物品选择状态
function toggleItemSelection(itemKey, checkbox) {
    if (checkbox.checked) {
        selectedItems.add(itemKey);
        checkbox.closest('tr').classList.add('selected');
    } else {
        selectedItems.delete(itemKey);
        checkbox.closest('tr').classList.remove('selected');
    }
    updateSelectedCount();
}

// 更新选中数量显示
function updateSelectedCount() {
    selectedCountSpan.textContent = selectedItems.size;
}

// 全选功能
function selectAll() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            checkbox.checked = true;
            const row = checkbox.closest('tr');
            const itemId = row.getAttribute('data-item-id');
            const category = row.getAttribute('data-category');
            selectedItems.add(`${category}-${itemId}`);
            row.classList.add('selected');
        }
    });
    updateSelectedCount();
}

// 清除选择
function clearSelection() {
    selectedItems.clear();
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('tr').classList.remove('selected');
    });
    updateSelectedCount();
}

// 复制物品代码
function copyItemCode(category, itemId, format, quantity = 1, quality = 0) {
    let code = '';
    
    switch (format) {
        case 'chicken':
            code = generateChickenCode(category, itemId, quantity, quality);
            break;
        case 'player':
            code = generatePlayerCode(category, itemId, quantity, quality);
            break;
        case 'chat':
            code = generateChatCode(category, itemId, quantity, quality);
            break;
        default:
            code = `[${getCategoryPrefix(category)}${itemId}]`;
    }
    
    copyToClipboard(code);
    showToast('代码已复制到剪贴板');
}

// 生成宠物名称格式代码
function generateChickenCode(category, itemId, quantity = 1, quality = 0) {
    const prefix = getCategoryPrefix(category);
    if (quantity === 1 && quality === 0) {
        return `[${prefix}${itemId}]`;
    }
    return `#$action AddItem ${prefix}${itemId} ${quantity} ${quality} 0`;
}

// 生成玩家名称格式代码
function generatePlayerCode(category, itemId, quantity = 1, quality = 0) {
    const prefix = getCategoryPrefix(category);
    return `[${prefix}${itemId}]`;
}

// 生成聊天命令格式代码
function generateChatCode(category, itemId, quantity = 1, quality = 0) {
    const prefix = getCategoryPrefix(category);
    return `/item ${prefix}${itemId} ${quantity} ${quality}`;
}

// 获取分类前缀
function getCategoryPrefix(category) {
    const prefixes = {
        'objects': '(O)',
        'big-craftables': '(BC)',
        'tools': '(T)',
        'weapons': '(W)',
        'furniture': '(F)',
        'boots': '(B)',
        'pants': '(P)',
        'shirts': '(S)',
        'hats': '(H)',
        'trinkets': '(TR)',
        'mannequins': '(M)',
        'flooring': '(FL)',
        'wallpaper': '(WP)'
    };
    return prefixes[category] || '(O)';
}

// 复制到剪贴板
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // 备用方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// 显示 Toast 提示
function showToast(message) {
    const toast = document.getElementById('copyToast');
    const toastBody = toast.querySelector('.toast-body');
    toastBody.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// 复制选中项
function copySelected() {
    if (selectedItems.size === 0) {
        showToast('请先选择要复制的物品');
        return;
    }
    
    const codes = Array.from(selectedItems).map(itemKey => {
        const [category, itemId] = itemKey.split('-');
        return generateChickenCode(category, itemId);
    });
    
    copyToClipboard(codes.join('\\n'));
    showToast(`已复制 ${selectedItems.size} 个物品代码`);
}

// 显示批量操作模态框
function showBatchModal() {
    if (selectedItems.size === 0) {
        showToast('请先选择要操作的物品');
        return;
    }
    window.batchModal.show();
}

// 执行批量复制
function executeBatchCopy() {
    const quantity = parseInt(document.getElementById('batchQuantity').value) || 1;
    const quality = parseInt(document.getElementById('batchQuality').value) || 0;
    const format = document.getElementById('batchFormat').value || 'chicken';
    
    const codes = Array.from(selectedItems).map(itemKey => {
        const [category, itemId] = itemKey.split('-');
        return copyItemCode(category, itemId, format, quantity, quality);
    });
    
    window.batchModal.hide();
    showToast(`已复制 ${selectedItems.size} 个物品的批量代码`);
}

// 显示/隐藏加载状态
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
    document.querySelector('.table-responsive').style.display = show ? 'none' : 'block';
}

// 显示/隐藏无结果提示
function showNoResults(show) {
    noResultsDiv.style.display = show ? 'block' : 'none';
}

// 显示物品详情模态框（预留功能）
function showItemModal(category, itemId) {
    // 这里可以扩展显示物品详细信息的模态框
    showToast('物品详情功能开发中...');
}

// 导出功能（预留）
function exportSelectedItems() {
    if (selectedItems.size === 0) {
        showToast('请先选择要导出的物品');
        return;
    }
    
    const data = Array.from(selectedItems).map(itemKey => {
        const [category, itemId] = itemKey.split('-');
        const item = currentItems.find(item => item.id === itemId);
        return {
            category,
            id: itemId,
            name: getItemName(item),
            code: generateChickenCode(category, itemId)
        };
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stardew-items-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('物品数据已导出');
}