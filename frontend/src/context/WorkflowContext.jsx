/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkflowContext = createContext(null);

const BACKEND_URL = 'http://localhost:3001';

const INITIAL_DOCUMENTS = [
  { id: 'demo-1', name: 'Project Proposal', type: 'PDF', status: 'Processed', lastUpdated: '10 Oct 2026', isDemo: true },
  { id: 'demo-2', name: 'Project Requirements', type: 'DOCX', status: 'Processed', lastUpdated: '12 Oct 2026', isDemo: true },
  { id: 'demo-3', name: 'Meeting Report', type: 'PDF', status: 'Processed', lastUpdated: '15 Oct 2026', isDemo: true },
  { id: 'demo-4', name: 'Budget Report', type: 'XLSX', status: 'Processed', lastUpdated: '16 Oct 2026', isDemo: true },
  { id: 'demo-5', name: 'Client Requirements', type: 'DOCX', status: 'Processed', lastUpdated: '18 Oct 2026', isDemo: true }
];

const INITIAL_RECENT_ACTIVITY = [
  { id: 'act-1', message: 'Project Proposal was added', timestamp: '10 Oct 2026' },
  { id: 'act-2', message: 'Conflict detected between Project Proposal and Project Requirements', timestamp: '12 Oct 2026' }
];

const INITIAL_CONFLICTS = [
  {
    id: 'conflict-deadline-01',
    title: 'Conflicting Deadline',
    status: 'Needs Verification',
    priority: 'High',
    description: 'Different deadlines were found across two documents.',
    sourceA: { documentName: 'Project Proposal', documentType: 'PDF Document', section: 'Section 4.2 - Submission Timeline', deadline: '20 October 2026', excerpt: 'The final project proposal deliverables must be submitted on or before 20 October 2026 for review committee evaluation.' },
    sourceB: { documentName: 'Project Requirements', documentType: 'DOCX Document', section: 'Section 1.3 - Critical Milestones', deadline: '25 October 2026', excerpt: 'Contractual requirements mandate submission of complete project documentation by 25 October 2026 at 17:00 EST.' },
    differenceHighlight: '5-day discrepancy between Proposal (20 Oct 2026) and Requirements (25 Oct 2026).',
    whyItMatters: 'Using the wrong deadline could result in a missed submission.',
    recommendedAction: 'Verify the final submission deadline with the responsible source.',
    actionCreated: true,
  }
];

const INITIAL_ACTIONS = [
  {
    id: 'action-deadline-01',
    title: 'Verify final submission deadline',
    source: 'Project Proposal + Project Requirements',
    reason: 'Conflicting deadlines were detected.',
    priority: 'High',
    status: 'Pending',
    due: 'Before final submission',
    why: 'Two documents contain different deadlines.',
    relatedConflict: 'Project Proposal vs Project Requirements',
    relatedConflictId: 'conflict-deadline-01',
    recommendedNextStep: 'Confirm the correct deadline before submission.',
    createdAt: 'Oct 08, 2026'
  }
];

