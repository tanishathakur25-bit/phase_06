function showSection(sectionId) {
    document
        .getElementById("formSection")
        .classList.add("hidden");

    document
        .getElementById("feedbackSection")
        .classList.add("hidden");
   
    document
        .getElementById(sectionId)
        .classList.remove("hidden");

    if (sectionId === "feedbackSection") {
        loadFeedback();
    }
}

const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const rating = document.getElementById("rating").value;
    const comments = document.getElementById("comment").value;

    try {
        const response = await fetch("/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                rating,
                comments
            })
        });

        const data = await response.json();
        const message = document.getElementById("message");

        if (response.ok) {
            message.textContent = "Feedback submitted successfully!";
            message.style.color = "green";
            feedbackForm.reset();
        } else {
            message.textContent = data.message || "Something went wrong.";
            message.style.color = "red";
        }

    } catch (error) {
        console.log(error);

        document.getElementById("message").textContent =
            "Server error. Please try again.";

        document.getElementById("message").style.color = "red";
    }
});


async function loadFeedback() {

    try {  
        const response = await fetch("/feedback");
        const feedback = await response.json();
        const feedbackList =
            document.getElementById("feedbackList");

        feedbackList.innerHTML = "";

        if (feedback.length === 0) {

            feedbackList.innerHTML = `
                <p class="no-feedback">
                    No feedback available yet.
                </p>
            `;
            return;
        }

        feedback.forEach((item) => {
            const card = document.createElement("div");
            card.className = "feedback-card";
            const stars = "⭐".repeat(item.rating);

            card.innerHTML = `
                <h3>${item.name}</h3>

                <div class="rating">
                    ${stars}
                </div>

                <p>${item.comments}</p>
            `;

            feedbackList.appendChild(card);
        });
    } catch (error) {
        console.log(error);

        document.getElementById("feedbackList").innerHTML = `
            <p class="no-feedback">
                Failed to load feedback.
            </p>
        `;
    }
}
