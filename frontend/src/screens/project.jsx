import React, { useContext, useEffect, useState } from "react";
import Markdown from 'markdown-to-jsx'

import axios from "../config/axios";
import { useParams } from "react-router-dom";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { UserContext } from "../context/user.context";

const Project = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  console.log("🚀 ~ Project ~ user:", user);

  console.log("🚀 ~ Project ~ selectedUserId:", selectedUserId);
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  console.log("🚀 ~ Project ~ projectUsers:", projectUsers);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("🚀 ~ Project ~ id:", id);
    initializeSocket(id);
    receiveMessage("project-message", (data) => {
      console.log("🚀 ~ useEffect ~ data:", data?.sender?._id, user?._id);
      if (data?.sender?._id === user?._id) return;
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    axios.get(`/projects/get-project/${id}`).then((res) => {
      console.log("🚀 ~ useEffect ~ ressssss:", res);
      setProjectUsers(res.data.data.users);
    });
    axios
      .get("/users/all")
      .then((res) => {
        console.log("🚀 ~ useEffect ~ res:", res);
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log("🚀 ~ axios.get ~ err:", err);
      });
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUserClick = (userId) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(userId)) {
        newSelectedUserId.delete(userId);
      } else {
        newSelectedUserId.add(userId);
      }
      return newSelectedUserId;
    });
    // setIsModalOpen(false);
  };

  const addCollaborator = async () => {
    const res = await axios.put("/projects/add-user", {
      projectId: id,
      users: Array.from(selectedUserId),
    });
    setIsModalOpen(false);
    setSelectedUserId([]);

    console.log("🚀 ~ addCollaborator ~ res:", res);
  };

  const sendMessageText = () => {
    if (message.length > 0) {
      sendMessage("project-message", { message, sender: user._id });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, sender: { _id: user._id, email: user.email } },
      ]);
      setMessage("");
    }
  };

  return (
    <main className="h-screen w-screen flex ">
      <section className=" relative left flex flex-col h-full min-w-96 bg-slate-300">
        <header className="flex items-center w-full justify-between p-4 bg-slate-100">
          <button className="flex items-center gap-2" onClick={toggleModal}>
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button className="p-2" onClick={toggleDrawer}>
            <i className="ri-group-fill"></i>
          </button>
        </header>
        <div
          style={{ scrollbarWidth: "none" }}
          className="conversation-area relative scroll-smooth overflow-auto flex-grow flex flex-col"
        >
          <div className="message-box flex-grow flex flex-col gap-1 p-1 ">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message max-w-56  flex flex-col p-2 bg-slate-50 rounded-md ${
                  msg?.sender?._id === user?._id ? "ml-auto" : ""
                }${msg?.sender?._id === "ai" ? "max-w-[23.5rem]" : ""}`}
              >
                <small className="text-xs opacity-65">{msg.sender.email}</small>

                <p className="text-sm">
                  {msg.sender?._id === "ai" ? (
                    <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
                    <Markdown>{msg.message}</Markdown>
                    </div>
                  ) : (
                    msg.message
                  )}
                </p>
              </div>
            ))}
          </div>
          <div className="inputField w-full flex sticky bottom-0">
            <input
              value={message}
              type="text"
              placeholder="Type a message"
              className="p-2 px-4 outline-none border-none flex-grow"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                e.key === "Enter" && sendMessageText();
              }}
            />
            <button
              onClick={sendMessageText}
              className="px-5 bg-slate-950 text-white"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          style={{
            minWidth: "inherit",
          }}
          className={`fixed top-0 left-0 h-full  bg-slate-50 shadow-lg transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <button
            onClick={toggleDrawer}
            className="absolute top-5 right-5  hover:text-gray-800"
          >
            <i className="ri-close-fill text-2xl"></i>
          </button>

          <div className="p-4 w-full bg-slate-200">
            <h1 className="text-xl font-semibold ">Collaborators</h1>
          </div>
          <div className="users flex flex-col gap-2 py-2">
            {projectUsers.map((user) => (
              <div
                key={user?._id}
                className="user cursor-pointer p-2 hover:bg-slate-200 flex items-center gap-2"
              >
                <div className="aspect-square rounded-full p-4 text-white bg-slate-600 w-fit h-fit flex items-center justify-center">
                  <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className="font-semibold text-lg">{user?.email}</h1>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-2/5 max-w-md ">
            <div className="flex  items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Select a User</h2>
              <button
                onClick={toggleModal}
                className="  text-lg rounded transition"
              >
                <i className="ri-close-fill"></i>
              </button>
            </div>
            <div className="users flex flex-col gap-2 max-h-96  relative pb-[58px] ">
              <div className="flex-1 overflow-y-auto  custom-scrollbar">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`user cursor-pointer p-2 hover:bg-slate-200 ${
                      Array.from(selectedUserId).indexOf(user._id) != -1
                        ? " bg-slate-200"
                        : ""
                    } flex items-center gap-2 relative`}
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="aspect-square rounded-full p-4 text-white bg-slate-600 w-fit h-fit flex items-center justify-center">
                      <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                ))}
              </div>

              {/* Add Collaborator Button */}
              <button
                onClick={addCollaborator}
                className="absolute bottom-0 left-0 w-full px-4 py-2 bg-blue-500 text-white rounded-t hover:bg-blue-600"
              >
                Add Collaborator
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
