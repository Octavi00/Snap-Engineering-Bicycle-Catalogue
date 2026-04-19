//Container js file
//  Description: This file is designed to load a default category page with all items. It works by first loading the corresponding json file based on the url extension, then building an array of item objects and keywords for later use in filters, and finally renders the items onto the page using a template.




//global items array + keywords array
all_items = [];
all_keywords = [];

function createItemObject(item)
{
  // returns a fully built Item with keywords for later sort / organization
  // also defaults all types incase of break or missing from json 
  return {
    brand: item.brand || "",
    name: item.name || "",
    price: item.price ?? null,
    url: item.url || "",
    img_url: item.img_url || "",
    keywords: item.keywords || [],
    date_added: item.date_added || "",
  };
}

// Creates a map of item objects
function buildItemsArray(items) {
  return items.map(createItemObject);
}



//actually make items visible on page by filling in template and appending to container
function renderItems(items)
{
  const container = document.getElementById("items-container");
  container.innerHTML = "";
  const template = document.querySelector(".item-card");

  items.forEach(item => {
    //copy template
    const card = template.cloneNode(true);
    card.style.display = "flex";

    const img = card.querySelector(".item-img");
    const name = card.querySelector(".item-name");
    const brand = card.querySelector(".item-brand");
    const price = card.querySelector(".item-price");
    const link = card.querySelector(".item-link");

    //set template values
    name.textContent = item.name;
    brand.textContent = item.brand;
    price.textContent = "$" + item.price.toFixed(2);
    link.href = item.url;

    //optional image, so no need for everything to have images
    if (item.img_url && item.img_url !== "") {
      img.src = item.img_url;
      img.alt = item.name;
    } else {
      img.style.display = "none";
    }

    container.appendChild(card);

  });
}




//Note: uses async to wait on loading page while function finishes
async function loadPage() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("data");

  if (category === "all") {
    await allCategoriesPage();
  }
  else {
    await singleCategoryPage(category);
  }
}
  
  


async function singleCategoryPage(category) {
  //fetch data
  const data = await fetchData(category);

  if (!data) {
    // If data is null, return early, error is already handled in fetchData()
    return;
  }

  //set theme image
  setBackgroundImage(data.background_image);
  
  //Set title and description
  document.getElementById("title").textContent = data.title;
  document.getElementById("description").textContent = data.description;
  
  //build items array and keywords array for later use in filters
  all_items = buildItemsArray(data.items);
  all_keywords = [...new Set(all_items.flatMap(item => item.keywords))];
    
  //now render all items as default page view
  renderItems(all_items);     
}


async function allCategoriesPage() {
  //run a for loop fetching all data files and building items array and keywords array for each, then render all items together on page
  let all_items_combined = [];
  let all_keywords_combined = new Set();

  //Note: data here implies data from all.json wihtin categories folder
  const data = await fetchData("all");
  if (!data) {
    // If null, return early, error is already handled in fetchData()
    return;
  }

  //set theme image
  setBackgroundImage(data.background_image);
  
  //Set title and description
  document.getElementById("title").textContent = data.title;
  document.getElementById("description").textContent = data.description;
  
  const categories = data.categories;

  //now loop through each category
  for (const category of categories) {
    const data = await fetchData(category);
    if (data && data.items) {
      const items = buildItemsArray(data.items);
      all_items_combined = all_items_combined.concat(items);
      items.forEach(item => item.keywords.forEach(keyword => all_keywords_combined.add(keyword)));
    }
  }

  //now rewrite global arrays with combined data and render all items together on page
  all_items = all_items_combined;
  all_keywords = Array.from(all_keywords_combined);
  renderItems(all_items);
}




async function fetchData(category) {
  const dataFile = "categories/" + category;
  
  //use a try and catch block to handle potential errors in fetching data, such as incorrect file paths or missing files, so user is aware of the issue instead of just a blank page
  try {
    const response = await fetch(`../data_files/${dataFile}.json`);
    if (!response.ok) {
      console.error("Failed to load data: ", response.statusText);
      alert("No data available for the requested category.");
      return;
    }
    
    //If data fails to load here, an error will be thrown and caught in the catch block
    const data = await response.json();
    return data;
  } 
  catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred while fetching data. Please try again later.");
  }

  return null; // Return null if there was an error
}


//small helper function for setting background image
async function setBackgroundImage(image_url) {
  if (image_url && image_url !== "") {
    document.body.style.setProperty('background-image', `url("${image_url}")`);
  }
  else {
    // Set none background image if none provided in data
    document.body.style.setProperty('background-image', 'none');
  }
}




//Default Page loader when website is openned
document.addEventListener("DOMContentLoaded", loadPage);

//Previous page button
function previousPage() {
    if (history.length > 1) {
        history.back();
    } else {
    window.location.href = "../index.html";
    }
}
