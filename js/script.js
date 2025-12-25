// select elements
var addBtn = document.getElementById("addBtn");
var contactModal = document.getElementById("contactModal");
var close = document.querySelectorAll(".close")
var contactForm = document.getElementById("contactForm");
var saveBtn = document.getElementById("saveBtn");
var noContacts = document.getElementById("noContacts");
var contactsRow = document.getElementById("contactsRow");
var emailIcon = document.getElementById("emailIcon");
// select inputs
var nameInput = document.getElementById("fn");
var phoneInput = document.getElementById("phoneNumber");
var emailInput = document.getElementById("email");
var addressInput = document.getElementById("adderss");
var groupSelect = document.getElementById("select");
var notesInput = document.querySelector("textarea");
var favCheck = document.getElementById("favoriteCheck");
var emergCheck = document.getElementById("emergencyCheck");
// count the contacts
var totalContact = document.getElementById("totalContact");
var favContact = document.getElementById("favContact");
var emergencyContact = document.getElementById("emergencyContact");

// fav and emerg cards
var favBody = document.querySelector(".fav-body");
var emergBody = document.querySelector(".emerg-body");
// no fav& emerg
var noFav = document.getElementById("noFav");
var noEmerg = document.getElementById("noEmerg");

// global index
var mainIndex = null; //عملناه null عشان نميز الكليك بتاع الزرار للسيف ولا الابديت


// regex
var nameRegex = /^[A-Za-z\u0600-\u06FF\s]{2,50}$/;
var phoneRegex = /^(010|011|012|015)\d{8}$/;
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// errors
var nameError = nameInput.nextElementSibling;
var phoneError = phoneInput.nextElementSibling;
var emailError = emailInput.nextElementSibling;
console.log(nameError);

// validate name
function validateName() {
    var value = nameInput.value.trim();

    if (value === "" || !nameRegex.test(value)) {
        nameError.classList.remove("d-none");

        return false;
    } else {
        nameError.classList.add("d-none");
        return true;
    }
}
// phone validate
function validatePhone() {
    var value = phoneInput.value.trim();
    if (value === "" || !phoneRegex.test(value)) {
        phoneError.classList.remove("d-none");
        return false;
    } else {
        phoneError.classList.add("d-none");
        return true;
    }
}
// email validate
function validateEmail() {
    var value = emailInput.value.trim();
    if (value !== "" && !emailRegex.test(value)) {
        emailError.classList.remove("d-none");
        return false;
    } else {
        emailError.classList.add("d-none");
        return true;
    }
}
function getDuplicatedPhone() {

    for (var i = 0; i < allContacts.length; i++) {
        if (i != mainIndex && allContacts[i].phone === phoneInput.value.trim()) {
            return allContacts[i].fullName;
        }
    }
    return null;
}




// validation action
nameInput.addEventListener("input", validateName);
phoneInput.addEventListener("input", validatePhone);
emailInput.addEventListener("input", validateEmail);




// array of all contacts

var allContacts = [];

if (localStorage.getItem("all") != null) {
    allContacts = JSON.parse(localStorage.getItem("all"));
    displayContacts();
}
// each contact act as object
function addContact() {



    // check duplicate
    var duplicatedName = getDuplicatedPhone();
    if (duplicatedName) {
        Swal.fire({
            icon: "error",
            title: "Duplicate Phone Number",
            html: `This phone number already belongs to <b>${duplicatedName}</b>`
        });
        return;
    }
    // بتاكد انه داخل يعدل ولا هيضيف من نفس الزرار
    var isUpdated = (mainIndex != null);

    var contact = {
        fullName: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        group: groupSelect.value,
        notes: notesInput.value,
        favorite: favCheck.checked,
        emergency: emergCheck.checked,
    }



    // push the object to the array
    if (mainIndex === null) {
        allContacts.push(contact);
    }
    else {
        allContacts.splice(mainIndex, 1, contact);
        mainIndex = null //نرجعه الاندكس زي ما كان
    }
    localStorage.setItem("all", JSON.stringify(allContacts));
    Swal.fire({
        icon: 'success',
        title: isUpdated ? 'Contact Updated!' : 'Contact Added!',
        text: isUpdated ? 'The contact has been Updated successfully.' : 'The contact has been Added successfully.',
        showConfirmButton: false,
        timer: 1500
    });




    clear();
    closeContactModal();
    displayContacts();
}

function clear() {
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    addressInput.value = "";
    groupSelect.value = "";
    notesInput.value = "";
    favCheck.checked = false;
    emergCheck.checked = false;
}

