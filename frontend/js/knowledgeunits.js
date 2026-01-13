const unitsContainer = document.getElementById("units");
const unitCountEl = document.getElementById("unitCount");

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const fetchKnowledgeUnits = async () => {
  return await getAllKnowledgeUnits();
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: 'easy',
    Medium: 'medium',
    Hard: 'hard'
  };
  return colors[difficulty] || 'medium';
};

const getStatusColor = (status) => {
  const colors = {
    'To Learn': 'status-to-learn',
    'Learning': 'status-learning',
    'Learned': 'status-learned'
  };
  return colors[status] || '';
};

const getDifficultySymbol = (difficulty) => {
  const symbols = {
    Easy: '●',
    Medium: '●●',
    Hard: '●●●'
  };
  return symbols[difficulty] || '';
};

const renderUnits = (units) => {
  unitsContainer.innerHTML = "";
  
  if (!Array.isArray(units)) {
    units = [];
  }
  
  if (unitCountEl) {
    unitCountEl.textContent = units.length;
  }

  if (!units || units.length === 0) {
    unitsContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-gray-400 text-lg font-semibold">No knowledge units found.</p>
        <p class="text-gray-300 text-sm mt-1">Create your first note to get started!</p>
      </div>
    `;
    return;
  }

  units.forEach((unit) => {
    const difficultyClass = getDifficultyColor(unit.difficulty);
    const statusClass = getStatusColor(unit.status);
    const confidencePercentage = (unit.confidence / 5) * 100;

    const div = document.createElement("div");
    div.className = `note-card ${difficultyClass}`;
    div.dataset.id = unit._id;

    div.innerHTML = `
      <div class="note-title">${escapeHtml(unit.title)}</div>
      
      <div class="note-category">${escapeHtml(unit.category)}</div>
      
      <div class="note-meta">
        <div class="meta-item">
          <span class="meta-label">Difficulty</span>
          <span class="difficulty-badge difficulty-${difficultyClass}">
            <span>${getDifficultySymbol(unit.difficulty)}</span>
            <span>${escapeHtml(unit.difficulty)}</span>
          </span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Status</span>
          <span class="status-badge ${statusClass}">${escapeHtml(unit.status)}</span>
        </div>
      </div>

      <div class="confidence-meter">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confidence</span>
          <span class="text-sm font-bold text-blue-600">${parseInt(unit.confidence)}/5</span>
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="width: ${confidencePercentage}%"></div>
        </div>
      </div>

      <div class="note-notes">${escapeHtml(unit.notes)}</div>

      <div class="note-actions">
        <button class="action-btn edit-btn update-btn" data-id="${unit._id}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Update
        </button>
        <button class="action-btn delete-btn" data-id="${unit._id}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Delete
        </button>
      </div>
    `;
    unitsContainer.appendChild(div);
  });
  deleteunit();
  updateunit();
};

const initKnowledgeUnits = async () => {
  try {
    const user = await checkauth();
    console.log("Authenticated user:", user);

    const response = await fetchKnowledgeUnits();
    renderUnits(response);
  } catch (err) {
    console.error("Knowledge units initialization failed:", err);
    window.location.href = "/login.html";
  }
};

document.addEventListener("DOMContentLoaded", initKnowledgeUnits);

const modal = document.getElementById("unitcreate");
if (!modal) {
  console.error("Modal element not found");
}

const createBtns = document.querySelectorAll(".createBtn");
const createNoteBtn = document.getElementById("createNote");

const closeModal = () => {
  if (!modal) return;
  if (modal) modal.classList.add("hidden");
  const form = document.getElementById("unitcreate");
  if (form) form.reset();
  const confidenceSlider = document.getElementById('confidenceSlider');
  if (confidenceSlider) {
    confidenceSlider.value = 3;
    const confidenceValue = document.getElementById('confidenceValue');
    if (confidenceValue) confidenceValue.textContent = 3;
  }
};

if (!modal) {
  console.error("Cannot attach modal event listeners - modal not found");
} else {
const modalCloseButtons = modal.querySelectorAll(".modal-close");
modalCloseButtons.forEach(btn => {
  btn.addEventListener("click", closeModal);
});

createBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
  });
});

if (createNoteBtn) {
  createNoteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
  });
}

const confidenceSlider = document.getElementById('confidenceSlider');
if (confidenceSlider) {
  confidenceSlider.addEventListener('input', (e) => {
    const confidenceValue = document.getElementById('confidenceValue');
    if (confidenceValue) confidenceValue.textContent = e.target.value;
  });
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

const handleEscapeKey = (e) => {
  if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    closeModal();
  }
};
document.addEventListener("keydown", handleEscapeKey);
}

const form = document.getElementById("unitcreate");

if (!form) {
  console.error("Form element not found");
} else {

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    title: form.title.value,
    category: form.category.value,
    difficulty: form.difficulty.value,
    status: form.status.value,
    confidence: form.confidence.value,
    notes: form.notes.value
  };

  try {
    await createKnowledgeUnit(data);
    form.reset();
    modal.classList.add("hidden");
    initKnowledgeUnits();
  } catch (err) {
    console.error("Error creating knowledge unit:", err);
    alert("Failed to create Knowledge Unit");
  }
});
}

const deleteunit = async () => {
  const btn = document.querySelectorAll(".delete-btn");

  btn.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this note?")) {
        try {
          await deleteKnowledgeUnit(id);
          initKnowledgeUnits();
        } catch (err) {
          console.error("Error deleting knowledge unit:", err);
          alert("Failed to delete Knowledge Unit");
        }
      }
    });
  });
};

const updateunit = async () => {
  const btn = document.querySelectorAll(".update-btn");

  btn.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const cardDiv = button.closest(".note-card");
      const title = cardDiv.querySelector(".note-title").innerText;
      const category = cardDiv.querySelector(".note-category").innerText;
      const difficulty = cardDiv.querySelector(".difficulty-badge")?.innerText?.match(/Easy|Medium|Hard/)?.[0] || '';
      const status = cardDiv.querySelector(".status-badge")?.innerText?.trim() || '';
      const confidence = cardDiv.querySelector(".confidence-bar")?.previousElementSibling?.querySelector('.text-blue-600')?.innerText?.match(/\d/)?.[0] || '3';
      const notes = cardDiv.querySelector(".note-notes").innerText;

      const updateModal = document.createElement("div");
      updateModal.className = "update-modal";
      updateModal.innerHTML = `
        <div class="update-modal-content ">
          <div class="update-header">
            <h3 class="update-title">Update Note</h3>
            <button type="button" class="modal-close text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
          </div>
          
          <form class="update-form">
            <div class="update-form-group">
              <label>Title</label>
              <input type="text" class="edit-title" value="${escapeHtml(title)}" required />
            </div>

            <div class="update-form-group">
              <label>Category</label>
              <input type="text" class="edit-category" value="${escapeHtml(category)}" required />
            </div>

            <div class="update-form-row">
              <div class="update-form-group">
                <label>Difficulty</label>
                <select class="edit-difficulty" required>
                  <option value="Easy" ${difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                  <option value="Medium" ${difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="Hard" ${difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
                </select>
              </div>

              <div class="update-form-group">
                <label>Status</label>
                <select class="edit-status" required>
                  <option value="To Learn" ${status === 'To Learn' ? 'selected' : ''}>To Learn</option>
                  <option value="Learning" ${status === 'Learning' ? 'selected' : ''}>Learning</option>
                  <option value="Learned" ${status === 'Learned' ? 'selected' : ''}>Learned</option>
                </select>
              </div>
            </div>

            <div class="update-form-group">
              <label>Confidence Level</label>
              <div class="flex items-center gap-4">
                <input type="range" class="edit-confidence w-full h-2 bg-gradient-to-r from-red-400 to-green-400 rounded-lg" min="1" max="5" value="${confidence}" />
                <span class="confidence-display text-2xl font-bold text-blue-600 min-w-12 text-center">${confidence}</span>
              </div>
            </div>

            <div class="update-form-group">
              <label>Notes</label>
              <textarea class="edit-notes" required>${escapeHtml(notes)}</textarea>
            </div>

            <div class="update-actions">
              <button type="submit" class="update-save-btn">Save Changes</button>
              <button type="button" class="update-cancel-btn modal-close">Cancel</button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(updateModal);

      const confidenceSlider = updateModal.querySelector(".edit-confidence");
      const confidenceDisplay = updateModal.querySelector(".confidence-display");

      confidenceSlider.addEventListener('input', (e) => {
        confidenceDisplay.textContent = e.target.value;
      });

      const closeUpdateModal = () => {
        updateModal.remove();
      };

      updateModal.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", closeUpdateModal);
      });

      updateModal.addEventListener("click", (e) => {
        if (e.target === updateModal) {
          closeUpdateModal();
        }
      });

      const handleUpdateEscapeKey = (e) => {
        if (e.key === "Escape") {
          closeUpdateModal();
          document.removeEventListener("keydown", handleUpdateEscapeKey);
        }
      };
      document.addEventListener("keydown", handleUpdateEscapeKey);

      const updateForm = updateModal.querySelector(".update-form");
      updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updatedData = {
          title: updateModal.querySelector(".edit-title").value,
          category: updateModal.querySelector(".edit-category").value,
          difficulty: updateModal.querySelector(".edit-difficulty").value,
          status: updateModal.querySelector(".edit-status").value,
          confidence: updateModal.querySelector(".edit-confidence").value,
          notes: updateModal.querySelector(".edit-notes").value,
        };
        try {
          await updateKnowledgeUnit(id, updatedData);
          closeUpdateModal();
          initKnowledgeUnits();
        } catch (err) {
          console.error("Error updating knowledge unit:", err);
          alert("Failed to update Knowledge Unit");
        }
      });
    });
  });
};

