import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import InputField from './InputField';
import Button from './Button';
import { useWorkflow } from '../context/WorkflowContext';

export default function ActionForm({ isOpen, onClose }) {
  const { createAction } = useWorkflow();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'High',
    source: 'Project Proposal + Project Requirements',
    due: 'Before final submission',
    recommendedNextStep: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Action title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createAction({
      title: formData.title.trim(),
      reason: formData.description.trim() || 'Manual action item created for verification.',
      priority: formData.priority,
      source: formData.source.trim() || 'Custom Document Reference',
      due: formData.due.trim() || 'Immediate attention',
      why: formData.description.trim() || 'Created manually by user.',
      recommendedNextStep: formData.recommendedNextStep.trim() || 'Follow up with stakeholders to resolve.',
      relatedConflict: formData.source.trim()
    });

    // Reset and close
    setFormData({
      title: '',
      description: '',
      priority: 'High',
      source: 'Project Proposal + Project Requirements',
      due: 'Before final submission',
      recommendedNextStep: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-card rounded-2xl w-full max-w-lg border border-surface-border overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Create Action Item
              </h3>
              <p className="text-xs text-slate-400">
                Turn findings into a structured, trackable task
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-surface-dark hover:bg-surface-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InputField
            label="Action Title *"
            id="action-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Verify final submission deadline"
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Description / Why It Was Created
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Different deadlines were found across two documents. Confirm correct date before submission."
              className="glass-input w-full rounded-xl px-4 py-2.5 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm bg-surface-dark text-slate-200"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <InputField
                label="Due Date"
                id="action-due"
                value={formData.due}
                onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                placeholder="e.g. Before final submission"
              />
            </div>
          </div>

          <InputField
            label="Related Document / Source"
            id="action-source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g. Project Proposal + Project Requirements"
          />

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" className="w-auto px-6 py-2.5">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
