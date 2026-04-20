//about page controller

//uses async to wait while function finishes
async function loadAboutPage()
{    
    //load data from json
    const response = await fetch("../data_files/about.json");
    const data = await response.json();
    
    //set theme
    document.body.classList.add(data.theme);
    
    //set text
    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;

    //add profile links
    const profilesList = document.getElementById("profiles");
    data.profiles.forEach(profile => {
        //li stands for link and avoids varaible overwrite
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = profile.url;
        a.textContent = profile.name;
        a.target = "_blank";

        li.appendChild(a);
        profilesList.appendChild(li);
    });

    //create + insert profile picture
    const profilePicture = document.getElementById("profile-picture");
    profilePicture.src = data.profile_picture;
}


//Default Page loader when website is openned
document.addEventListener("DOMContentLoaded", loadAboutPage);

function previousPage() {
    if (history.length > 1) {
        history.back();
    } else {
    window.location.href = "../index.html";
    }
}
