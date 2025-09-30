// 简化版应用
let allData = {};
let currentCategory = 'objects';
// selectedItems已移除，复选框现在仅用于显示配置状态
let currentItemModal = { category: '', id: '', name: '' };

// 多选模式相关变量
let isMultiSelectMode = true; // 默认开启多选模式
let configuredItems = new Map(); // 存储已配置的物品: key -> {category, id, name, quantity, quality, item}

// 分类映射
const categoryNames = {
    'objects': '物品',
    'big-craftables': '大型手工制品',
    'tools': '工具',
    'weapons': '武器',
    'furniture': '家具',
    'boots': '靴子',
    'pants': '裤子',
    'shirts': '衬衫',
    'hats': '帽子',
    'trinkets': '饰品',
    'mannequins': '模特',
    'flooring': '地板',
    'wallpaper': '壁纸'
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('页面加载完成，开始初始化...');
    
    // 显示加载状态
    showLoading(true);
    
    try {
        // 加载所有分类数据
        await loadAllData();
        
        // 构建全局搜索缓存
        buildGlobalSearchCache();
        
        // 默认显示objects分类
        displayCategory('objects');
        
        // 设置事件监听器
        setupEventListeners();
        
        // 设置警告模态框事件监听器
        setupWarningModalListeners();
        
        // 初始化多选模式界面
        initializeMultiSelectMode();
        
        console.log('初始化完成');
    } catch (error) {
        console.error('初始化失败:', error);
        showError('数据加载失败: ' + error.message);
    } finally {
        showLoading(false);
    }
});

