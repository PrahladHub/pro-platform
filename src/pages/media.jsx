import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaPlus, FaImage, FaTrash, FaCloudArrowUp } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Media = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();

  const mediaFiles = [
    { id: 1, name: 'product-1.jpg', size: '245 KB', type: 'image', date: '2026-09-28' },
    { id: 2, name: 'banner.png', size: '512 KB', type: 'image', date: '2026-09-27' },
    { id: 3, name: 'logo.svg', size: '12 KB', type: 'image', date: '2026-09-26' },
    { id: 4, name: 'background.jpg', size: '890 KB', type: 'image', date: '2026-09-25' },
    { id: 5, name: 'invoice.pdf', size: '120 KB', type: 'document', date: '2026-09-24' },
    { id: 6, name: 'promo.mp4', size: '4.5 MB', type: 'video', date: '2026-09-23' },
  ];

  const getTypeColor = (type) => {
    if (type === 'image') return 'from-green-400 to-blue-500';
    if (type === 'document') return 'from-red-400 to-orange-500';
    if (type === 'video') return 'from-purple-400 to-pink-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <FaGlobe /> Create Website
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <FaGear /> Settings
            </button>
            {isPinSet && (
              <button
                onClick={() => navigate('/workspace')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                <FaDesktop /> Desktop
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            User <FaChevronDown />
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
              <p className="text-sm text-gray-500 mt-1">{mediaFiles.length} files</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
              <FaPlus /> Upload
            </button>
          </div>

          {/* Upload Drop Zone */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 text-center mb-6 hover:border-primary transition cursor-pointer">
          <FaCloudArrowUp className="text-5xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">Drop files here to upload</p>
            <p className="text-gray-500 text-sm mt-1">or click to browse from your computer</p>
            <p className="text-gray-400 text-xs mt-3">Max size: 5MB • JPG, PNG, SVG, PDF, MP4</p>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mediaFiles.map((file) => (
              <div key={file.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className={`h-32 bg-gradient-to-br ${getTypeColor(file.type)} flex items-center justify-center relative`}>
                  <FaImage className="text-white text-4xl opacity-70" />
                  <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition">
                    <FaTrash className="text-red-500 text-xs" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{file.size}</span>
                    <span>{file.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Media;