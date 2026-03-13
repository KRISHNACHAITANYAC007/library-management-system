document.addEventListener("DOMContentLoaded", function () {

    /* ===============================
       1) LOGIN SYSTEM
    =============================== */

    const loginForm = document.querySelector(".login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "admin@lms.com" && password === "admin123") {
                window.location.href = "admin_dashoard.html";
            }
            else if (email === "lib@lms.com" && password === "lib123") {
                window.location.href = "librarian_dashboard.html";
            }
            else if (email === "stu@lms.com" && password === "stu123") {
                window.location.href = "student_faculty_dashboard.html";
            }
            else {
                alert("Invalid Credentials");
            }
        });
    }


    /* ===============================
       2) ADD BOOK
    =============================== */

    const addForm = document.querySelector(".add-book-form");

    if (addForm) {
        addForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const title = document.getElementById("bookTitle")?.value.trim();
            const author = document.getElementById("bookAuthor")?.value.trim();
            const edition = document.getElementById("bookEdition")?.value.trim();
            const quantity=parseInt(document.getElementById("bookQuantity").value);
            const imageFile = document.getElementById("bookImage").files[0];
            let imageURL = "image copy 16.png";

            if(imageFile) {
                imageURL=URL.createObjectURL(imageFile);
            }

            if (!title || !author || !edition || isNaN(quantity) || quantity<=0) {
                alert("All fields are required!");
                return;
            }

            fetch("add_book.php", {
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded"
},
body: `title=${title}&author=${author}&edition=${edition}&quantity=${quantity}`
})
.then(res => res.text())
.then(data => {
data = data.trim();
if(data === "success"){
alert("Book Added Successfully!");
addActivity("New Book Added","Library Staff","Librarian","Added");
addForm.reset();
}
else{
console.log(data);
alert("Error adding book");
}

});
        });
    }


   /* ===============================
   5) BOOK SEARCH DISPLAY
=============================== */

const bookSection = document.querySelector(".books");

if (bookSection) {

fetch("get_books.php")
.then(res => res.json())
.then(books => {

books.forEach((book, index) => {

const div = document.createElement("div");
div.classList.add("book");

const status = book.quantity > 0 ? "Available" : "Not Available";
const statusClass = book.quantity > 0 ? "status-Ok" : "status-due";

div.innerHTML = `
<img src="${book.image}" class="imgbook">
<h3>${book.title}</h3>
<p><strong>Author:</strong> ${book.author}</p>
<p><strong>Edition:</strong> ${book.edition}</p>
<p class="${statusClass}">${status}</p>

<button class="btn"
${book.quantity <= 0 ? "disabled" : ""}
onclick="addToCart(${index})">

${book.quantity > 0 ? "Add to Cart" : "Not Available"}

</button>
`;

bookSection.appendChild(div);

});

});
}
  /* ===============================
UPDATE BOOK TABLE DISPLAY
=============================== */

const manageBooksTable = document.querySelector(".manage-books-body");

if (manageBooksTable) {

fetch("get_books.php")
.then(res => res.json())
.then(books => {

books.forEach((book) => {

const row = document.createElement("tr");

row.innerHTML = `
<td><img src="${book.image}" class="book-img"></td>
<td>${book.id}</td>
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.edition}</td>
<td>
<button class="button" onclick="editBook(${book.id})">
Update
</button>
</td>
`;

manageBooksTable.appendChild(row);

});

});

}




    /* ===============================
       7) CART PAGE
    =============================== */
    
    const cartTable = document.querySelector(".cart-body");

    if (cartTable) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.forEach((book, index) => {

            const row = document.createElement("tr");

        row.innerHTML = `
<td><img src="${book.image}" class="book-img"></td>
<td>${book.id}</td>
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.edition}</td>
<td class="status-Ok">Available</td>
<td>-</td>
<td>
<button class="button" onclick="removeFromCart(${index})">
Remove
</button>
</td>
`;

            cartTable.appendChild(row);
        });
    }


    /* ===============================
       8) MY BOOKS PAGE
    =============================== */

    const myBooksTable = document.querySelector(".mybooks-body");

    if (myBooksTable) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.forEach((book, index) => {

            const row = document.createElement("tr");
                const issueDate = new Date();
const dueDate = new Date(Date.now() + 7*24*60*60*1000);

const fine = calculateFine(dueDate);

row.innerHTML = `
<td><img src="${book.image}" class="book-img"></td>
<td>${book.id}</td>
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.edition}</td>
<td>${issueDate.toLocaleDateString()}</td>
<td>${dueDate.toLocaleDateString()}</td>
<td class="status-Ok">Issued</td>

<td>
${fine > 0
? `<button class="button" onclick="payFine(${index}, ${fine})">Fine ₹${fine}</button>`
: `<button class="button" onclick="returnBook(${index})">Return</button>`
}
</td>
`;
          

            myBooksTable.appendChild(row);
        });
    }

    /* ===============================
   UPDATE BOOK FORM
=============================== */