export function WorkflowProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [actions, setActions] = useState([]);
  const [recentActivity, setRecentActivity] = useState(INITIAL_RECENT_ACTIVITY);
  const [toasts, setToasts] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    documents: 0,
    importantFindings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isDemoMode) return;
      try {
        const [docsRes, confRes, actRes, aiRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/documents`),
          fetch(`${BACKEND_URL}/api/conflicts`),
          fetch(`${BACKEND_URL}/api/actions`),
          fetch(`${BACKEND_URL}/api/status`)
        ]);
        const [docsData, confData, actData, aiData] = await Promise.all([
          docsRes.json(),
          confRes.json(),
          actRes.json(),
          aiRes.json()
        ]);
        setDocuments(docsData || []);
        setConflicts(confData || []);
        setActions(actData || []);
        setAiConfigured(aiData.aiConfigured);
        setDashboardStats({
          documents: docsData?.length || 0,
          importantFindings: (confData?.length || 0) + (actData?.length || 0)
        });
      } catch (e) {
        setIsDemoMode(true);
      }
    };
    fetchData();
  }, [BACKEND_URL, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      setDocuments(INITIAL_DOCUMENTS);
      setConflicts(INITIAL_CONFLICTS);
      setActions(INITIAL_ACTIONS);
      setDashboardStats({ documents: INITIAL_DOCUMENTS.length, importantFindings: INITIAL_CONFLICTS.length });
    }
  }, [isDemoMode]);

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

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const addDocument = async (file) => {
    if (isDemoMode) {
      const newDoc = {
        id: `demo-${Date.now()}`,
        name: file.name,
        type: file.name.split('.').pop().toUpperCase(),
        status: 'Processed',
        lastUpdated: new Date().toLocaleDateString(),
        isDemo: true
      };
      setDocuments([newDoc, ...documents]);
      showToast('Document processed (Demo)', 'success');
      return newDoc;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      showToast('Uploading document...', 'info');
      const res = await fetch(`${BACKEND_URL}/api/documents`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const newDoc = await res.json();
      setDocuments(prev => [newDoc, ...prev]);
      addActivity(`Document "${newDoc.name}" was added`);
      showToast('Document uploaded successfully', 'success');
      return newDoc;
    } catch (e) {
      showToast('Failed to upload document', 'error');
      throw e;
    }
  };

  const removeDocument = async (id) => {
    if (!isDemoMode) {
      await fetch(`${BACKEND_URL}/api/documents/${id}`, { method: 'DELETE' });
    }
    const doc = documents.find(d => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (doc) addActivity(`Document "${doc.name}" was deleted`);
    showToast('Document deleted', 'info');
  };

  const updateConflictStatus = async (conflictId, newStatus) => {
    if (!isDemoMode) {
      const c = conflicts.find(x => x.id === conflictId);
      if (c) await fetch(`${BACKEND_URL}/api/conflicts/${conflictId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...c, status: newStatus })
      });
    }
    setConflicts((prev) => prev.map((c) => (c.id === conflictId ? { ...c, status: newStatus } : c)));
    if (newStatus === 'Resolved') showToast('Conflict marked as resolved', 'success');
    else showToast(`Conflict status updated to ${newStatus}`, 'info');
  };

  const markConflictResolved = (conflictId) => updateConflictStatus(conflictId, 'Resolved');

  const createActionFromConflict = async (conflictId) => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return null;
    const existingAction = actions.find((a) => a.relatedConflictId === conflictId);
    if (existingAction) {
      showToast('Action already exists in Action Center', 'info');
      return existingAction;
    }

    const sourceAName = conflict.sourceA ? conflict.sourceA.documentName : 'Source A';
    const sourceBName = conflict.sourceB ? conflict.sourceB.documentName : 'Source B';

    const newAction = {
      title: 'Verify information',
      source: `${sourceAName} + ${sourceBName}`,
      reason: 'Conflict detected',
      priority: conflict.priority || 'Medium',
      status: 'Pending',
      due: 'Not specified',
      why: 'Conflict needs resolution',
      relatedConflict: `${sourceAName} vs ${sourceBName}`,
      relatedConflictId: conflict.id,
      recommendedNextStep: 'Review the conflicting information.',
      createdAt: new Date().toLocaleDateString()
    };

    if (!isDemoMode) {
      const res = await fetch(`${BACKEND_URL}/api/actions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAction)
      });
      const data = await res.json();
      Object.assign(newAction, data);
      await fetch(`${BACKEND_URL}/api/conflicts/${conflictId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...conflict, actionCreated: true })
      });
    } else {
      newAction.id = `action-${Date.now()}`;
    }

    setActions((prev) => [newAction, ...prev]);
    setConflicts((prev) => prev.map((c) => (c.id === conflictId ? { ...c, actionCreated: true } : c)));
    showToast('Action created successfully', 'success');
    return newAction;
  };

  const createAction = async (actionData) => {
    const newAction = {
      title: actionData.title,
      source: actionData.source || 'Manual Entry',
      reason: actionData.reason || actionData.description || 'Action created by user',
      priority: actionData.priority || 'Medium',
      status: 'Pending',
      due: actionData.due || 'Not specified',
      why: actionData.why || actionData.description || 'Created to track next steps.',
      relatedConflict: actionData.relatedConflict || 'None',
      relatedConflictId: null,
      recommendedNextStep: actionData.recommendedNextStep || 'Review and complete task.',
      createdAt: new Date().toLocaleDateString()
    };

    if (!isDemoMode) {
      const res = await fetch(`${BACKEND_URL}/api/actions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAction)
      });
      const data = await res.json();
      Object.assign(newAction, data);
    } else {
      newAction.id = `action-${Date.now()}`;
    }

    setActions((prev) => [newAction, ...prev]);
    showToast('Action created successfully', 'success');
    return newAction;
  };

  const updateActionStatus = async (actionId, newStatus) => {
    if (!isDemoMode) {
      const a = actions.find(x => x.id === actionId);
      if (a) await fetch(`${BACKEND_URL}/api/actions/${actionId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...a, status: newStatus })
      });
    }
    setActions((prev) => prev.map((a) => a.id === actionId ? { ...a, status: newStatus } : a));
    if (newStatus === 'Completed') showToast('Action completed', 'success');
  };

  const deleteAction = async (actionId) => {
    if (!isDemoMode) await fetch(`${BACKEND_URL}/api/actions/${actionId}`, { method: 'DELETE' });
    setActions((prev) => prev.filter((a) => a.id !== actionId));
    showToast('Action item removed', 'info');
  };

  const resetDemoData = () => {
    setIsDemoMode(true);
    setDocuments(INITIAL_DOCUMENTS);
    setConflicts(INITIAL_CONFLICTS);
    setActions(INITIAL_ACTIONS);
    setDashboardStats({ documents: 2, importantFindings: 2 });
    showToast('Demo data reset', 'info');
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setDocuments(INITIAL_DOCUMENTS);
    setConflicts(INITIAL_CONFLICTS);
    setActions(INITIAL_ACTIONS);
    showToast('Demo Mode Activated', 'success');
  };

  const conflictMetrics = {
    total: conflicts.length,
    highPriority: conflicts.filter((c) => c.priority === 'High').length,
    needsVerification: conflicts.filter((c) => c.status === 'Needs Verification').length,
    underReview: conflicts.filter((c) => c.status === 'Under Review').length,
    resolved: conflicts.filter((c) => c.status === 'Resolved').length,
    unresolvedCount: conflicts.filter((c) => c.status !== 'Resolved').length
  };

  const actionMetrics = {
    total: actions.length,
    pending: actions.filter((a) => a.status === 'Pending').length,
    inProgress: actions.filter((a) => a.status === 'In Progress').length,
    completed: actions.filter((a) => a.status === 'Completed').length,
    highPriority: actions.filter((a) => a.priority === 'High').length,
    activeCount: actions.filter((a) => a.status !== 'Completed').length
  };

  return (
    <WorkflowContext.Provider
      value={{
        documents, conflicts, actions, recentActivity, toasts,
        conflictMetrics, actionMetrics,
        addDocument, removeDocument,
        updateConflictStatus, markConflictResolved,
        createActionFromConflict, createAction, updateActionStatus, deleteAction,
        resetDemoData, enableDemoMode, isDemoMode, dashboardStats,
        showToast, removeToast, aiConfigured, BACKEND_URL
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error('useWorkflow must be used within a WorkflowProvider');
  return context;
}
