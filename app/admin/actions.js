'use server';

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

// User Actions
import { redirect } from 'next/navigation';

import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/session';

export async function incrementResumeView(id) {
  try {
    const user = await getCurrentUser();
    // Real Usage Logic: Only increment if NOT an admin
    if (user?.role === 'admin') return { success: false, reason: 'admin_ignore' };

    await pool.query('UPDATE resumes SET views = views + 1 WHERE id = ?', [id]);
    revalidatePath('/admin/resumes');
    return { success: true };
  } catch (error) {
    console.error('Failed to increment views:', error);
    return { success: false };
  }
}

export async function incrementResumeDownload(id) {
  try {
    const user = await getCurrentUser();
    // Real Usage Logic: Only increment if NOT an admin
    if (user?.role === 'admin') return { success: false, reason: 'admin_ignore' };

    await pool.query('UPDATE resumes SET downloads = downloads + 1 WHERE id = ?', [id]);
    revalidatePath('/admin/resumes');
    return { success: true };
  } catch (error) {
    console.error('Failed to increment downloads:', error);
    return { success: false };
  }
}

export async function createUser(formData) {
  const name = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');
  const status = formData.get('status');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, status]
    );
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user');
  }

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  redirect('/admin/users?success=User+created+successfully');
}

export async function updateUser(id, formData) {
  const name = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');
  const status = formData.get('status');

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?',
        [name, email, hashedPassword, role, status, id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
        [name, email, role, status, id]
      );
    }
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user');
  }

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  redirect('/admin/users?success=User+updated+successfully');
}

export async function deleteUser(id) {
  let isSuccess = false;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    isSuccess = true;
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
  
  if (isSuccess) {
    revalidatePath('/admin/users');
    revalidatePath('/admin');
    redirect('/admin/users?success=User+deleted+successfully');
  }
}

export async function updateUserStatus(id, newStatus) {
  let isSuccess = false;
  try {
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
    isSuccess = true;
  } catch (error) {
    console.error('Failed to update status:', error);
  }
  
  if (isSuccess) {
    revalidatePath('/admin/users');
    redirect('/admin/users?success=Status+updated');
  }
}

// Resume Actions
export async function deleteResume(id) {
  let isSuccess = false;
  try {
    await pool.query('DELETE FROM resumes WHERE id = ?', [id]);
    isSuccess = true;
  } catch (error) {
    console.error('Failed to delete resume:', error);
  }
  
  if (isSuccess) {
    revalidatePath('/admin/resumes');
    revalidatePath('/admin');
    redirect('/admin/resumes?success=Resume+deleted+successfully');
  }
}

// Settings Actions
export async function getSettings() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        key_name VARCHAR(50) PRIMARY KEY,
        value_data TEXT
      )
    `);
    const [rows] = await pool.query('SELECT key_name, value_data FROM platform_settings');
    const settings = rows.reduce((acc, row) => {
      acc[row.key_name] = row.value_data;
      return acc;
    }, {});
    return settings;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return {};
  }
}

export async function updateSettings(formData) {
  const platformName = formData.get('platformName');
  const supportEmail = formData.get('supportEmail');
  const notifyNewUser = formData.get('notifyNewUser') === 'on' ? 'true' : 'false';
  const weeklyReport = formData.get('weeklyReport') === 'on' ? 'true' : 'false';

  try {
    const settingsToSave = [
      ['platformName', platformName],
      ['supportEmail', supportEmail],
      ['notifyNewUser', notifyNewUser],
      ['weeklyReport', weeklyReport]
    ];

    for (const [key, val] of settingsToSave) {
      if (val !== null) {
        await pool.query(
          'INSERT INTO platform_settings (key_name, value_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_data = ?',
          [key, val, val]
        );
      }
    }
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw new Error('Failed to save settings');
  }

  revalidatePath('/admin/settings');
  revalidatePath('/admin');
  redirect('/admin/settings?success=Settings+saved+successfully');
}