// 加载所有分类数据
async function loadAllData() {
    const categories = Object.keys(categoryNames);
    console.log('开始加载分类:', categories);
    
    for (const category of categories) {
        try {
            console.log(`加载 ${category}...`);
            const response = await fetch(`./dist/${category}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            allData[category] = data;
            console.log(`${category} 加载完成: ${data.length} 个物品`);
            
        } catch (error) {
            console.error(`加载 ${category} 失败:`, error);
            allData[category] = [];
        }
    }
    
    console.log('所有数据加载完成:', Object.keys(allData));
}

// 显示指定分类
function displayCategory(category) {
    console.log(`显示分类: ${category}`);
    
    currentCategory = category;
    
    // 更新标签状态
    updateTabState(category);
    
    if (category === 'configured') {
        // 显示已设置物品列表
        showConfiguredItems();
    } else {
        // 显示正常分类的物品
        const items = allData[category] || [];
        console.log(`分类 ${category} 有 ${items.length} 个物品`);
        
        // 隐藏已设置物品内容
        document.getElementById('configuredItemsContent').style.display = 'none';
        document.querySelector('.table-responsive').style.display = 'block';
        document.getElementById('noResults').style.display = 'none';
        
        // 渲染物品表格
        renderItemTable(items);
    }
    
    // 清除搜索（切换分类时清除搜索）
    clearSearch();
    // 不自动清除选择，让用户保持选择状态
}

// 更新标签状态
function updateTabState(activeCategory) {
    document.querySelectorAll('#categoryTabs .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === activeCategory) {
            link.classList.add('active');
        }
    });
}

// 缓存搜索数据
let searchCache = [];

// 渲染物品表格
function renderItemTable(items) {
    const tableBody = document.getElementById('tableBody');
    
    if (!tableBody) {
        console.error('tableBody 元素未找到');
        return;
    }
    
    if (!items || items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">该分类暂无物品</td></tr>';
        showNoResults(true);
        searchCache = []; // 清空缓存
        return;
    }
    
    showNoResults(false);
    
    console.log(`开始渲染 ${items.length} 个物品`);
    
    // 构建搜索缓存
    searchCache = items.map((item, index) => {
        const itemId = item.id || 'N/A';
        const itemName = getItemName(item);
        const searchText = `${itemName} ${itemId}`.toLowerCase();
        return {
            index,
            itemId,
            itemName,
            searchText,
            item
        };
    });
    
    const html = items.map((item, index) => {
        const itemId = item.id || 'N/A';
        const itemName = getItemName(item);
        const itemImage = getItemImage(item);
        // 不再使用selectedItems
        const isConfigured = configuredItems.has(`${currentCategory}-${itemId}`);
        
        return `
            <tr class="item-row ${isConfigured ? 'configured' : ''}" data-item-id="${itemId}" data-category="${currentCategory}" data-index="${index}">
                <td class="text-center">
                    <div class="checkbox-container">
                        <input type="checkbox" class="item-checkbox" 
                               ${isConfigured ? 'checked' : ''}
                               disabled
                               readonly>
                        ${isConfigured ? '<div class="configured-indicator">✓</div>' : ''}
                    </div>
                </td>
                <td class="text-center">
                    <img src="${itemImage}" alt="${itemName}" class="item-image" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yNCAzMkMyOC40MTgzIDMyIDMyIDI4LjQxODMgMzIgMjRDMzIgMTkuNTgxNyAyOC40MTgzIDE2IDI0IDE2QzE5LjU4MTcgMTYgMTYgMTkuNTgxNyAxNiAyNEMxNiAyOC40MTgzIDE5LjU4MTcgMzIgMjQgMzJaIiBzdHJva2U9IiNERUUyRTYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'">
                </td>
                <td class="item-name">${itemName}</td>
                <td class="text-center">
                    <span class="item-id">${itemId}</span>
                </td>
                <td class="text-center">
                    <div class="copy-buttons">
                        <button class="copy-btn" onclick="showItemModal('${currentCategory}', '${itemId}')" 
                                title="自定义数量和品质">⚙️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = html;
    
    // 添加动画
    setTimeout(() => {
        document.querySelectorAll('.item-row').forEach((row, index) => {
            row.style.animationDelay = `${index * 0.02}s`;
            row.classList.add('fade-in');
        });
    }, 50);
    
    console.log('表格渲染完成');
}

// 获取物品名称
function getItemName(item) {
    if (item.names) {
        return item.names['data-zh-CN'] || 
               item.names['data-en-US'] || 
               Object.values(item.names)[0] || 
               'Unknown Item';
    }
    return item.name || 'Unknown Item';
}

// 获取物品图片
function getItemImage(item) {
    if (item.image) {
        return `data:image/png;base64,${item.image}`;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yNCAzMkMyOC40MTgzIDMyIDMyIDI4LjQxODMgMzIgMjRDMzIgMTkuNTgxNyAyOC40MTgzIDE2IDI0IDE2QzE5LjU4MTcgMTYgMTYgMTkuNTgxNyAxNiAyNEMxNiAyOC40MTgzIDE5LjU4MTcgMzIgMjQgMzJaIiBzdHJva2U9IiNERUUyRTYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
}

// 设置事件监听器
function setupEventListeners() {
    // 分类标签点击
    document.querySelectorAll('#categoryTabs .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            displayCategory(category);
        });
    });
    
    // 搜索功能 - 即时搜索，减少延迟
    const searchInput = document.querySelector('.searchTxt');
    const clearBtn = document.querySelector('.clear-search-btn');
    
    if (searchInput) {
        // 对于快速搜索，减少debounce延迟到50ms，接近即时响应
        searchInput.addEventListener('input', function() {
            debounce(performSearch, 50)();
            
            // 显示或隐藏清空按钮
            if (searchInput.value.trim()) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }
        });
        
        // 同时监听keydown事件，提供更快的响应
        searchInput.addEventListener('keydown', function(e) {
            // 对于退格键和删除键提供即时响应
            if (e.key === 'Backspace' || e.key === 'Delete') {
                setTimeout(() => {
                    performSearch();
                    if (searchInput.value.trim()) {
                        clearBtn.style.display = 'block';
                    } else {
                        clearBtn.style.display = 'none';
                    }
                }, 0);
            }
        });
    }
    
    // 多选模式默认开启，无需按钮切换
    
    console.log('事件监听器设置完成');
}

