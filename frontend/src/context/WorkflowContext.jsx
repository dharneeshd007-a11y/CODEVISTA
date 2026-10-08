/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext(null);

const INITIAL_DOCUMENTS = [
  {
    id: 'demo-1',
    name: 'Project Proposal',
    type: 'PDF',
    status: 'Processed',
    lastUpdated: '10 Oct 2026',
    isDemo: true
  },
  {
    id: 'demo-2',
    name: 'Project Requirements',
    type: 'DOCX',
    status: 'Processed',
    lastUpdated: '12 Oct 2026',
    isDemo: true
  },
  {
    id: 'demo-3',
    name: 'Project Guidelines',
    type: 'TXT',
    status: 'Processed',
    lastUpdated: '15 Oct 2026',
    isDemo: true
  }
];

const INITIAL_RECENT_ACTIVITY = [
  { id: 'act-1', message: 'Project Proposal was added', timestamp: '10 Oct 2026' },
  { id: 'act-2', message: 'Conflict detected between Project Proposal and Project Requirements', timestamp: '12 Oct 2026' }
];

const INITIAL_CONFLICTS = [
  {
    id: 'conflict-deadline-01',
    title: 'Conflicting Deadline',
    status: 'Needs Verification', // 'Needs Verification' | 'Under Review' | 'Resolved'
    priority: 'High',
    description: 'Different deadlines were found across two documents.',
    sourceA: {
      documentName: 'Project Proposal',
      documentType: 'PDF Document',
      section: 'Section 4.2 - Submission Timeline',
      deadline: '20 October 2026',
      excerpt: 'The final project proposal deliverables must be submitted on or before 20 October 2026 for review committee evaluation.'
    },
    sourceB: {
      documentName: 'Project Requirements',
      documentType: 'DOCX Document',
      section: 'Section 1.3 - Critical Milestones',
      deadline: '25 October 2026',
      excerpt: 'Contractual requirements mandate submission of complete project documentation by 25 October 2026 at 17:00 EST.'
    },
    differenceHighlight: '5-day discrepancy between Proposal (20 Oct 2026) and Requirements (25 Oct 2026).',
    whyItMatters: 'Using the wrong deadline could result in a missed submission. The user should verify the correct deadline before taking action.',
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
    status: 'Pending', // 'Pending' | 'In Progress' | 'Completed'
    due: 'Before final submission',
    why: 'Two documents contain different deadlines.',
    relatedConflict: 'Project Proposal vs Project Requirements',
    relatedConflictId: 'conflict-deadline-01',
    recommendedNextStep: 'Confirm the correct deadline before submission.',
    createdAt: 'Oct 08, 2026'
  }
];

export function WorkflowProvider({ children }) {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [conflicts, setConflicts] = useState(INITIAL_CONFLICTS);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [recentActivity, setRecentActivity] = useState(INITIAL_RECENT_ACTIVITY);
  const [toasts, setToasts] = useState([]);

  const addActivity = (message) => {
    setRecentActivity(prev => [{ id: `act-${Date.now()}`, message, timestamp: 'Just now' }, ...prev]);
  };

  // Toast notification helper
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

  // Document Management
  const addDocument = (doc) => {
    setDocuments((prev) => [doc, ...prev]);
    addActivity(`Document "${doc.name}" was added`);
    showToast(`Document "${doc.name}" processed successfully`, 'success');
  };

  const removeDocument = (id) => {
    const doc = documents.find(d => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (doc) addActivity(`Document "${doc.name}" was deleted`);
    showToast('Document deleted', 'info');
  };

  // Conflict state management
  const updateConflictStatus = (conflictId, newStatus) => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, status: newStatus } : c))
    );
    if (newStatus === 'Resolved') {
      showToast('Conflict marked as resolved', 'success');
      addActivity('A conflict was resolved');
    } else {
      showToast(`Conflict status updated to ${newStatus}`, 'info');
      addActivity(`Conflict status updated to ${newStatus}`);
    }
  };

  const markConflictResolved = (conflictId) => {
    updateConflictStatus(conflictId, 'Resolved');
  };

  // Convert conflict into Action item
  const createActionFromConflict = (conflictId) => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return null;

    // Check if an action already exists for this conflict
    const existingAction = actions.find((a) => a.relatedConflictId === conflictId);
    if (existingAction) {
      showToast('Action already exists in Action Center', 'info');
      return existingAction;
    }

    const newAction = {
      id: `action-${Date.now()}`,
      title: 'Verify final submission deadline',
      source: `${conflict.sourceA.documentName} + ${conflict.sourceB.documentName}`,
      reason: 'Conflicting deadlines were detected.',
      priority: conflict.priority,
      status: 'Pending',
      due: 'Before final submission',
      why: 'Two documents contain different deadlines.',
      relatedConflict: `${conflict.sourceA.documentName} vs ${conflict.sourceB.documentName}`,
      relatedConflictId: conflict.id,
      recommendedNextStep: 'Confirm the correct deadline before submission.',
      createdAt: 'Just now'
    };

    setActions((prev) => [newAction, ...prev]);
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, actionCreated: true } : c))
    );
    showToast('Action created successfully', 'success');
    addActivity(`Action created: ${newAction.title}`);
    return newAction;
  };

  // Manual action creation
  const createAction = (actionData) => {
    const newAction = {
      id: `action-${Date.now()}`,
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
      createdAt: 'Just now'
    };

    setActions((prev) => [newAction, ...prev]);
    showToast('Action created successfully', 'success');
    return newAction;
  };

  // Update action status
  const updateActionStatus = (actionId, newStatus) => {
    let actionTitle = '';
    setActions((prev) =>
      prev.map((a) => {
        if (a.id === actionId) {
          actionTitle = a.title;
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
    if (newStatus === 'In Progress') {
      showToast('Action moved to In Progress', 'info');
      addActivity(`Action "${actionTitle}" moved to In Progress`);
    } else if (newStatus === 'Completed') {
      showToast('Action completed', 'success');
      addActivity(`Action "${actionTitle}" completed`);
    } else {
      showToast(`Action status set to ${newStatus}`, 'info');
    }
  };

  // Delete action (allows testing empty state)
  const deleteAction = (actionId) => {
    setActions((prev) => prev.filter((a) => a.id !== actionId));
    showToast('Action item removed', 'info');
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    setDocuments(INITIAL_DOCUMENTS);
    setConflicts(INITIAL_CONFLICTS);
    setActions(INITIAL_ACTIONS);
    setRecentActivity(INITIAL_RECENT_ACTIVITY);
    showToast('Demo data reset to initial state', 'info');
  };

  // Computed summary metrics
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
        documents,
        conflicts,
        actions,
        recentActivity,
        toasts,
        conflictMetrics,
        actionMetrics,
        addDocument,
        removeDocument,
        updateConflictStatus,
        markConflictResolved,
        createActionFromConflict,
        createAction,
        updateActionStatus,
        deleteAction,
        resetDemoData,
        showToast,
        removeToast
      }}
    >
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
