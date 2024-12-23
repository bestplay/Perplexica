"use client";

import { useState, useEffect, Fragment } from 'react';
import { toast, Toaster } from 'sonner';
import { Dialog, Transition } from '@headlessui/react';
import { Settings } from 'lucide-react';

// 定义 FocusMode 接口类型
interface FocusMode {
  name: string;
  desc?: string;
  api: string;
}

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/focusmode`;

const FocusModes = () => {
  const [focusModes, setFocusModes] = useState<FocusMode[]>([]);
  const [newFocusMode, setNewFocusMode] = useState<FocusMode>({ name: '', desc: '', api: '' });
  const [editingFocusMode, setEditingFocusMode] = useState<FocusMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchFocusModes = async () => {
      setLoading(true);
      try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        setFocusModes(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch focus modes.');
        toast.error('Failed to fetch focus modes.');
      } finally {
        setLoading(false);
      }
    };

    fetchFocusModes();
  }, []);

  const handleAddOrUpdateFocusMode = async () => {
    setLoading(true);
    if (editingFocusMode) {
      try {
        const response = await fetch(`${baseUrl}/${editingFocusMode.name}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFocusMode),
        });
        const updatedFocusModes = await response.json();
        setFocusModes(updatedFocusModes);
        toast.success('Focus mode updated successfully!');
      } catch (err) {
        setError('Failed to save focus mode.');
        toast.error('Failed to save focus mode.');
      } finally {
        setLoading(false);
        setModalIsOpen(false);
      }
    } else {
      if (focusModes.some(mode => mode.name === newFocusMode.name)) {
        setLoading(false);
        setError('Focus mode name already exists.');
        toast.error('Focus mode name already exists.');
        return;
      }

      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFocusMode),
        });
        const addedFocusModes = await response.json();
        setFocusModes(addedFocusModes);
        toast.success('Focus mode added successfully!');
      } catch (err) {
        setError('Failed to save focus mode.');
        toast.error('Failed to save focus mode.');
      } finally {
        setLoading(false);
        setModalIsOpen(false);
      }
    }

    setNewFocusMode({ name: '', desc: '', api: '' });
    setEditingFocusMode(null);
    setError(null);
  };

  const handleDeleteFocusMode = async (name: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/${name}`, {
        method: 'DELETE',
      });
      const updatedFocusModes = await response.json();
      setFocusModes(updatedFocusModes);
      toast.success('Focus mode deleted successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to delete focus mode.');
      toast.error('Failed to delete focus mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFocusMode = (mode: FocusMode) => {
    setNewFocusMode(mode);
    setEditingFocusMode(mode);
    setModalIsOpen(true);
  };

  const openModal = () => {
    setNewFocusMode({ name: '', desc: '', api: '' });
    setEditingFocusMode(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setNewFocusMode({ name: '', desc: '', api: '' });
    setEditingFocusMode(null);
    setModalIsOpen(false);
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <Toaster /> {/* 添加 Toaster 组件 */}
      <h1 className="text-3xl font-medium p-2 flex items-center">
        <Settings className="mr-2" /> Focus modes
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {focusModes.map(mode => (
          <div key={mode.name} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{mode.name}</h2>
              <p className="mb-2">{mode.desc}</p>
              <p className="text-sm text-gray-400 mb-4">{mode.api}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => handleEditFocusMode(mode)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Edit
              </button>
              <button onClick={() => handleDeleteFocusMode(mode.name)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={openModal} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-6">
        Add Focus Mode
      </button>
      <Transition show={modalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/50 dark:bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-gray-800 border border-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h2" className="text-xl font-medium leading-6 text-white">
                    {editingFocusMode ? 'Update Focus Mode' : 'Add Focus Mode'}
                  </Dialog.Title>
                  <div className="mt-4 flex flex-col space-y-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newFocusMode.name}
                      onChange={e => setNewFocusMode({ ...newFocusMode, name: e.target.value })}
                      required
                      maxLength={20} // 限制名称长度为20个字符
                      disabled={!!editingFocusMode}  // 在编辑模式下禁用名称输入框
                      className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newFocusMode.desc}
                      onChange={e => setNewFocusMode({ ...newFocusMode, desc: e.target.value })}
                      className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="API"
                      value={newFocusMode.api}
                      onChange={e => setNewFocusMode({ ...newFocusMode, api: e.target.value })}
                      className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={handleAddOrUpdateFocusMode}
                    >
                      {editingFocusMode ? 'Update' : 'Add'}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FocusModes;
