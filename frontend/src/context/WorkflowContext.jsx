/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext(null);

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
  const [conflicts, setConflicts] = useState(INITIAL_CONFLICTS);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [toasts, setToasts] = useState([]);

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

  // Conflict state management
  const updateConflictStatus = (conflictId, newStatus) => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, status: newStatus } : c))
    );
    if (newStatus === 'Resolved') {
      showToast('Conflict marked as resolved', 'success');
    } else {
      showToast(`Conflict status updated to ${newStatus}`, 'info');
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
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: newStatus } : a))
    );
    if (newStatus === 'In Progress') {
      showToast('Action moved to In Progress', 'info');
    } else if (newStatus === 'Completed') {
      showToast('Action completed', 'success');
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
    setConflicts(INITIAL_CONFLICTS);
    setActions(INITIAL_ACTIONS);
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
        conflicts,
        actions,
        toasts,
        conflictMetrics,
        actionMetrics,
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