function openContactModal() {

    contactModal.classList.replace("d-none", "d-flex")
}
function closeContactModal() {
    // رجعنا الاندكس null تاني عشان لو جينا نعلم ابديت و عملنا كنسل  ميفضل محافظ على القيم
    mainIndex = null; //بنرجع الاندكس زي  Null
    clear();
    contactModal.classList.add("d-none")

}

// delect function
function deleteContact(index) {
    Swal.fire({
        title: 'Delete Contact?',
        text: `Are you sure you want to delete ${allContacts[index].fullName}? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            allContacts.splice(index, 1);
            localStorage.setItem("all", JSON.stringify(allContacts));
            displayContacts();

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Contact has been deleted.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


// fav toggle
function toggleFavorite(index) {
    allContacts[index].favorite = !allContacts[index].favorite;
    localStorage.setItem("all", JSON.stringify(allContacts));
    displayContacts();
}
// emerge toggle
function toggleEmergency(index) {
    allContacts[index].emergency = !allContacts[index].emergency;
    localStorage.setItem("all", JSON.stringify(allContacts));
    displayContacts();
}



// save a contact
// saveBtn.addEventListener("click", addContact)

// open the contact form
addBtn.addEventListener("click", openContactModal)

// close the cotnact form
for (var i = 0; i < close.length; i++) {
    close[i].addEventListener("click", function (e) {
        e.preventDefault();
        mainIndex = null;
        clear();
        contactModal.classList.add("d-none");
    });
}
// prevent refreshing from the form when click on the buttons
contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateName()) {
        Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Name should contain only letters and spaces (2-50 characters)"
        });
        return;
    }

    if (!validatePhone()) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone",
            text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)"
        });
        return;
    }

    if (!validateEmail()) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Email should be valid"
        });
        return;
    }






    addContact();
});


// group badget
function getGroupBadge(group) {
    if (!group) return "";

    return `
        <span class="group-badge d-flex justify-content-center align-items-center rounded-2 fa-xs fw-semibold ${group.toLowerCase()}">
            ${group}
        </span>
    `;
}

// display the contact
function displayContacts() {
    var stored_data = "";

    if (allContacts.length != 0) {
        noContacts.classList.replace("d-flex", "d-none");
    } else {
        noContacts.classList.replace("d-none", "d-flex");
    }

    for (var i = 0; i < allContacts.length; i++) {
        stored_data += `
        <div class="col-md-6">
            <div class="inner bg-white overflow-hidden rounded-4">
                <div class="header-inner p-3">
                    <div class="d-flex gap-2">
                        <div class="first-letter position-relative d-flex justify-content-center align-items-center text-white fw-medium fs-5">
                            ${allContacts[i].fullName.charAt(0).toUpperCase()}
                            <div class="position-absolute ${allContacts[i].favorite ? "" : "d-none"} bg-warning fav-badge rounded-circle d-flex justify-content-center align-items-center">
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <div class="position-absolute ${allContacts[i].emergency ? "" : "d-none"} pink-bg emrg-badge rounded-circle d-flex justify-content-center align-items-center">
                                <i class="fa-solid text-white fa-heart-pulse"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="fs-6 mt-0 m-1">${allContacts[i].fullName}</h3>
                            <div class="d-flex gap-2">
                                <div class="phone-icon light-blue-bg rounded-3 d-flex justify-content-center align-items-center">
                                    <i class="fa-solid fa-xs blue-color fa-phone"></i>
                                </div>
                                <span class="text-secondary">${allContacts[i].phone}</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2 mt-2">

                        ${allContacts[i].email ? `
                            <div id="emailIcon" class="phone-icon mt-2 p-3 bg-purple rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-xs text-main fa-envelope"></i>
                        </div>
                        <span>${allContacts[i].email}</span>
                            `: ""}
                    </div>


                    <div class="d-flex align-items-center gap-2 mt-2">

                        ${allContacts[i].address ? `
                            <div  class="phone-icon mt-2 p-3 bg-green rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-xs green-color fa-location-dot"></i>
                        </div>
                        <span class="text-muted">${allContacts[i].address}</span>
                            `: ""}
                    </div>


                    <div class="mt-2 mb-3 d-flex gap-2">
                    ${getGroupBadge(allContacts[i].group)}
                 ${allContacts[i].emergency ? `
                <span class="rounded-3 light-red-bg p-2 fa-xs fw-semibold text-danger">
                <i class="fa-solid fa-heart-pulse"></i>
                 Emergency
                </span>
                 ` : ""}
                </div>
                </div>
                <div class="footer-inner px-3 py-2 d-flex justify-content-between border-top">
                    <div class="d-flex gap-3 align-items-center">
                        <a href="tel:${allContacts[i].phone}" class="text-decoration-none phone-icon footer-icon bg-green rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid green-color fa-phone"></i>
                        </a>
                        <a href="mailto:${allContacts[i].email}" class="text-decoration-none text-main mail-icon footer-icon bg-purple rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid  fa-envelope"></i>
                        </a>
                    </div>
                    <div class="action-btns">
                        <button onclick="toggleFavorite(${i})"
                                class="btn favorite-add ${allContacts[i].favorite ? "d-none" : ""}">
                            <i class="fa-regular fa-star"></i>
                        </button>

                        <!-- remove from fav -->
                        <button onclick="toggleFavorite(${i})"
                                class="btn favorite bg-yellow ${allContacts[i].favorite ? "" : "d-none"}">
                            <i class="fa-solid fa-star text-warning"></i>
                        </button>

                        <!-- add to emergency -->
                        <button onclick="toggleEmergency(${i})"
                                class="btn emergency-add ${allContacts[i].emergency ? "d-none" : ""}">
                            <i class="fa-regular fa-heart"></i>
                        </button>

                        <!-- remove from emergency -->
                        <button onclick="toggleEmergency(${i})"
                                class="btn emergency light-red-bg ${allContacts[i].emergency ? "" : "d-none"}">
                            <i class="fa-solid fa-heart-pulse pink-color"></i>
                        </button>
                        <!-- edit -->
                        <button onclick="preUpdate(${i})" class="btn edit ">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <!-- delete -->
                        
                         <button onclick="deleteContact(${i})" class="btn delete ">
                                                    <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }


    contactsRow.innerHTML = stored_data;
    displayFavorites();
    displayEmergency();
    updateCounters();

}
// display fav

function displayFavorites() {
    var cartoona = "";

    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].favorite) {
            cartoona += `
                                 <a href="tel:${allContacts[i].phone}"
                                        class="p-1 mt-2 d-flex align-items-center gap-2  rounded-2 text-decoration-none ">
                                        <div
                                            class="first-letter position-relative d-flex justify-content-center align-items-center text-white fw-medium fs-5">
                                            ${allContacts[i].fullName.charAt(0).toUpperCase()}

                                        </div>
                                        <div>
                                            <h4 class="fs-6 text-black">${allContacts[i].fullName}</h4>
                                            <p class="text-secondary fa-xs">${allContacts[i].phone}</p>
                                        </div>
                                        <div class="ms-auto me-2 text-decoration-none phone-icon  bg-green rounded-3 d-flex
                                            justify-content-center align-items-center">

                                            <i class="fa-solid  fa-xs  green-color fa-phone"></i>
                                        </div>
                                    </a>`;

        }
    }

    favBody.innerHTML = cartoona;


}


