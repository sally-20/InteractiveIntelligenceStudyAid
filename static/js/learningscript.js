document.addEventListener('DOMContentLoaded', function () {
    // Function to toggle visibility of units and lessons within a level
    function toggleLevelContent(level) {
        const levels = document.querySelectorAll('section[id]');
        levels.forEach((lvl) => {
            if (lvl.id === level) {
                lvl.classList.remove('hidden');
            } else {
                lvl.classList.add('hidden');
            }
        });
    }

    $(document).ready(function() {
        // Add a click event handler to the elements with data-target attributes
        $('[data-target]').click(function() {
            var targetId = $(this).data('target');
            // Hide all dialog boxes
            $('.dialog-box').addClass('hidden');
            // Show the dialog box corresponding to the clicked element
            $('#' + targetId).removeClass('hidden');
        });
    });
    
    // Function to toggle the visibility of the courses list
    const coursesToggle = document.querySelector(".courses-toggle");
    const courseList = document.querySelector(".course-list");

    coursesToggle.addEventListener("click", () => {
        courseList.classList.toggle("hidden");
    });

    // Get the dropdown button and the dropdown content
    var dropbtn = document.querySelector(".dropbtn");
    var dropdownContent = document.querySelector(".dropdown-content");

    // Get the first option in the dropdown content
    var firstOption = dropdownContent.querySelector(".option");

    // Set the button's text to match the first option
    dropbtn.textContent = firstOption.textContent;

    // Set the background color of the dropdown button and the text color to the color of the first option
    dropbtn.style.backgroundColor = firstOption.dataset.color;
    dropbtn.style.color = getComputedStyle(firstOption).color;

    // Add an event listener to the dropdown button
    dropbtn.addEventListener("click", function () {
        // Toggle the visibility of the dropdown content
        dropdownContent.classList.toggle("show");
    });

    // Add an event listener to each option in the dropdown content
    dropdownContent.querySelectorAll(".option").forEach(function (option) {
        // Set the background color of the option to its own color
        option.style.backgroundColor = option.dataset.color;

        // Add an event listener to the option
        option.addEventListener("click", function () {
            // Set the button's text to match the selected option
            dropbtn.textContent = option.textContent;
            // Set the background color of the dropdown button and the text color to the color of the option
            dropbtn.style.backgroundColor = option.dataset.color;
            dropbtn.style.color = getComputedStyle(option).color;
            // Close the dropdown content
            dropdownContent.classList.remove("show");
            // Show/hide sections based on the selected option
            toggleLevelContent(option.className.split(" ")[1]);
        });
    });

    // Get all the stars, flowers and dialog boxes
    const stars = document.querySelectorAll('.four-pointed-star');
    const flowers = document.querySelectorAll('.flower_head');
    const bolts = document.querySelectorAll('.bolt');
    const dialogBoxes = document.querySelectorAll('.dialog-box');

    // Function to show the dialog box based on the target ID
    function showDialogBox(target) {
        const dialogBox = document.getElementById(target);
        dialogBox.classList.remove('hidden');
    }

    // Function to hide all dialog boxes
    function hideAllDialogBoxes() {
        dialogBoxes.forEach((box) => {
            box.classList.add('hidden');
        });
    }

    // Add a click event listener to each star
    stars.forEach((star) => {
        star.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click event from propagating to the document
            const target = star.getAttribute('data-target');
            hideAllDialogBoxes(); // Hide all dialog boxes
            showDialogBox(target); // Show the clicked dialog box
        });
    });

    // Add a click event listener to each flower
    flowers.forEach((flower) => {
        flower.addEventListener('click', function (event) {
        event.stopPropagation();// Prevent the click event from propagating to the document
        const target = flower.getAttribute('data-target');
        hideAllDialogBoxes(); // Hide all dialog boxes
        showDialogBox(target); // Show the clicked dialog box
        });
    });

    // Add a click event listener to each bolt
    bolts.forEach((bolt) => {
        bolt.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click event from propagating to the document
            const target = bolt.getAttribute('data-target');
            hideAllDialogBoxes(); // Hide all dialog boxes
            showDialogBox(target); // Show the clicked dialog box
        });
    });

    document.addEventListener('click', function (event) {
        hideAllDialogBoxes();
    });

    var startButtons = document.querySelectorAll('.start-button');

    startButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the lesson URL from the data-url attribute
            var lessonURL = button.getAttribute('data-url');

            // Redirect the user to the lesson URL
            window.location.href = lessonURL;
        });
    });

    const chatButton = document.querySelector(".chat-button");
    const chatbotContainer = document.querySelector(".chatbot-container");
    const closeButton = document.getElementById("close-button");

    chatButton.addEventListener("click", function () {
        chatbotContainer.classList.add("chatbot-container-open");
    });

    closeButton.addEventListener("click", function () {
        chatbotContainer.classList.remove("chatbot-container-open");
    });

    // Get chatbot elements
    const chatbot = document.getElementById('chatbot');
    const conversation = document.getElementById('conversation');
    const inputForm = document.getElementById('input-form');
    const inputField = document.getElementById('input-field');

    inputForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const input = inputField.value;
        inputField.value = '';
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
        let message = document.createElement('div');
        message.classList.add('chatbot-message', 'user-message');
        message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
        conversation.appendChild(message);
        try {
            // Use the input to generate chatbot response
            const response = await generateChatResponse(input);
            message = document.createElement('div');
            message.classList.add('chatbot-message', 'chatbot');
            message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
            conversation.appendChild(message);
            message.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.error(error);
        }
    });    
    
    async function generateChatResponse(userInput) {
        try {
            const response = await fetch('/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_input': userInput,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch chatbot response');
            }
    
            const responseData = await response.json();
            return responseData.response;
        } catch (error) {
            console.error(error);
            // Handle error appropriately (e.g., show a message to the user)
            return 'An error occurred while processing your request.';
        }
    }

    // Generate chatbot response function
    function simulateChatbotResponse(input) {
        // Add chatbot logic here
        const responses = [
            "Hello, how can I help you today? 😊",
            "I'm sorry, I didn't understand your question. Could you please rephrase it? 😕",
            "I'm here to assist you with any questions or concerns you may have. 📩",
            "I'm sorry, I'm not able to browse the internet or access external information. Is there anything else I can help with? 💻",
            "What would you like to know? 🤔",
            "I'm sorry, I'm not programmed to handle offensive or inappropriate language. Please refrain from using such language in our conversation. 🚫",
            "I'm here to assist you with any questions or problems you may have. How can I help you today? 🚀",
            "Is there anything specific you'd like to talk about? 💬",
            "I'm happy to help with any questions or concerns you may have. Just let me know how I can assist you. 😊",
            "I'm here to assist you with any questions or problems you may have. What can I help you with today? 🤗",
            "Is there anything specific you'd like to ask or talk about? I'm here to help with any questions or concerns you may have. 💬",
            "I'm here to assist you with any questions or problems you may have. How can I help you today? 💡",
        ];

        // Return a random response
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Function to submit feedback
    const feedbackButton = document.querySelector(".feedback-button");
    const feedbackContainer = document.getElementById("feedback-container");
    const closeFeedbackButton = document.getElementById("close-feedback-button");
    const submitFeedbackButton = document.getElementById("submit-feedback-button");
    const feedbackMessage = document.getElementById("feedback-message");

    feedbackButton.addEventListener("click", function () {
        feedbackContainer.style.display = "block";
    });
    
    closeFeedbackButton.addEventListener("click", function () {
        feedbackContainer.style.display = "none";
    });

    function submitFeedback(url, username, feedbackContainer) {
        // Fetch the feedback message and other data from the form
        const feedbackMessage = document.getElementById("feedback-message").value;
        // Make a POST request to the feedback submission endpoint
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            feedback_message: feedbackMessage,
                username: username,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response, e.g., show a success message
            console.log(data);
            alert("Feedback submitted successfully!");
            feedbackContainer.style.display = "none";
        })
        .catch(error => {
            // Handle errors
            console.error('Error submitting feedback:', error);
            alert("Error submitting feedback. Please try again.");
        });
    }  
});
