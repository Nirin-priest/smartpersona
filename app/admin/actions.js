'use server';

import pool from './lib/db';
import { revalidatePath } from 'next/cache';

// User Actions
import { redirect } from 'next/navigation';

export async function createUser(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const role = formData.get('role');
  const status = formData.get('status');

  try {
    await pool.query(
      'INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)',
      [name, email, role, status]
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
  const name = formData.get('name');
  const email = formData.get('email');
  const role = formData.get('role');
  const status = formData.get('status');

  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [name, email, role, status, id]
    );
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
