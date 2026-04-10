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
  DragOverlay, DragStartEvent, closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
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
}) => (
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

    <Box sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, pb: 0.5 }}>
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

// ── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const {
    applications, loading, error,
    createApplication, updateApplication, updateApplicationStatus, deleteApplication,
  } = useApplications();

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
      applications.filter(
        (a) =>
          !search ||
          a.company.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase())
      ),
    [applications, search]
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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;

    const app = applications.find((a) => a.id === active.id);
    if (!app) return;

    // Dropped on a column header or another card — determine target status
    const columnMatch = COLUMNS.find((c) => c.id === over.id);
    const cardMatch = applications.find((a) => a.id === over.id);
    const newStatus = columnMatch?.id ?? cardMatch?.status;

    if (newStatus && newStatus !== app.status) {
      try {
        await updateApplicationStatus(app.id, newStatus);
        setSnackbar({ open: true, message: `Moved to ${newStatus}` });
      } catch {
        setSnackbar({ open: true, message: 'Failed to update status' });
      }
    }
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

  const activeApp = activeId ? applications.find((a) => a.id === activeId) ?? null : null;

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