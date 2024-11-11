class Apprenant {
    constructor(name, firstName, email, phone, group) {
        this.name = name;
        this.firstName = firstName;
        this.email = email;
        this.phone = phone;
        this.group = group;
        this.projects = [];
    }
}

class Project {
    constructor(title, startDate, endDate, github, skills) {
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.github = github;
        this.skills = skills;
    }
}

function validateEmail(email) {
    return /^[a-zA-Z]+\.[a-zA-Z]+\.solicode@gmail\.com$/i.test(email);
}

function validatePhone(phone) {
    return /^\+212\d{3}-\d{2}-\d{2}-\d{2}$/.test(phone);
}

function showError(elementId, show, message = '') {
    const errorElement = document.getElementById(elementId);
    const inputElement = document.getElementById(elementId.replace('Error', ''));
    if (!errorElement || !inputElement) return;

    errorElement.style.display = show ? 'block' : 'none';
    errorElement.textContent = message;
    inputElement.classList.toggle('invalid', show);
}

function handleSubmit(event) {
    event.preventDefault();
    const fields = ['name', 'firstName', 'email', 'phone', 'group'];
    const values = {};
    let isValid = true;

    for (const field of fields) {
        values[field] = document.getElementById(field)?.value.trim() || '';
        if (!values[field]) {
            showError(`${field}Error`, true, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            isValid = false;
        } else {
            showError(`${field}Error`, false);
        }
    }

    if (!validateEmail(values.email)) {
        showError('emailError', true, 'Invalid email format');
        isValid = false;
    }
    if (!validatePhone(values.phone)) {
        showError('phoneError', true, 'Invalid phone format');
        isValid = false;
    }

    if (isValid) {
        try {
            const apprenant = new Apprenant(values.name, values.firstName, values.email, values.phone, values.group);
            localStorage.setItem('apprenant', JSON.stringify(apprenant));
            window.location.replace('projects.html');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('An error occurred while saving your information. Please try again.');
        }
    }
}

function handleProjectSubmit(event) {
    event.preventDefault();
    const fields = ['title', 'startDate', 'endDate', 'github'];
    const values = {};
    let isValid = true;

    for (const field of fields) {
        values[field] = document.getElementById(field)?.value.trim() || '';
        if (!values[field]) {
            showError(`${field}Error`, true, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            isValid = false;
        } else {
            showError(`${field}Error`, false);
        }
    }

    const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
    values.skills = Array.from(skillCheckboxes).map(checkbox => checkbox.value).join(', ');

    if (!values.skills) {
        showError('skillsError', true, 'Skills are required');
        isValid = false;
    } else {
        showError('skillsError', false);
    }

    if (new Date(values.endDate) < new Date(values.startDate)) {
        showError('endDateError', true, 'End date must be after start date');
        isValid = false;
    }

    if (!values.github.toLowerCase().includes('github.com')) {
        showError('githubError', true, 'Please enter a valid GitHub URL');
        isValid = false;
    }

    if (isValid) {
        try {
            const apprenantData = JSON.parse(localStorage.getItem('apprenant'));
            if (!apprenantData) {
                alert('No student data found. Please fill in your information first.');
                window.location.replace('index.html');
                return;
            }
            const project = new Project(values.title, values.startDate, values.endDate, values.github, values.skills);
            apprenantData.projects.push(project);
            localStorage.setItem('apprenant', JSON.stringify(apprenantData));
            displayProjects();
            event.target.reset();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('An error occurred while saving the project. Please try again.');
        }
    }
}

function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function displayProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;

    try {
        const apprenantData = JSON.parse(localStorage.getItem('apprenant'));
        if (!apprenantData || !apprenantData.projects.length) {
            projectsList.innerHTML = '<p>No projects found. Please add a project.</p>';
            return;
        }

        projectsList.innerHTML = apprenantData.projects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p><strong>Duration:</strong> ${formatDate(project.startDate)} - ${formatDate(project.endDate)}</p>
                <p><strong>GitHub:</strong> <a href="${project.github}" target="_blank">${project.github}</a></p>
                <p><strong>Skills:</strong> ${project.skills}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying projects:', error);
        projectsList.innerHTML = '<p>Error loading projects. Please try refreshing the page.</p>';
    }
}

function finish() {
    const apprenantData = JSON.parse(localStorage.getItem('apprenant'));
    if (!apprenantData) {
        alert('No student data found. Please fill in your information first.');
        window.location.replace('index.html');
    } else if (!apprenantData.projects || apprenantData.projects.length === 0) {
        alert('Please add at least one project before finishing');
    } else {
        window.location.replace('portfolio.html');
    }
}

function displayPortfolio() {
    try {
        const apprenantData = JSON.parse(localStorage.getItem('apprenant'));
        if (!apprenantData) {
            alert('No data found for the portfolio. Redirecting to the homepage.');
            window.location.replace('index.html');
            return;
        }

        document.getElementById('fullName').textContent = `${apprenantData.firstName} ${apprenantData.name}`;
        document.getElementById('email').textContent = apprenantData.email;
        document.getElementById('phone').textContent = apprenantData.phone;
        document.getElementById('group').textContent = apprenantData.group;

        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = apprenantData.projects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p><strong>Duration:</strong><br>${formatDate(project.startDate)} - ${formatDate(project.endDate)}</p> <p><strong>GitHub:</strong><br><a href="${project.github}" target="_blank">${project.github}</a></p>
                <p><strong>Skills:</strong></p>
                <div class="skills-tags">
                    ${project.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying portfolio:', error);
        alert('Error loading portfolio. Please try again.');
        window.location.replace('index.html');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const mainForm = document.getElementById('apprenantForm');
    if (mainForm) {
        mainForm.addEventListener('submit', handleSubmit);
    }

    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
    }

    if (window.location.pathname.includes('projects.html')) {
        displayProjects();
    } else if (window.location.pathname.includes('portfolio.html')) {
        displayPortfolio();
    }
});

function exportPortfolioAsPDF() {
    const portfolioElement = document.getElementById('portfolio');

    const options = {
        margin: 0.5,
        filename: 'Portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(portfolioElement).save();
}