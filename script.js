const itemSchema = [
    { id: 0, name: "Cursor",   basePrice: 10,      cps: 0.1,  image: "https://orteil.dashnet.org/cookieclicker/img/cursor.png" },
    { id: 1, name: "Grandma",  basePrice: 80,      cps: 1,    image: "https://orteil.dashnet.org/cookieclicker/img/grandma.png" },
    { id: 2, name: "Farm",     basePrice: 500,     cps: 10,   image: "https://orteil.dashnet.org/cookieclicker/img/farm.png" },
    { id: 3, name: "Mine",     basePrice: 3000,    cps: 100,  image: "https://orteil.dashnet.org/cookieclicker/img/mine.png" },
    { id: 4, name: "Factory",  basePrice: 9000,    cps: 600,  image: "https://orteil.dashnet.org/cookieclicker/img/factory.png" },
    { id: 5, name: "Bank",     basePrice: 10000,   cps: 2000, image: "https://orteil.dashnet.org/cookieclicker/img/bank.png" }, 
    { id: 6, name: "Temple",   basePrice: 1000000, cps: 10000,image: "https://orteil.dashnet.org/cookieclicker/img/temple.png" }
];

let totalCookies = 0;
let totalCPS = 0;
let bakeryName = "Farhan";

let lastTickTime = Date.now();

const newsTicker = [
    "Your cookies are reasonably moist.",
    "People are starting to talk about your bakery.",
    "A local grandmother praises your recipe.",
    "Cookie consumption up 400% nationwide!",
    "Your cookies have been linked to mysterious occurrences in the basement."
];

document.addEventListener("DOMContentLoaded", () => {
    const bakeryElem = document.getElementById("bakeryName");
    if (bakeryElem) bakeryElem.innerText = `${bakeryName}'s bakery`;

    const textElem = document.getElementById("commentsText");
    if (textElem) textElem.innerText = `"${newsTicker[0]}"`;
    
    const cookieBtn = document.getElementById("bigCookie");
    if (cookieBtn) {
        cookieBtn.addEventListener("click", (e) => {
            totalCookies += 1;
            triggerClickAnimation(e);
            updateInterface();
        });
    }

    setInterval(() => {
        const textElem = document.getElementById("commentsText");
        if (textElem) {
            const randomQuote = newsTicker[Math.floor(Math.random() * newsTicker.length)];
            textElem.innerText = `"${randomQuote}"`;
        }
    }, 6000);

    setInterval(() => {
        const currentTime = Date.now();
        const timePassed = currentTime - lastTickTime;
        lastTickTime = currentTime;

        if (totalCPS > 0) {
            totalCookies += totalCPS * (timePassed / 1000);
            updateInterface();
        }
    }, 100);

    renderStoreLayout();
    updateInterface();
});

function calculatePrice(item) {
    return Math.floor(item.basePrice * Math.pow(1.15, item.owned || 0));
}

function processPurchase(id) {
    const item = itemSchema.find(i => i.id === id);
    if (!item) return;
    
    if (!item.owned) item.owned = 0;
    const cost = calculatePrice(item);

    if (totalCookies >= cost) {
        totalCookies -= cost;
        item.owned++;
        
        totalCPS = itemSchema.reduce((sum, i) => sum + ((i.owned || 0) * i.cps), 0);
        
        renderStoreLayout();
        renderBuildingVisuals();
        updateInterface();
    }
}

function updateInterface() {
    const displayNum = Math.floor(totalCookies).toLocaleString();
    const displayCPS = totalCPS.toFixed(1);

    const cookiesDisplay = document.getElementById("cookies");
    if (cookiesDisplay) {
        cookiesDisplay.innerHTML = `
            ${displayNum} cookies<br>
            <span style="font-size:14px; font-family:sans-serif; color:#ccc; text-shadow:1px 1px #000;">per second: ${displayCPS}</span>
        `;
    }

    document.title = `${displayNum} Cookies - Cookie Clicker`;

    itemSchema.forEach(item => {
        const targetElement = document.getElementById(`prod-row-${item.id}`);
        if (targetElement) {
            if (totalCookies >= calculatePrice(item)) {
                targetElement.classList.remove("disabled");
            } else {
                targetElement.classList.add("disabled");
            }
        }
    });
}

function renderStoreLayout() {
    const shopBox = document.getElementById("products");
    if (!shopBox) return;
    shopBox.innerHTML = "";

    itemSchema.forEach(item => {
        if (!item.owned) item.owned = 0;
        const currentPrice = calculatePrice(item);
        const element = document.createElement("div");
        element.className = "product";
        element.id = `prod-row-${item.id}`;
        
        element.innerHTML = `
            <div class="prod-icon-box">
                <div class="prod-icon-sprite" style="background-image: url('${item.image}');"></div>
            </div>
            <div class="prod-content">
                <div class="prod-title">${item.name}</div>
                <div class="prod-price">🍪 ${currentPrice.toLocaleString()}</div>
            </div>
            <div class="prod-owned">${item.owned}</div>
        `;

        element.addEventListener("click", () => processPurchase(item.id));
        shopBox.appendChild(element);
    });
}

function renderBuildingVisuals() {
    const rowContainer = document.getElementById("rows");
    if (!rowContainer) return;
    rowContainer.innerHTML = "";

    itemSchema.forEach(item => {
        if (item.owned > 0) {
            const visualRow = document.createElement("div");
            visualRow.className = "building-row";

            const label = document.createElement("div");
            label.className = "building-row-label";
            label.innerText = item.name;
            visualRow.appendChild(label);

            const spritesContainer = document.createElement("div");
            spritesContainer.className = "building-row-sprites";

            for (let i = 0; i < Math.min(item.owned, 50); i++) {
                const iconBox = document.createElement("div");
                iconBox.className = "row-icon-box";

                const sprite = document.createElement("div");
                sprite.className = "row-icon-sprite";
                sprite.style.backgroundImage = `url('${item.image}')`;
                
                iconBox.appendChild(sprite);
                spritesContainer.appendChild(iconBox);
            }
            
            visualRow.appendChild(spritesContainer);
            rowContainer.appendChild(visualRow);
        }
    });
}

function triggerClickAnimation(e) {
    const frame = document.getElementById("sectionLeft");
    if (!frame) return;
    const label = document.createElement("div");
    label.className = "cookieNumber";
    label.innerText = "+1";
    
    label.style.left = `${e.clientX}px`;
    label.style.top = `${e.clientY}px`;

    frame.appendChild(label);
    setTimeout(() => { label.remove(); }, 600);
}