import { Banknote, CreditCard, Smartphone } from 'lucide-react';
import { classNames } from '../../utils/helpers.js';

const PaymentMethod = ({ selected, onChange }) => {
  const methods = [
    { value: 'cash', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
    { value: 'card', label: 'Card Payment', icon: CreditCard, description: 'Debit or Credit card' },
    { value: 'online', label: 'Online Payment', icon: Smartphone, description: 'JazzCash, Easypaisa' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-3">
        Payment Method
      </label>
      <div className="grid gap-3">
        {methods.map((method) => (
          <button
            key={method.value}
            type="button"
            onClick={() => onChange(method.value)}
            className={classNames(
              'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
              selected === method.value
                ? 'border-primary bg-primary/10'
                : 'border-dark-lighter hover:border-text-muted'
            )}
          >
            <div className={classNames(
              'w-12 h-12 rounded-full flex items-center justify-center',
              selected === method.value ? 'bg-primary text-white' : 'bg-dark-lighter text-text-muted'
            )}>
              <method.icon className="w-6 h-6" />
            </div>
            <div>
              <p className={classNames(
                'font-medium',
                selected === method.value ? 'text-primary' : 'text-white'
              )}>
                {method.label}
              </p>
              <p className="text-text-muted text-sm">{method.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;