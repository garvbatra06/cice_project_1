import { useEffect, useState } from "react";
import { auth, db } from "./Authentication/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
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
  const [filterCategory, setFilterCategory] = useState("");

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "",
    membersRequired: 1,
  });

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/"); // redirect if not logged in
      }
      setUser(currentUser);
      if (currentUser) setShowAlert(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProjects([]);
      setShowProjects(false);
      setShowDropdown(false);
      navigate("/"); // redirect after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch all projects
  const handleTeamUpNow = async () => {
    if (!user) return; // safety check
    setShowAddForm(false);
    const projectsCollection = collection(db, "projects");
    const snapshot = await getDocs(projectsCollection);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProjects(list);
    setShowProjects(true);
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to add a project");

    try {
      await addDoc(collection(db, "projects"), {
        ...newProject,
        owner: user.displayName || user.email, // 👈 use displayName if available
        membersRequired: Number(newProject.membersRequired),
        createdAt: serverTimestamp(),
      });
      alert("Project added successfully!");
      setNewProject({
        name: "",
        description: "",
        category: "",
        membersRequired: 1,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const filteredProjects = filterCategory
    ? projects.filter(
        (p) => p.category.toLowerCase() === filterCategory.toLowerCase()
      )
    : projects;

  return (
    <div className="default-container">
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
                <button>See Previous Team Ups</button>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <span>Not logged in</span>
        )}
      </div>

      <h1 id="heading">Welcome to the HackMate 🎉</h1>

      {showAlert && (
        <div className="login-alert">You’re logged in successfully.</div>
      )}

      <div className="main-options">
        <button onClick={handleTeamUpNow} disabled={!user}>
          Team Up Now
        </button>
        <button
          onClick={() => {
            if (!user) return navigate("/"); // redirect if not logged in
            setShowProjects(false);
            setShowAddForm(!showAddForm);
          }}
        >
          Add Your Project
        </button>
      </div>

      {showAddForm && user && (
        <form className="add-project-form" onSubmit={handleAddProject}>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Description"
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
              setNewProject({ ...newProject, membersRequired: e.target.value })
            }
            required
          />
          <button type="submit">Submit Project</button>
        </form>
      )}

      {showProjects && user && (
        <div className="projects-list">
          <h2 id="projects">All Projects</h2>

          <div className="filter">
            <span className="filter-label">Filter by Category</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Web">Web</option>
              <option value="App">App</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Data Science">Data Science</option>
              <option value="Other">Other</option>
            </select>
            <button
              type="button"
              className="filter-clear"
              onClick={() => setFilterCategory("")}
            >
              Clear
            </button>
          </div>

          {filteredProjects.length === 0 ? (
            <p id="no-projects">No projects found.</p>
          ) : (
            <ul>
              {filteredProjects.map((proj) => (
                <li key={proj.id}>
                  <strong>{proj.name}</strong> by{" "}
                  {proj.owner || "Unknown User"} <br />
                  Category: {proj.category} <br />
                  Members Required: {proj.membersRequired} <br />
                  <p>{proj.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