const filterForm = document.getElementById("filter-form");
const clearFilterBtn = document.getElementById("clearFilter");

if (filterForm) {
filterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusFilter = document.getElementById("statusFilter");
  const difficultyFilter = document.getElementById("difficultyFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  
  const status = statusFilter ? statusFilter.value : "";
  const difficulty = difficultyFilter ? difficultyFilter.value : "";
  const category = categoryFilter ? categoryFilter.value : "";

  try {
    const res = await fetchKnowledgeUnits();
    
    // Ensure res is an array
    if (!Array.isArray(res)) {
      renderUnits([]);
      return;
    }
    
    let filteredUnits = res;

    if (status) {
      filteredUnits = filteredUnits.filter(unit => unit.status === status);
    }
    if (difficulty) {
      filteredUnits = filteredUnits.filter(unit => unit.difficulty === difficulty);
    }
    if (category) {
      filteredUnits = filteredUnits.filter(unit => unit.category.toLowerCase().includes(category.toLowerCase()));
    }

    renderUnits(filteredUnits);
  } catch (err) {
    console.error("Error filtering knowledge units:", err);
  }
});
}

if (clearFilterBtn) {
clearFilterBtn.addEventListener("click", async () => {
  const statusFilter = document.getElementById("statusFilter");
  const difficultyFilter = document.getElementById("difficultyFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  
  if (statusFilter) statusFilter.value = "";
  if (difficultyFilter) difficultyFilter.value = "";
  if (categoryFilter) categoryFilter.value = "";
  initKnowledgeUnits();
});
}

document.getElementById("dashboardBtn")?.addEventListener("click", () => {
  window.location.href = "/dashboard.html";
});

document.getElementById("knowledgeunits")?.addEventListener("click", () => {
  window.location.href = "/knowledgeunits.html";
});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  try {
    await logoutUser();
    window.location.href = "/login.html";
  } catch (err) {
    console.error("Logout failed:", err);
  }
});
