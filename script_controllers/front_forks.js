//Front Forks page controller, may become a general js file

//uses async to wait while function finishes
async function loadFrontForkPage() {    
    const response = await fetch("../data_files/front_forks.json");
    const data = await response.json();

    //set Theme
    document.body.classList.add(data.theme);


    //Set title and description
    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;

    const container = document.getElementById("forks-container");
    container.innerHTML = "";

    const template = document.querySelector(".item-card");

    data.forks.forEach(fork => {
    const card = template.cloneNode(true);
    card.style.display = "flex";

    const img = card.querySelector(".item-img");
    const name = card.querySelector(".item-name");
    const brand = card.querySelector(".item-brand");
    const price = card.querySelector(".item-price");
    const link = card.querySelector(".item-link");

    name.textContent = fork.name;
    brand.textContent = fork.brand;
    //fix to 2 decimal digits if not already
    price.textContent = "$" + fork.price.toFixed(2);

    link.href = fork.url;

    //optional image, so no need for everything to have images
    if (fork.img_url && fork.img_url !== "") {
      img.src = fork.img_url;
      img.alt = fork.name;
    } else {
      img.style.display = "none";
    }

    container.appendChild(card);
  });
}


//Default Page loader when website is openned
document.addEventListener("DOMContentLoaded", loadFrontForkPage);

function previousPage() {
    if (history.length > 1) {
        history.back();
    } else {
    window.location.href = "../index.html";
    }
}
