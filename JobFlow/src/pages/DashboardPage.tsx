import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Inbox, Briefcase } from 'lucide-react';
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
  DragOverlay, DragStartEvent, DragOverEvent, closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useApplications } from '@/hooks/useApplications';
import ApplicationFormDialog from '@/components/board/ApplicationFormDialog';
import type { Application, ApplicationStatus, ApplicationInsert } from '@/types';
import { format } from 'date-fns';

// ── Column config ─────────────────────────────────────────────────────────────
const COLUMNS: {
  id: ApplicationStatus;
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
}[] = [
  { id: 'Applied',   label: 'Applied',   color: '#2D52E0', bgColor: '#EEF2FF', dotColor: '#2D52E0' },
  { id: 'Interview', label: 'Interview', color: '#C27803', bgColor: '#FFFBEB', dotColor: '#D97706' },
  { id: 'Offer',     label: 'Offer',     color: '#047857', bgColor: '#ECFDF5', dotColor: '#059669' },
  { id: 'Rejected',  label: 'Rejected',  color: '#B91C1C', bgColor: '#FEF2F2', dotColor: '#DC2626' },
];

// ── Decorative orb ──────────────────────────────────────
const Orb: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

// ── Application Card ──────────────────────────────────────────────────────────
interface CardProps {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const AppCard: React.FC<CardProps> = ({ app, onEdit, onDelete }) => {
  const col = COLUMNS.find((c) => c.id === app.status)!;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: app.id,
    data: { status: app.status },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        borderLeftColor: col.color,
      }}
      {...attributes}
      {...listeners}
      className="group bg-white rounded-xl border border-[#EEECE8] border-l-4 p-4 cursor-grab select-none relative overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Subtle accent wash on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{ background: `radial-gradient(circle at 0% 0%, ${col.color}0C 0%, transparent 60%)` }}
      />

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-0.5 p-0.5 bg-white/95 backdrop-blur-sm rounded-lg border border-[#EEECE8] opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(app); }}
          className="p-1 rounded-md text-[#9CA3AF] hover:text-[#2D52E0] hover:bg-[#EEF2FF] transition-all"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
          className="p-1 rounded-md text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Card content */}
      <div className="pr-6 relative">
        <p className="font-bold text-sm text-[#0D0F17] mb-0.5 line-clamp-1" style={{ fontFamily: 'Sora, sans-serif' }}>
          {app.company}
        </p>
        <p className="text-xs text-[#6B7180] line-clamp-1">{app.role}</p>
      </div>

      {app.notes && (
        <p className="mt-2.5 text-xs text-[#9CA3AF] line-clamp-2 relative">
          {app.notes}
        </p>
      )}

      <div className="flex items-center gap-1 mt-3 relative">
        <Calendar size={11} className="text-[#C4C0BC]" />
        <span className="text-[0.72rem] text-[#C4C0BC] font-medium">
          {format(new Date(app.applied_date), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );
};

// ── Kanban Column ─────────────────────────────────────────────────────────────
interface ColumnProps {
  colId: ApplicationStatus;
  label: string;
  color: string;
  bgColor: string;
  applications: Application[];
  onAdd: (status: ApplicationStatus) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const KanbanColumn: React.FC<ColumnProps> = ({
  colId, label, color, bgColor, applications, onAdd, onEdit, onDelete,
}) => {
  const { setNodeRef } = useDroppable({ id: colId });

  return (
    <div
      className="w-[82vw] sm:w-[300px] shrink-0 rounded-2xl flex flex-col gap-3 max-h-[calc(100vh-160px)] overflow-hidden"
      style={{ backgroundColor: bgColor, border: `1px solid ${color}22` }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span
            className="text-xs font-extrabold tracking-wide"
            style={{ color, fontFamily: 'Sora, sans-serif' }}
          >
            {label}
          </span>
          <div
            className="min-w-5 h-5 px-1.5 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${color}1A` }}
          >
            <span className="text-[0.7rem] font-bold" style={{ color, lineHeight: 1 }}>
              {applications.length}
            </span>
          </div>
        </div>

        <button
          onClick={() => onAdd(colId)}
          title={`Add to ${label}`}
          className="p-1 rounded-md border transition-all hover:bg-white hover:shadow-md"
          style={{ borderColor: `${color}33`, color, backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto flex flex-col gap-3 px-3 pb-3"
      >
        <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <AppCard key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 gap-2">
            <Inbox size={28} style={{ color: `${color}40` }} />
            <span className="text-xs font-medium" style={{ color: `${color}60` }}>
              Drop here
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const {
    applications, loading, error,
    createApplication, updateApplication, updateApplicationStatus, deleteApplication,
  } = useApplications();

  const [localApps, setLocalApps] = useState<Application[] | null>(null);
  const displayApps = localApps ?? applications;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>('Applied');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; appId: string | null }>({
    open: false,
    appId: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const filtered = useMemo(
    () =>
      displayApps.filter(
        (a) =>
          !search ||
          a.company.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase())
      ),
    [displayApps, search]
  );

  const groupedByStatus = useMemo(
    () =>
      COLUMNS.reduce<Record<ApplicationStatus, Application[]>>(
        (acc, col) => {
          acc[col.id] = filtered.filter((a) => a.status === col.id);
          return acc;
        },
        {} as Record<ApplicationStatus, Application[]>
      ),
    [filtered]
  );

  const getColumnOfItem = (id: string): ApplicationStatus | null => {
    const col = COLUMNS.find((c) => c.id === id);
    if (col) return col.id;
    const app = displayApps.find((a) => a.id === id);
    return app?.status ?? null;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    setLocalApps(applications);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;
    const activeStatus = getColumnOfItem(activeId);
    const overStatus = getColumnOfItem(overId);
    if (!activeStatus || !overStatus) return;

    setLocalApps((prev) => {
      const apps = prev ?? applications;
      if (activeStatus === overStatus) {
        const colApps = apps.filter((a) => a.status === activeStatus);
        const oldIndex = colApps.findIndex((a) => a.id === activeId);
        const newIndex = colApps.findIndex((a) => a.id === overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return apps;
        const reordered = arrayMove(colApps, oldIndex, newIndex);
        return apps.filter((a) => a.status !== activeStatus).concat(reordered);
      } else {
        const activeApp = apps.find((a) => a.id === activeId);
        if (!activeApp) return apps;
        const updatedActive = { ...activeApp, status: overStatus };
        const overIsColumn = COLUMNS.some((c) => c.id === overId);
        let newApps = apps.filter((a) => a.id !== activeId);
        if (overIsColumn) {
          newApps = [...newApps, updatedActive];
        } else {
          const overIndex = newApps.findIndex((a) => a.id === overId);
          newApps.splice(overIndex + 1, 0, updatedActive);
        }
        return newApps;
      }
    });
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) { setLocalApps(null); return; }
    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) { setLocalApps(null); return; }
    const newStatus = getColumnOfItem(over.id as string);
    if (!newStatus) { setLocalApps(null); return; }
    if (newStatus !== activeApp.status) {
      try {
        await updateApplicationStatus(activeApp.id, newStatus);
        setSnackbar({ open: true, message: `Moved to ${newStatus}` });
      } catch {
        setLocalApps(null);
        setSnackbar({ open: true, message: 'Failed to update status' });
        return;
      }
    }
    setLocalApps(null);
  };

  const handleAdd = (status: ApplicationStatus) => {
    setEditingApp(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: ApplicationInsert) => {
    if (editingApp) {
      await updateApplication(editingApp.id, data);
      setSnackbar({ open: true, message: 'Application updated!' });
    } else {
      await createApplication(data);
      setSnackbar({ open: true, message: 'Application added!' });
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, appId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.appId) return;
    await deleteApplication(confirmDialog.appId);
    setConfirmDialog({ open: false, appId: null });
    setSnackbar({ open: true, message: 'Application deleted' });
  };

  const activeApp = activeId ? displayApps.find((a) => a.id === activeId) ?? null : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FAFAF8]">
        <div
          className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: '#2D52E0', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAFAF8]">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="relative shrink-0 bg-white border-b border-[#EEECE8] overflow-hidden">
        {/* Decorative orbs — mirrors the landing page blobs, kept subtle */}
        <Orb style={{
          top: '-80%', right: '-5%', width: 340, height: 340,
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <Orb style={{
          top: '-60%', left: '-4%', width: 260, height: 260,
          background: 'radial-gradient(circle, rgba(45,82,224,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div className="relative z-10 px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Brand + title */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                boxShadow: '0 2px 8px rgba(45,82,224,0.28)',
              }}
            >
              <Briefcase className="text-white w-4 h-4" />
            </div>
            <div>
              <h1
                className="text-lg font-extrabold text-[#0D0F17] leading-none tracking-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Job Board
              </h1>
              <p className="text-[0.78rem] text-[#9CA3AF] mt-0.5">
                {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search company or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-[#FAFAF8] border border-[#EEECE8] rounded-lg text-sm text-[#0D0F17] placeholder-[#C4C0BC] focus:outline-none focus:ring-2 focus:ring-[#2D52E0]/25 focus:border-[#2D52E0] transition-all"
              />
            </div>

            {/* Add button — matches landing page CTA style */}
            <button
              onClick={() => handleAdd('Applied')}
              className="h-9 px-4 text-sm font-bold text-white rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #2D52E0 0%, #7C3AED 100%)',
                boxShadow: '0 2px 10px rgba(45,82,224,0.28)',
              }}
            >
              <Plus size={15} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-5 sm:mx-7 mt-4 p-3.5 bg-[#FEF2F2] border border-[#DC2626]/20 rounded-xl text-[#B91C1C] text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── Kanban Board ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-h-full items-start">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                colId={col.id}
                label={col.label}
                color={col.color}
                bgColor={col.bgColor}
                applications={groupedByStatus[col.id]}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
            {activeApp && (
              <div className="opacity-95 rotate-2 scale-[1.02] shadow-2xl rounded-xl cursor-grabbing">
                <AppCard app={activeApp} onEdit={() => {}} onDelete={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* ── Application Form Dialog ───────────────────────────────────────── */}
      <ApplicationFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingApp(null); }}
        onSubmit={handleSubmit}
        initialData={editingApp}
        defaultStatus={defaultStatus}
      />

      {/* ── Confirm Delete Dialog ─────────────────────────────────────────── */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0D0F17]/40 backdrop-blur-sm"
            onClick={() => setConfirmDialog({ open: false, appId: null })}
          />
          {/* Panel — matches landing page CTA card style */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-7 border border-[#EEECE8]"
            style={{ boxShadow: '0 8px 32px rgba(13,15,23,0.12), 0 2px 8px rgba(13,15,23,0.06)' }}
          >
            {/* Accent orb */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 65%)',
                transform: 'translate(30%, -30%)',
              }}
            />
            <div className="relative">
              <h3
                className="text-lg font-extrabold text-[#0D0F17] mb-1.5 tracking-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Delete Application
              </h3>
              <p className="text-sm text-[#6B7180] leading-relaxed mb-7">
                Are you sure you want to delete this application? This action cannot be undone.
              </p>
              <div className="flex gap-2.5 justify-end">
                <button
                  onClick={() => setConfirmDialog({ open: false, appId: null })}
                  className="px-4 py-2 text-sm font-semibold text-[#6B7180] bg-[#F5F4F1] hover:bg-[#EEECE8] rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-bold text-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    boxShadow: '0 2px 8px rgba(220,38,38,0.28)',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Snackbar ──────────────────────────────────────────────────────── */}
      {snackbar.open && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className="px-4 py-3 text-white rounded-xl shadow-xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #0D0F17 0%, #1a1d2e 100%)',
              boxShadow: '0 4px 16px rgba(13,15,23,0.25)',
            }}
          >
            {snackbar.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;