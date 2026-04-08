"use client";

import React from 'react';

export default function DeleteConfirmForm({ action, itemName = "this item", children }) {
  return (
    <form 
      action={action} 
      onSubmit={(e) => {
        if (!window.confirm(`Are you sure you want to delete ${itemName}? This action cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}
