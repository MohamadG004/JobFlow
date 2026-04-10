// src/services/applicationService.ts
import { supabase } from './supabase';
import type { Application, ApplicationInsert, ApplicationUpdate, ApplicationStatus } from '@/types';

const TABLE = 'applications';

export const applicationService = {
  async getAll(): Promise<Application[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Application[];
  },

  async getById(id: string): Promise<Application> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Application;
  },

  async create(application: ApplicationInsert): Promise<Application> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from(TABLE)
      .insert({ ...application, user_id: user.id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Application;
  },

  async update(id: string, updates: Partial<ApplicationInsert>): Promise<Application> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Application;
  },

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    return this.update(id, { status });
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  subscribeToChanges(
    userId: string,
    onInsert: (app: Application) => void,
    onUpdate: (app: Application) => void,
    onDelete: (id: string) => void
  ) {
    return supabase
      .channel(`applications:user:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: TABLE, filter: `user_id=eq.${userId}` },
        (payload) => onInsert(payload.new as Application)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: TABLE, filter: `user_id=eq.${userId}` },
        (payload) => onUpdate(payload.new as Application)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: TABLE, filter: `user_id=eq.${userId}` },
        (payload) => onDelete(payload.old.id as string)
      )
      .subscribe();
  },
};
