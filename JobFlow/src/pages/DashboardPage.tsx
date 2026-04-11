import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, Chip, CircularProgress, Alert,
  Snackbar, Stack, TextField, InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
  DragOverlay, DragStartEvent, DragOverEvent, closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';   // ← NEW
import { CSS } from '@dnd-kit/utilities';
import { useApplications } from '@/hooks/useApplications';
import ApplicationFormDialog from '@/components/board/ApplicationFormDialog';
import type { Application, ApplicationStatus, ApplicationInsert } from '@/types';
import { format } from 'date-fns';

// ── Column config ─────────────────────────────────────────────────────────────
const COLUMNS: { id: ApplicationStatus; label: string; color: string; bg: string }[] = [
  { id: 'Applied',   label: 'Applied',   color: '#2563EB', bg: '#EFF6FF' },
  { id: 'Interview', label: 'Interview', color: '#D97706', bg: '#FFFBEB' },
  { id: 'Offer',     label: 'Offer',     color: '#059669', bg: '#ECFDF5' },
  { id: 'Rejected',  label: 'Rejected',  color: '#DC2626', bg: '#FEF2F2' },
];

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
    data: { status: app.status },   // ← expose status so onDragOver can read it
  });

  return (
    <Box
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
      sx={{
        bgcolor: 'background.paper', borderRadius: 2, p: 2,
        border: '1px solid', borderColor: 'divider',
        cursor: 'grab', userSelect: 'none',
        '&:hover': { boxShadow: 3, borderColor: col.color },
        transition: 'box-shadow 0.15s, border-color 0.15s',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={700} noWrap sx={{ mb: 0.25 }}>{app.company}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{app.role}</Typography>
        </Box>
        <Stack direction="row" spacing={0.25} sx={{ ml: 1, flexShrink: 0 }}>
          <Box
            component="button"
            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
            sx={{
              border: 'none', bgcolor: 'transparent', cursor: 'pointer',
              p: 0.5, borderRadius: 1, color: 'text.secondary', display: 'flex',
              '&:hover': { color: 'primary.main', bgcolor: '#EFF6FF' },
            }}
          >
            <EditRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box
            component="button"
            onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
            sx={{
              border: 'none', bgcolor: 'transparent', cursor: 'pointer',
              p: 0.5, borderRadius: 1, color: 'text.secondary', display: 'flex',
              '&:hover': { color: 'error.main', bgcolor: '#FEF2F2' },
            }}
          >
            <DeleteRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1.5 }}>
        <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
        <Typography variant="caption" color="text.disabled">
          {format(new Date(app.applied_date), 'MMM d, yyyy')}
        </Typography>
      </Stack>

      {app.notes && (
        <Typography
          variant="caption" color="text.secondary"
          sx={{
            mt: 1, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5,
          }}
        >
          {app.notes}
        </Typography>
      )}
    </Box>
  );
};

// ── Kanban Column ─────────────────────────────────────────────────────────────
interface ColumnProps {
  colId: ApplicationStatus;
  label: string;
  color: string;
  bg: string;
  applications: Application[];
  onAdd: (status: ApplicationStatus) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const KanbanColumn: React.FC<ColumnProps> = ({
  colId, label, color, bg, applications, onAdd, onEdit, onDelete,
}) => {
  // Make the column itself a drop target so cards can be dropped into empty columns
  const { setNodeRef } = useDroppable({ id: colId });

  return (
    <Box
      sx={{
        minWidth: { xs: '80vw', sm: 280 }, maxWidth: 320,
        flexShrink: 0, flexGrow: 1,
        bgcolor: bg, borderRadius: 3, p: 2,
        display: 'flex', flexDirection: 'column', gap: 1.5,
        border: `1px solid ${color}22`,
        maxHeight: 'calc(100vh - 148px)', overflow: 'hidden',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
          <Typography fontWeight={700} fontSize="0.85rem" sx={{ color }}>{label}</Typography>
          <Chip
            label={applications.length} size="small"
            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, bgcolor: `${color}18`, color }}
          />
        </Stack>
        <Box
          component="button" onClick={() => onAdd(colId)}
          sx={{
            border: 'none', bgcolor: 'transparent', cursor: 'pointer',
            color, p: 0.5, borderRadius: 1, display: 'flex',
            '&:hover': { bgcolor: `${color}18` },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      </Stack>

      {/* ← ref goes on the scrollable card list so the whole column area is droppable */}
      <Box
        ref={setNodeRef}
        sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, pb: 0.5, flex: 1 }}
      >
        <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <AppCard key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <BusinessRoundedIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1, opacity: 0.4 }} />
            <Typography variant="body2" color="text.disabled">No applications</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const {
    applications, loading, error,
    createApplication, updateApplication, updateApplicationStatus, deleteApplication,
  } = useApplications();

