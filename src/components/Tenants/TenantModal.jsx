import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTenant, updateTenant } from '../../store/slices/tenantSlice';
import { X } from 'lucide-react';

const TenantModal = ({ isOpen, onClose, tenant, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    domain: '',
    plan: 'FREE',
    orgAdminEmail: '',
    orgAdminPassword: '',
    orgAdminFirstName: '',
    orgAdminLastName: '',
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        subdomain: tenant.subdomain || '',
        domain: tenant.domain || '',
        plan: tenant.subscription?.plan || 'FREE',
        orgAdminEmail: '',
        orgAdminPassword: '',
        orgAdminFirstName: '',
        orgAdminLastName: '',
      });
    } else {
      setFormData({
        name: '',
        subdomain: '',
        domain: '',
        plan: 'FREE',
        orgAdminEmail: '',
        orgAdminPassword: '',
        orgAdminFirstName: '',
        orgAdminLastName: '',
      });
    }
  }, [tenant, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tenant) {
      // Update existing tenant
      await dispatch(updateTenant({
        id: tenant._id,
        tenantData: {
          name: formData.name,
          subdomain: formData.subdomain,
          domain: formData.domain,
          subscription: {
            plan: formData.plan
          }
        }
      }));
    } else {
      // Create new tenant
      if (!formData.orgAdminEmail || !formData.orgAdminPassword || !formData.orgAdminFirstName || !formData.orgAdminLastName) {
        alert('Please fill in all Org Admin details');
        return;
      }

      await dispatch(createTenant({
        name: formData.name,
        subdomain: formData.subdomain,
        domain: formData.domain,
        plan: formData.plan,
        orgAdminEmail: formData.orgAdminEmail,
        orgAdminPassword: formData.orgAdminPassword,
        orgAdminFirstName: formData.orgAdminFirstName,
        orgAdminLastName: formData.orgAdminLastName,
      }));
    }
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {tenant ? 'Edit Tenant' : 'Create New Tenant'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Tenant Information */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tenant Information</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="label">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input text-sm"
                  placeholder="Acme Corporation"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="label">
                    Subdomain *
                  </label>
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    required
                    disabled={!!tenant}
                    className="input text-sm"
                    placeholder="acme"
                    pattern="[a-z0-9-]+"
                    title="Lowercase letters, numbers, and hyphens only"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {tenant ? 'Subdomain cannot be changed' : 'Lowercase letters, numbers, and hyphens only'}
                  </p>
                </div>

                <div>
                  <label className="label">
                    Domain (Optional)
                  </label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                  className="input text-sm"
                  placeholder="acme.com"
                />
              </div>
            </div>

              <div>
                <label className="label">Plan *</label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  required
                  className="input text-sm"
                >
                  <option value="FREE">Free</option>
                  <option value="BASIC">Basic</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Org Admin Information (only for new tenants) */}
          {!tenant && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Organization Admin</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Create the first admin user for this organization
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="orgAdminFirstName"
                      value={formData.orgAdminFirstName}
                      onChange={handleChange}
                      required
                      className="input text-sm"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="orgAdminLastName"
                      value={formData.orgAdminLastName}
                      onChange={handleChange}
                      required
                      className="input text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="orgAdminEmail"
                    value={formData.orgAdminEmail}
                    onChange={handleChange}
                    required
                    className="input text-sm"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="label">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="orgAdminPassword"
                    value={formData.orgAdminPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="input text-sm"
                    placeholder="Min 8 characters"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The Org Admin will use this to login
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {tenant ? 'Update' : 'Create'} Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantModal;

