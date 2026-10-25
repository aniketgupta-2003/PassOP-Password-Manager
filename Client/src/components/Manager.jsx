import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const ref = useRef();
  const passwordRef = useRef();

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000");
    let passwords = await req.json();
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    passwordRef.current.type = "password";
    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png";
      passwordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
      ref.current.src = "icons/eyecross.png";
    }
  };

  const savePassword = async () => {
  if (form.site.length > 0 && form.username.length > 0 && form.password.length > 0) {
    
    if (form.id) {
      // 1. Agar ID pehle se hai -> Seedha UPDATE karo (No DELETE call)
      await fetch("http://localhost:3000/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // UI state ko update karo bina delete kiye
      setPasswordArray(
        passwordArray.map((item) => (item.id === form.id ? form : item))
      );
    } else {
      // 2. Agar Naya Password hai -> Brand new record create karo
      const newItem = { ...form, id: uuidv4() };

      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      setPasswordArray([...passwordArray, newItem]);
    }

    setform({ site: "", username: "", password: "" });
    toast("Password Saved Successfully!");
  } else {
    toast("Error: Password not saved");
  }
};

  const deltePassword = async (id) => {
    let c = confirm("Do you really want to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast("Password Deleted!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

 const editPassword = (id) => {
  const selectedItem = passwordArray.find((i) => i.id === id);
  if (selectedItem) {
    // Form mein purana data bhar do taaki user edit kar sake
    setform(selectedItem);
  }
};

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    toast("Copied To Clipboard!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="p-2 pt-3 md:mycontainer">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your own PassWord Manager
        </p>
        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row justify-between w-full gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="absolute cursor-pointer top-[4px] right-[3px]"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={26}
                  src="icons/eyecross.png"
                  alt="eye"
                />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center bg-green-400 hover:bg-green-300 rounded-full px-5 w-fit gap-3 border border-green-900"
          >
            <lord-icon
              src="/add-button.json"
              trigger="hover"
              state="hover-rotation"
            ></lord-icon>
            Save
          </button>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}
          {passwordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={item.id || index}>
                      <td className="text-center py-2 border border-white w-32">
                        <div className="flex justify-between items-center px-2">
                          <a href={item.site} target="_blank" rel="noreferrer">
                            {item.site}
                          </a>
                          <div
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <img
                              className="w-5 cursor-pointer"
                              src="icons/copy.svg"
                              alt="copy"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2 border border-white w-32">
                        <div className="flex justify-between items-center px-2">
                          {item.username}
                          <div
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <img
                              className="w-5 cursor-pointer"
                              src="icons/copy.svg"
                              alt="copy"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2 border border-white w-32">
                        <div className="flex justify-between items-center px-2">
                          {"*".repeat(item.password?.length || 0)}
                          <div
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <img
                              className="w-5 cursor-pointer"
                              src="icons/copy.svg"
                              alt="copy"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2 border border-white w-32">
                        <span className="flex justify-center gap-3 items-center">
                          <div
                            className="edit w-5 cursor-pointer"
                            onClick={() => {
                              editPassword(item.id);
                            }}
                          >
                            <img src="icons/edit.svg" alt="edit" />
                          </div>
                          <div
                            className="delte w-5 cursor-pointer"
                            onClick={() => {
                              deltePassword(item.id);
                            }}
                          >
                            <img src="icons/delete.svg" alt="delete" />
                          </div>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
