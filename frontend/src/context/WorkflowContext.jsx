import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [actions, setActions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [toasts, setToasts] = useState([]);

  const token = localStorage.getItem('auth_token');

  const fetchDocuments = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConflicts = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/conflicts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setConflicts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActions = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/actions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setActions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDocuments();
      fetchConflicts();
      fetchActions();
    }
  }, [token]);

  const addActivity = (message) => {
    setRecentActivity(prev => [{ id: `act-${Date.now()}`, message, timestamp: 'Just now' }, ...prev]);
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addDocument = (doc) => {
    setDocuments((prev) => [doc, ...prev]);
    addActivity(`Document "${doc.name}" was added`);
    showToast(`Document "${doc.name}" processed successfully`, 'success');
  };

  const removeDocument = async (id) => {
    const doc = documents.find(d => d.id === id);
    try {
      const res = await fetch(`http://localhost:5000/api/documents/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        if (doc) addActivity(`Document "${doc.name}" was deleted`);
        showToast('Document deleted', 'info');
      } else {
        throw new Error('Failed to delete from database');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete document', 'error');
    }
  };

  const createAction = async (actionData) => {
    try {
      const res = await fetch('http://localhost:5000/api/actions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(actionData)
      });
      if (res.ok) {
        const newAction = await res.json();
        setActions(prev => [newAction, ...prev]);
        showToast('Action created successfully', 'success');
        addActivity(`Action created: ${newAction.title}`);
        return newAction;
      }
    } catch (err) {
      showToast('Failed to create action', 'error');
      console.error(err);
    }
  };

  const updateActionStatus = async (actionId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/actions/${actionId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status: newStatus } : a)));
        showToast(`Action status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAction = async (actionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/actions/${actionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setActions((prev) => prev.filter((a) => a.id !== actionId));
        showToast('Action deleted', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateConflictStatus = async (conflictId, newStatus) => {
    // Optional: implement PUT /api/conflicts/:id if needed, else local
    setConflicts((prev) => prev.map((c) => (c.id === conflictId ? { ...c, status: newStatus } : c)));
    showToast(`Conflict status updated`, 'info');
  };

  const markConflictResolved = (conflictId) => {
    updateConflictStatus(conflictId, 'Resolved');
  };

  const createActionFromConflict = async (conflictId) => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return null;

    const existingAction = actions.find((a) => a.relatedConflictId === conflictId);
    if (existingAction) {
      showToast('Action already exists', 'info');
      return existingAction;
    }

    const newActionData = {
      title: 'Verify conflict resolution',
      source: `Conflicts`,
      reason: 'Conflict detected',
      priority: conflict.priority || 'Medium',
      status: 'pending',
      due: 'Not specified',
      why: 'Resolve identified differences',
      relatedConflict: conflict.title,
      relatedConflictId: conflict.id,
      recommendedNextStep: 'Review conflict details and resolve.'
    };

    return await createAction(newActionData);
  };

  return (
    <WorkflowContext.Provider value={{
      documents,
      conflicts,
      actions,
      recentActivity,
      toasts,
      addDocument,
      removeDocument,
      updateConflictStatus,
      markConflictResolved,
      createActionFromConflict,
      createAction,
      updateActionStatus,
      deleteAction,
      showToast,
      removeToast
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
