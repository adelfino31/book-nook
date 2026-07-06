const bookshelf = document.getElementById("bookshelf");
const bookDetails = document.getElementById("bookDetails");

const saved = localStorage.getItem("finishedBooks");
const books = saved ? JSON.parse(saved) : [];

// Old-library color palette for spines, cycled through
const spineColors = ["#5C1F2E", "#2F4F3A", "#1F3A5C", "#4A3728", "#6B4226", "#3B4A2F"];

if(books.length === 0){
    bookshelf.innerHTML = "<p class='no-books-message'>No books finished yet — go read something! 📖</p>";
} else {

    books.forEach((book, index) => {

        const spine = document.createElement("div");
        spine.className = "spine";
        spine.style.backgroundColor = spineColors[index % spineColors.length];

        const label = document.createElement("span");
        label.textContent = book.title;
        label.style.fontSize = getFontSizeForTitle(book.title);
        spine.appendChild(label);

        spine.addEventListener("click", function(){
            showBookDetails(book);
        });

        bookshelf.appendChild(spine);
    });
}

// Shrink font size as title length grows, so nothing gets cut off
function getFontSizeForTitle(title){
    const length = title.length;

    if(length <= 12){
        return "14px";
    } else if(length <= 20){
        return "12px";
    } else if(length <= 30){
        return "10px";
    } else {
        return "8.5px";
    }
}

function showBookDetails(book){

    const displayTitle = book.author === "" ? book.title : `${book.title} by ${book.author}`;
    const starsText = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);

    bookDetails.innerHTML = `
        <h3>${displayTitle}</h3>
        <p class="library-date">Finished on ${book.date}</p>
        <p class="library-rating">${starsText}</p>
        ${book.review ? `<p class="library-review">"${book.review}"</p>` : "<p class='library-review'>No review written.</p>"}
    `;

    bookDetails.classList.remove("hidden");
}