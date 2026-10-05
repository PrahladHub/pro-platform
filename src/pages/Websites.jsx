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
} from 'react-icons/fa6';

import { websiteAPI } from '../services/api';


const Websites = () => {
  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [websites, setWebsites] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [actionLoading, setActionLoading] =
    useState(false);


  const [isPinSet] = useState(
    localStorage.getItem('desktopPin') !== null
  );


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


      /*
        Backend currently returns the websites array
        directly.

        This also supports an object response such as:
        { websites: [...] }
      */

      const websiteList = Array.isArray(data)
        ? data
        : data?.websites || [];


      setWebsites(websiteList);


    } catch (error) {
      console.error(
        'Fetch websites error:',
        error
      );

      setError(
        error.message ||
          'Failed to load websites'
      );


    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // VIEW WEBSITE
  // =====================================================

  const handleView = (website) => {
    let savedStore = null;


    try {
      savedStore = JSON.parse(
        localStorage.getItem('store') || 'null'
      );
    } catch {
      savedStore = null;
    }


    const storeSlug =
      savedStore?.slug ||
      localStorage.getItem('storeSlug') ||
      website?.storeSlug ||
      website?.store?.slug;


    if (!storeSlug) {
      alert(
        'Store URL not found. Please login again.'
      );

      return;
    }


    window.open(
      `/store/${storeSlug}`,
      '_blank',
      'noopener,noreferrer'
    );
  };


  // =====================================================
  // OPEN WEBSITE EDITOR
  // =====================================================

  const handleEdit = (website) => {
    if (!website?._id) {
      alert('Website ID not found.');
      return;
    }


    /*
      IMPORTANT:

      Edit no longer opens the old popup.

      It opens the new Website Editor.
    */

    navigate(
      `/websites/edit/${website._id}`
    );
  };


  // =====================================================
  // DELETE WEBSITE
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


      await websiteAPI.delete(
        website._id
      );


      setWebsites((previous) =>
        previous.filter(
          (item) =>
            item._id !== website._id
        )
      );


      alert(
        'Website deleted successfully. 🗑️'
      );


    } catch (error) {
      console.error(
        'Delete website error:',
        error
      );


      alert(
        error.message ||
          'Failed to delete website'
      );


    } finally {
      setActionLoading(false);
    }
  };


  // =====================================================
  // PUBLISH WEBSITE
  // =====================================================

  const handlePublish = async (website) => {
    if (!website?._id) {
      alert('Website ID not found.');
      return;
    }


    try {
      setActionLoading(true);


      const data =
        await websiteAPI.publish(
          website._id
        );


      const updatedWebsite =
        data.website || data;


      setWebsites((previous) =>
        previous.map((item) =>
          item._id === website._id
            ? updatedWebsite
            : item
        )
      );


      alert(
        'Website published successfully. 🚀'
      );


    } catch (error) {
      console.error(
        'Publish website error:',
        error
      );


      alert(
        error.message ||
          'Failed to publish website'
      );


    } finally {
      setActionLoading(false);
    }
  };


  // =====================================================
  // UNPUBLISH WEBSITE
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


      const data =
        await websiteAPI.unpublish(
          website._id
        );


      const updatedWebsite =
        data.website || data;


      setWebsites((previous) =>
        previous.map((item) =>
          item._id === website._id
            ? updatedWebsite
            : item
        )
      );


      alert(
        'Website unpublished successfully.'
      );


    } catch (error) {
      console.error(
        'Unpublish website error:',
        error
      );


      alert(
        error.message ||
          'Failed to unpublish website'
      );


    } finally {
      setActionLoading(false);
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex h-screen bg-gray-50">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      <main className="flex-1 flex flex-col">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">


          <div className="flex gap-3">


            {/* CREATE WEBSITE */}

            <button
              onClick={() =>
                navigate('/create-website')
              }
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <FaPlus />

              Create Website
            </button>


            {/* SETTINGS */}

            <button
              onClick={() =>
                navigate('/settings')
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              <FaGear />

              Settings
            </button>


            {/* DESKTOP */}

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


          {/* USER */}

          <div className="flex items-center gap-2 text-sm text-gray-700">

            User

            <FaChevronDown />

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-6 flex-1 overflow-y-auto">


          {/* PAGE HEADER */}

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


            {/* NEW WEBSITE */}

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

              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />


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
                          {site.status ||
                            'Draft'}
                        </span>


                      </div>


                      {/* NAME */}

                      <h3 className="font-semibold text-gray-800 text-lg">
                        {site.name}
                      </h3>


                      {/* DOMAIN */}

                      <p className="text-sm text-gray-500 mb-4">
                        {site.domain ||
                          'No domain'}
                      </p>


                      {/* STATS */}

                      <div className="flex justify-between text-sm text-gray-600 mb-4 border-t border-b py-2">

                        <span>
                          📦 {site.products || 0}{' '}
                          Products
                        </span>


                        <span>
                          🛒 {site.orders || 0}{' '}
                          Orders
                        </span>

                      </div>


                      {/* MAIN BUTTONS */}

                      <div className="grid grid-cols-3 gap-2">


                        {/* VIEW */}

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


                        {/* EDIT */}

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


                        {/* DELETE */}

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


                      {/* PUBLISH / UNPUBLISH */}

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

    </div>
  );
};


export default Websites;