const updateForm = document.querySelector(".book-form");

if(updateForm){

updateForm.addEventListener("submit", function(e){

    e.preventDefault();

    const index = localStorage.getItem("editBookIndex");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const quantity = document.getElementById("quantity").value;

    books[index].title = title;
    books[index].author = author;
    books[index].quantity = quantity;

    localStorage.setItem("books", JSON.stringify(books));

    alert("Book Updated Successfully");

    window.location.href = "UPDATEBOOK.html";

});
}

/* ===============================
   REMOVE BOOK PAGE TABLE
=============================== */

const removeBooksTable = document.querySelector(".remove-books-body");

if (removeBooksTable) {

    const books = JSON.parse(localStorage.getItem("books")) || [];

    books.forEach((book, index) => {

        const status = book.quantity > 0 ? "Available" : "Issued";
        const statusClass = book.quantity > 0 ? "status-Ok" : "status-due";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td><img src="${book.image}" class="book-img"></td>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.edition}</td>
            <td class="${statusClass}">${status}</td>
            <td>
                ${
                    book.quantity > 0
                    ? `<button class="button remove-btn" onclick="removeBook(${index})">Remove</button>`
                    : `<span style="color:red;font-weight:bold;">Cannot Remove</span>`
                }
            </td>
        `;

        removeBooksTable.appendChild(row);

    });
}

    const editIndex = localStorage.getItem("editBookIndex");

if(editIndex !== null){

    let books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books[editIndex];

    if(book){

        document.getElementById("bookTitle").value = book.title;
        document.getElementById("bookAuthor").value = book.author;
        document.getElementById("quantity").value = book.quantity;
    }
}

/* ===============================
   FINE PAGE
=============================== */

const fineTable = document.querySelector(".fine-body");

if(fineTable){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let totalFine = 0;

cart.forEach((book,index)=>{

const issueDate = new Date();
const dueDate = new Date(Date.now() - 3*24*60*60*1000); // simulate overdue

const daysExceeded = Math.max(0,
Math.floor((new Date() - dueDate)/(1000*60*60*24)));

const fineAmount = daysExceeded * 10;

totalFine += fineAmount;

const row = document.createElement("tr");

row.innerHTML = `
<td><img src="${book.image}" class="book-img"></td>
<td>${book.id}</td>
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.edition}</td>
<td>${book.issueDate}</td>
<td>${book.dueDate}</td>
<td class="finedays">${daysExceeded}</td>
<td class="finedays">₹${fineAmount}</td>
<td>
<button class="button" onclick="payFine(${index})">
Pay Fine
</button>
</td>
`;

fineTable.appendChild(row);

});

document.getElementById("totalFine").innerText = "₹" + totalFine;

}

/* ===============================
   RECENT SYSTEM ACTIVITY
=============================== */

const activityTable = document.getElementById("activityBody");

if(activityTable){

const activities = JSON.parse(localStorage.getItem("activities")) || [];

activities.forEach(act => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${act.date}</td>
<td>${act.activity}</td>
<td>${act.user}</td>
<td>${act.role}</td>
<td class="${act.status === "Blocked" ? "status-due" : "status-Ok"}">
${act.status}
</td>
`;

activityTable.appendChild(row);

});

}

  /* ===============================
   12) SYSTEM OVERVIEW
=============================== */

const booksOverview = JSON.parse(localStorage.getItem("books")) || [];
const cartOverview = JSON.parse(localStorage.getItem("cart")) || [];
const users = JSON.parse(localStorage.getItem("users")) || [];

const totalBooks = document.getElementById("totalBooks");
const issuedBooks = document.getElementById("issuedBooks");
const totalUsers = document.getElementById("totalUsers");
const totalLibrarians = document.getElementById("totalLibrarians");
const overdueBooks = document.getElementById("overdueBooks");
const totalFines = document.getElementById("totalFines");

if (totalBooks) totalBooks.innerText = booksOverview.length;
if (issuedBooks) issuedBooks.innerText = cartOverview.length;
if (totalUsers) totalUsers.innerText = users.length;

