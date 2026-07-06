// Currently Reading elements
const openCurrentForm = document.getElementById("openCurrentForm");
const currentForm = document.getElementById("currentForm");
const saveCurrentBook = document.getElementById("saveCurrentBook");
const currentReading = document.getElementById("currentReading");
const currentPage = document.getElementById("currentPage");
const markFinished = document.getElementById("markFinished");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pageInput = document.getElementById("page");

let currentBookTitle = "";
let currentBookAuthor = "";

// Recently Finished elements
const openFinishedForm = document.getElementById("openFinishedForm");
const finishedForm = document.getElementById("finishedForm");
const saveFinishedBook = document.getElementById("saveFinishedBook");
const finishedBook = document.getElementById("finishedBook");
const finishedRatingDisplay = document.getElementById("finishedRatingDisplay");

const finishedTitleInput = document.getElementById("finishedTitle");
const finishedAuthorInput = document.getElementById("finishedAuthor");
const finishedReviewInput = document.getElementById("finishedReview");

// Reading Goal + Quote
const goalCount = document.getElementById("goalCount");
const quoteText = document.getElementById("quoteText");
const quoteSource = document.getElementById("quoteSource");

// Star rating
const stars = document.querySelectorAll("#starRating .star");
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener("click", function(){
        currentRating = parseInt(this.dataset.value);
        highlightStars(currentRating);
    });
});

function highlightStars(rating){
    stars.forEach(star => {
        if(parseInt(star.dataset.value) <= rating){
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }
    });
}

function getFinishedBooks(){
    const saved = localStorage.getItem("finishedBooks");
    return saved ? JSON.parse(saved) : [];
}

function saveFinishedBooks(books){
    localStorage.setItem("finishedBooks", JSON.stringify(books));
}

function updateGoalCount(){
    const books = getFinishedBooks();
    goalCount.textContent = `${books.length} / 50 Books`;
}

function showQuoteOfTheDay(){
    const books = getFinishedBooks();
    const booksWithReviews = books.filter(book => book.review && book.review.trim() !== "");

    if(booksWithReviews.length === 0){
        quoteText.textContent = "Add a review to see quotes here!";
        quoteSource.textContent = "";
        return;
    }

    const randomIndex = Math.floor(Math.random() * booksWithReviews.length);
    const chosen = booksWithReviews[randomIndex];

    quoteText.textContent = `"${chosen.review}"`;
    quoteSource.textContent = `— your review of ${chosen.title}`;
}

updateGoalCount();
showQuoteOfTheDay();

// Open/close forms
openCurrentForm.addEventListener("click", function(){
    currentForm.classList.remove("hidden");
});

openFinishedForm.addEventListener("click", function(){
    finishedForm.classList.remove("hidden");
});

// Save Currently Reading
saveCurrentBook.addEventListener("click", function(){

    const title = titleInput.value;
    const author = authorInput.value;
    const page = pageInput.value;

    if(title === ""){
        alert("Enter a title!");
        return;
    }

    currentBookTitle = title;
    currentBookAuthor = author;

    currentReading.textContent = author === "" 
        ? title 
        : `${title} by ${author}`;

    currentPage.textContent = page === "" ? "" : `On page ${page}`;

    titleInput.value = "";
    authorInput.value = "";
    pageInput.value = "";

    currentForm.classList.add("hidden");
});

// Mark current book as finished
markFinished.addEventListener("click", function(){

    if(currentBookTitle === ""){
        alert("You don't have a book marked as Currently Reading yet!");
        return;
    }

    finishedTitleInput.value = currentBookTitle;
    finishedAuthorInput.value = currentBookAuthor;

    currentRating = 0;
    highlightStars(0);
    finishedReviewInput.value = "";

    finishedForm.classList.remove("hidden");

    currentBookTitle = "";
    currentBookAuthor = "";
    currentReading.textContent = "No books yet...";
    currentPage.textContent = "";
});

// Save Recently Finished
saveFinishedBook.addEventListener("click", function(){

    const title = finishedTitleInput.value;
    const author = finishedAuthorInput.value;
    const review = finishedReviewInput.value;

    if(title === ""){
        alert("Enter a title!");
        return;
    }

    if(currentRating === 0){
        alert("Please select a star rating!");
        return;
    }

    const displayText = author === "" ? title : `${title} by ${author}`;
    const starsText = "★".repeat(currentRating) + "☆".repeat(5 - currentRating);

    finishedBook.textContent = displayText;
    finishedRatingDisplay.textContent = starsText;

    const books = getFinishedBooks();
    books.push({
        title: title,
        author: author,
        rating: currentRating,
        review: review,
        date: new Date().toLocaleDateString()
    });
    saveFinishedBooks(books);

    updateGoalCount();
    showQuoteOfTheDay();

    finishedTitleInput.value = "";
    finishedAuthorInput.value = "";
    finishedReviewInput.value = "";
    currentRating = 0;
    highlightStars(0);

    finishedForm.classList.add("hidden");
});