  // ── Local optimistic state for drag ordering ──────────────────────────────
  const [localApps, setLocalApps] = useState<Application[] | null>(null);
  const displayApps = localApps ?? applications;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>('Applied');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

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

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getColumnOfItem = (id: string): ApplicationStatus | null => {
    const col = COLUMNS.find((c) => c.id === id);
    if (col) return col.id;
    const app = displayApps.find((a) => a.id === id);
    return app?.status ?? null;
  };

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    // Initialise local state from server state when drag begins
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
        // ── Same-column reorder ──────────────────────────────────────────────
        const colApps = apps.filter((a) => a.status === activeStatus);
        const oldIndex = colApps.findIndex((a) => a.id === activeId);
        const newIndex = colApps.findIndex((a) => a.id === overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return apps;

        const reordered = arrayMove(colApps, oldIndex, newIndex);
        // Rebuild full list preserving order of other columns
        return apps
          .filter((a) => a.status !== activeStatus)
          .concat(reordered);
      } else {
        // ── Cross-column move ────────────────────────────────────────────────
        const activeApp = apps.find((a) => a.id === activeId);
        if (!activeApp) return apps;

        const updatedActive = { ...activeApp, status: overStatus };

        // Insert after the card we're hovering, or at the end of the column
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

    if (!over) {
      setLocalApps(null);   // abort — revert to server state
      return;
    }

    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) { setLocalApps(null); return; }

    const newStatus = getColumnOfItem(over.id as string);
    if (!newStatus) { setLocalApps(null); return; }

    if (newStatus !== activeApp.status) {
      try {
        await updateApplicationStatus(activeApp.id, newStatus);
        setSnackbar({ open: true, message: `Moved to ${newStatus}` });
      } catch {
        setLocalApps(null);   // revert on failure
        setSnackbar({ open: true, message: 'Failed to update status' });
        return;
      }
    }

    // Persist the local order as the new source of truth (clear so server re-syncs)
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this application?')) return;
    await deleteApplication(id);
    setSnackbar({ open: true, message: 'Application deleted' });
  };

  const activeApp = activeId ? displayApps.find((a) => a.id === activeId) ?? null : null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Page Header */}
      <Box
        sx={{
          px: 3, py: 2.5, bgcolor: 'background.paper',
          borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>Job Board</Typography>
            <Typography variant="body2" color="text.secondary">
              {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 220 }}
            />
            <Button
              variant="contained" startIcon={<AddRoundedIcon />}
              onClick={() => handleAdd('Applied')}
            >
              Add Application
            </Button>
          </Stack>
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mx: 3, mt: 2 }}>{error}</Alert>}

      {/* Kanban Board */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}    // ← NEW
          onDragEnd={handleDragEnd}
        >
          <Stack direction="row" spacing={2} sx={{ minHeight: '100%', alignItems: 'flex-start' }}>
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                colId={col.id}
                label={col.label}
                color={col.color}
                bg={col.bg}
                applications={groupedByStatus[col.id]}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Stack>

          <DragOverlay>
            {activeApp && (
              <Box sx={{ opacity: 0.9, transform: 'rotate(2deg)', boxShadow: 6, borderRadius: 2 }}>
                <AppCard app={activeApp} onEdit={() => {}} onDelete={() => {}} />
              </Box>
            )}
          </DragOverlay>
        </DndContext>
      </Box>

      {/* Add / Edit Dialog */}
      <ApplicationFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingApp(null); }}
        onSubmit={handleSubmit}
        initialData={editingApp}
        defaultStatus={defaultStatus}
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default DashboardPage;