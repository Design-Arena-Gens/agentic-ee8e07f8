"use client";

import { useState, useRef } from "react";
import { initFfmpegAndConcat } from "../lib/ffmpeg";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const inputRef = useRef(null);

  function onDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("video/"));
    setFiles(prev => [...prev, ...dropped]);
  }

  function onSelect(e) {
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith("video/"));
    setFiles(prev => [...prev, ...selected]);
  }

  function removeFile(idx) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function generate() {
    if (files.length === 0) return;
    setStatus("Loading FFmpeg...");
    setProgress(0);
    setVideoUrl(null);

    try {
      const { url, onProgress } = await initFfmpegAndConcat(files);
      onProgress(p => setProgress(Math.round(p * 100)));
      setStatus("Encoding...");
      const outUrl = await url();
      setVideoUrl(outUrl);
      setStatus("Done");
    } catch (e) {
      console.error(e);
      setStatus("Failed: " + (e?.message || "Unknown error"));
    }
  }

  return (
    <div className="stack">
      <section
        className="dropzone"
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          accept="video/*"
          multiple
          ref={inputRef}
          style={{ display: "none" }}
          onChange={onSelect}
        />
        <p><strong>Upload goal clips</strong></p>
        <p>Drag & drop or click to select MP4/WEBM files.</p>
      </section>

      {files.length > 0 && (
        <section className="files">
          <h3>Clips ({files.length})</h3>
          <ul>
            {files.map((f, i) => (
              <li key={i} className="fileItem">
                <span>{f.name}</span>
                <button className="remove" onClick={() => removeFile(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="actions">
        <button disabled={files.length === 0} onClick={generate} className="primary">
          Generate Video
        </button>
        <span className="status">{status}{status.includes("Encoding") || status.includes("Loading") ? ` ? ${progress}%` : ""}</span>
      </section>

      {videoUrl && (
        <section className="result">
          <video controls src={videoUrl} className="player" />
          <a className="download" href={videoUrl} download="albania-all-goals.mp4">Download MP4</a>
        </section>
      )}

      <section className="note">
        <p><strong>Note:</strong> For licensing, please upload your own clips. Processing happens entirely in your browser.</p>
      </section>
    </div>
  );
}