if (totalLibrarians) {
    const librarians = users.filter(u => u.role === "librarian");
    totalLibrarians.innerText = librarians.length;
}

let overdue = 0;
let fines = 0;

cartOverview.forEach(book => {

const today = new Date();
const due = new Date(book.dueDate);

if (today > due) {

overdue++;

const days = Math.floor((today - due) / (1000*60*60*24));
fines += days * 10;

}


});
if (overdueBooks) overdueBooks.innerText = overdue;
if (totalFines) totalFines.innerText = "₹" + fines;
});


/* ===============================
   GLOBAL FUNCTIONS
=============================== */

function addToCart(index){

let books = JSON.parse(localStorage.getItem("books")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

if(books[index].quantity > 0){

books[index].quantity -= 1;

const issueDate = new Date();
const dueDate = new Date();

dueDate.setDate(issueDate.getDate() + 14);

const issuedBook = {
...books[index],
issueDate: issueDate.toLocaleDateString(),
dueDate: dueDate.toLocaleDateString()
};

cart.push(issuedBook);

localStorage.setItem("books", JSON.stringify(books));
localStorage.setItem("cart", JSON.stringify(cart));

alert("Book Issued");
addActivity("Book Issued","Krishna","Student","Success");
location.reload();

}

}

function removeFromCart(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let books = JSON.parse(localStorage.getItem("books")) || [];

    const removedBook = cart[index];

    books.forEach(book => {
        if (book.title === removedBook.title) {
            book.quantity += 1;
        }
    });

    cart.splice(index, 1);

    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();
}



function returnBook(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let books = JSON.parse(localStorage.getItem("books")) || [];

    const returnedBook = cart[index];
 
    books.forEach(book => {
        if (book.title === returnedBook.title) {
            book.quantity += 1;
        }
    });

    cart.splice(index, 1);

    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Book Returned!");
    addActivity("Book Returned","Krishna","Student","Completed");
    location.reload();
}

function calculateFine(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);

    if (today > due) {
        const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
        return diff * 10;
    }
    return 0;
}


function toggleUser(btn) {
    const row = btn.closest("tr");
    const statusCell = row.querySelector(".status-Ok, .status-due");

    if (!statusCell) return;

    if (statusCell.innerText === "Active") {
        statusCell.innerText = "Blocked";
        statusCell.style.color = "red";
        btn.innerText = "Unblock";
        addActivity("User Blocked","Admin","Admin","Blocked");
    } else {
        statusCell.innerText = "Active";
        statusCell.style.color = "green";
        btn.innerText = "Block";
        addActivity("User Unblocked","Admin","Admin","Success");
    }
}

function editBook(bookId){

    localStorage.setItem("editBookIndex", bookId);

    window.location.href = "manage_books.html";
}

function removeBook(index){

    let books = JSON.parse(localStorage.getItem("books")) || [];

    books.splice(index,1);

    localStorage.setItem("books", JSON.stringify(books));

    alert("Book Removed Successfully");

    location.reload();
}

function reserveBook(index){

let books = JSON.parse(localStorage.getItem("books")) || [];
let reserve = JSON.parse(localStorage.getItem("reserve")) || [];

reserve.push(books[index]);

localStorage.setItem("reserve", JSON.stringify(reserve));

alert("Book Reserved Successfully");

}

function payFine(index, amount){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const book = cart[index];

localStorage.setItem("fineAmount", amount);
localStorage.setItem("fineBook", JSON.stringify(book));
localStorage.setItem("fineBookIndex", index);
addActivity("Fine Paid","Krishna","Student","Completed");
window.location.href = "stu_fine.html";

}



function approve(btn){

const row = btn.closest("tr");
const statusCell = row.querySelector("td:nth-child(7)");

statusCell.innerText = "Approved";
statusCell.className = "status-Ok";

btn.parentElement.innerHTML = "Verified";

}

function reject(btn){

const row = btn.closest("tr");
const statusCell = row.querySelector("td:nth-child(7)");

statusCell.innerText = "Rejected";
statusCell.className = "status-due";

btn.parentElement.innerHTML = "Rejected";

}

function addActivity(activity, user, role, status){

let activities = JSON.parse(localStorage.getItem("activities")) || [];

const today = new Date();
const date = today.toLocaleDateString("en-GB");

activities.unshift({
date: date,
activity: activity,
user: user,
role: role,
status: status
});

if(activities.length > 5){
activities.pop();
}

localStorage.setItem("activities", JSON.stringify(activities));

}