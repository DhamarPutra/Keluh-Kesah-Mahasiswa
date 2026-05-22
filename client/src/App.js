import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import PORT_API from "./PortAPI";

function App() {
  const [dosen, setDosen] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");

  // Mengambil daftar dosen dari backend
  useEffect(() => {
    axios
      .get(PORT_API + "/dosen")
      .then((response) => {
        const dosenOptions = response.data.map((dosen) => ({
          value: dosen.id,
          label: `${dosen.nama} ${dosen.nidn} (${dosen.comment_count} komentar)`,
          comment_count: dosen.comment_count,
        }));
        setDosen(dosenOptions);
      })
      .catch((error) => {
        console.error("Error fetching dosen:", error);
        setMessage("Gagal Mengambil Data Dosen", error);
      });
  }, []);

  // Mengambil komentar ketika dosen dipilih
  const handleDosenChange = (selectedOption) => {
    setSelectedDosen(selectedOption);

    axios
      .get(PORT_API + `/comments/${selectedOption.value}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  // Mengirim komentar baru ke backend
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDosen || !newComment) {
      setMessage("Dosen dan komentar harus diisi");
      return;
    }

    axios
      .post(PORT_API + "/comments", {
        dosenId: selectedDosen.value,
        comment: newComment,
      })
      .then((response) => {
        setMessage(response.data.message);
        setNewComment(""); // Reset form setelah submit

        // Refresh komentar setelah menambah komentar baru
        axios
          .get(PORT_API + `/comments/${selectedDosen.value}`)
          .then((response) => {
            setComments(response.data);
          })
          .catch((error) => {
            console.error("Error fetching comments:", error);
          });
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        setMessage("Terjadi kesalahan");
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Pilih Dosen:</label>
        <Select
          options={dosen}
          onChange={handleDosenChange}
          placeholder="Pilih Dosen"
          className="w-full mb-4"
        />
      </div>

      <div className="mb-6">
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded shadow">
              <div>
                <p className="text-gray-800">{comment.comment}</p>
                <p className="text-sm text-gray-500 italic">
                  by Anonymous -
                  {" " + new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Add Comment:
            <div className="text-xs text-red mt-2">
          <span>*TETAP GUNAKAN ETIKA BERPENDAPAT YA!</span>
        </div>
          </label>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-400 text-black py-2 px-4 rounded hover:bg-blue-600 hover:text-white transition duration-200"
        >
          Add Comment
        </button>
      </form>
    </div>
  );
}

export default App;
