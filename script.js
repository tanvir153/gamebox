// Wait for DOM content to load before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // Tab elements
    const resumeTabBtn = document.getElementById('resumeTab');        // "Resume" tab button
    const coverLetterTabBtn = document.getElementById('coverLetterTab');  // "Cover Letter" tab button
    const resumeSection = document.getElementById('resumeSection');   // Resume form section container
    const coverLetterSection = document.getElementById('coverLetterSection'); // Cover letter form section container
  
    // Multi-page form elements
    const resumePage1 = document.getElementById('resumePage1');  // First page of resume form
    const resumePage2 = document.getElementById('resumePage2');  // Second page of resume form
    const nextBtn = document.getElementById('nextBtn');          // "Next" button
    const prevBtn = document.getElementById('prevBtn');          // "Previous" button
  
    // Form fields
    const profilePicInput = document.getElementById('profilePicInput');    // File input for profile picture
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const summaryInput = document.getElementById('summary');
    const skillsInput = document.getElementById('skills');
  
    // Containers for dynamic fields and their "Add More" buttons
    const educationContainer = document.getElementById('educationFields');
    const experienceContainer = document.getElementById('experienceFields');
    const projectsContainer = document.getElementById('projectsFields');
    const addEducationBtn = document.getElementById('addEducationBtn');
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addProjectBtn = document.getElementById('addProjectBtn');
  
    // Template style switcher (could be radio buttons or select dropdown)
    const templateSelect = document.getElementById('templateSelect'); // Assuming a select for template choice
  
    // Preview elements
    const resumePreview = document.getElementById('resumePreview');        // Resume preview container
    const previewName = document.getElementById('previewName');
    const previewEmail = document.getElementById('previewEmail');
    const previewSummary = document.getElementById('previewSummary');
    const previewSkills = document.getElementById('previewSkills');
    const previewEducationList = document.getElementById('previewEducation');
    const previewExperienceList = document.getElementById('previewExperience');
    const previewProjectsList = document.getElementById('previewProjects');
    const previewProfilePic = document.getElementById('previewProfilePic');
  
    // Buttons for preview and PDF (resume)
    const previewResumeBtn = document.getElementById('previewResumeBtn');
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  
    // Save/load elements for resumes
    const saveResumeBtn = document.getElementById('saveResumeBtn');
    const savedResumesDropdown = document.getElementById('savedResumesDropdown');
    const deleteResumeBtn = document.getElementById('deleteResumeBtn');
  
    // Cover letter form fields and preview elements
    const coverLetterPreview = document.getElementById('coverLetterPreview');
    const clRecipientInput = document.getElementById('clRecipientName');
    const clCompanyInput = document.getElementById('clCompanyName');
    const clPositionInput = document.getElementById('clPositionTitle');
    const clBodyInput = document.getElementById('clBody');
    const clYourNameInput = document.getElementById('clYourName');  // your name for sign-off (could reuse fullNameInput, but let's assume separate)
    const previewCoverLetterBtn = document.getElementById('previewCoverLetterBtn');
    const downloadCoverLetterBtn = document.getElementById('downloadCoverLetterBtn');
  
    // State variables
    let profileImageDataURL = "";  // Will hold the base64 data URL of the uploaded profile image (if any)
    let savedResumes = [];         // Array to hold saved resume objects (loaded from localStorage)
  
    // --- Tab Navigation between Resume and Cover Letter ---
    function showResumeTab() {
      // Show resume section, hide cover letter section
      resumeSection.style.display = 'block';
      coverLetterSection.style.display = 'none';
      // Highlight active tab (if styling requires)
      resumeTabBtn.classList.add('active');
      coverLetterTabBtn.classList.remove('active');
    }
    function showCoverLetterTab() {
      coverLetterSection.style.display = 'block';
      resumeSection.style.display = 'none';
      coverLetterTabBtn.classList.add('active');
      resumeTabBtn.classList.remove('active');
    }
    // Attach tab click listeners
    resumeTabBtn.addEventListener('click', showResumeTab);
    coverLetterTabBtn.addEventListener('click', showCoverLetterTab);
  
    // --- Multi-page Resume Form Navigation ---
    nextBtn.addEventListener('click', () => {
      // Go from page 1 to page 2
      resumePage1.style.display = 'none';
      resumePage2.style.display = 'block';
    });
    prevBtn.addEventListener('click', () => {
      // Go back from page 2 to page 1
      resumePage2.style.display = 'none';
      resumePage1.style.display = 'block';
    });
  
    // --- Profile Image Preview ---
    profilePicInput.addEventListener('change', () => {
      const file = profilePicInput.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileImageDataURL = e.target.result;           // store data URL string
          previewProfilePic.src = profileImageDataURL;     // show image in preview
          previewProfilePic.style.display = 'block';       // ensure image element is visible
        };
        reader.readAsDataURL(file);  // convert to base64 data URL:contentReference[oaicite:7]{index=7}
      } else {
        // No file or not an image: clear preview
        profileImageDataURL = "";
        previewProfilePic.src = "";
        previewProfilePic.style.display = 'none';
      }
    });
  
    // --- Dynamic Field Addition for Education, Experience, Projects ---
    function addEducationField() {
      // Clone the first education input field (assumes at least one exists in HTML)
      const allEduFields = educationContainer.getElementsByClassName('education-field');
      if (allEduFields.length > 0) {
        const firstField = allEduFields[0];
        const newField = firstField.cloneNode(true);
        newField.value = "";  // clear the cloned input's value
        // Remove any id to avoid duplicates (we rely on class for collection)
        if (newField.id) newField.removeAttribute('id');
        educationContainer.appendChild(newField);
      }
    }
    function addExperienceField() {
      const allExpFields = experienceContainer.getElementsByClassName('experience-field');
      if (allExpFields.length > 0) {
        const firstField = allExpFields[0];
        const newField = firstField.cloneNode(true);
        newField.value = "";
        if (newField.id) newField.removeAttribute('id');
        experienceContainer.appendChild(newField);
      }
    }
    function addProjectField() {
      const allProjFields = projectsContainer.getElementsByClassName('project-field');
      if (allProjFields.length > 0) {
        const firstField = allProjFields[0];
        const newField = firstField.cloneNode(true);
        newField.value = "";
        if (newField.id) newField.removeAttribute('id');
        projectsContainer.appendChild(newField);
      }
    }
    // Attach "Add More" button handlers
    addEducationBtn.addEventListener('click', addEducationField);
    addExperienceBtn.addEventListener('click', addExperienceField);
    addProjectBtn.addEventListener('click', addProjectField);
  
    // --- Template Switching ---
    templateSelect.addEventListener('change', () => {
      const styleChoice = templateSelect.value;  // e.g., "style1" or "style2"
      // Remove any existing style classes (assuming only those two possible)
      resumePreview.classList.remove('style1', 'style2');
      if (styleChoice) {
        resumePreview.classList.add(styleChoice);
      }
    });
  
    // --- Generate Resume Preview ---
    function generateResumePreview() {
      // Get basic fields
      const fullName = fullNameInput.value.trim();
      const email = emailInput.value.trim();
      const summary = summaryInput.value.trim();
      const skills = skillsInput.value.trim();
  
      // Set basic info in preview
      previewName.textContent = fullName;
      previewEmail.textContent = email;
      previewSummary.textContent = summary;
      // Skills: if comma-separated, we could format it, but for simplicity just output the string
      previewSkills.textContent = skills;
  
      // Populate Education entries
      previewEducationList.innerHTML = "";  // clear previous list
      const eduFields = educationContainer.getElementsByClassName('education-field');
      for (let field of eduFields) {
        const eduText = field.value.trim();
        if (eduText) {
          const p = document.createElement('p');
          p.textContent = eduText;
          previewEducationList.appendChild(p);
        }
      }
  
      // Populate Experience entries
      previewExperienceList.innerHTML = "";
      const expFields = experienceContainer.getElementsByClassName('experience-field');
      for (let field of expFields) {
        const expText = field.value.trim();
        if (expText) {
          const p = document.createElement('p');
          p.textContent = expText;
          previewExperienceList.appendChild(p);
        }
      }
  
      // Populate Projects entries
      previewProjectsList.innerHTML = "";
      const projFields = projectsContainer.getElementsByClassName('project-field');
      for (let field of projFields) {
        const projText = field.value.trim();
        if (projText) {
          const p = document.createElement('p');
          p.textContent = projText;
          previewProjectsList.appendChild(p);
        }
      }
  
      // Profile picture in preview
      if (profileImageDataURL) {
        previewProfilePic.src = profileImageDataURL;
        previewProfilePic.style.display = 'block';
      } else {
        previewProfilePic.style.display = 'none';
      }
  
      // Finally, ensure the preview section is visible (in case it was hidden initially)
      resumePreview.style.display = 'block';
    }
    previewResumeBtn.addEventListener('click', generateResumePreview);
  
    // --- Save Resume to localStorage ---
    function saveResume() {
      // Ensure the preview is up to date (so we save current data). We can call generateResumePreview to gather latest values.
      // Alternatively, gather form data directly for saving (to avoid needing to press Preview first).
      const resumeData = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        summary: summaryInput.value.trim(),
        skills: skillsInput.value.trim(),
        education: [], 
        experience: [],
        projects: [],
        template: templateSelect.value,
        profileImage: profileImageDataURL || ""
      };
      // Collect arrays of entries
      const eduFields = educationContainer.getElementsByClassName('education-field');
      for (let field of eduFields) {
        const eduText = field.value.trim();
        if (eduText) resumeData.education.push(eduText);
      }
      const expFields = experienceContainer.getElementsByClassName('experience-field');
      for (let field of expFields) {
        const expText = field.value.trim();
        if (expText) resumeData.experience.push(expText);
      }
      const projFields = projectsContainer.getElementsByClassName('project-field');
      for (let field of projFields) {
        const projText = field.value.trim();
        if (projText) resumeData.projects.push(projText);
      }
  
      // Ask user for a title for this resume (could use a prompt or an input field in the form)
      let title = prompt("Enter a title for this resume:", "");
      if (!title) {
        return; // If user cancelled or empty title, abort saving
      }
      title = title.trim();
      if (title === "") {
        return;
      }
      resumeData.title = title;
  
      // Load existing saved resumes from localStorage
      const savedData = localStorage.getItem('savedResumes');
      if (savedData) {
        savedResumes = JSON.parse(savedData);
      } else {
        savedResumes = [];
      }
      // Check if a resume with this title exists to decide update or add
      const existingIndex = savedResumes.findIndex(r => r.title === title);
      if (existingIndex >= 0) {
        // Overwrite existing resume with new data
        savedResumes[existingIndex] = resumeData;
      } else {
        // Add new resume
        savedResumes.push(resumeData);
      }
      // Save back to localStorage
      localStorage.setItem('savedResumes', JSON.stringify(savedResumes));  // store data:contentReference[oaicite:8]{index=8}
  
      // Update the dropdown list
      populateSavedResumesDropdown();
      alert("Resume saved successfully.");
    }
    saveResumeBtn.addEventListener('click', saveResume);
  
    // Populate the saved resumes dropdown with current savedResumes array
    function populateSavedResumesDropdown() {
      // Clear current options
      savedResumesDropdown.innerHTML = "<option value=''>-- Select Saved Resume --</option>";
      savedResumes.forEach((res, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = res.title;
        savedResumesDropdown.appendChild(opt);
      });
    }
  
    // On page load, retrieve any saved resumes from storage
    const initialSavedData = localStorage.getItem('savedResumes');
    if (initialSavedData) {
      try {
        savedResumes = JSON.parse(initialSavedData);
      } catch (e) {
        savedResumes = [];
      }
      populateSavedResumesDropdown();
    }
  
    // --- Load a selected saved resume into the form ---
    savedResumesDropdown.addEventListener('change', () => {
      const idx = savedResumesDropdown.value;
      if (idx === "" || isNaN(idx)) {
        return; // No selection or invalid value
      }
      const resumeData = savedResumes[Number(idx)];
      if (!resumeData) return;
  
      // Populate form fields with this resume data
      fullNameInput.value = resumeData.fullName || "";
      emailInput.value = resumeData.email || "";
      summaryInput.value = resumeData.summary || "";
      skillsInput.value = resumeData.skills || "";
  
      // Profile image
      profileImageDataURL = resumeData.profileImage || "";
      if (profileImageDataURL) {
        previewProfilePic.src = profileImageDataURL;
        previewProfilePic.style.display = 'block';
      } else {
        previewProfilePic.src = "";
        previewProfilePic.style.display = 'none';
      }
      // Note: we cannot set the file input's files for security, so if user wants to change image, they'll need to re-upload.
  
      // Template style
      if (resumeData.template) {
        templateSelect.value = resumeData.template;
        // Trigger change to apply class
        resumePreview.classList.remove('style1', 'style2');
        resumePreview.classList.add(resumeData.template);
      }
  
      // Reset and populate dynamic fields (education, experience, projects)
      // Clear existing additional fields (keep one default field in each container)
      function resetDynamicFields(container, className, valuesArray) {
        // Remove all child inputs in the container
        container.innerHTML = "";
        // If there are values to populate, create inputs for each. At least one even if array is empty (to keep a blank field).
        const count = Math.max(valuesArray.length, 1);
        for (let i = 0; i < count; i++) {
          const input = document.createElement('input');
          input.type = "text";
          input.className = className;
          // Use placeholder similar to original first field if available:
          if (i < valuesArray.length && valuesArray[i]) {
            input.value = valuesArray[i];
          } else {
            input.value = "";
          }
          // We could set placeholder text here if desired (e.g., "e.g. BSc in CS, 2022" for education).
          container.appendChild(input);
        }
      }
      resetDynamicFields(educationContainer, 'education-field', resumeData.education || []);
      resetDynamicFields(experienceContainer, 'experience-field', resumeData.experience || []);
      resetDynamicFields(projectsContainer, 'project-field', resumeData.projects || []);
  
      // Switch back to page1 of the form (in case it was on page2 or user was in cover letter tab)
      showResumeTab();
      resumePage2.style.display = 'none';
      resumePage1.style.display = 'block';
  
      // Optionally, generate preview immediately:
      generateResumePreview();
    });
  
    // --- Delete selected resume ---
    deleteResumeBtn.addEventListener('click', () => {
      const idx = savedResumesDropdown.value;
      if (idx === "" || isNaN(idx)) {
        alert("Please select a saved resume to delete.");
        return;
      }
      const index = Number(idx);
      const resumeToDelete = savedResumes[index];
      if (!resumeToDelete) return;
      const confirmDel = confirm(`Are you sure you want to delete "${resumeToDelete.title}"?`);
      if (confirmDel) {
        savedResumes.splice(index, 1);
        localStorage.setItem('savedResumes', JSON.stringify(savedResumes));
        populateSavedResumesDropdown();
        // Clear form if the deleted one was loaded (optional: here we simply clear if current selection was deleted)
        fullNameInput.value = "";
        emailInput.value = "";
        summaryInput.value = "";
        skillsInput.value = "";
        // Clear dynamic fields by resetting containers
        educationContainer.innerHTML = '<input type="text" class="education-field" placeholder="e.g. BSc in CS, 2022">';
        experienceContainer.innerHTML = '<input type="text" class="experience-field" placeholder="e.g. Intern at XYZ">';
        projectsContainer.innerHTML = '<input type="text" class="project-field" placeholder="e.g. Resume Builder App">';
        profileImageDataURL = "";
        previewProfilePic.src = "";
        previewProfilePic.style.display = 'none';
        alert("Resume deleted.");
      }
    });
  
    // --- Download Resume as PDF ---
    downloadResumeBtn.addEventListener('click', () => {
      // Ensure latest data is in preview
      generateResumePreview();
      // Use html2pdf to save the resume preview as PDF
      const element = resumePreview;
      html2pdf().from(element).set({ filename: 'Resume.pdf', jsPDF: {orientation: 'portrait'} }).save();  // initiate PDF download:contentReference[oaicite:9]{index=9}:contentReference[oaicite:10]{index=10}
    });
  
    // --- Generate Cover Letter Preview ---
    function generateCoverLetterPreview() {
      // Get cover letter field values
      const recipientName = clRecipientInput.value.trim();
      const companyName = clCompanyInput.value.trim();
      const positionTitle = clPositionInput.value.trim();
      const bodyText = clBodyInput.value.trim();
      const yourName = clYourNameInput.value.trim() || fullNameInput.value.trim(); // use provided name or fallback to resume name
  
      // Clear the cover letter preview content
      coverLetterPreview.innerHTML = "";
  
      // Date (current date)
      const today = new Date();
      const dateStr = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      const dateP = document.createElement('p');
      dateP.textContent = dateStr;
      coverLetterPreview.appendChild(dateP);
  
      // Company (if provided) and position reference line
      if (positionTitle && companyName) {
        const refP = document.createElement('p');
        refP.textContent = `Re: Application for ${positionTitle} at ${companyName}`;
        coverLetterPreview.appendChild(refP);
      } else if (positionTitle) {
        const refP = document.createElement('p');
        refP.textContent = `Re: Application for ${positionTitle}`;
        coverLetterPreview.appendChild(refP);
      }
  
      // Greeting
      const greetP = document.createElement('p');
      if (recipientName) {
        greetP.textContent = `Dear ${recipientName},`;
      } else {
        greetP.textContent = `Dear Hiring Manager,`;
      }
      coverLetterPreview.appendChild(greetP);
  
      // Body paragraphs: split body text by blank lines or newlines
      if (bodyText) {
        const paragraphs = bodyText.split(/\n\s*\n/);  // split by empty lines for separate paragraphs
        for (let para of paragraphs) {
          const lines = para.split('\n').filter(line => line.trim() !== "");
          // Each "para" is a chunk separated by blank line. We'll treat it as one paragraph in output.
          const bodyP = document.createElement('p');
          bodyP.textContent = lines.join(" ");
          coverLetterPreview.appendChild(bodyP);
        }
      }
  
      // Closing
      const closingP = document.createElement('p');
      closingP.textContent = "Sincerely,";
      coverLetterPreview.appendChild(closingP);
      const nameP = document.createElement('p');
      nameP.textContent = yourName || "";
      coverLetterPreview.appendChild(nameP);
  
      // Make sure cover letter preview section is visible
      coverLetterPreview.style.display = 'block';
    }
    previewCoverLetterBtn.addEventListener('click', generateCoverLetterPreview);
  
    // --- Download Cover Letter as PDF ---
    downloadCoverLetterBtn.addEventListener('click', () => {
      // Ensure cover letter preview is up to date
      generateCoverLetterPreview();
      const element = coverLetterPreview;
      html2pdf().from(element).set({ filename: 'CoverLetter.pdf', jsPDF: {orientation: 'portrait'} }).save();
    });
  
    // Initial setup: ensure by default Resume tab is shown
    showResumeTab();
  });
  function downloadResume() {
    generateResumePreview(); // <- Ensure content is populated first
    const element = document.getElementById("resumePreview");
    element.style.display = "block"; // Ensure it's visible
    html2pdf().from(element).set({
      margin: 0.5,
      filename: 'resume.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
  }
    