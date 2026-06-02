import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface OrderItem {
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  special_instructions: string;
}

interface CreateOrderModalProps {
  onClose: () => void;
  orderForm: {
    order_type: 'room_service' | 'dine_in' | 'takeaway' | 'bar';
    room_id: string;
    table_id: string;
    guest_id: string;
    booking_id: string;
    special_instructions: string;
  };
  setOrderForm: (form: any) => void;
  orderItems: OrderItem[];
  addItemToOrder: (item: any) => void;
  removeItemFromOrder: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  calculateOrderTotal: () => { subtotal: number; tax: number; service_charge: number; total: number };
  handleCreateOrder: () => void;
  activeBookings?: any[];
  tables?: any[];
  availableMenuItems?: any[];
  menuCategories?: any[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isLoading?: boolean;
}

export const CreateOrderModal = ({
  onClose,
  orderForm,
  setOrderForm,
  orderItems,
  addItemToOrder,
  removeItemFromOrder,
  updateItemQuantity,
  calculateOrderTotal,
  handleCreateOrder,
  activeBookings = [],
  tables = [],
  availableMenuItems = [],
  menuCategories = [],
  selectedCategory,
  setSelectedCategory,
  isLoading = false,
}: CreateOrderModalProps) => {
  const totals = calculateOrderTotal();

  const filteredMenuItems = selectedCategory === 'all'
    ? availableMenuItems
    : availableMenuItems.filter((item: any) => item.category_id === selectedCategory);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-none sm:rounded-2xl shadow-2xl w-full sm:max-w-[95vw] lg:max-w-6xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col border-0 sm:border dark:border-slate-700 sm:my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-slate-700 flex-shrink-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-seafoam-500" />
              <span className="hidden sm:inline">Nouvelle Commande Restaurant</span>
              <span className="sm:hidden">Commande</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left: Order Configuration */}
            <div className="lg:col-span-2 space-y-4">
              {/* Type de commande */}
              <Card className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3">Type de commande</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'room_service', label: 'Service Chambre', shortLabel: 'Chambre' },
                    { value: 'dine_in', label: 'En Salle', shortLabel: 'Salle' },
                    { value: 'takeaway', label: 'À Emporter', shortLabel: 'Emporter' },
                    { value: 'bar', label: 'Bar', shortLabel: 'Bar' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setOrderForm({ ...orderForm, order_type: type.value as any })}
                      className={`px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border-2 transition-colors ${
                        orderForm.order_type === type.value
                          ? 'border-seafoam-500 bg-seafoam-50 dark:bg-seafoam-900/20 text-seafoam-700 dark:text-seafoam-300'
                          : 'border-gray-300 dark:border-slate-600 hover:border-seafoam-300 dark:hover:border-seafoam-700'
                      }`}
                    >
                      <span className="hidden sm:inline">{type.label}</span>
                      <span className="sm:hidden">{type.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sélection chambre/table */}
              {orderForm.order_type === 'room_service' && (
                <Card className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3">Chambre</h3>
                  <select
                    value={orderForm.booking_id}
                    onChange={(e) => {
                      const booking = activeBookings.find(b => b.id === e.target.value);
                      setOrderForm({
                        ...orderForm,
                        booking_id: e.target.value,
                        room_id: booking?.room_id || '',
                        guest_id: booking?.guest_id || '',
                      });
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Sélectionner une chambre...</option>
                    {activeBookings.map((booking: any) => (
                      <option key={booking.id} value={booking.id}>
                        Chambre {booking.room_number} - {booking.guest_name}
                      </option>
                    ))}
                  </select>
                </Card>
              )}

              {orderForm.order_type === 'dine_in' && (
                <Card className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3">Table</h3>
                  <select
                    value={orderForm.table_id}
                    onChange={(e) => setOrderForm({ ...orderForm, table_id: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Sélectionner une table...</option>
                    {tables.map((table: any) => (
                      <option key={table.id} value={table.id}>
                        {table.table_number} ({table.capacity} places)
                      </option>
                    ))}
                  </select>
                </Card>
              )}

              {/* Menu Items */}
              <Card className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Menu</h3>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs sm:text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white w-full sm:w-auto"
                  >
                    <option value="all">Toutes catégories</option>
                    {menuCategories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 max-h-60 sm:max-h-96 overflow-y-auto">
                  {filteredMenuItems.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 py-4">
                      Aucun article disponible
                    </p>
                  ) : (
                    filteredMenuItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{item.name}</p>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm font-semibold text-seafoam-600 dark:text-seafoam-400 mt-0.5 sm:mt-1">
                            {Number(item.price || 0).toFixed(2)}€
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addItemToOrder(item)}
                          className="bg-seafoam-500 hover:bg-seafoam-600 flex-shrink-0"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Instructions spéciales */}
              <Card className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3">Instructions spéciales</h3>
                <textarea
                  value={orderForm.special_instructions}
                  onChange={(e) => setOrderForm({ ...orderForm, special_instructions: e.target.value })}
                  rows={3}
                  placeholder="Allergies, préférences..."
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                />
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
              <Card className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3">Panier ({orderItems.length})</h3>

                {orderItems.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 dark:text-slate-400 py-8">
                    Panier vide
                  </p>
                ) : (
                  <>
                    <div className="space-y-2 sm:space-y-3 mb-4 max-h-48 sm:max-h-64 overflow-y-auto">
                      {orderItems.map((item) => (
                        <div key={item.menu_item_id} className="border dark:border-slate-700 rounded-lg p-2 sm:p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white flex-1 line-clamp-2">
                              {item.item_name}
                            </p>
                            <button
                              onClick={() => removeItemFromOrder(item.menu_item_id)}
                              className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => updateItemQuantity(item.menu_item_id, item.quantity - 1)}
                                className="p-0.5 sm:p-1 rounded border dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.menu_item_id, item.quantity + 1)}
                                className="p-0.5 sm:p-1 rounded border dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-seafoam-600 dark:text-seafoam-400">
                              {(item.unit_price * item.quantity).toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t dark:border-slate-700 pt-3 space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-slate-400">Sous-total</span>
                        <span className="font-medium">{totals.subtotal.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-slate-400">TVA (10%)</span>
                        <span className="font-medium">{totals.tax.toFixed(2)}€</span>
                      </div>
                      {totals.service_charge > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 dark:text-slate-400">Service (15%)</span>
                          <span className="font-medium">{totals.service_charge.toFixed(2)}€</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base sm:text-lg font-bold border-t dark:border-slate-700 pt-2">
                        <span>Total</span>
                        <span className="text-seafoam-600 dark:text-seafoam-400">{totals.total.toFixed(2)}€</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateOrder}
                      disabled={isLoading}
                      className="w-full mt-3 sm:mt-4 bg-seafoam-500 hover:bg-seafoam-600 text-sm sm:text-base"
                    >
                      {isLoading ? 'Création...' : 'Créer la Commande'}
                    </Button>
                  </>
                )}
              </Card>
            </div>
          </div>
          </div>

          <div className="flex justify-end gap-2 sm:gap-3 p-4 sm:p-6 pt-0 sm:pt-0 border-t dark:border-slate-700 flex-shrink-0">
            <Button
              onClick={onClose}
              variant="secondary"
              className="dark:border-slate-600 dark:text-slate-200 text-sm sm:text-base px-3 sm:px-4"
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
