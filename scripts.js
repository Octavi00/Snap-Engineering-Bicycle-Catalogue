/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

const FRESH_PRINCE_URL =
  "https://upload.wikimedia.org/wikipedia/en/3/33/Fresh_Prince_S1_DVD.jpg";
const CURB_POSTER_URL =
  "https://m.media-amazon.com/images/M/MV5BZDY1ZGM4OGItMWMyNS00MDAyLWE2Y2MtZTFhMTU0MGI5ZDFlXkEyXkFqcGdeQXVyMDc5ODIzMw@@._V1_FMjpg_UX1000_.jpg";
const EAST_LOS_HIGH_POSTER_URL =
  "https://static.wikia.nocookie.net/hulu/images/6/64/East_Los_High.jpg";


//basic url's
/*
*/



// This is an array of strings (TV show titles)
let titles = [
  "Fresh Prince of Bel Air",
  "Curb Your Enthusiasm",
  "East Los High",
];

let main_part_categories = [
  "Front Forks",
  "Brake systems",
  "Rear Suspension",
  "Tires",
  "Powertrains",
  "Misceleaneous",
  "All",
]


//Here are some more specific category breakdowns for generalized names
let brake_systems_parts = [
  "Fluids",
  "Pads",
  "Calipers",
  "Hoses",
  "Levers",
  "Brake Kits",
]

let powertrains_parts = [
  "Chains",
  "Deraileurs",
  "Cassettes",
  "Cranksets",
]
/////////////////////////////////////////////////////

const loaders = {
  homepage : loadHomePage,
  aboutme : loadAboutPage,
}

//Page loaders
function loadHomePage()
{
  const mainCategory_Container = document.getElementById("main-category-container");
  mainCategory_Container.innerHTML = ""; //homepage url extension
  const templateCategory = document.querySelector(".category");
  
  for (let i = 0; i < main_part_categories.length; i++)
  {
    let title = main_part_categories[i];
    
    //NOTE: make a function to get and insert urls
    let imageURL = ""
    

    const nextCategory = templateCategory.cloneNode(true); //Copy this created template
    
    editCategoryContent(nextCategory, title, imageURL); // Add a title + image
    mainCategory_Container.appendChild(nextCategory); // Add into category container
  }
}

function loadAboutPage()
{
  alert(
    "This is a good stopping point"
  );
}



function editCategoryContent(category, newTitle, newImageURL){
  category.style.display = "block";

  const categoryHeader = category.querySelector("h2");
  const categoryImage = category.querySelector("img");
  const link = category.querySelector(".category-link");

  categoryHeader.textContent = newTitle;

  categoryImage.src = newImageURL;
  categoryImage.alt = newTitle + " Image";
  
  //loads new page when Title or image is clicked
  link.href = "index.html?category=" + encodeURIComponent(newTitle);

  //prints for debugging
  console.log("New category: ", newTitle, "- html: ", category);
}




//Default Page loader when website is openned
document.addEventListener("DOMContentLoaded", loaders["homepage"]);








//button functions
function home_page_clicked() {
  console.log("Home Page clicked");
  loaders["homepage"]?.();
}

function about_page_clicked() {
  console.log("About Page clicked");
  loaders["aboutme"]?.();
}
