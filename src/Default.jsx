import { useEffect, useState } from "react";
import { auth, db } from "./Authentication/firebase";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import "./Default.css";

export default function Default() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [showMyProjects, setShowMyProjects] = useState(false); // 👈 new state
  const [filterCategory, setFilterCategory] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "",
    membersRequired: 1,
    linkedin: "",
  });

  const authInstance = getAuth();

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      if (!currentUser) navigate("/");
      setUser(currentUser);
      if (currentUser) setShowAlert(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Auto-hide login alert
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(authInstance);
      setUser(null);
      setProjects([]);
      setShowProjects(false);
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch all projects
  const handleTeamUpNow = async () => {
    if (!user) return;
    setShowAddForm(false);
    setShowMyProjects(false);
    const projectsCollection = collection(db, "projects");
    const snapshot = await getDocs(projectsCollection);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProjects(list);
    setShowProjects(true);
  };

  // Fetch my own projects
  const handleMyProjects = async () => {
    if (!user) return;
    setShowAddForm(false);
    setShowProjects(false);
    const projectsCollection = collection(db, "projects");
    const snapshot = await getDocs(projectsCollection);
    const myList = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((p) => p.email === user.email);
    setProjects(myList);
    setShowMyProjects(true);
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to add a project");

    const wordCount = newProject.description.trim().split(/\s+/).length;
    if (wordCount < 100) {
      alert("Description must be at least 100 words long!");
      return;
    }

    try {
      await addDoc(collection(db, "projects"), {
        name: newProject.name,
        description: newProject.description,
        category: newProject.category,
        membersRequired: newProject.membersRequired,
        linkedin: newProject.linkedin,
        email: user.email,
        owner: user.displayName || "Anonymous",
        timestamp: serverTimestamp(),
        views: 0,
      });
      alert("Project added successfully!");
      setNewProject({
        name: "",
        description: "",
        category: "",
        membersRequired: 1,
        linkedin: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const filteredProjects = filterCategory
    ? projects.filter(
        (p) => p.category?.toLowerCase() === filterCategory.toLowerCase()
      )
    : projects;

  // When user reads a project
  const handleReadMore = async (proj) => {
    setSelectedProject(proj);

    // 👁 Increment views only if viewer ≠ owner
    if (user && user.email !== proj.email) {
      try {
        const projectRef = doc(db, "projects", proj.id);
        await updateDoc(projectRef, { views: increment(1) });
        setProjects((prev) =>
          prev.map((p) =>
            p.id === proj.id ? { ...p, views: (p.views || 0) + 1 } : p
          )
        );
      } catch (error) {
        console.error("Error updating view count:", error);
      }
    }
  };

  const closeModal = () => setSelectedProject(null);

  return (
    <div className="default-container">
      {/* Header */}
      <div className="header">
        {user ? (
          <div className="user-info">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="user-pfp"
                onClick={() => setShowDropdown(!showDropdown)}
              />
            ) : (
              <div
                className="placeholder-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user?.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user?.email.charAt(0).toUpperCase()}
              </div>
            )}
            {showDropdown && (
              <div className="profile-dropdown">
                <button onClick={handleMyProjects}>
                  See Previous Team Ups
                </button>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <span>Not logged in</span>
        )}
      </div>

      <h1 id="heading">Welcome to HackMate 🎉</h1>

      {showAlert && (
        <div className="login-alert">You’re logged in successfully.</div>
      )}

      {/* Main Buttons */}
      <div className="main-options">
        <button onClick={handleTeamUpNow} disabled={!user}>
          Team Up Now
        </button>
        <button
          onClick={() => {
            if (!user) return navigate("/");
            setShowProjects(false);
            setShowMyProjects(false);
            setShowAddForm(!showAddForm);
          }}
        >
          Add Your Project
        </button>
      </div>

      {/* Add Project */}
      {showAddForm && user && (
        <form className="add-project-form" onSubmit={handleAddProject}>
          <p className="user-email">
            Logged in as: <strong>{user.email}</strong>
          </p>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description (minimum 100 words)"
            rows="6"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            required
          />
          <select
            value={newProject.category}
            onChange={(e) =>
              setNewProject({ ...newProject, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Web">Web</option>
            <option value="App">App</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Data Science">Data Science</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            placeholder="Members Required"
            value={newProject.membersRequired}
            min="1"
            onChange={(e) =>
              setNewProject({
                ...newProject,
                membersRequired: e.target.value,
              })
            }
            required
          />

          {/* LinkedIn input */}
          <div className="linkedin-input-container">
            <input
              type="url"
              placeholder="LinkedIn Profile (optional)"
              value={newProject.linkedin}
              onChange={(e) =>
                setNewProject({ ...newProject, linkedin: e.target.value })
              }
            />
            <span
              className="info-icon"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ⓘ
            </span>
            {showTooltip && (
              <div className="tooltip">
                Adding your LinkedIn helps others contact you easily for team-ups.
              </div>
            )}
          </div>

          <button type="submit">Submit Project</button>
        </form>
      )}

      {/* All Projects Section */}
      {showProjects && user && (
        <div className="projects-list">
          <h2 id="projects">All Projects</h2>
          {filteredProjects.length === 0 ? (
            <p id="no-projects">No projects available.</p>
          ) : (
            <ul>
              {filteredProjects.map((proj) => (
                <li key={proj.id}>
                  <strong>{proj.name}</strong> by {proj.owner || "Unknown"} <br />
                  Email: {proj.email || "Not provided"} <br />
                  Category: {proj.category} <br />
                  Members Required: {proj.membersRequired} <br />
                  <p>
                    {proj.description.split(" ").slice(0, 25).join(" ")}...
                    <button
                      className="read-more-btn"
                      onClick={() => handleReadMore(proj)}
                    >
                      Read More
                    </button>
                  </p>
                  {proj.linkedin && (
                    <p>
                      <a
                        href={proj.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="linkedin-link"
                      >
                        LinkedIn
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 👁 My Projects Section */}
      {showMyProjects && user && (
        <div className="projects-list">
          <h2 id="projects">Your Previous Team Ups</h2>
          {projects.length === 0 ? (
            <p id="no-projects">You haven’t added any projects yet.</p>
          ) : (
            <ul>
              {projects.map((proj) => (
                <li key={proj.id}>
                  <strong>{proj.name}</strong> <br />
                  Category: {proj.category} <br />
                  Members Required: {proj.membersRequired} <br />
                  👁 Views: {proj.views || 0} <br />
                  <p>
                    {proj.description.split(" ").slice(0, 25).join(" ")}...
                    <button
                      className="read-more-btn"
                      onClick={() => setSelectedProject(proj)}
                    >
                      Read More
                    </button>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal Popup */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
            <h2>{selectedProject.name}</h2>
            <p>
              <strong>Owner:</strong> {selectedProject.owner || "Unknown"} <br />
              <strong>Email:</strong> {selectedProject.email || "Not provided"} <br />
              <strong>Category:</strong> {selectedProject.category} <br />
              <strong>Members Required:</strong> {selectedProject.membersRequired} <br />
              <strong>👁 Views:</strong> {selectedProject.views || 0}
            </p>
            <p className="modal-description">
              {selectedProject.description}
            </p>
            {selectedProject.linkedin && (
              <a
                href={selectedProject.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-link"
              >
                View LinkedIn Profile
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
