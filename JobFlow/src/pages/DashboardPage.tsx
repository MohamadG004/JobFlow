import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert,
  Snackbar, Stack, TextField, InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
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
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
      sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '1px solid #EEECE8',
        borderLeft: `3px solid ${col.color}`,
        p: 2,
        cursor: 'grab',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(13,15,23,0.08)',
          transform: 'translateY(-1px)',
          '& .card-actions': { opacity: 1 },
        },
        '&:active': { cursor: 'grabbing', transform: 'translateY(0)' },
      }}
    >
      {/* Action buttons (revealed on hover) */}
      <Stack
        className="card-actions"
        direction="row"
        spacing={0.25}
        sx={{
          position: 'absolute',
          top: 8, right: 8,
          opacity: 0,
          transition: 'opacity 0.15s ease',
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(4px)',
          borderRadius: '8px',
          border: '1px solid #EEECE8',
          p: '2px',
        }}
      >
        <Box
          component="button"
          onClick={(e) => { e.stopPropagation(); onEdit(app); }}
          sx={{
            border: 'none', bgcolor: 'transparent', cursor: 'pointer',
            p: '4px', borderRadius: '6px', color: '#9CA3AF', display: 'flex',
            transition: 'all 0.15s ease',
            '&:hover': { color: '#2D52E0', bgcolor: '#EEF2FF' },
          }}
        >
          <EditRoundedIcon sx={{ fontSize: 14 }} />
        </Box>
        <Box
          component="button"
          onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
          sx={{
            border: 'none', bgcolor: 'transparent', cursor: 'pointer',
            p: '4px', borderRadius: '6px', color: '#9CA3AF', display: 'flex',
            transition: 'all 0.15s ease',
            '&:hover': { color: '#DC2626', bgcolor: '#FEF2F2' },
          }}
        >
          <DeleteRoundedIcon sx={{ fontSize: 14 }} />
        </Box>
      </Stack>

      {/* Card content */}
      <Box sx={{ pr: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: '#0D0F17',
            mb: 0.25,
            lineHeight: 1.3,
          }}
          noWrap
        >
          {app.company}
        </Typography>
        <Typography
          sx={{ fontSize: '0.8rem', color: '#6B7180', fontWeight: 400 }}
          noWrap
        >
          {app.role}
        </Typography>
      </Box>

      {app.notes && (
        <Typography
          sx={{
            mt: 1.25, fontSize: '0.775rem', color: '#9CA3AF', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {app.notes}
        </Typography>
      )}

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5 }}>
        <CalendarTodayRoundedIcon sx={{ fontSize: 11, color: '#C4C0BC' }} />
        <Typography sx={{ fontSize: '0.72rem', color: '#C4C0BC', fontWeight: 500 }}>
          {format(new Date(app.applied_date), 'MMM d, yyyy')}
        </Typography>
      </Stack>
    </Box>
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
    <Box
      sx={{
        minWidth: { xs: '82vw', sm: 275 }, maxWidth: 320,
        flexShrink: 0, flexGrow: 1,
        borderRadius: '16px',
        bgcolor: bgColor,
        border: `1px solid ${color}1A`,
        display: 'flex', flexDirection: 'column', gap: 1.5,
        maxHeight: 'calc(100vh - 144px)',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, pt: 2, pb: 0 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }} />
          <Typography sx={{ fontFamily: '"Sora",sans-serif', fontWeight: 700, fontSize: '0.8rem', color, letterSpacing: '0.01em' }}>
            {label}
          </Typography>
          <Box
            sx={{
              minWidth: 20, height: 18, px: 0.75,
              bgcolor: `${color}18`,
              borderRadius: '5px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color, lineHeight: 1 }}>
              {applications.length}
            </Typography>
          </Box>
        </Stack>

        <Box
          component="button"
          onClick={() => onAdd(colId)}
          title={`Add to ${label}`}
          sx={{
            border: `1px solid ${color}33`,
            bgcolor: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            color, p: '3px', borderRadius: '7px', display: 'flex',
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', boxShadow: `0 2px 6px ${color}22` },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      </Stack>

      {/* Cards area */}
      <Box
        ref={setNodeRef}
        sx={{
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 1.5,
          px: 1.5, pb: 1.5, flex: 1,
        }}
      >
        <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <AppCard key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              py: 5, gap: 1,
            }}
          >
            <InboxRoundedIcon sx={{ fontSize: 28, color: `${color}40` }} />
            <Typography sx={{ fontSize: '0.78rem', color: `${color}60`, fontWeight: 500 }}>
              Drop here
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this application?')) return;
    await deleteApplication(id);
    setSnackbar({ open: true, message: 'Application deleted' });
  };

  const activeApp = activeId ? displayApps.find((a) => a.id === activeId) ?? null : null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={28} thickness={3} sx={{ color: '#2D52E0' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 2,
          bgcolor: '#fff',
          borderBottom: '1px solid #EEECE8',
          flexShrink: 0,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Job Board
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#6B7180', mt: 0.25 }}>
              {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Search company or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 17, color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: '100%', sm: 230 },
                '& .MuiOutlinedInput-root': { height: 38 },
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => handleAdd('Applied')}
              sx={{ whiteSpace: 'nowrap', height: 38, px: 2 }}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2, borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      {/* Kanban Board */}
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, sm: 3 } }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Stack direction="row" spacing={2} sx={{ minHeight: '100%', alignItems: 'flex-start' }}>
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
          </Stack>

          <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
            {activeApp && (
              <Box
                sx={{
                  opacity: 0.96,
                  transform: 'rotate(1.5deg) scale(1.02)',
                  boxShadow: '0 12px 40px rgba(13,15,23,0.16)',
                  borderRadius: '12px',
                  cursor: 'grabbing',
                }}
              >
                <AppCard app={activeApp} onEdit={() => {}} onDelete={() => {}} />
              </Box>
            )}
          </DragOverlay>
        </DndContext>
      </Box>

      {/* Dialog */}
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
        autoHideDuration={2800}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{
          sx: {
            bgcolor: '#0D0F17',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(13,15,23,0.20)',
          },
        }}
      />
    </Box>
  );
};

export default DashboardPage;