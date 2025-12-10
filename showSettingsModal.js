// 显示设置弹窗
function showSettingsModal() {
    const content = `
        <h2 style="margin-bottom: 20px;">更多</h2>
        <div style="display: flex; gap: 20px; width: 700px; height: 400px;">
            <!-- 左侧导航 -->
            <div style="width: 200px; background-color: rgba(50, 50, 50, 0.5); border-radius: 8px; padding: 15px;">
                <div style="margin-bottom: 20px;"></div>
                <div class="settings-nav-item active" data-category="general" style="padding: 12px; margin-bottom: 8px; border-radius: 5px; cursor: pointer; transition: all 0.3s; background-color: rgba(255, 255, 255, 0.2); color: #fff;">通用</div>
                <div class="settings-nav-item" data-category="features" style="padding: 12px; margin-bottom: 8px; border-radius: 5px; cursor: pointer; transition: all 0.3s; background-color: transparent; color: #aaa;">功能</div>
                <div class="settings-nav-item" data-category="about" style="padding: 12px; margin-bottom: 8px; border-radius: 5px; cursor: pointer; transition: all 0.3s; background-color: transparent; color: #aaa;">关于</div>
            </div>
            
            <!-- 右侧内容 -->
            <div style="flex: 1; background-color: rgba(50, 50, 50, 0.5); border-radius: 8px; padding: 25px;">
                <!-- 通用设置 -->
                <div id="settings-general" class="settings-content">
                    <h3 style="margin-bottom: 25px; color: #fff; font-size: 18px;">通用</h3>
                    <div class="option-item" style="margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
                        <span class="option-label" style="font-size: 16px;">显示毫秒</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="ms-toggle-modal" ${msToggle.checked ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="option-item">
                        <span class="option-label" style="font-size: 14px; color: #888;">说明：关闭毫秒显示可减少屏幕刷新频率，延长屏幕寿命</span>
                    </div>
                </div>
                
                <!-- 功能设置 -->
                <div id="settings-features" class="settings-content" style="display: none;">
                    <h3 style="margin-bottom: 25px; color: #fff; font-size: 18px;">功能</h3>
                    <div class="option-item" style="margin-bottom: 25px;">
                        <span class="option-label" style="font-size: 16px; margin-bottom: 15px; display: block;">功能切换</span>
                        <div style="display: flex; gap: 15px;">
                            <button class="feature-btn time-active" data-feature="time" style="padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; transition: all 0.3s; background-color: ${currentFeature === 'time' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(50, 50, 50, 0.8)'};
 color: ${currentFeature === 'time' ? '#fff' : '#aaa'};">北京时间</button>
                            <button class="feature-btn countdown-active" data-feature="countdown" style="padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; transition: all 0.3s; background-color: ${currentFeature === 'countdown' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(50, 50, 50, 0.8)'};
 color: ${currentFeature === 'countdown' ? '#fff' : '#aaa'};">倒计时</button>
                        </div>
                    </div>
                </div>
                
                <!-- 关于设置 -->
                <div id="settings-about" class="settings-content" style="display: none;">
                    <h3 style="margin-bottom: 25px; color: #fff; font-size: 18px;">关于</h3>
                    <div class="option-item" style="border-bottom: 1px solid #333; margin-bottom: 25px; padding-bottom: 25px;">
                        <button class="btn btn-blue" style="width: 100%; padding: 12px; font-size: 16px;" id="show-creator-btn">制作人员名单</button>
                    </div>
                    <div class="option-item" style="text-align: center; margin-top: 30px;">
                        <div style="color: #aaa; font-size: 14px; margin-bottom: 15px;">v4.0.12</div>
                        <a href="https://beijingfortime.wordpress.com/" target="_blank" rel="noopener noreferrer" style="font-size: 14px; opacity: 0.8; text-decoration: underline; color: #aaa;">官网</a>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .modal-content {
                min-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .settings-nav-item:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
                color: #ddd !important;
            }
            .settings-nav-item.active {
                background-color: rgba(255, 255, 255, 0.2) !important;
                color: #fff !important;
            }
        </style>
    `;
    showModal(content);
    
    // 添加事件监听器
    document.getElementById('ms-toggle-modal').addEventListener('change', (e) => {
        msToggle.checked = e.target.checked;
        // 保存设置到本地存储
        localStorage.setItem('showMilliseconds', msToggle.checked);
        // 更新显示
        if (currentFeature === 'time') {
            updateTime();
        } else if (currentFeature === 'countdown') {
            updateCountdown();
        }
        // 重新设置更新频率
        clearInterval(window.timeInterval);
        const updateInterval = msToggle.checked ? 100 : 1000;
        if (currentFeature === 'time') {
            window.timeInterval = setInterval(updateTime, updateInterval);
        } else if (currentFeature === 'countdown') {
            window.timeInterval = setInterval(updateCountdown, updateInterval);
        }
    });
    
    document.getElementById('show-creator-btn').addEventListener('click', () => {
        hideModal();
        showEnvironmentCheck();
    });
    
    // 添加设置分类切换事件
    const navItems = document.querySelectorAll('.settings-nav-item');
    const contentItems = document.querySelectorAll('.settings-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有active类和样式
            navItems.forEach(nav => {
                nav.classList.remove('active');
                nav.style.backgroundColor = 'transparent';
                nav.style.color = '#aaa';
            });
            
            // 隐藏所有内容
            contentItems.forEach(content => content.style.display = 'none');
            
            // 添加当前active类和样式
            item.classList.add('active');
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            item.style.color = '#fff';
            
            // 显示当前内容
            const category = item.dataset.category;
            const contentElement = document.getElementById(`settings-${category}`);
            if (contentElement) {
                contentElement.style.display = 'block';
            }
        });
    });
    
    // 处理功能切换事件
    // 这里简化处理，直接使用事件委托
    const featuresContent = document.getElementById('settings-features');
    if (featuresContent) {
        featuresContent.addEventListener('click', (e) => {
            // 功能切换按钮点击
            if (e.target.classList.contains('feature-btn')) {
                const feature = e.target.dataset.feature;
                // 更新所有功能按钮样式
                const featureBtns = featuresContent.querySelectorAll('.feature-btn');
                featureBtns.forEach(btn => {
                    if (btn.dataset.feature === feature) {
                        btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        btn.style.color = '#fff';
                    } else {
                        btn.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
                        btn.style.color = '#aaa';
                    }
                });
                // 切换功能
                switchFeature(feature);
            }
        });
    }
}