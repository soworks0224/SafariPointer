// 初期設定
let pointerSize = 50;
let pointerOpacity = 0.5;
let defaultColors = ['ff3b30', 'ff9400', 'ffcc00', '33c759', '007aff'];//red,orange,yellow,green,blue
let colorHexes = defaultColors;
// Webページで表示されるポインターを管理
let activePointers = {};
// タッチの順序を管理する変数
let touchOrder = 0;


// ページ全体を覆う透明なマスク要素を作成
function createMask() {
    const mask = document.createElement('div');
    mask.id = 'mask'; // IDを設定
    mask.style.position = 'absolute';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.zIndex = '9998'; // ポインターより低い値を設定（オプション）
    mask.style.pointerEvents = 'none'; // マスク自体がイベントを邪魔しないようにする
    mask.style.overflow = 'hidden'; // はみ出し部分を非表示にする
    mask.style.background = 'transparent'; // 背景は透明
    
    // 初期サイズを設定
    updateMaskSize(mask);
    
    // ページがリサイズされたときにマスクサイズを更新
    window.addEventListener('resize', () => updateMaskSize(mask));
    
    document.body.appendChild(mask);
    return mask;
}

// マスクのサイズをページ全体の大きさに更新
function updateMaskSize(mask) {
    const scrollWidth = document.documentElement.scrollWidth; // ページの横幅
    const scrollHeight = document.documentElement.scrollHeight; // ページの縦幅
    mask.style.width = `${scrollWidth}px`;
    mask.style.height = `${scrollHeight}px`;
}

// マスク要素が存在しない場合に作成
let maskElement = document.getElementById('mask');
if (!maskElement) {
    maskElement = createMask();
}

// ポインターを作成する関数
function createPointer(x, y, color) {
    const pointer = document.createElement('div');
    pointer.style.position = 'absolute';
    pointer.style.width = `${pointerSize}px`;
    pointer.style.height = `${pointerSize}px`;
    pointer.style.backgroundColor = `#${color}`;
    pointer.style.borderRadius = '50%';
    pointer.style.opacity = pointerOpacity;
    
    // pointerSizeに基づいて影を動的に設定
    const shadowOffset = pointerSize / 25; // 影のオフセット（サイズに応じて調整）
    const shadowBlur = pointerSize * 0.1; // ぼかしの大きさ（サイズに応じて調整）
    const shadowColor = 'rgba(0, 0, 0, 0.5)'; // 影の色
    
    pointer.style.boxShadow = `${shadowOffset}px ${shadowOffset}px ${shadowBlur}px ${shadowColor}`;
    
    pointer.style.top = `${y - pointerSize / 2}px`;
    pointer.style.left = `${x - pointerSize / 2}px`;
    
    mask.appendChild(pointer); // マスク内に追加
    return pointer;
}



// すべてのポインターを削除
function clearAllPointers() {
    for (let id in activePointers) {
        if (activePointers[id]) {
            activePointers[id].remove();
        }
    }
    activePointers = {};
    touchOrder = 0;
}

// タッチ開始イベント
document.addEventListener('touchstart', function (event) {
    clearAllPointers(); // 既存のポインターを削除
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const x = touch.pageX;
        const y = touch.pageY;
        const color = colorHexes[touchOrder % colorHexes.length];
        const pointer = createPointer(x, y, color);
        activePointers[touch.identifier] = pointer;
        touchOrder++;
        console.log(`Pointer size set to: ${pointerSize}`);
    }
});

// タッチ移動イベント
document.addEventListener('touchmove', function (event) {
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const pointer = activePointers[touch.identifier];
        if (pointer) {
            pointer.style.top = `${touch.pageY - pointerSize / 2}px`;
            pointer.style.left = `${touch.pageX - pointerSize / 2}px`;
        }
    }
});

// タッチ終了イベント
document.addEventListener('touchend', function (event) {
    for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i];
        const pointer = activePointers[touch.identifier];
        if (pointer) {
            pointer.remove();
            delete activePointers[touch.identifier];
        }
    }
});

// タッチキャンセルイベント
document.addEventListener('touchcancel', function (event) {
    for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i];
        const pointer = activePointers[touch.identifier];
        if (pointer) {
            pointer.remove();
            delete activePointers[touch.identifier];
        }
    }
});



// マウス専用の識別子
const MOUSE_IDENTIFIER = 'mouse';

// マウスのポインターを作成
document.addEventListener('mousedown', function (event) {
    clearAllPointers(); // 既存のポインターを削除
    
    const x = event.pageX;
    const y = event.pageY;
    const color = colorHexes[touchOrder % colorHexes.length]; // 色を選択
    const pointer = createPointer(x, y, color); // ポインターを作成
    
    activePointers[MOUSE_IDENTIFIER] = pointer; // マウスポインターを登録
    touchOrder++;
    console.log(`Pointer size set to: ${pointerSize}`);
});

// マウス移動イベント
document.addEventListener('mousemove', function (event) {
    const pointer = activePointers[MOUSE_IDENTIFIER];
    if (pointer) {
        pointer.style.top = `${event.pageY - pointerSize / 2}px`;
        pointer.style.left = `${event.pageX - pointerSize / 2}px`;
    }
});

// マウスのボタンを離したときにポインターを削除
document.addEventListener('mouseup', function (event) {
    const pointer = activePointers[MOUSE_IDENTIFIER];
    if (pointer) {
        pointer.remove(); // ポインターを削除
        delete activePointers[MOUSE_IDENTIFIER]; // マウスポインターを解除
    }
});

// マウスイベントとタッチイベントの両方をサポートするための処理
// マウスとタッチのポインターが干渉しないように識別子を分けています


