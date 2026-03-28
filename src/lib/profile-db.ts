import { supabase } from './supabase';

// Типы данных профиля
export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// Получение профиля пользователя
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { success: false, error };
  }
};

// Обновление профиля пользователя
export const updateUserProfile = async (userId: string, displayName: string, avatarUrl: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { success: false, error };
  }
};

// Создание профиля при регистрации
export const createProfile = async (userId: string, displayName?: string, avatarUrl?: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: displayName || '',
        avatar_url: avatarUrl || '👤'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createProfile:', error);
    return { success: false, error };
  }
};
