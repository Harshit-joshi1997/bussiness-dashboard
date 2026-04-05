import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Shield, Trash2, Edit2, Plus, X } from 'lucide-react';
import type { User } from '../store/useStore';

export default function TeamDirectory() {
  const user = useStore((state) => state.user);
  const employees = useStore((state) => state.employees || []);
  const updateEmployeeRole = useStore((state) => state.updateEmployeeRole);
  const removeEmployee = useStore((state) => state.removeEmployee);

  const addEmployee = useStore((state) => state.addEmployee);
  const updateEmployee = useStore((state) => state.updateEmployee);

  const [errorText, setErrorText] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<User>>({});

  if (user?.role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-red-500 mb-4 opacity-50" />
          <h2 className="text-2xl font-bold dark:text-white mb-2">Access Denied</h2>
          <p className="text-zinc-500 dark:text-zinc-400">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  const handleRoleChange = (email: string, currentRole: string | undefined) => {
    if (email === user.email) {
      setErrorText("You cannot change your own role.");
      setTimeout(() => setErrorText(''), 3000);
      return;
    }
    const newRole = currentRole === 'admin' ? 'staff' : 'admin';
    updateEmployeeRole(email, newRole);
  };

  const handleDelete = (email: string) => {
    if (email === user.email) {
      setErrorText("You cannot remove yourself.");
      setTimeout(() => setErrorText(''), 3000);
      return;
    }
    if (window.confirm('Are you sure you want to remove this employee?')) {
      removeEmployee(email);
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', password: '', phone: '', role: 'staff' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (emp: User) => {
    setSelectedEmployee(emp);
    setFormData({ name: emp.name || '', email: emp.email, phone: emp.phone || '', role: emp.role || 'staff' });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employees.some(emp => emp.email === formData.email)) {
      setErrorText('User with this email already exists.');
      setIsAddModalOpen(false);
      setTimeout(() => setErrorText(''), 3000);
      return;
    }
    
    addEmployee(formData as User);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.email, formData);
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white mb-2">Team Directory</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your employees, their roles, and access.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </header>

      {errorText && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {errorText}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="pb-3 font-medium">Employee</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {employees.map((emp) => (
                <tr key={emp.email} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 text-zinc-900 dark:text-zinc-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {emp.name ? emp.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-medium dark:text-white">{emp.name || 'Unnamed User'}</div>
                        {emp.email === user.email && <div className="text-xs text-indigo-500">You</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-600 dark:text-zinc-400 whitespace-normal">
                    <div>{emp.email}</div>
                    {emp.phone && <div className="text-xs">{emp.phone}</div>}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                      {emp.role === 'admin' ? 'Admin' : 'Staff'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button
                         onClick={() => handleRoleChange(emp.email, emp.role)}
                         className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                         title="Change Role"
                       >
                         <Shield size={18} />
                       </button>
                       <button
                         onClick={() => openEditModal(emp)}
                         className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                         title="Edit Employee"
                       >
                         <Edit2 size={18} />
                       </button>
                       <button
                         onClick={() => handleDelete(emp.email)}
                         className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                         title="Remove Employee"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">
                {isAddModalOpen ? 'Add New Employee' : 'Edit Employee'}
              </h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Email</label>
                <input
                  type="email"
                  required
                  disabled={isEditModalOpen} // Prevent changing email in edit mode to avoid ID mismatch, since email acts as PK here
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                />
              </div>

              {isAddModalOpen && (
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Role</label>
                <select
                  value={formData.role || 'staff'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent dark:bg-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                >
                  {isAddModalOpen ? 'Add Employee' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
