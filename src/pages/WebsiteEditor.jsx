import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  FaArrowLeft,
  FaDesktop,
  FaMobileScreen,
  FaFloppyDisk,
  FaEye,
  FaGlobe,
  FaPalette,
  FaFont,
  FaGear,
  FaBars,
  FaXmark,
} from 'react-icons/fa6';

import { websiteAPI } from '../services/api';


const DEFAULT_DESIGN = {
  primaryColor: '#4f46e5',
  backgroundColor: '#ffffff',
  textColor: '#111827',
  font: 'Inter',
};


const WebsiteEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();


  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [activePanel, setActivePanel] =
    useState('content');

  const [previewMode, setPreviewMode] =
    useState('desktop');

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


  const [form, setForm] = useState({
    name: '',
    domain: '',
    description: '',
    category: 'E-commerce',
  });


  const [design, setDesign] =
    useState(DEFAULT_DESIGN);


  // =====================================================
  // LOAD WEBSITE
  // =====================================================

  useEffect(() => {
    loadWebsite();
  }, [id]);


  const loadWebsite = async () => {
    try {
      setLoading(true);
      setError('');


      if (!id) {
        throw new Error(
          'Website ID not found.'
        );
      }


      const data =
        await websiteAPI.getOne(id);


      const loadedWebsite =
        data.website || data;


      setWebsite(loadedWebsite);


      setForm({
        name: loadedWebsite.name || '',
        domain: loadedWebsite.domain || '',
        description:
          loadedWebsite.description || '',
        category:
          loadedWebsite.category ||
          'E-commerce',
      });


      setDesign({
        primaryColor:
          loadedWebsite.design?.primaryColor ||
          DEFAULT_DESIGN.primaryColor,

        backgroundColor:
          loadedWebsite.design?.backgroundColor ||
          DEFAULT_DESIGN.backgroundColor,

        textColor:
          loadedWebsite.design?.textColor ||
          DEFAULT_DESIGN.textColor,

        font:
          loadedWebsite.design?.font ||
          DEFAULT_DESIGN.font,
      });


    } catch (err) {
      console.error(
        'Load website editor error:',
        err
      );

      setError(
        err.message ||
          'Failed to load website.'
      );


    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } =
      event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // DESIGN CHANGE
  // =====================================================

  const handleDesignChange = (
    field,
    value
  ) => {
    setDesign((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    if (!website?._id) {
      alert('Website ID not found.');
      return;
    }


    if (!form.name.trim()) {
      alert(
        'Website name is required.'
      );

      return;
    }


    try {
      setSaving(true);


      const data =
        await websiteAPI.update(
          website._id,
          {
            name: form.name.trim(),

            domain:
              form.domain.trim(),

            description:
              form.description.trim(),

            category:
              form.category,

            design: {
              primaryColor:
                design.primaryColor,

              backgroundColor:
                design.backgroundColor,

              textColor:
                design.textColor,

              font:
                design.font,
            },
          }
        );


      const updatedWebsite =
        data.website || data;


      setWebsite(updatedWebsite);


      setDesign({
        primaryColor:
          updatedWebsite.design?.primaryColor ||
          design.primaryColor,

        backgroundColor:
          updatedWebsite.design?.backgroundColor ||
          design.backgroundColor,

        textColor:
          updatedWebsite.design?.textColor ||
          design.textColor,

        font:
          updatedWebsite.design?.font ||
          design.font,
      });


      alert(
        'Website saved successfully. ✅'
      );


    } catch (err) {
      console.error(
        'Save website error:',
        err
      );


      alert(
        err.message ||
          'Failed to save website.'
      );


    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // PREVIEW
  // =====================================================

  const handlePreview = () => {
    let savedStore = null;


    try {
      savedStore = JSON.parse(
        localStorage.getItem(
          'store'
        ) || 'null'
      );
    } catch {
      savedStore = null;
    }


    const storeSlug =
      savedStore?.slug ||
      localStorage.getItem(
        'storeSlug'
      ) ||
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
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white rounded-xl shadow-sm p-10 text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600">
            Loading website editor...
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">

          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <FaGlobe />
          </div>


          <h2 className="text-xl font-bold text-gray-800">
            Unable to load website
          </h2>


          <p className="text-sm text-gray-500 mt-2">
            {error}
          </p>


          <div className="flex gap-3 justify-center mt-6">

            <button
              onClick={() =>
                navigate('/websites')
              }
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
            >
              Back
            </button>


            <button
              onClick={loadWebsite}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // PREVIEW MODE HELPERS
  // =====================================================

  const isMobilePreview =
    previewMode === 'mobile';


  const featureGridClass =
    isMobilePreview
      ? 'grid grid-cols-1 gap-5'
      : 'grid grid-cols-1 md:grid-cols-3 gap-5';


  const navClass =
    isMobilePreview
      ? 'px-5 py-5 border-b'
      : 'px-6 md:px-10 py-5 flex items-center justify-between border-b';


  const heroClass =
    isMobilePreview
      ? 'px-5 py-14 text-center'
      : 'px-6 md:px-16 py-20 text-center';


  const heroTitleClass =
    isMobilePreview
      ? 'text-4xl font-bold tracking-tight'
      : 'text-4xl md:text-6xl font-bold tracking-tight';


  const featureSectionClass =
    isMobilePreview
      ? 'px-5 py-12'
      : 'px-6 md:px-12 py-14';


  const footerClass =
    isMobilePreview
      ? 'border-t px-5 py-7'
      : 'border-t px-6 md:px-12 py-8';


  // =====================================================
  // EDITOR
  // =====================================================

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">


      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              navigate('/websites')
            }
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600"
            title="Back"
          >
            <FaArrowLeft />
          </button>


          <div>
            <h1 className="font-bold text-gray-800">
              Website Editor
            </h1>

            <p className="text-xs text-gray-500">
              {website?.name ||
                'Untitled Website'}
            </p>
          </div>

        </div>


        <div className="flex items-center gap-2">

          {/* DESKTOP */}

          <button
            onClick={() => {
              setPreviewMode(
                'desktop'
              );

              setMobileMenuOpen(false);
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              previewMode === 'desktop'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaDesktop />
            Desktop
          </button>


          {/* MOBILE */}

          <button
            onClick={() => {
              setPreviewMode(
                'mobile'
              );

              setMobileMenuOpen(false);
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              previewMode === 'mobile'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaMobileScreen />
            Mobile
          </button>


          {/* PREVIEW */}

          <button
            onClick={handlePreview}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
          >
            <FaEye />
            Preview
          </button>


          {/* SAVE */}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium"
          >
            <FaFloppyDisk />

            {saving
              ? 'Saving...'
              : 'Save'}
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN EDITOR
      ================================================= */}

      <div className="flex flex-1 min-h-0">


        {/* LEFT TOOLBAR */}

        <aside className="w-16 md:w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-3 shrink-0">

          <button
            onClick={() =>
              setActivePanel(
                'content'
              )
            }
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 ${
              activePanel === 'content'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaFont />

            <span className="text-[10px]">
              Content
            </span>
          </button>


          <button
            onClick={() =>
              setActivePanel(
                'design'
              )
            }
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 ${
              activePanel === 'design'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaPalette />

            <span className="text-[10px]">
              Design
            </span>
          </button>


          <button
            onClick={() =>
              setActivePanel(
                'settings'
              )
            }
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 ${
              activePanel === 'settings'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaGear />

            <span className="text-[10px]">
              Settings
            </span>
          </button>

        </aside>


        {/* EDIT PANEL */}

        <aside className="w-72 lg:w-80 bg-white border-r border-gray-200 overflow-y-auto shrink-0">


          {/* CONTENT */}

          {activePanel ===
            'content' && (
            <div className="p-5">

              <div className="mb-6">

                <h2 className="font-bold text-gray-800">
                  Website Content
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Edit your basic website information
                </p>

              </div>


              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="My Website"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>

                <input
                  type="text"
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  placeholder="example.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>


              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="E-commerce">
                    E-commerce
                  </option>

                  <option value="Blog">
                    Blog
                  </option>

                  <option value="Portfolio">
                    Portfolio
                  </option>

                  <option value="Business">
                    Business
                  </option>

                  <option value="Restaurant">
                    Restaurant
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>


              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={5}
                  placeholder="Describe your website..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

              </div>


              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium"
              >
                <FaFloppyDisk />

                {saving
                  ? 'Saving...'
                  : 'Save Content'}
              </button>

            </div>
          )}


          {/* DESIGN */}

          {activePanel ===
            'design' && (
            <div className="p-5">

              <div className="mb-6">

                <h2 className="font-bold text-gray-800">
                  Design
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Customize your website appearance
                </p>

              </div>


              {/* PRIMARY COLOR */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>

                <div className="flex items-center gap-3">

                  <input
                    type="color"
                    value={
                      design.primaryColor
                    }
                    onChange={(event) =>
                      handleDesignChange(
                        'primaryColor',
                        event.target.value
                      )
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer border-0"
                  />

                  <input
                    type="text"
                    value={
                      design.primaryColor
                    }
                    onChange={(event) =>
                      handleDesignChange(
                        'primaryColor',
                        event.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />

                </div>

              </div>


              {/* BACKGROUND */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>

                <div className="flex items-center gap-3">

                  <input
                    type="color"
                    value={
                      design.backgroundColor
                    }
                    onChange={(event) =>
                      handleDesignChange(
                        'backgroundColor',
                        event.target.value
                      )
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer border-0"
                  />

                  <input
                    type="text"
                    value={
                      design.backgroundColor
                    }
                    onChange={(event) =>
                      handleDesignChange(
                        'backgroundColor',
                        event.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />

                </div>

              </div>


              {/* TEXT COLOR */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>

                <div className="flex items-center gap-3">

                  <input
                    type="color"
                    value={
                      design.textColor
                    }
                    onChange={(event) =>
                      handleDesignChange(
                        'textColor',
                        event.target.value
                      )
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer border-0"
                  />

                  <input
                    type="text"
                    value={
                      design.textColor
                    }
                    onChange={(event) =>
                      handleDesignChange(
                        'textColor',
                        event.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />

                </div>

              </div>


              {/* FONT */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font
                </label>

                <select
                  value={design.font}
                  onChange={(event) =>
                    handleDesignChange(
                      'font',
                      event.target.value
                    )
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="Inter">
                    Inter
                  </option>

                  <option value="Arial">
                    Arial
                  </option>

                  <option value="Poppins">
                    Poppins
                  </option>

                  <option value="Roboto">
                    Roboto
                  </option>
                </select>

              </div>


              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium"
              >
                <FaFloppyDisk />

                {saving
                  ? 'Saving...'
                  : 'Save Design'}
              </button>


              <div className="p-4 bg-indigo-50 rounded-xl mt-4">

                <p className="text-xs text-indigo-700">
                  🎨 Design settings are saved
                  to your website.
                </p>

              </div>

            </div>
          )}


          {/* SETTINGS */}

          {activePanel ===
            'settings' && (
            <div className="p-5">

              <div className="mb-6">

                <h2 className="font-bold text-gray-800">
                  Website Settings
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Manage website information
                </p>

              </div>


              <div className="bg-gray-50 rounded-xl p-4 mb-4">

                <div className="flex justify-between items-center mb-3">

                  <span className="text-sm text-gray-600">
                    Status
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      website?.status ===
                      'Published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {website?.status ||
                      'Draft'}
                  </span>

                </div>


                <div className="flex justify-between items-center">

                  <span className="text-sm text-gray-600">
                    Category
                  </span>

                  <span className="text-sm font-medium text-gray-800">
                    {form.category}
                  </span>

                </div>

              </div>


              <div className="bg-blue-50 rounded-xl p-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FaGear />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-blue-800">
                      Editor Settings
                    </p>

                    <p className="text-xs text-blue-600 mt-1">
                      More settings will be added later.
                    </p>

                  </div>

                </div>

              </div>

            </div>
          )}

        </aside>


        {/* =================================================
            PREVIEW AREA
        ================================================= */}

        <main className="flex-1 overflow-auto p-4 md:p-8">

          <div className="max-w-6xl mx-auto">


            {/* BROWSER BAR */}

            <div className="bg-gray-800 rounded-t-xl px-4 py-3 flex items-center gap-3">

              <div className="flex gap-1.5">

                <span className="w-3 h-3 rounded-full bg-red-400" />

                <span className="w-3 h-3 rounded-full bg-yellow-400" />

                <span className="w-3 h-3 rounded-full bg-green-400" />

              </div>


              <div className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-xs text-gray-300 flex items-center gap-2">

                <FaGlobe />

                <span>
                  {form.domain ||
                    `${form.name
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        '-'
                      )}.yourplatform.com`}
                </span>

              </div>

            </div>


            {/* WEBSITE PREVIEW */}

            <div
              className={`bg-white shadow-xl mx-auto transition-all duration-300 ${
                isMobilePreview
                  ? 'max-w-[390px]'
                  : 'max-w-full'
              }`}
              style={{
                backgroundColor:
                  design.backgroundColor,

                color:
                  design.textColor,

                fontFamily:
                  design.font,
              }}
            >


              {/* =================================================
                  NAVBAR
              ================================================= */}

              <nav
                className={navClass}
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                      style={{
                        backgroundColor:
                          design.primaryColor,
                      }}
                    >
                      {form.name
                        ? form.name
                            .charAt(0)
                            .toUpperCase()
                        : 'W'}
                    </div>


                    <span className="font-bold text-lg">
                      {form.name ||
                        'Your Website'}
                    </span>

                  </div>


                  {/* DESKTOP NAVIGATION */}

                  {!isMobilePreview && (
                    <div className="flex items-center gap-6 text-sm font-medium">

                      <span>
                        Home
                      </span>

                      <span>
                        Products
                      </span>

                      <span>
                        About
                      </span>

                      <span>
                        Contact
                      </span>

                    </div>
                  )}


                  {/* MOBILE HAMBURGER */}

                  {isMobilePreview && (
                    <button
                      onClick={() =>
                        setMobileMenuOpen(
                          (previous) =>
                            !previous
                        )
                      }
                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                      style={{
                        color:
                          design.textColor,
                      }}
                      aria-label="Toggle menu"
                    >
                      {mobileMenuOpen ? (
                        <FaXmark
                          size={22}
                        />
                      ) : (
                        <FaBars
                          size={22}
                        />
                      )}
                    </button>
                  )}

                </div>


                {/* MOBILE MENU */}

                {isMobilePreview &&
                  mobileMenuOpen && (
                    <div className="mt-4 border-t pt-3">

                      <div className="flex flex-col">

                        {[
                          'Home',
                          'Products',
                          'About',
                          'Contact',
                        ].map(
                          (item) => (
                            <button
                              key={item}
                              onClick={() =>
                                setMobileMenuOpen(
                                  false
                                )
                              }
                              className="text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                              style={{
                                color:
                                  design.textColor,
                              }}
                            >
                              {item}
                            </button>
                          )
                        )}

                      </div>

                    </div>
                  )}

              </nav>


              {/* =================================================
                  HERO
              ================================================= */}

              <section
                className={heroClass}
                style={{
                  background:
                    `linear-gradient(135deg, ${design.primaryColor}12, ${design.primaryColor}04)`,
                }}
              >

                <span
                  className="inline-block px-4 py-2 rounded-full text-xs font-semibold mb-5"
                  style={{
                    backgroundColor:
                      `${design.primaryColor}18`,

                    color:
                      design.primaryColor,
                  }}
                >
                  {form.category}
                </span>


                <h1
                  className={heroTitleClass}
                >
                  {form.name ||
                    'Build Your Website'}
                </h1>


                <p className="max-w-2xl mx-auto mt-5 text-gray-500 text-base md:text-lg">
                  {form.description ||
                    'Create a beautiful and professional website with your own online presence.'}
                </p>


                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

                  <button
                    className="px-6 py-3 rounded-lg text-white font-semibold"
                    style={{
                      backgroundColor:
                        design.primaryColor,
                    }}
                  >
                    Explore Website
                  </button>


                  <button className="px-6 py-3 rounded-lg border border-gray-300 font-semibold">
                    Learn More
                  </button>

                </div>

              </section>


              {/* =================================================
                  FEATURES
              ================================================= */}

              <section
                className={
                  featureSectionClass
                }
              >

                <div className="text-center mb-10">

                  <h2
                    className={
                      isMobilePreview
                        ? 'text-3xl font-bold'
                        : 'text-2xl md:text-3xl font-bold'
                    }
                  >
                    Everything You Need
                  </h2>


                  <p className="text-gray-500 mt-2 text-sm">
                    A simple preview of your website
                  </p>

                </div>


                {/* IMPORTANT:
                    Mobile = 1 column
                    Desktop = 3 columns
                */}

                <div
                  className={
                    featureGridClass
                  }
                >

                  {[
                    {
                      title:
                        'Professional Design',
                      text:
                        'Create a modern and clean website.',
                    },

                    {
                      title:
                        'Easy Management',
                      text:
                        'Manage your website from one place.',
                    },

                    {
                      title:
                        'Online Presence',
                      text:
                        'Publish your website for customers.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`border border-gray-200 rounded-xl p-6 hover:shadow-md transition ${
                        isMobilePreview
                          ? 'w-full'
                          : ''
                      }`}
                    >

                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white mb-4"
                        style={{
                          backgroundColor:
                            design.primaryColor,
                        }}
                      >
                        <FaGlobe />
                      </div>


                      <h3 className="font-bold text-lg">
                        {item.title}
                      </h3>


                      <p className="text-sm text-gray-500 mt-2">
                        {item.text}
                      </p>

                    </div>
                  ))}

                </div>

              </section>


              {/* =================================================
                  FOOTER
              ================================================= */}

              <footer
                className={footerClass}
              >

                <div
                  className={
                    isMobilePreview
                      ? 'flex flex-col gap-4'
                      : 'flex flex-col md:flex-row justify-between gap-4'
                  }
                >

                  <div>

                    <p className="font-bold">
                      {form.name ||
                        'Your Website'}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {form.description ||
                        'Your professional website'}
                    </p>

                  </div>


                  {/* STORE FORGE */}

                  <p className="text-xs text-gray-400">
                    Powered by StoreForge
                  </p>

                </div>

              </footer>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};


export default WebsiteEditor;