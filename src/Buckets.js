import React, { useState, useEffect } from "react";
import "./Buckets.css";

function Buckets() {
  // 1. Retrieve initial data from localStorage on load
  const [uContainers, setUContainers] = useState(() => {
    const saved = localStorage.getItem("bucket_app_data");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "PROJECTS", frames: [] }
    ];
  });

  const [activeContainerId, setActiveContainerId] = useState(uContainers[0]?.id || null);
  const [editingContainerId, setEditingContainerId] = useState(null);

  // 2. Save to localStorage whenever uContainers state changes
  useEffect(() => {
    localStorage.setItem("bucket_app_data", JSON.stringify(uContainers));
  }, [uContainers]);

  // 3. Helper to generate unique IDs based on existing items
  const getNextContainerId = () => {
    return uContainers.length > 0 
      ? Math.max(...uContainers.map(c => c.id)) + 1 
      : 1;
  };

  const getNextFrameId = (frames) => {
    return frames.length > 0 
      ? Math.max(...frames.map(f => f.id)) + 1 
      : 1;
  };

  const createBucket = () => {
    const newId = getNextContainerId();
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
          const newFrameId = getNextFrameId(uc.frames);
          return {
            ...uc,
            frames: [
              ...uc.frames,
              { id: newFrameId, label: `Frame ${newFrameId}` }
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

  const handleContainerKeyDown = (e) => {
    if (e.key === "Enter") {
      setEditingContainerId(null);
    }
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
        {/* Optional: Clear All Button */}
        <button 
          style={{background: '#ef4444', marginLeft: '10px'}} 
          onClick={() => { if(window.confirm("Clear all?")) setUContainers([]); }}
        >
          Clear
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
                  <span
                    className="edit-icon"
                    onClick={() => setEditingContainerId(uc.id)}
                  >
                    ✏️
                  </span>
                </>
              )}
            </div>

            <div className={`frames-wrapper ${activeContainerId === uc.id ? "active" : ""}`}>
              <div className="frames-container">
                {uc.frames.length === 0 ? (
                  <span className="empty-hint">Click "Create Stuff"</span>
                ) : (
                  Array.from({ length: Math.ceil(uc.frames.length / 2) }).map((_, rowIndex) => (
                    <div key={rowIndex} className="frame-row">
                      {uc.frames.slice(rowIndex * 2, rowIndex * 2 + 2).map((frame, idx) => {
                        const globalIndex = rowIndex * 2 + idx;
                        return (
                          <Bucket
                            key={frame.id}
                            index={globalIndex}
                            label={frame.label}
                            onChangeLabel={newLabel =>
                              updateFrameName(uc.id, frame.id, newLabel)
                            }
                          />
                        );
                      })}
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

function Bucket({ index, label, onChangeLabel }) {
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
          <span
            className="edit-icon"
            onClick={e => {
              e.stopPropagation();
              setEditing(true);
            }}
          >
            ✏️
          </span>
        </>
      )}
    </div>
  );
}

export default Buckets;