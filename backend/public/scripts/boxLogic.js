const openBtn = document.getElementById('openBtn');
const boxImage = document.getElementById('boxImage');
const boxVideo = document.getElementById('boxVideo');
const result = document.getElementById('result');
const itemName = document.getElementById('itemName');

const items = [
    {
        name: "Mystic Crystal",
        image: "/img/logo.png",
        description: "A shimmering crystal radiating with unknown energy.",
        rarity: "Legendary"
    },
    {
        name: "Cyber Banana",
        image: "/img/logo.png",
        description: "A banana with cybernetic enhancements. Why? Nobody knows.",
        rarity: "Epic"
    }
];

openBtn.addEventListener('click', () => {

    openBtn.disabled = true;
    openBtn.innerText = "Opening...";
    const sound = document.getElementById("boxSound");
    sound.currentTime = 0;
    sound.play();

    boxImage.classList.add("d-none");
    boxVideo.classList.remove("d-none");
    boxVideo.play();


    boxVideo.onended = () => showResult();
    setTimeout(() => {
        if (boxVideo.paused) showResult();
    }, 4000);
});

function showResult() {
    const item = items[Math.floor(Math.random() * items.length)];

    // Hide video, show item image
    boxVideo.classList.add("d-none");

    // Play sound
    

    // Fill in item content
    const itemImage = document.getElementById("itemImage");
    const itemNameText = document.getElementById("itemName");
    const itemDescription = document.getElementById("itemDescription");
    const itemRarity = document.getElementById("itemRarity");

    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemNameText.textContent = item.name;
    itemDescription.textContent = item.description;

    const rarityClass = "rarity-" + item.rarity.toLowerCase();
    itemRarity.textContent = item.rarity;
    itemRarity.className = `rarity-badge ${rarityClass}`;

    // Show result
    result.classList.remove("d-none");
    openBtn.innerText = "Opened!";
}


