import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import {
  FaGlobe,
  FaGear,
  FaChevronDown,
  FaPlus,
  FaEye,
  FaPenToSquare,
  FaTrash,
  FaDesktop,
  FaRocket,
  FaRotateLeft,
  FaXmark,
  FaCheck,
} from 'react-icons/fa6';

import { websiteAPI } from '../services/api';

const Websites = () => {
  const navigate = useNavigate();

  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [editingWebsite, setEditingWebsite] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    domain: '',
    description: '',
    category: 'E-commerce',
  });

  const [isPinSet] = useState(
    localStorage.getItem('desktopPin') !== null
  );

  const categories = [
    'E-commerce',
    'Blog',
    'Portfolio',
    'Business',
    'Restaurant',
    'Other',
  ];

  // =====================================================
  // LOAD WEBSITES
  // =====================================================

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await websiteAPI.getAll();

      setWebsites(data.websites || []);
    } catch (error) {
      console.error('Fetch websites error:', error);
      setError(error.message || 'Failed to load websites');
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VIEW WEBSITE
  // =====================================================

  const handleView = (website) => {
    const savedStore = JSON.parse(
      localStorage.getItem('store') || 'null'
    );

    const storeSlug =
      savedStore?.slug ||
      localStorage.getItem('storeSlug') ||
      website.storeSlug ||
      website.store?.slug;

    if (!storeSlug) {
      alert('Store URL not found. Please login again.');
      return;
    }

    window.open(
      `/store/${storeSlug}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleEdit = (website) => {
    setEditingWebsite(website);

    setEditForm({
      name: website.name || '',
      domain: website.domain || '',
      description: website.description || '',
      category: website.category || 'E-commerce',
    });
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {
    if (actionLoading) return;

    setEditingWebsite(null);

    setEditForm({
      name: '',
      domain: '',
      description: '',
      category: 'E-commerce',
    });
  };

  // =====================================================
  // EDIT INPUT
  // =====================================================

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = async () => {
    if (!editingWebsite) return;

    if (!editForm.name.trim()) {
      alert('Website name is required.');
      return;
    }

    try {
      setActionLoading(true);

      const data = await websiteAPI.update(
        editingWebsite._id,
        {
          name: editForm.name.trim(),
          domain: editForm.domain.trim(),
          description: editForm.description.trim(),
          category: editForm.category,
        }
      );

      setWebsites((previous) =>
        previous.map((website) =>
          website._id === editingWebsite._id
            ? data.website
            : website
        )
      );

      setEditingWebsite(null);

      alert('Website updated successfully. ✅');
    } catch (error) {
      console.error('Update website error:', error);
      alert(error.message || 'Failed to update website');
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (website) => {
    if (!website?._id) {
      alert('Website ID not found.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${website.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await websiteAPI.delete(website._id);

      setWebsites((previous) =>
        previous.filter(
          (item) => item._id !== website._id
        )
      );

      alert('Website deleted successfully. 🗑️');
    } catch (error) {
      console.error('Delete website error:', error);
      alert(error.message || 'Failed to delete website');
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // PUBLISH
  // =====================================================

  const handlePublish = async (website) => {
    if (!website?._id) {
      alert('Website ID not found.');
      return;
    }

    try {
      setActionLoading(true);

      const data = await websiteAPI.publish(
        website._id
      );

      setWebsites((previous) =>
        previous.map((item) =>
          item._id === website._id
            ? data.website
            : item
        )
      );

      alert('Website published successfully. 🚀');
    } catch (error) {
      console.error('Publish website error:', error);
      alert(error.message || 'Failed to publish website');
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // UNPUBLISH
  // =====================================================

  const handleUnpublish = async (website) => {
    if (!website?._id) {
      alert('Website ID not found.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to unpublish this website?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const data = await websiteAPI.unpublish(
        website._id
      );

      setWebsites((previous) =>
        previous.map((item) =>
          item._id === website._id
            ? data.website
            : item
        )
      );

      alert('Website unpublished successfully.');
    } catch (error) {
      console.error('Unpublish website error:', error);
      alert(
        error.message ||
          'Failed to unpublish website'
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">

      <Sidebar />

      <main className="flex-1 flex flex-col">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">

          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate('/create-website')
              }
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <FaPlus />
              Create Website
            </button>

            <button
              onClick={() =>
                navigate('/settings')
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              <FaGear />
              Settings
            </button>

            {isPinSet && (
              <button
                onClick={() =>
                  navigate('/workspace')
                }
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                <FaDesktop />
                Desktop
              </button>
            )}

          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            User
            <FaChevronDown />
          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-6 flex-1 overflow-y-auto">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h1 className="text-2xl font-bold text-gray-800">
                My Websites
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {websites.length}{' '}
                {websites.length === 1
                  ? 'website'
                  : 'websites'}
              </p>

            </div>

            <button
              onClick={() =>
                navigate('/create-website')
              }
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <FaPlus />
              New Website
            </button>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="bg-white p-10 rounded-xl text-center shadow-sm">

              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-gray-500">
                Loading websites...
              </p>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 p-5 rounded-xl">

              <p className="text-red-600 text-sm">
                {error}
              </p>

              <button
                onClick={fetchWebsites}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            websites.length === 0 && (

              <div className="bg-white p-10 rounded-xl text-center shadow-sm">

                <FaGlobe className="text-5xl text-gray-300 mx-auto mb-4" />

                <h3 className="text-lg font-semibold text-gray-700">
                  No websites yet
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Create your first website to get started
                </p>

                <button
                  onClick={() =>
                    navigate('/create-website')
                  }
                  className="mt-4 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"
                >
                  Create Website
                </button>

              </div>
            )}

          {/* =================================================
              WEBSITE CARDS
          ================================================= */}

          {!loading &&
            !error &&
            websites.length > 0 && (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {websites.map((site) => {

                  const isPublished =
                    site.status === 'Published';

                  return (
                    <div
                      key={site._id}
                      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
                    >

                      {/* ICON + STATUS */}

                      <div className="flex justify-between items-start mb-3">

                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xl">
                          <FaGlobe />
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {site.status || 'Draft'}
                        </span>

                      </div>

                      {/* NAME */}

                      <h3 className="font-semibold text-gray-800 text-lg">
                        {site.name}
                      </h3>

                      {/* DOMAIN */}

                      <p className="text-sm text-gray-500 mb-4">
                        {site.domain || 'No domain'}
                      </p>

                      {/* STATS */}

                      <div className="flex justify-between text-sm text-gray-600 mb-4 border-t border-b py-2">

                        <span>
                          📦 {site.products || 0} Products
                        </span>

                        <span>
                          🛒 {site.orders || 0} Orders
                        </span>

                      </div>

                      {/* MAIN BUTTONS */}

                      <div className="grid grid-cols-3 gap-2">

                        <button
                          onClick={() =>
                            handleView(site)
                          }
                          disabled={actionLoading}
                          className="py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 disabled:opacity-50"
                        >
                          <FaEye className="inline mr-1" />
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleEdit(site)
                          }
                          disabled={actionLoading}
                          className="py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FaPenToSquare className="inline mr-1" />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(site)
                          }
                          disabled={actionLoading}
                          className="py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 disabled:opacity-50"
                        >
                          <FaTrash className="inline mr-1" />
                          Delete
                        </button>

                      </div>

                      {/* PUBLISH */}

                      {isPublished ? (

                        <button
                          onClick={() =>
                            handleUnpublish(site)
                          }
                          disabled={actionLoading}
                          className="w-full mt-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 disabled:opacity-50"
                        >
                          <FaRotateLeft className="inline mr-1" />

                          {actionLoading
                            ? 'Working...'
                            : 'Unpublish'}
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            handlePublish(site)
                          }
                          disabled={actionLoading}
                          className="w-full mt-3 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 disabled:opacity-50"
                        >
                          <FaRocket className="inline mr-1" />

                          {actionLoading
                            ? 'Publishing...'
                            : 'Publish Website'}
                        </button>

                      )}

                    </div>
                  );
                })}

              </div>
            )}

        </div>
      </main>

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingWebsite && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">

            {/* MODAL HEADER */}

            <div className="px-6 py-5 border-b flex justify-between items-center">

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Edit Website
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update your website details
                </p>

              </div>

              <button
                onClick={closeEdit}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500"
              >
                <FaXmark />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-6 space-y-5">

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Name
                </label>

                <input
                  type="text"
                  name="domain"
                  value={editForm.domain}
                  onChange={handleEditChange}
                  placeholder="example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-primary"
                />

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="px-6 py-5 border-t bg-gray-50 flex justify-end gap-3">

              <button
                onClick={closeEdit}
                disabled={actionLoading}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                disabled={
                  actionLoading ||
                  !editForm.name.trim()
                }
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {actionLoading ? (
                  'Saving...'
                ) : (
                  <>
                    <FaCheck className="inline mr-1" />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Websites;