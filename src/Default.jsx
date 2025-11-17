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
  deleteDoc,
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
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("latest");

  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectData, setEditProjectData] = useState({
    name: "",
    description: "",
    category: "",
    membersRequired: 1,
    linkedin: "",
    course: "",
    year: "",
    techStack: "",
  });

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "",
    membersRequired: 1,
    linkedin: "",
    course: "",
    year: "",
    techStack: "",
  });

  const authInstance = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      if (!currentUser) navigate("/");
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

  const handleTeamUpNow = async () => {
    if (!user) return;
    setShowAddForm(false);
    setShowMyProjects(false);
    setLoading(true);
    
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const now = new Date();
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((proj) => {
          // Show only active projects (within 3 months)
          const createdAt = proj.timestamp?.toDate() || new Date(0);
          return proj.isActive !== false && createdAt > threeMonthsAgo;
        });
      
      setProjects(list);
      setShowProjects(true);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMyProjects = async () => {
    if (!user) return;
    setShowAddForm(false);
    setShowProjects(false);
    setLoading(true);
    
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const myList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.email === user.email);
      setProjects(myList);
      setShowMyProjects(true);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to load your projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to add a project");

    if (newProject.description.trim().length < 100) {
      alert("Description must be at least 100 letters long!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "projects"), {
        ...newProject,
        email: user.email,
        owner: user.displayName || "Anonymous",
        timestamp: serverTimestamp(),
        views: 0,
        isActive: true,
      });

      alert("Project added successfully!");
      setNewProject({
        name: "",
        description: "",
        category: "",
        membersRequired: 1,
        linkedin: "",
        course: "",
        year: "",
        techStack: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Failed to add project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filterCategory
    ? projects.filter(
        (p) => p.category?.toLowerCase() === filterCategory.toLowerCase()
      )
    : projects;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const dateA = a.timestamp?.toDate() || new Date(0);
    const dateB = b.timestamp?.toDate() || new Date(0);
    
    if (sortBy === "latest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handleReadMore = async (proj) => {
    setSelectedProject(proj);

    if (user && user.email !== proj.email) {
      try {
        const ref = doc(db, "projects", proj.id);
        await updateDoc(ref, { views: increment(1) });

        setProjects((prev) =>
          prev.map((p) =>
            p.id === proj.id ? { ...p, views: (p.views || 0) + 1 } : p
          )
        );
      } catch (err) {
        console.error("Error incrementing views:", err);
      }
    }
  };

  const closeModal = () => setSelectedProject(null);

  const handleEditClick = (proj) => {
    setEditProjectId(proj.id);
    setEditProjectData({
      name: proj.name,
      description: proj.description,
      category: proj.category,
      membersRequired: proj.membersRequired,
      linkedin: proj.linkedin || "",
      course: proj.course || "",
      year: proj.year || "",
      techStack: proj.techStack || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProjectId) return;

    setLoading(true);
    try {
      const docRef = doc(db, "projects", editProjectId);
      await updateDoc(docRef, { ...editProjectData });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editProjectId ? { ...p, ...editProjectData } : p
        )
      );
      setEditProjectId(null);
      alert("Project updated successfully!");
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "projects", projId));
      setProjects((prev) => prev.filter((p) => p.id !== projId));
      alert("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (projId) => {
    if (!window.confirm("Do you want to reactivate this project for another 3 months?")) return;

    setLoading(true);
    try {
      const docRef = doc(db, "projects", projId);
      await updateDoc(docRef, { 
        isActive: true,
        timestamp: serverTimestamp()
      });
      
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projId ? { ...p, isActive: true, timestamp: { toDate: () => new Date() } } : p
        )
      );
      
      alert("Project reactivated successfully!");
    } catch (err) {
      console.error("Error reactivating project:", err);
      alert("Failed to reactivate project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isProjectExpired = (proj) => {
    const createdAt = proj.timestamp?.toDate() || new Date(0);
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    return createdAt < threeMonthsAgo;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="default-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}

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

      <h1 id="heading">Welcome to MyHustl 🎉</h1>

      {showAlert && (
        <div className="login-alert">You're logged in successfully.</div>
      )}

      <div className="main-options">
        <button onClick={handleTeamUpNow} disabled={!user || loading}>
          Team Up Now
        </button>
        <button
          onClick={() => {
            if (!user) return navigate("/");
            setShowProjects(false);
            setShowMyProjects(false);
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
        >
          Add Your Project
        </button>
      </div>

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
            disabled={loading}
          />

          <textarea
            placeholder="Description (minimum 100 letters)"
            rows="6"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            required
            disabled={loading}
          />

          <select
            value={newProject.category}
            onChange={(e) =>
              setNewProject({ ...newProject, category: e.target.value })
            }
            required
            disabled={loading}
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

          <select
            value={newProject.course}
            onChange={(e) =>
              setNewProject({ ...newProject, course: e.target.value })
            }
            required
            disabled={loading}
          >
            <option value="">Select Course</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BSc">BSc</option>
            <option value="MSc">MSc</option>
            <option value="Diploma">Diploma</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={newProject.year}
            onChange={(e) =>
              setNewProject({ ...newProject, year: e.target.value })
            }
            required
            disabled={loading}
          >
            <option value="">Select Year/Status</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Pass Out">Pass Out</option>
          </select>

          <input
            type="text"
            placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
            value={newProject.techStack}
            onChange={(e) =>
              setNewProject({ ...newProject, techStack: e.target.value })
            }
            required
            disabled={loading}
          />

          <input
            type="number"
            placeholder="Members Required"
            value={newProject.membersRequired}
            min="1"
            onChange={(e) =>
              setNewProject({ ...newProject, membersRequired: e.target.value })
            }
            required
            disabled={loading}
          />

          <div className="linkedin-input-container">
            <input
              type="url"
              placeholder="LinkedIn Profile (optional)"
              value={newProject.linkedin}
              onChange={(e) =>
                setNewProject({ ...newProject, linkedin: e.target.value })
              }
              disabled={loading}
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
                Adding your LinkedIn helps others contact you easily for
                team-ups.
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Project"}
          </button>
        </form>
      )}

      {showProjects && user && (
        <div className="projects-list">
          <div className="projects-header">
            <h2 id="projects">All Projects</h2>

            <div className="filter-controls">
              <select
                className="filter-dropdown"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                disabled={loading}
              >
                <option value="">All Categories</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Web">Web</option>
                <option value="App">App</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Science">Data Science</option>
                <option value="Other">Other</option>
              </select>

              <select
                className="filter-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                disabled={loading}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {sortedProjects.length === 0 ? (
            <p id="no-projects">No projects found.</p>
          ) : (
            <ul>
              {sortedProjects.map((proj) => (
                <li key={proj.id}>
                  <strong>{proj.name}</strong> by {proj.owner || "Unknown"}{" "}
                  <br />
                  Email: {proj.email} <br />
                  Category: {proj.category} <br />
                  Course: {proj.course} <br />
                  Year: {proj.year} <br />
                  Tech Stack: {proj.techStack} <br />
                  Members Required: {proj.membersRequired} <br />
                  <span className="project-date">Posted: {formatDate(proj.timestamp)}</span>
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

      {showMyProjects && user && (
        <div className="projects-list">
          <h2 id="projects">Your Previous Team Ups</h2>

          {projects.length === 0 ? (
            <p id="no-projects">You haven't added any projects yet.</p>
          ) : (
            <ul>
              {projects.map((proj) => {
                const expired = isProjectExpired(proj);
                return (
                  <li key={proj.id} className={expired ? "expired-project" : ""}>
                    {editProjectId === proj.id ? (
                      <form
                        onSubmit={handleEditSubmit}
                        className="add-project-form"
                      >
                        <input
                          type="text"
                          value={editProjectData.name}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              name: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        />
                        <textarea
                          rows="4"
                          value={editProjectData.description}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              description: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        />
                        <select
                          value={editProjectData.category}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              category: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
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
                        <select
                          value={editProjectData.course}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              course: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        >
                          <option value="">Select Course</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="BCA">BCA</option>
                          <option value="MCA">MCA</option>
                          <option value="BSc">BSc</option>
                          <option value="MSc">MSc</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Other">Other</option>
                        </select>
                        <select
                          value={editProjectData.year}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              year: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        >
                          <option value="">Select Year/Status</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Pass Out">Pass Out</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Tech Stack"
                          value={editProjectData.techStack}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              techStack: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        />
                        <input
                          type="number"
                          min="1"
                          value={editProjectData.membersRequired}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              membersRequired: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        />
                        <input
                          type="url"
                          value={editProjectData.linkedin}
                          onChange={(e) =>
                            setEditProjectData({
                              ...editProjectData,
                              linkedin: e.target.value,
                            })
                          }
                          disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditProjectId(null)}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        {expired && (
                          <span className="expired-badge">Expired (Not visible to others)</span>
                        )}
                        <strong>{proj.name}</strong> <br />
                        Category: {proj.category} <br />
                        Course: {proj.course} <br />
                        Year: {proj.year} <br />
                        Tech Stack: {proj.techStack} <br />
                        Members Required: {proj.membersRequired} <br />
                        Views: {proj.views || 0} <br />
                        <span className="project-date">Posted: {formatDate(proj.timestamp)}</span>
                        <p>
                          {proj.description.split(" ").slice(0, 25).join(" ")}...
                          <button
                            className="read-more-btn"
                            onClick={() => setSelectedProject(proj)}
                          >
                            Read More
                          </button>
                        </p>
                        {expired && (
                          <button
                            className="reactivate-btn"
                            onClick={() => handleReactivate(proj.id)}
                            disabled={loading}
                          >
                            Reactivate Project
                          </button>
                        )}
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(proj)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(proj.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>

            <h2>{selectedProject.name}</h2>

            <p>
              <strong>Owner:</strong> {selectedProject.owner || "Unknown"}{" "}
              <br />
              <strong>Email:</strong> {selectedProject.email} <br />
              <strong>Category:</strong> {selectedProject.category} <br />
              <strong>Course:</strong> {selectedProject.course} <br />
              <strong>Year:</strong> {selectedProject.year} <br />
              <strong>Tech Stack:</strong> {selectedProject.techStack} <br />
              <strong>Members Required:</strong>{" "}
              {selectedProject.membersRequired} <br />
              <strong>Views:</strong> {selectedProject.views || 0} <br />
              <strong>Posted:</strong> {formatDate(selectedProject.timestamp)}
            </p>

            <p className="modal-description">{selectedProject.description}</p>

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