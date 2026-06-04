import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Trash2 } from 'lucide-react';

interface OrderItem {
  id?: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  special_instructions?: string;
}

interface Order {
  id: string;
  order_number: string;
  table_id?: string;
  special_instructions?: string;
  order_type: string;
  status: string;
}

interface Table {
  id: string;
  table_number: string;
  capacity: number;
  location: string;
  status: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category_name: string;
}

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  tables: Table[];
  menuItems: MenuItem[];
  onSave: (orderId: string, data: {
    table_id?: string;
    special_instructions?: string;
    items?: OrderItem[];
  }) => Promise<void>;
}

export default function EditOrderModal({
  isOpen,
  onClose,
  order,
  tables,
  menuItems,
  onSave
}: EditOrderModalProps) {
  const [tableId, setTableId] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setTableId(order.table_id || '');
      setSpecialInstructions(order.special_instructions || '');
      // Items would need to be loaded separately
      setItems([]);
    }
  }, [order]);

  const handleSave = async () => {
    if (!order) return;

    setSaving(true);
    try {
      await onSave(order.id, {
        table_id: tableId || undefined,
        special_instructions: specialInstructions || undefined,
        // Only send items if they were modified
        ...(items.length > 0 ? { items } : {})
      });
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setItems([...items, {
      menu_item_id: '',
      item_name: '',
      quantity: 1,
      unit_price: 0,
      special_instructions: ''
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // If menu item changed, update name and price
    if (field === 'menu_item_id') {
      const menuItem = menuItems.find(m => m.id === value);
      if (menuItem) {
        newItems[index].item_name = menuItem.name;
        newItems[index].unit_price = menuItem.price;
      }
    }
    
    setItems(newItems);
  };

  if (!order) return null;

  // Filter available tables (or current table)
  const availableTables = tables.filter(
    t => t.status === 'available' || t.id === order.table_id
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                    Modifier Commande {order.order_number}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Table Selection (for dine-in only) */}
                  {order.order_type === 'dine_in' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Table
                      </label>
                      <select
                        value={tableId}
                        onChange={(e) => setTableId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="">Aucune table</option>
                        {availableTables.map((table) => (
                          <option key={table.id} value={table.id}>
                            Table {table.table_number} - {table.location} (Cap: {table.capacity})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Instructions Spéciales
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={3}
                      placeholder="Allergies, préférences, etc."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white resize-none"
                    />
                  </div>

                  {/* Order Items (optional - advanced editing) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Articles (optionnel)
                      </label>
                      <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <Plus size={16} />
                        Ajouter
                      </button>
                    </div>

                    {items.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {items.map((item, index) => (
                          <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <select
                                value={item.menu_item_id}
                                onChange={(e) => updateItem(index, 'menu_item_id', e.target.value)}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded dark:bg-slate-800 dark:text-white"
                              >
                                <option value="">Sélectionner...</option>
                                {menuItems.map((menuItem) => (
                                  <option key={menuItem.id} value={menuItem.id}>
                                    {menuItem.name} - {menuItem.price}€
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                placeholder="Qté"
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded dark:bg-slate-800 dark:text-white"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {items.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Laisser vide pour conserver les articles actuels
                      </p>
                    )}
                  </div>

                  {/* Status Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Statut actuel:</strong> {order.status}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Pour changer le statut, utilisez les boutons de statut dans la liste des commandes
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t dark:border-slate-700">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg font-medium transition-colors"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
