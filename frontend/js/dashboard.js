const unitsContainer = document.getElementById("units");

const fetchKnowledgeUnits = async () => {
  const res = await fetch("/knowledge/all", {
    credentials: "include",
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
};

const renderUnits = (units) => {
  unitsContainer.innerHTML = "";

  if (!units || units.length === 0) {
    unitsContainer.textContent = "No knowledge units found.";
    return;
  }

  units.forEach((unit) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3 class="title">${unit.title}</h3>
      <p>
        <div class="category border-2"> Category : ${unit.category} </div>
        <div class="difficulty border-2"> Difficulty : ${unit.difficulty} </div>
        <div class="status border-2"> Status : ${unit.status} </div>
        <div class="confidence border-2"> Confidence : ${unit.confidence} </div>
        <div class = "Note border-2"> Notes : ${unit.notes} </div>
      </p>
      <button class="delete-btn" data-id = "${unit._id}">Delete</button>
      <button class="update-btn" data-id = "${unit._id}">Update</button>
      <hr />
    `;
    unitsContainer.appendChild(div);
  });
   deleteunit();
   updateunit();

};

const initDashboard = async () => {
  try {
    const user = await checkauth();
    console.log("Authenticated user:", user);

    const response = await fetchKnowledgeUnits();
    renderUnits(response);

  } catch (err) {
    console.error("Dashboard initialization failed:", err);
    window.location.href = "/login.html";
    
  }
};

document.addEventListener("DOMContentLoaded", initDashboard);

const form = document.getElementById("unitcreate")

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data= {
   title : form.title.value,
   category : form.category.value,
   difficulty : form.difficulty.value,
   status : form.status.value,
   confidence : form.confidence.value,
   notes : form.notes.value}

  try{
    await createKnowledgeUnit(data);
    alert("Knowledge Unit Created Successfully");
    form.reset();
    initDashboard();
  }
  catch(err){
    console.error("Error creating knowledge unit:", err);
    alert("Failed to create Knowledge Unit");
  }
});

const deleteunit = async() =>{
  const btn = document.querySelectorAll(".delete-btn");

  btn.forEach((button) => {
    button.addEventListener("click", async()=>{
      const id = button.getAttribute("data-id");
      try{
        await deleteKnowledgeUnit(id);
        initDashboard();
      }
      catch(err){
        console.error("Error deleting knowledge unit:", err);
        alert("Failed to delete Knowledge Unit");
      }
    });
  });
};

const updateunit = async(id, data) =>{
  
  const btn = document.querySelectorAll(".update-btn");

  btn.forEach((button)=>{
    button.addEventListener("click", async()=>{
      const id = button.getAttribute("data-id");
      const data = button.closest("div");
      const title = data.querySelector(".title").innerText;
      const category = data.querySelector(".category").innerText;
      const difficulty = data.querySelector(".difficulty").innerText;
      const status = data.querySelector(".status").innerText;
      const confidence = data.querySelector(".confidence").innerText;
      const notes = data.querySelector(".Note").innerText;    

      data.innerHTML = `
        <input type="text" class="edit-title" value="${title}" />
        <input type="text" class="edit-category" value="${category}" />
        <select name="difficulty" class="edit-difficulty" >
            <option value="">${difficulty}</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
        </select>
        <select name="status" class="edit-status" >
            <option value="">${status}</option>
            <option value="To Learn">To Learn</option>
            <option value="Learning">Learning</option>
            <option value="Learned">Learned</option>
        </select>
        <input type="number" class="edit-confidence" min=1 max = 5 value="${confidence}" />
        <input type="text" class="edit-notes" value="${notes}" />
        <button class="save-btn" data-id = "${id}">Save</button>
        <button class="cancel-btn" data-id = "${id}">Cancel</button>
      `
        const saveBtn = data.querySelector(".save-btn");
        saveBtn.addEventListener("click", async()=>{
          const updatedData = {
            title : data.querySelector(".edit-title").value,
            category : data.querySelector(".edit-category").value,
            difficulty : data.querySelector(".edit-difficulty").value,
            status : data.querySelector(".edit-status").value,
            confidence : data.querySelector(".edit-confidence").value,
            notes : data.querySelector(".edit-notes").value,
          }
          try{
            await updateKnowledgeUnit(id, updatedData);
            initDashboard();
          }
          catch(err){
            console.error("Error updating knowledge unit:", err);
            alert("Failed to update Knowledge Unit");
          }
        });
          
        const cancelBtn = data.querySelector(".cancel-btn");
        cancelBtn.addEventListener("click", () => {
          initDashboard();
        });
    });
  });
};