// display emerg
function displayEmergency() {
    var cartoona = "";

    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].emergency) {
            cartoona += `
           <a href="tel:${allContacts[i].phone}"
                                        class="p-1 mt-2 d-flex align-items-center gap-2  rounded-2 text-decoration-none ">
                                        <div
                                            class="first-letter position-relative d-flex justify-content-center align-items-center text-white fw-medium fs-5">
                                            ${allContacts[i].fullName.charAt(0).toUpperCase()}

                                        </div>
                                        <div>
                                            <h4 class="fs-6 text-black">${allContacts[i].fullName}</h4>
                                            <p class="text-secondary fa-xs">${allContacts[i].phone}</p>
                                        </div>
                                        <div class="ms-auto me-2 text-decoration-none phone-icon  light-red-bg rounded-3 d-flex
                                            justify-content-center align-items-center">

                                            <i class="fa-solid  fa-xs  green-color fa-phone"></i>
                                        </div>
                                    </a>`;
        }
    }

    emergBody.innerHTML = cartoona;


}



// counter function

function updateCounters() {
    // Total
    totalContact.innerHTML = allContacts.length;

    // FAVORITES
    var favCount = 0;
    var emergencyCount = 0;

    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].favorite) {
            favCount++;
        }
        if (allContacts[i].emergency) {
            emergencyCount++;
        }
    }
    if (favCount === 0) {
        noFav.classList.replace("d-none", "d-flex")
    } else {
        noFav.classList.add("d-none")
    }

    if (emergencyCount === 0) {
        noEmerg.classList.replace("d-none", "d-flex")
    } else {
        noEmerg.classList.add("d-none")
    }

    favContact.innerHTML = favCount;
    emergencyContact.innerHTML = emergencyCount;
}


// update a contact functions
function preUpdate(index) {
    nameInput.value = allContacts[index].fullName;
    phoneInput.value = allContacts[index].phone;
    emailInput.value = allContacts[index].email;
    addressInput.value = allContacts[index].address;
    groupSelect.value = allContacts[index].group;
    notesInput.value = allContacts[index].notes;
    favCheck.checked = allContacts[index].favorite;
    emergCheck.checked = allContacts[index].emergency;

    mainIndex = index;

    openContactModal();
}

