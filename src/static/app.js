document.addEventListener("DOMContentLoaded", function() {
    fetchParticipants();
});
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  function fetchParticipants() {
    fetch('/participants')
      .then(response => response.json())
      .then(data => {
        const list = document.getElementById('participants-list');
        list.innerHTML = '';
        data.forEach(participant => {
          const li = document.createElement('li');
          li.style.listStyleType = 'none'; // Hide bullet points
          li.style.display = 'flex';
          li.style.alignItems = 'center';
                
          const nameSpan = document.createElement('span');
          nameSpan.textContent = participant;
          nameSpan.style.flexGrow = '1';

          const deleteBtn = document.createElement('span');
          deleteBtn.innerHTML = '&#128465;'; // Trash can icon
          deleteBtn.title = 'Unregister';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.style.marginLeft = '10px';
          deleteBtn.onclick = function() {
            unregisterParticipant(participant);
          };

          li.appendChild(nameSpan);
          li.appendChild(deleteBtn);
          list.appendChild(li);
        });
      });
  }

  function unregisterParticipant(name) {
    fetch(`/participants/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        fetchParticipants();
      } else {
        alert('Failed to unregister participant.');
      }
    });
  }
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Participants section
        let participantsHTML = "";
        if (details.participants.length > 0) {
          participantsHTML = `
            <div class="participants-section">
              <strong>Participants:</strong>
              <ul class="participants-list">
                ${details.participants.map(email => `<li>${email}</li>`).join("")}
              </ul>
            </div>
          `;
        } else {
          participantsHTML = `
            <div class="participants-section">
              <strong>Participants:</strong>
              <span class="no-participants">No participants yet</span>
            </div>
          `;
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          ${participantsHTML}
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        fetchParticipants(); // Refresh participant list after successful signup
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
