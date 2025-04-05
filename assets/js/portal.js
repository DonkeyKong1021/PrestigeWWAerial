// Firebase configuration
const firebaseConfig = {
    // Replace with your Firebase project configuration
    // You need to create a Firebase project and enable authentication, Firestore, and Storage
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const userDashboard = document.getElementById('user-dashboard');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');
const userProjects = document.getElementById('user-projects');
const galleryContainer = document.getElementById('gallery-container');
const forgotPasswordBtn = document.getElementById('forgot-password');

// Toggle between login and signup forms
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        // Sign in user with Firebase auth
        await auth.signInWithEmailAndPassword(email, password);
        // Login successful - auth state change listener will handle UI updates
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
});

// Sign Up Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }
    
    try {
        // Create user with Firebase auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Add user profile to Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update user profile
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Signup successful - auth state change listener will handle UI updates
    } catch (error) {
        alert(`Registration failed: ${error.message}`);
    }
});

// Forgot Password
forgotPasswordBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    try {
        await auth.sendPasswordResetEmail(email);
        alert('Password reset email sent! Check your inbox.');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Auth State Change Listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        loginContainer.classList.add('hidden');
        signupContainer.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        
        // Update user name display
        userName.textContent = user.displayName || 'Client';
        
        // Load user projects
        loadUserProjects(user.uid);
        
        // Load user media
        loadUserMedia(user.uid);
    } else {
        // User is signed out
        loginContainer.classList.remove('hidden');
        signupContainer.classList.add('hidden');
        userDashboard.classList.add('hidden');
        
        // Clear forms
        loginForm.reset();
        signupForm.reset();
    }
});

// Load User Projects
async function loadUserProjects(userId) {
    // Clear previous content
    userProjects.innerHTML = '';
    
    try {
        const projectsSnapshot = await db.collection('projects')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        if (projectsSnapshot.empty) {
            // Show empty state
            userProjects.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects available yet</p>
                </div>
            `;
            return;
        }
        
        // Add projects to the UI
        projectsSnapshot.forEach(doc => {
            const project = doc.data();
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-thumbnail" style="background-image: url('${project.thumbnailUrl || 'assets/images/placeholder.jpg'}')"></div>
                <div class="project-info">
                    <h4>${project.name}</h4>
                    <p>${formatDate(project.createdAt?.toDate() || new Date())}</p>
                    <a href="#" class="project-view-btn" data-project-id="${doc.id}">View Project</a>
                </div>
            `;
            
            userProjects.appendChild(projectCard);
            
            // Add click event to view project button
            const viewBtn = projectCard.querySelector('.project-view-btn');
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loadProjectMedia(doc.id);
            });
        });
    } catch (error) {
        console.error("Error loading projects:", error);
        userProjects.innerHTML = `
            <div class="empty-state">
                <p>Error loading projects. Please try again.</p>
            </div>
        `;
    }
}

// Load User Media (recent media from all projects)
async function loadUserMedia(userId) {
    // Clear previous content
    galleryContainer.innerHTML = '';
    
    try {
        const mediaSnapshot = await db.collection('media')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        if (mediaSnapshot.empty) {
            // Show empty state
            galleryContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <p>No media available yet</p>
                </div>
            `;
            return;
        }
        
        // Add media to the gallery
        mediaSnapshot.forEach(doc => {
            const media = doc.data();
            const mediaItem = document.createElement('div');
            mediaItem.className = `gallery-item ${media.type === 'video' ? 'video' : ''}`;
            
            // Create thumbnail (image or video)
            if (media.type === 'image') {
                mediaItem.innerHTML = `<img src="${media.url}" alt="${media.name}">`;
            } else if (media.type === 'video') {
                mediaItem.innerHTML = `<img src="${media.thumbnailUrl || media.url}" alt="${media.name}">`;
            }
            
            // Add click handler to open media in a modal or new tab
            mediaItem.addEventListener('click', () => {
                window.open(media.url, '_blank');
            });
            
            galleryContainer.appendChild(mediaItem);
        });
    } catch (error) {
        console.error("Error loading media:", error);
        galleryContainer.innerHTML = `
            <div class="empty-state">
                <p>Error loading media. Please try again.</p>
            </div>
        `;
    }
}

// Load Project Media
function loadProjectMedia(projectId) {
    // This function would show a modal or navigate to a project detail page
    // For simplicity, we'll just load the media in the gallery
    
    // Clear previous content
    galleryContainer.innerHTML = '';
    
    // Show loading state
    galleryContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading project media...</p>
        </div>
    `;
    
    db.collection('media')
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'desc')
        .get()
        .then(mediaSnapshot => {
            // Clear loading state
            galleryContainer.innerHTML = '';
            
            if (mediaSnapshot.empty) {
                // Show empty state
                galleryContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-images"></i>
                        <p>No media in this project</p>
                    </div>
                `;
                return;
            }
            
            // Add media to the gallery
            mediaSnapshot.forEach(doc => {
                const media = doc.data();
                const mediaItem = document.createElement('div');
                mediaItem.className = `gallery-item ${media.type === 'video' ? 'video' : ''}`;
                
                // Create thumbnail (image or video)
                if (media.type === 'image') {
                    mediaItem.innerHTML = `<img src="${media.url}" alt="${media.name}">`;
                } else if (media.type === 'video') {
                    mediaItem.innerHTML = `<img src="${media.thumbnailUrl || media.url}" alt="${media.name}">`;
                }
                
                // Add click handler to open media in a modal or new tab
                mediaItem.addEventListener('click', () => {
                    window.open(media.url, '_blank');
                });
                
                galleryContainer.appendChild(mediaItem);
            });
        })
        .catch(error => {
            console.error("Error loading project media:", error);
            galleryContainer.innerHTML = `
                <div class="empty-state">
                    <p>Error loading media. Please try again.</p>
                </div>
            `;
        });
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
} 