// 设置警告模态框事件监听器
function setupWarningModalListeners() {
    const warningModal = document.getElementById('nonStackableWarningModal');
    if (warningModal) {
        warningModal.addEventListener('hidden.bs.modal', function () {
            // 模态框关闭时重置复选框状态
            document.getElementById('dontShowAgain').checked = false;
            pendingNonStackableAction = null;
        });
    }
}

// 全局搜索缓存
let globalSearchCache = [];
let isGlobalCacheBuilt = false;

// 构建全局搜索缓存
function buildGlobalSearchCache() {
    if (isGlobalCacheBuilt) return;
    
    console.log('构建全局搜索缓存...');
    globalSearchCache = [];
    
    Object.keys(allData).forEach(category => {
        const items = allData[category] || [];
        items.forEach(item => {
            const itemId = item.id || 'N/A';
            const itemName = getItemName(item);
            const searchText = `${itemName} ${itemId}`.toLowerCase();
            
            globalSearchCache.push({
                ...item,
                category: category,
                itemName: itemName,
                itemId: itemId,
                searchText: searchText
            });
        });
    });
    
    isGlobalCacheBuilt = true;
    console.log(`全局搜索缓存构建完成，共 ${globalSearchCache.length} 个物品`);
}

// 搜索功能 - 全局搜索版本
function performSearch() {
    const searchTerm = document.querySelector('.searchTxt').value.toLowerCase().trim();
    
    // 如果没有搜索词，显示当前分类的所有项目
    if (!searchTerm) {
        displayCategory(currentCategory);
        return;
    }
    
    // 确保全局缓存已构建
    buildGlobalSearchCache();
    
    // 执行全局搜索
    performGlobalSearch(searchTerm);
}

// 全局搜索功能 - 优化版本
function performGlobalSearch(searchTerm) {
    console.log(`开始全局搜索: "${searchTerm}"`);
    
    // 使用缓存进行快速搜索
    const matchedItems = globalSearchCache.filter(item => 
        item.searchText.includes(searchTerm)
    );
    
    console.log(`全局搜索找到 ${matchedItems.length} 个匹配项目`);
    
    // 渲染搜索结果
    renderSearchResults(matchedItems);
}

