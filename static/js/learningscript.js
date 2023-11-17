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

    // Function to navigate to the lesson's content
    function navigateToLesson(lesson) {
        // Define URLs for each lesson page
        const lessonURLs = {
            algbeglsn1: 'algbeglsn1.html',
            algbeglsn2: 'algbeglsn2.html', 
            algbeglsn3: 'algbeglsn3.html', 
            algbeglsn4: 'algbeglsn4.html', 
            algbeglsn5: 'algbeglsn5.html', 
            algbeglsn6: 'algbeglsn.html', 
            algbeglsn7: 'algbeglsn.html', 
            algbeglsn8: 'algbeglsn8.html',
            algbeglsn9: 'algbeglsn9.html',
            algbeglsn10: 'algbeglsn10.html',
            algbeglsn11: 'algbeglsn11.html',
            algbeglsn12: 'algbeglsn12.html',
            algbeglsn13: 'algbeglsn13.html',
            algbeglsn14: 'algbeglsn14.html',
            algbeglsn15: 'algbeglsn15.html',
            algbeglsn16: 'algbeglsn16.html',
            algbeglsn17: 'algbeglsn17.html',
            algbeglsn18: 'algbeglsn18.html',
            algbeglsn19: 'algbeglsn19.html',
            algbeglsn20: 'algbeglsn20.html',
            algitdlsn1: 'algitdlsn1.html',
            algitdlsn2: 'algitdlsn2.html',
            algitdlsn3: 'algitdlsn3.html',
            algitdlsn4: 'algitdlsn4.html',
            algitdlsn5: 'algitdlsn5.html',
            algitdlsn6: 'algitdlsn6.html',
            algitdlsn7: 'algitdlsn7.html',
            algitdlsn8: 'algitdlsn8.html',
            algitdlsn9: 'algitdlsn9.html',
            algitdlsn10: 'algitdlsn10.html',
            algitdlsn11: 'algitdlsn11.html',
            algitdlsn12: 'algitdlsn12.html',
            algitdlsn13: 'algitdlsn13.html',
            algitdlsn14: 'algitdlsn14.html',
            algitdlsn15: 'algitdlsn15.html',
            algitdlsn16: 'algitdlsn16.html',
            algadvlsn1: 'algadvlsn1.html',
            algadvlsn2: 'algadvlsn2.html',
            algadvlsn3: 'algadvlsn3.html',
            algadvlsn4: 'algadvlsn4.html',
            algadvlsn5: 'algadvlsn5.html',
            algadvlsn6: 'algadvlsn6.html',
            algadvlsn7: 'algadvlsn7.html',
            algadvlsn8: 'algadvlsn8.html',
            algadvlsn9: 'algadvlsn9.html',
            algadvlsn10: 'algadvlsn10.html',
            algadvlsn11: 'algadvlsn11.html',
            algadvlsn12: 'algadvlsn12.html',
            algadvlsn13: 'algadvlsn13.html',
            algadvlsn14: 'algadvlsn14.html',
            algadvlsn15: 'algadvlsn15.html',
            algadvlsn16: 'algadvlsn16.html',
            algadvlsn17: 'algadvlsn17.html',
            algadvlsn18: 'algadvlsn18.html',
            algadvlsn19: 'algadvlsn19.html',
            algadvlsn20: 'algadvlsn20.html',
            algadvlsn21: 'algadvlsn21.html',
            algadvlsn22: 'algadvlsn22.html',
            algadvlsn23: 'algadvlsn23.html',
            algadvlsn24: 'algadvlsn24.html',
            algadvlsn25: 'algadvlsn25.html',
            algadvlsn26: 'algadvlsn26.html',
            algadvlsn27: 'algadvlsn27.html',
            algadvlsn28: 'algadvlsn28.html',
            algadvlsn29: 'algadvlsn29.html',
            algadvlsn30: 'algadvlsn30.html',
            algadvlsn31: 'algadvlsn31.html',
            algadvlsn32: 'algadvlsn32.html',
            algadvlsn33: 'algadvlsn33.html',
            algadvlsn34: 'algadvlsn34.html',
            algadvlsn35: 'algadvlsn35.html',
            algadvlsn36: 'algadvlsn36.html',
            algadvlsn37: 'algadvlsn37.html',
            algadvlsn38: 'algadvlsn38.html',
            algadvlsn39: 'algadvlsn39.html',
            algadvlsn40: 'algadvlsn40.html',
            algadvlsn41: 'algadvlsn41.html',
        };

        // Check if the lesson URL exists
        if (lessonURLs[lesson]) {
            // Navigate to the lesson's content
            window.location.href = lessonURLs[lesson];
        }
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

    const startButtons = document.querySelectorAll('.start-button');

    startButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const lesson = button.getAttribute('data-lesson');
            navigateToLesson(lesson);
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

    // Add event listener to input form
    inputForm.addEventListener('submit', function (event) {
        // Prevent form submission
        event.preventDefault();

        // Get user input
        const input = inputField.value;

        // Clear input field
        inputField.value = '';
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

        // Add user input to conversation
        let message = document.createElement('div');
        message.classList.add('chatbot-message', 'user-message');
        message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
        conversation.appendChild(message);

        // Generate chatbot response
        const response = generateResponse(input);

        // Add chatbot response to conversation
        message = document.createElement('div');
        message.classList.add('chatbot-message', 'chatbot');
        message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
        conversation.appendChild(message);
        message.scrollIntoView({ behavior: "smooth" });
    });

    // Generate chatbot response function
    function generateResponse(input) {
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
    
    // Function to toggle visibility of the feedback form
    const feedbackButton = document.querySelector(".feedback-button");
    const feedbackContainer = document.getElementById("feedback-container");
    const closeFeedbackButton = document.getElementById("close-feedback-button");

    feedbackButton.addEventListener("click", function () {
        feedbackContainer.style.display = "block"; // Show the feedback container
    });

    closeFeedbackButton.addEventListener("click", function () {
        feedbackContainer.style.display = "none"; // Hide the feedback container
    });
});
