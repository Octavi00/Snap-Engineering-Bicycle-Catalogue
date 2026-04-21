//Container js file
//  Description: This file is designed to load a default category page with all items. It works by first loading the corresponding json file based on the url extension, then building an array of item objects and keywords for later use in filters, and finally renders the items onto the page using a template.




//global items array + filtered items array + keywords array
all_items = [];
filtered_items = [];
all_keywords = [];




//Note: uses async to wait on loading page while function finishes
async function loadPage() {
  const params = new URLSearchParams(window.location.search);
  //find page category from url
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

  //set theme: background image, title, and description
  setTheme(data.background_image, data.title, data.description);
  
  //build items array and keywords array for later use in filters, and default filtered items to all items for now
  all_items = buildItemsArray(data.items);
  filtered_items = all_items; 
  all_keywords = [...new Set(all_items.flatMap(item => item.keywords))];
    
  //default sort is newest items first, (rendering is included in sort functions)
  newestDateSort();
}


async function allCategoriesPage() {
  //runs a for loop fetching all data files, and in turn builds items array and keywords array for each.
  //We store all of them in the temporary combined variables, then render all combined items once finisjed
  let all_items_combined = [];
  let all_keywords_combined = new Set();

  //Note: data here implies data from all.json within categories folder
  const data = await fetchData("all");
  if (!data) {
    // If null, return early, error is already handled in fetchData()
    return;
  }

  //set theme: background image, title, and description
  setTheme(data.background_image, data.title, data.description);
  
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

  //now rewrite global arrays with combined data and render all items together on page, and copy all_items into filtered_items by default
  all_items = all_items_combined;
  filtered_items = all_items; 
  all_keywords = Array.from(all_keywords_combined);
  //default sort
  newestDateSort();
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




//small helper function for setting up page theme
async function setTheme(image_url, title, description) {
  //set background image
  if (image_url && image_url !== "") {
    document.body.style.setProperty('background-image', `url("${image_url}")`);
  }
  else {
    // Set none background image if none provided in data
    document.body.style.setProperty('background-image', 'none');
  }

  //Set title and description
  document.getElementById("title").textContent = title;
  document.getElementById("description").textContent = description;
}

// Creates a map of item objects
function buildItemsArray(items) {
  return items.map(createItemObject);
}


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
    date_added: item.date_modified || "0",
    card: createCard(item.brand, item.name, item.price, item.url, item.img_url),
  };
}


function createCard(brand, name, price, url, img_url) {
  //creates a card element for an item
  //item template
  const template = document.querySelector(".item-card");
  const card = template.cloneNode(true);
  card.style.display = "flex";

  //set template values
  card.querySelector(".item-name").textContent = name;
  card.querySelector(".item-brand").textContent = brand;
  card.querySelector(".item-price").textContent = "$" + price.toFixed(2);
  card.querySelector(".item-link").href = url;

  //optional image, so no need for everything to have images
  if (img_url && img_url !== "") {
    card.querySelector(".item-img").src = img_url;
    card.querySelector(".item-img").alt = name;
  } else {
    card.querySelector(".item-img").style.display = "none";
  }
  return card;
}





//renders items onto page by filling in template and appending to container
function renderItems(items)
{
  const container = document.getElementById("items-container");
  container.innerHTML = "";

  items.forEach(item => {
    container.appendChild(item.card);
  });

  //now propagate filters based on keywords from items, so they are ready to be used when user clicks them
  propagateKeywordFilters();
}





//Default Page loader when website is openned
document.addEventListener("DOMContentLoaded", loadPage);
















//Button propagations
function propagateKeywordFilters() {
  const keywordContainer = document.getElementById("keyword-filters");
  //clear previous filters from other pages / urls just in case
  keywordContainer.replaceChildren();

  //Note: A set inherently avoids duplicate values, so no worries about inserting
  const keywordSet = new Set();

  //iterate through all items and add keywords to set
  all_items.forEach(item => {
    item.keywords.forEach(keyword => {
      keywordSet.add(keyword);
    });
  });

  //Sorts keywords alphabetically for an easier navigation experience
  const sortedKeywords = [...keywordSet].sort((a, b) => a.localeCompare(b));

  //now create and insert buttons for each keyword, and add event listener to filter by keyword when clicked
  sortedKeywords.forEach(keyword => {
    const button = document.createElement("button");
    button.classList.add("filter-option");
    button.textContent = keyword;

    button.addEventListener("click", () => {
      filterByKeyword(keyword);
    });

    keywordContainer.appendChild(button);
  });
}

function previousPage() {
  if (history.length > 1) {
    history.back();
  } else {
    window.location.href = "../index.html";
  }
}
















//Filter + Sort helper function: clears all items from current page
function clearAllItems() {
  const container = document.getElementById("items-container");
  //this function can also replace children instead of just clearing, but I will stay with using renderItems 
  container.replaceChildren(); 
}

//Sorting functions
async function increasingPrice() {
  //clear items and re-render with new sort
  clearAllItems();

  //mutates array order only, so sort can be combined with other filters
  filtered_items.sort((a, b) => a.price - b.price);
  renderItems(filtered_items);
}

async function decreasingPrice() {
  clearAllItems();
  //also mutates order just like increasing function
  filtered_items.sort((a, b) => b.price - a.price);
  renderItems(filtered_items);
}

async function alphabeticalSort() {
  clearAllItems();
  //uses localeCompare for proper alphabetical sorting, also avoids mutating all_items while still sorting and printing sorted items
  filtered_items.sort((a, b) => a.name.localeCompare(b.name));
  renderItems(filtered_items);
}

async function rev_alphabeticalSort() {
  clearAllItems();  
  //reverses standard alphabet sort
  filtered_items.sort((a, b) => b.name.localeCompare(a.name));
  renderItems(filtered_items);
}

async function newestDateSort() {
  clearAllItems();
  //sorts by date added, with newest items first. Note: this relies on the date format in the json data being consistent and properly formatted for Date parsing
  filtered_items.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
  renderItems(filtered_items);
}

async function oldestDateSort() {
  clearAllItems();
  //sorts by date added, with oldest items first
  filtered_items.sort((a, b) => 
    new Date(a.date_added) - new Date(b.date_added)
);
  renderItems(filtered_items);
}

  






//filter functions
async function clearFilters() {
  clearAllItems();
  filtered_items = all_items;
  renderItems(filtered_items);
}

async function filterByKeyword(keyword) {
  clearAllItems();

  //uses .includes() to check if keyword is present
  //Note: this filter is case sensitive, and the json data is currently formatting all keywords in lowercase
  filtered_items = all_items.filter(item => item.keywords.includes(keyword));
  renderItems(filtered_items);

  //it may be possible that a keyword with no items is selected during testing and future changes, so we can alert the user of this by printing onto the screen
  if (filtered_items.length === 0) {
    alert("No items found with the keyword: " + keyword);
    return;
  }

  renderItems(filtered_items);
}

