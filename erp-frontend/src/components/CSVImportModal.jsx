import { useRef, useState } from "react";
import api from "../api/api.js";
import toast from "react-hot-toast";
import "./CSVImport.css";

const CSVImportModal = ({
  endpoint,
  label = "Import CSV",
  onDone,
  buttonClass = "btn-add",
  icon: Icon,
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset so same file can trigger again
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

    setSelectedFile(file);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedFile || !endpoint) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const uploadPromise = api.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.promise(uploadPromise, {
      loading: "Importing CSV...",
      success: (res) => {
        const { created, totalRows, errors } = res.data || {};
        onDone?.();
        setShowConfirm(false);
        setSelectedFile(null);
        const msg = `Imported ${created || 0}/${totalRows || 0} rows ${
          errors?.length ? `(${errors.length} errors)` : "successfully"
        }`;
        return msg;
      },
      error: (err) => err.response?.data?.message || "Import failed",
    });

    try {
      setUploading(true);
      await uploadPromise;
    } finally {
      setUploading(false);
    }
  };

  const handleChangeFile = () => {
    setShowConfirm(false);
    setTimeout(() => openFileDialog(), 100);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setShowConfirm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ display: "inline-block" }}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv,text/csv"
        onChange={handleFileChange}
      />

      {/* Import trigger button */}
      <button
        type="button"
        className={buttonClass}
        onClick={openFileDialog}
        disabled={uploading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {Icon && <Icon size={16} strokeWidth={2} />}{" "}
        {/* 👈 render icon if provided */}
        {uploading ? "Uploading..." : label}
      </button>

      {/* Custom confirmation modal */}
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

export default CSVImportModal;
