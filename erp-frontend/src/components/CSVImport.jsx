import { useRef, useState } from "react";
import api from "../api/api.js";
import toast from "react-hot-toast";
import "./CSVImport.css";

const CSVImport = ({ onDone }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openFileDialog = () => {
    // Reset input value to allow reselecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please select a valid CSV file");
      return;
    }

    // Update file + show modal again (always)
    setSelectedFile(file);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const p = api.post("/customers/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.promise(p, {
      loading: "Importing CSV...",
      success: (res) => {
        const { created, totalRows, errors } = res.data;
        onDone?.();
        setShowConfirm(false);
        setSelectedFile(null);
        const msg = `Imported ${created}/${totalRows} rows ${
          errors?.length ? `(${errors.length} errors)` : "successfully"
        }`;
        return msg;
      },
      error: (err) => err.response?.data?.message || "Import failed",
    });

    try {
      setUploading(true);
      await p;
    } finally {
      setUploading(false);
    }
  };

  const handleChangeFile = () => {
    // Hide modal and re-trigger file dialog
    setShowConfirm(false);
    setTimeout(() => openFileDialog(), 100); // small delay for smooth UI
  };

  const handleCancel = () => {
    // Reset everything so user can reopen dialog
    setSelectedFile(null);
    setShowConfirm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ display: "inline-block" }}>
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv,text/csv"
        onChange={handleFileChange}
      />

      {/* Import button */}
      <button
        type="button"
        className="btn-add"
        onClick={openFileDialog}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Import CSV"}
      </button>

      {/* Confirmation popup */}
      {showConfirm && (
        <div className="csv-modal-overlay">
          <div className="csv-modal">
            <h3>Confirm Import</h3>
            <p>
              You selected: <strong>{selectedFile?.name}</strong>
            </p>
            <p>Do you want to continue importing this file?</p>
            <div className="csv-actions">
              <button className="btn-confirm" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="btn-change" onClick={handleChangeFile}>
                Change File
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImport;