// 渲染搜索结果
function renderSearchResults(items) {
    const tableBody = document.getElementById('tableBody');
    
    if (!tableBody) {
        console.error('tableBody 元素未找到');
        return;
    }
    
    if (!items || items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">没有找到匹配的物品</td></tr>';
        showNoResults(true);
        return;
    }
    
    showNoResults(false);
    
    console.log(`开始渲染 ${items.length} 个搜索结果`);
    
    const html = items.map((item, index) => {
        const itemId = item.itemId;
        const itemName = item.itemName;
        const itemImage = getItemImage(item);
        const category = item.category;
        // 不再使用selectedItems
        const isConfigured = configuredItems.has(`${category}-${itemId}`);
        
        // 获取分类中文名
        const categoryDisplayName = categoryNames[category] || category;
        
        return `
            <tr class="item-row ${isConfigured ? 'configured' : ''}" data-item-id="${itemId}" data-category="${category}" data-index="${index}">
                <td class="text-center">
                    <div class="checkbox-container">
                        <input type="checkbox" class="item-checkbox" 
                               ${isConfigured ? 'checked' : ''}
                               disabled
                               readonly>
                        ${isConfigured ? '<div class="configured-indicator">✓</div>' : ''}
                    </div>
                </td>
                <td class="text-center">
                    <img src="${itemImage}" alt="${itemName}" class="item-image" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yNCAzMkMyOC40MTgzIDMyIDMyIDI4LjQxODMgMzIgMjRDMzIgMTkuNTgxNyAyOC40MTgzIDE2IDI0IDE2QzE5LjU4MTcgMTYgMTYgMTkuNTgxNyAxNiAyNEMxNiAyOC40MTgzIDE5LjU4MTcgMzIgMjQgMzJaIiBzdHJva2U9IiNERUUyRTYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'">
                </td>
                <td class="item-name">${itemName}</td>
                <td class="text-center">
                    <span class="item-id">${itemId}</span>
                </td>
                <td class="text-center">
                    <div class="copy-buttons">
                        <button class="copy-btn" onclick="showItemModal('${category}', '${itemId}')" 
                                title="自定义数量和品质">⚙️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = html;
    
    // 添加动画
    setTimeout(() => {
        document.querySelectorAll('.item-row').forEach((row, index) => {
            row.style.animationDelay = `${index * 0.02}s`;
            row.classList.add('fade-in');
        });
    }, 50);
    
    console.log('搜索结果渲染完成');
}

// toggleSelection函数已移除，复选框现在仅用于显示配置状态

// 注：selectAll 和 clearSelection 函数已删除，因为不再使用批量选择功能

// 清除搜索
function clearSearch() {
    const searchInput = document.querySelector('.searchTxt');
    if (searchInput) {
        searchInput.value = '';
    }
}

// 清空搜索输入框
function clearSearchInput() {
    const searchInput = document.querySelector('.searchTxt');
    const clearBtn = document.querySelector('.clear-search-btn');
    
    if (searchInput) {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        performSearch(); // 重新执行搜索以显示所有项目
    }
}

// updateSelectedCount函数已移除，不再需要跟踪手动选择

// 多选模式功能

// 初始化多选模式界面
function initializeMultiSelectMode() {
    // 多选模式默认开启，初始化界面状态
    updateConfiguredCount();
}

// 更新已配置物品数量显示
function updateConfiguredCount() {
    const count = configuredItems.size;
    
    // 更新多选操作栏中的数量显示
    const countSpan = document.getElementById('configuredCount');
    if (countSpan) {
        countSpan.textContent = count;
    }
    
    // 更新tab标签中的数量显示
    const tabCountSpan = document.getElementById('configuredTabCount');
    if (tabCountSpan) {
        tabCountSpan.textContent = count;
    }
}

// 保存物品配置
function saveItemConfiguration(quantity, quality) {
    const category = currentItemModal.category;
    const itemId = currentItemModal.id;
    const item = currentItemModal.item;
    const itemName = currentItemModal.name;
    
    // 生成唯一键
    const key = `${category}-${itemId}`;
    
    // 保存配置
    configuredItems.set(key, {
        category: category,
        id: itemId,
        name: itemName,
        quantity: quantity,
        quality: quality,
        item: item
    });
    
    // 更新显示
    updateConfiguredItemsList();
    updateConfiguredCount();
    updateItemDisplayStatus();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
    modal.hide();
    
    // 显示提示
    const qualityNames = ['普通', '银星', '金星', '铱星'];
    const qualityText = qualityNames[quality] || '普通';
    showToast(`已保存配置: ${itemName} ×${quantity} (${qualityText})`);
    
    // 自动生成总代码并复制到剪贴板
    generateAllCodes(true);
}

// 更新物品列表中的显示状态
function updateItemDisplayStatus() {
    // 如果当前在已设置物品tab，不需要更新
    if (currentCategory === 'configured') {
        return;
    }
    
    // 更新当前显示的物品表格
    const rows = document.querySelectorAll('#tableBody .item-row');
    rows.forEach(row => {
        const itemId = row.getAttribute('data-item-id');
        const category = row.getAttribute('data-category');
        const key = `${category}-${itemId}`;
        const isConfigured = configuredItems.has(key);
        
        const checkbox = row.querySelector('.item-checkbox');
        const checkboxContainer = row.querySelector('.checkbox-container');
        const existingIndicator = row.querySelector('.configured-indicator');
        
        if (isConfigured) {
            // 添加已配置样式
            row.classList.add('configured');
            checkbox.checked = true;
            checkbox.disabled = true;
            
            // 添加对勾指示器
            if (!existingIndicator && checkboxContainer) {
                const indicator = document.createElement('div');
                indicator.className = 'configured-indicator';
                indicator.textContent = '✓';
                checkboxContainer.appendChild(indicator);
            }
        } else {
            // 移除已配置样式
            row.classList.remove('configured');
            checkbox.checked = false;
            checkbox.disabled = true; // 所有复选框都应该是disabled的
            
            // 移除对勾指示器
            if (existingIndicator) {
                existingIndicator.remove();
            }
        }
    });
}

// 显示已设置物品内容
function showConfiguredItems() {
    // 隐藏表格，显示已设置物品内容
    document.querySelector('.table-responsive').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('configuredItemsContent').style.display = 'block';
    
    // 更新已设置物品列表
    updateConfiguredItemsList();
}

// 更新已配置物品列表显示
function updateConfiguredItemsList() {
    const listContainer = document.getElementById('configuredItemsList');
    
    if (configuredItems.size === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-5">
                <p class="text-muted mb-0">暂无已设置的物品</p>
                <p class="text-muted small">在多选模式下点击物品的⚙️按钮进行设置</p>
            </div>
        `;
        return;
    }
    
    const items = Array.from(configuredItems.entries()).map(([key, config]) => {
        const categoryDisplayName = categoryNames[config.category] || config.category;
        const qualityNames = ['普通', '银星', '金星', '铱星'];
        const qualityText = qualityNames[config.quality] || '普通';
        const itemImage = getItemImage(config.item);
        
        return `
            <div class="configured-item" data-key="${key}">
                <div class="configured-item-info" onclick="editConfiguredItem('${key}')" style="cursor: pointer;">
                    <img src="${itemImage}" alt="${config.name}" class="configured-item-image" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjhGOUZBIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjgiIHN0cm9rZT0iI0RFRTJFNiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo='">
                    <div class="configured-item-details">
                        <div class="configured-item-name">${config.name}</div>
                        <div class="configured-item-meta">
                            <span class="configured-item-category">[${categoryDisplayName}]</span>
                            数量: ${config.quantity} | 品质: ${qualityText} | ID: ${getCategoryPrefix(config.category)}${config.id}
                        </div>
                    </div>
                </div>
                <div class="configured-item-actions">
                    <button class="remove-configured-item" onclick="removeConfiguredItem('${key}')" title="删除此配置">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    listContainer.innerHTML = items;
}

// 编辑已配置的物品
function editConfiguredItem(key) {
    const config = configuredItems.get(key);
    if (!config) {
        return;
    }
    
    // 设置当前模态框数据
    currentItemModal = {
        category: config.category,
        id: config.id,
        name: config.name,
        item: config.item
    };
    
    // 显示物品模态框
    showItemModal(config.category, config.id);
    
    // 设置当前的数量和品质值
    setTimeout(() => {
        document.getElementById('itemQuantity').value = config.quantity;
        document.querySelector(`input[name="itemQuality"][value="${config.quality}"]`).checked = true;
        
        // 更新数量按钮状态
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        quantityButtons.forEach(btn => {
            if (btn.getAttribute('data-quantity') === config.quantity.toString()) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }, 100);
}

// 删除已配置的物品
function removeConfiguredItem(key) {
    const config = configuredItems.get(key);
    if (config) {
        configuredItems.delete(key);
        updateConfiguredItemsList();
        updateConfiguredCount();
        
        // 更新物品列表中的显示状态
        updateItemDisplayStatus();
        
        showToast(`已删除配置: ${config.name}`);
    }
}

// 清空所有配置
function clearAllConfigurations() {
    if (configuredItems.size === 0) {
        showToast('没有需要清空的配置');
        return;
    }
    
    if (confirm(`确定要清空所有 ${configuredItems.size} 个已选择的物品配置吗？`)) {
        configuredItems.clear();
        updateConfiguredItemsList();
        updateConfiguredCount();
        updateItemDisplayStatus();
        showToast('已清空所有物品配置');
    }
}

// 生成所有已配置物品的代码
function generateAllCodes(autoGenerated = false) {
    if (configuredItems.size === 0) {
        if (!autoGenerated) {
            showToast('请先选择一些物品再生成代码');
        }
        return;
    }
    
    const allCodes = [];
    
    // 遍历所有已配置的物品
    configuredItems.forEach((config, key) => {
        const prefix = getCategoryPrefix(config.category);
        const prefixLetter = prefix.replace('(', '').replace(')', '');
        const canStack = canItemStack(config.category, config.item);
        
        if (canStack) {
            // 可堆叠物品：使用指定数量
            let formattedQuantity = config.quantity.toString();
            if (config.quantity >= 100) {
                // 对于三位数，在第一位后插入换行：1${^^回车}$23
                formattedQuantity = formattedQuantity.charAt(0) + '${^^' + '\n' + '}$' + formattedQuantity.slice(1);
            }
            
            allCodes.push('#$actio${^^' + '\n' + '}$n Add${^^' + '\n' + '}$Item (${^^' + '\n' + '}$' + prefixLetter + ')' + config.id + ' ' + formattedQuantity + ' ' + config.quality + ' 0');
            
        } else {
            // 不可堆叠物品：生成多组代码
            for (let i = 0; i < config.quantity; i++) {
                allCodes.push('#$actio${^^' + '\n' + '}$n Add${^^' + '\n' + '}$Item (${^^' + '\n' + '}$' + prefixLetter + ')' + config.id + ' 1 ' + config.quality + ' 0');
            }
        }
    });
    
    // 多个项目之间直接连接，不要空行
    const finalCode = allCodes.join('\n');
    
    // 复制到剪贴板
    copyToClipboard(finalCode);
    
    if (!autoGenerated) {
        showToast(`已生成并复制 ${configuredItems.size} 个物品的总代码到剪贴板`);
    }
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

// 判断物品是否可以堆叠，基于星露谷实际游戏规则
function canItemStack(category, item) {
    // 1. 绝对不可堆叠的分类
    const nonStackableCategories = [
        'tools',     // 工具：斧头、锄头、镐、镰刀、喷壶、鱼竿
        'weapons',   // 武器：剑、匕首、棍棒、弹弓
        'boots',     // 鞋子：苔藓靴、皮靴、战斗靴、太空靴
        'hats',      // 帽子和头盔：各种帽子、战斗头盔
        'furniture', // 家具：椅子、桌子、装饰品、地毯
        'mannequins',// 人体模型
        'flooring',  // 地板（每块单独放置）
        'wallpaper'  // 壁纸（每张单独使用）
    ];
    
    if (nonStackableCategories.includes(category)) {
        return false;
    }
    
    // 2. Objects分类中的特殊情况
    if (category === 'objects' && item) {
        const objectType = item.objectType;
        const itemName = getItemName(item);
        
        // 戒指不可堆叠
        if (objectType === 'Ring') {
            return false;
        }
        
        // 钓具不可堆叠（通过名称识别）
        const tackleKeywords = ['浮标', '浮漂', '鱼饵', 'bobber', 'tackle', 'bait'];
        const isTackle = tackleKeywords.some(keyword => 
            itemName.toLowerCase().includes(keyword.toLowerCase())
        );
        if (isTackle) {
            return false;
        }
        
        // 某些特殊任务物品可能不可堆叠
        if (objectType === 'Quest') {
            return false;
        }
    }
    
    // 3. 其他可堆叠分类
    const stackableCategories = [
        'objects',        // 物品（除了上述特殊情况）
        'big-craftables', // 大型手工制品（大多数可堆叠）
        'trinkets',       // 饰品（小装饰品，可堆叠）
        'pants',          // 裤子（虽然是装备，但可能可以堆叠？需要验证）
        'shirts'          // 衬衫（虽然是装备，但可能可以堆叠？需要验证）
    ];
    
    return stackableCategories.includes(category);
}

// 获取物品的最大堆叠数量
function getMaxStackSize(category, item) {
    if (!canItemStack(category, item)) {
        return 1; // 不可堆叠物品最多1个
    }
    
    return 999; // 可堆叠物品最多999个
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

// 显示Toast提示
function showToast(message) {
    const toast = document.getElementById('copyToast');
    if (toast) {
        const toastBody = toast.querySelector('.toast-body');
        if (toastBody) {
            toastBody.textContent = message;
        }
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    } else {
        alert(message); // 备用提示
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    const tableDiv = document.querySelector('.table-responsive');
    
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }
    if (tableDiv) {
        tableDiv.style.display = show ? 'none' : 'block';
    }
}

// 显示/隐藏无结果提示
function showNoResults(show) {
    const noResultsDiv = document.getElementById('noResults');
    if (noResultsDiv) {
        noResultsDiv.style.display = show ? 'block' : 'none';
    }
}

// 显示错误信息
function showError(message) {
    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${message}</td></tr>`;
    }
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

// 批量操作相关函数已删除

// 显示单个物品模态框
function showItemModal(category, itemId) {
    // 查找物品信息
    const items = allData[category] || [];
    const item = items.find(item => item.id === itemId);
    const itemName = item ? getItemName(item) : 'Unknown Item';
    
    currentItemModal = { category, id: itemId, name: itemName, item: item };
    
    // 获取最大堆叠数量
    const maxStack = getMaxStackSize(category, item);
    const canStack = canItemStack(category, item);
    
    // 设置模态框内容
    document.getElementById('itemModalName').textContent = itemName;
    document.getElementById('itemModalId').textContent = `${getCategoryPrefix(category)}${itemId}`;
    
    // 设置数量输入框
    const quantityInput = document.getElementById('itemQuantity');
    quantityInput.value = 1;
    quantityInput.max = maxStack;
    
    // 设置堆叠信息提示
    const stackInfoElement = document.getElementById('stackInfo');
    
    // 设置数量输入提示信息 - 更明显的样式
    if (!canStack) {
        quantityInput.disabled = false;
        quantityInput.title = '此物品不可堆叠，数量>1时会生成多组代码';
        quantityInput.style.backgroundColor = '';
        
        // 使用更明显的样式
        stackInfoElement.className = 'text-warning non-stackable-warning';
        stackInfoElement.innerHTML = '<span class="warning-text"><strong>此物品不可堆叠！</strong> 数量>1时会生成多组代码，每组数量为1</span>';
    } else {
        stackInfoElement.className = 'text-success';
        stackInfoElement.innerHTML = `✅ 此物品可堆叠，最大数量：${maxStack}`;
    }
    
    // 重置品质选择
    document.querySelector('input[name="itemQuality"][value="0"]').checked = true;
    
    // 设置数量按钮事件监听器
    setupQuantityButtons();
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('itemModal'));
    modal.show();
}

// 设置数量按钮事件监听器
function setupQuantityButtons() {
    const quantityInput = document.getElementById('itemQuantity');
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    
    // 为每个数量按钮添加点击事件
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantity = this.getAttribute('data-quantity');
            quantityInput.value = quantity;
            
            // 更新按钮状态
            quantityButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 监听手动输入，更新按钮状态
    quantityInput.addEventListener('input', function() {
        const currentValue = this.value;
        quantityButtons.forEach(btn => {
            if (btn.getAttribute('data-quantity') === currentValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
    
    // 初始设置按钮状态
    const currentValue = quantityInput.value;
    quantityButtons.forEach(btn => {
        if (btn.getAttribute('data-quantity') === currentValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 本地存储键名
const DONT_SHOW_WARNING_KEY = 'stardew_dont_show_non_stackable_warning';

// 检查是否应该显示警告
function shouldShowWarning() {
    return localStorage.getItem(DONT_SHOW_WARNING_KEY) !== 'true';
}

// 设置不再显示警告
function setDontShowWarning() {
    localStorage.setItem(DONT_SHOW_WARNING_KEY, 'true');
}

// 待执行的操作
let pendingNonStackableAction = null;

// 复制单个物品的自定义设置
function copyItemWithSettings() {
    const quantity = parseInt(document.getElementById('itemQuantity').value) || 1;
    const quality = parseInt(document.querySelector('input[name="itemQuality"]:checked').value) || 0;
    
    const category = currentItemModal.category;
    const itemId = currentItemModal.id;
    const item = currentItemModal.item;
    
    // 检查是否可堆叠
    const canStack = canItemStack(category, item);
    const maxStack = getMaxStackSize(category, item);
    
    // 如果是不可堆叠物品且数量>1，显示警告
    if (!canStack && quantity > 1 && shouldShowWarning()) {
        // 设置待执行的操作（默认多选模式）
        pendingNonStackableAction = () => saveItemConfiguration(quantity, quality);
        
        // 显示警告模态框
        document.getElementById('warningItemName').textContent = currentItemModal.name;
        const warningModal = new bootstrap.Modal(document.getElementById('nonStackableWarningModal'));
        warningModal.show();
        return;
    }
    
    // 默认多选模式，保存配置
    saveItemConfiguration(quantity, quality);
}

// 执行复制操作的实际逻辑
function executeCopyItemWithSettings(quantity, quality) {
    const category = currentItemModal.category;
    const itemId = currentItemModal.id;
    const item = currentItemModal.item;
    const prefix = getCategoryPrefix(category);
    const prefixLetter = prefix.replace('(', '').replace(')', '');
    
    // 检查是否可堆叠
    const canStack = canItemStack(category, item);
    const maxStack = getMaxStackSize(category, item);
    
    let code = '';
    
    if (canStack) {
        // 可堆叠物品：验证数量限制
        if (quantity > maxStack) {
            showToast(`错误：${currentItemModal.name} 最多只能堆叠${maxStack}个`);
            return;
        }
        
        // 处理数量的换行分割（999 -> 9${^^，换行，}$99）
        let formattedQuantity = quantity.toString();
        if (quantity >= 100) {
            // 对于三位数，在第一位后插入换行：1${^^回车}$23
            formattedQuantity = formattedQuantity.charAt(0) + '${^^' + '\n' + '}$' + formattedQuantity.slice(1);
        }
        
        code = '#$actio${^^' + '\n' + '}$n Add${^^' + '\n' + '}$Item (${^^' + '\n' + '}$' + prefixLetter + ')' + itemId + ' ' + formattedQuantity + ' ' + quality + ' 0';
        
    } else {
        // 不可堆叠物品：生成多组代码
        const codes = [];
        for (let i = 0; i < quantity; i++) {
            codes.push('#$actio${^^' + '\n' + '}$n Add${^^' + '\n' + '}$Item (${^^' + '\n' + '}$' + prefixLetter + ')' + itemId + ' 1 ' + quality + ' 0');
        }
        code = codes.join('\n');
    }
    
    copyToClipboard(code);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
    modal.hide();
    
    const stackInfo = canStack ? `(可堆叠，最大${maxStack}个)` : `(不可堆叠，生成${quantity}组代码)`;
    showToast(`已复制自定义代码: ${currentItemModal.name} ×${quantity} (品质${quality}) ${stackInfo}`);
}

// 确认不可堆叠物品操作
function confirmNonStackableAction() {
    // 检查是否勾选了"不再提醒"
    const dontShowAgain = document.getElementById('dontShowAgain').checked;
    if (dontShowAgain) {
        setDontShowWarning();
    }
    
    // 关闭警告模态框
    const warningModal = bootstrap.Modal.getInstance(document.getElementById('nonStackableWarningModal'));
    warningModal.hide();
    
    // 执行待处理的操作
    if (pendingNonStackableAction) {
        pendingNonStackableAction();
        pendingNonStackableAction = null;
    }
}

// 注：copySelectedWithSettings 和 executeCopySelectedWithSettings 函数已删除，
// 因为已改为多选模式，使用 generateAllCodes 函数代替