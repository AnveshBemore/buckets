import React, { useState } from "react";
import "./Buckets.css";

let globalFrameId = 1;
let globalContainerId = 1;

function Buckets() {
  const [uContainers, setUContainers] = useState([
    { id: globalContainerId++, name: "PROJECTS", frames: [] }
  ]);

  const [activeContainerId, setActiveContainerId] = useState(1);
  const [editingContainerId, setEditingContainerId] = useState(null);

  const createBucket = () => {
    const newId = globalContainerId++;
    setUContainers(prev => [
      ...prev,
      { id: newId, name: `Container ${newId}`, frames: [] }
    ]);
    setActiveContainerId(newId);
  };

  const createStuff = () => {
    if (activeContainerId === null) return;
    setUContainers(prev =>
      prev.map(uc => {
        if (uc.id === activeContainerId) {
          if (uc.frames.length >= 8) return uc;
          return {
            ...uc,
            frames: [
              ...uc.frames,
              { id: globalFrameId++, label: `Frame ${globalFrameId - 1}` }
            ]
          };
        }
        return uc;
      })
    );
  };

  const updateContainerName = (id, newName) => {
    setUContainers(prev =>
      prev.map(uc => (uc.id === id ? { ...uc, name: newName } : uc))
    );
  };

  const updateFrameName = (containerId, frameId, newLabel) => {
    setUContainers(prev =>
      prev.map(uc =>
        uc.id === containerId
          ? {
              ...uc,
              frames: uc.frames.map(f =>
                f.id === frameId ? { ...f, label: newLabel } : f
              )
            }
          : uc
      )
    );
  };

  // Delete a whole container
  const deleteContainer = (id) => {
    setUContainers(prev => prev.filter(uc => uc.id !== id));
    if (activeContainerId === id) setActiveContainerId(null);
  };

  // Delete a specific frame inside a container
  const deleteFrame = (containerId, frameId) => {
    setUContainers(prev =>
      prev.map(uc =>
        uc.id === containerId
          ? { ...uc, frames: uc.frames.filter(f => f.id !== frameId) }
          : uc
      )
    );
  };

  const handleContainerKeyDown = (e) => {
    if (e.key === "Enter") setEditingContainerId(null);
  };

  return (
    <div className="app">
      <div className="toolbar">
        <button onClick={createBucket}>Create Bucket</button>
        <button
          className="create-stuff-btn"
          onClick={createStuff}
          disabled={activeContainerId === null}
        >
          Create Stuff
        </button>
      </div>

      <div className="all-containers">
        {uContainers.map(uc => (
          <div
            key={uc.id}
            className={`u-container ${activeContainerId === uc.id ? "active" : ""}`}
            onClick={() => setActiveContainerId(uc.id)}
          >
            <div className="uc-label-wrapper" onClick={e => e.stopPropagation()}>
              {editingContainerId === uc.id ? (
                <input
                  className="uc-label-input"
                  value={uc.name}
                  autoFocus
                  onChange={e => updateContainerName(uc.id, e.target.value)}
                  onBlur={() => setEditingContainerId(null)}
                  onKeyDown={handleContainerKeyDown}
                />
              ) : (
                <>
                  <span className="uc-label-text">{uc.name}</span>
                  <div className="action-icons">
                    <span className="edit-icon" onClick={() => setEditingContainerId(uc.id)}>✏️</span>
                    <span className="delete-icon" onClick={() => deleteContainer(uc.id)}>🗑️</span>
                  </div>
                </>
              )}
            </div>

            <div className={`frames-wrapper ${activeContainerId === uc.id ? "active" : ""}`}>
              <div className="frames-container">
                {uc.frames.length === 0 ? (
                  <span className="empty-hint">Click "Create Stuff" to add frames</span>
                ) : (
                  Array.from({ length: Math.ceil(uc.frames.length / 2) }).map((_, rowIndex) => (
                    <div key={rowIndex} className="frame-row">
                      {uc.frames.slice(rowIndex * 2, rowIndex * 2 + 2).map((frame, idx) => (
                        <Bucket
                          key={frame.id}
                          index={rowIndex * 2 + idx}
                          label={frame.label}
                          onDelete={() => deleteFrame(uc.id, frame.id)}
                          onChangeLabel={newLabel => updateFrameName(uc.id, frame.id, newLabel)}
                        />
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bucket({ index, label, onChangeLabel, onDelete }) {
  const [editing, setEditing] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") setEditing(false);
  };

  return (
    <div className={`bucket ${index % 2 === 0 ? "light" : "dark"}`}>
      <div className="fill" />
      {editing ? (
        <input
          className="edit-input"
          value={label}
          autoFocus
          onChange={e => onChangeLabel(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <div className="text">{label}</div>
          <div className="bucket-action-icons">
             <span className="edit-icon" onClick={(e) => { e.stopPropagation(); setEditing(true); }}>✏️</span>
             <span className="delete-icon" onClick={(e) => { e.stopPropagation(); onDelete(); }}>🗑️</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Buckets;