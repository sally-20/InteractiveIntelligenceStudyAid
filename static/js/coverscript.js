document.addEventListener('DOMContentLoaded', function() {
    // Select the dropdown on smaller window
    const navDropdown = document.getElementById('navDropdown');
    navDropdown.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent the dropdown from closing when clicking on it
    });
    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function() {
        navDropdown.querySelector('.dropdown-content').style.display = 'none';
    });
    // Open the dropdown when clicking on the dropdown button
    navDropdown.querySelector('.dropbtn').addEventListener('click', function(e) {
        e.stopPropagation();
        navDropdown.querySelector('.dropdown-content').style.display = 'block';
    });
    // Select the subject cards on the homepage
    const subjectCards = document.querySelectorAll('.subject-card');
    // Add click event listeners to each subject card
    subjectCards.forEach(card => {
        card.addEventListener('click', function() {
            // You can add logic to start the selected subject when clicked.
            const subjectName = card.querySelector('h2').textContent;
            alert(`Starting ${subjectName}`);
        });
    });
});