// search function
function searchContacts(term) {
    var stored_data = "";
    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].fullName.toLowerCase().includes(term.toLowerCase()) ||
            allContacts[i].phone.includes(term) || allContacts[i].email.toLowerCase().includes(term.toLowerCase())) {
            stored_data += `
            <div class="col-md-6">
            <div class="inner bg-white overflow-hidden rounded-4">
                <div class="header-inner p-3">
                    <div class="d-flex gap-2">
                        <div class="first-letter position-relative d-flex justify-content-center align-items-center text-white fw-medium fs-5">
                            ${allContacts[i].fullName.charAt(0).toUpperCase()}
                            <div class="position-absolute ${allContacts[i].favorite ? "" : "d-none"} bg-warning fav-badge rounded-circle d-flex justify-content-center align-items-center">
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <div class="position-absolute ${allContacts[i].emergency ? "" : "d-none"} pink-bg emrg-badge rounded-circle d-flex justify-content-center align-items-center">
                                <i class="fa-solid text-white fa-heart-pulse"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="fs-6 mt-0 m-1">${allContacts[i].fullName}</h3>
                            <div class="d-flex gap-2">
                                <div class="phone-icon light-blue-bg rounded-3 d-flex justify-content-center align-items-center">
                                    <i class="fa-solid fa-xs blue-color fa-phone"></i>
                                </div>
                                <span class="text-secondary">${allContacts[i].phone}</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2 mt-2">

                        ${allContacts[i].email ? `
                            <div id="emailIcon" class="phone-icon mt-2 p-3 bg-purple rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-xs text-main fa-envelope"></i>
                        </div>
                        <span>${allContacts[i].email}</span>
                            `: ""}
                    </div>


                    <div class="d-flex align-items-center gap-2 mt-2">

                        ${allContacts[i].address ? `
                            <div  class="phone-icon mt-2 p-3 bg-green rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-xs green-color fa-location-dot"></i>
                        </div>
                        <span class="text-muted">${allContacts[i].address}</span>
                            `: ""}
                    </div>


                    <div class="mt-2 mb-3 d-flex gap-2">
                    ${getGroupBadge(allContacts[i].group)}
                 ${allContacts[i].emergency ? `
                <span class="rounded-3 light-red-bg p-2 fa-xs fw-semibold text-danger">
                <i class="fa-solid fa-heart-pulse"></i>
                 Emergency
                </span>
                 ` : ""}
                </div>
                </div>
                <div class="footer-inner px-3 py-2 d-flex justify-content-between border-top">
                    <div class="d-flex gap-3 align-items-center">
                        <a href="tel:${allContacts[i].phone}" class="text-decoration-none phone-icon footer-icon bg-green rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid green-color fa-phone"></i>
                        </a>
                        <a href="mailto:${allContacts[i].email}" class="text-decoration-none text-main mail-icon footer-icon bg-purple rounded-3 d-flex justify-content-center align-items-center">
                            <i class="fa-solid  fa-envelope"></i>
                        </a>
                    </div>
                    <div class="action-btns">
                        <button onclick="toggleFavorite(${i})"
                                class="btn favorite-add ${allContacts[i].favorite ? "d-none" : ""}">
                            <i class="fa-regular fa-star"></i>
                        </button>

                        <!-- remove from fav -->
                        <button onclick="toggleFavorite(${i})"
                                class="btn favorite bg-yellow ${allContacts[i].favorite ? "" : "d-none"}">
                            <i class="fa-solid fa-star text-warning"></i>
                        </button>

                        <!-- add to emergency -->
                        <button onclick="toggleEmergency(${i})"
                                class="btn emergency-add ${allContacts[i].emergency ? "d-none" : ""}">
                            <i class="fa-regular fa-heart"></i>
                        </button>

                        <!-- remove from emergency -->
                        <button onclick="toggleEmergency(${i})"
                                class="btn emergency light-red-bg ${allContacts[i].emergency ? "" : "d-none"}">
                            <i class="fa-solid fa-heart-pulse pink-color"></i>
                        </button>
                        <!-- edit -->
                        <button onclick="preUpdate(${i})" class="btn edit ">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <!-- delete -->
                        
                         <button onclick="deleteContact(${i})" class="btn delete ">
                                                    <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        }
    }
    contactsRow.innerHTML = stored_data;
    if (stored_data == "") {
        noContacts.classList.replace("d-none", "d-flex")
    }
    else {
        noContacts.classList.replace("d-flex", "d-none")

    }
    displayFavorites();
    displayEmergency();
    updateCounters();

}
