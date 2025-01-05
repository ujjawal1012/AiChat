import React, { useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { toast } from "react-toastify";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setprojectName] = useState(null);
  const [project, setProject] = useState([]);
  const { user } = useContext(UserContext);
  console.log("🚀 ~ Home ~ user:", user);

  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const createProject = async () => {
    closeModal();
    console.log(projectName);

    try {
      const res = await axios.post("/projects/create", { name: projectName });
      console.log("🚀 ~ createProject ~ resS:", res);
      toast.success("Project created successfully");
      getAllProjects()
    } catch (error) {
      console.log("🚀 ~ handleLogin ~ error:", error);
      toast.error("An error occurred while creating the project");
    }
  };

  useEffect(() => {
    getAllProjects()
  }, []);

  const getAllProjects = ()=>{
    axios
      .get("/projects/all")
      .then((res) => {
        console.log(res.data);
        setProject(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="flex min-h-screen  p-4 bg-gray-100">
      {/* Button to open the modal */}

      <div className="flex items-center gap-2  h-fit p-2 rounded-lg shadow-lg w-full">
        <button
          onClick={openModal}
          className="px-5  w-fit h-fit py-3 text-sm font-semibold text-white bg-green-500 rounded-full shadow-md hover:bg-green-600 transition-all duration-200"
        >
          + New Project
        </button>
        <div className="flex items-center space-x-4">
          {/* <i className="ri-attachment-line text-2xl text-white hover:text-gray-300 transition-all duration-200 cursor-pointer"></i> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.length > 0 ? (
            project.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h1 className="text-2xl font-bold text-white mb-2">
                  {project.name.charAt(0).toUpperCase() + project.name.slice(1)}
                </h1>
                <div className="flex items-center space-x-2 text-white">
                  <i className="ri-user-line text-lg"></i>
                  <span className="text-sm font-medium">
                    {project.users.length} Collaborators
                  </span>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-xl font-semibold text-gray-500">No projects</h1>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/4">
            {/* Modal Body */}
            <div className="p-4">
              <h1 className="text-2xl font-semibold ">Create new project</h1>
              <div className="mt-4 flex flex-col gap-2">
                <h2 className="">project Name</h2>
                <input
                  type="text"
                  placeholder="Project name"
                  className="w-full px-4 py-2  border rounded"
                  onChange={(e) => setprojectName(e.target.value)}
                />
              </div>
            </div>
            {/* Modal Footer */}
            <div className="flex justify-around p-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
