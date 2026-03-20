import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Image as ImageIcon, PenTool, Heart, X, Camera, Send, MessageCircle, Mail, GraduationCap, Users, Sparkles, Quote } from 'lucide-react';

// Add CSS for floating labels, 3D flip card, and 3D carousel
const floatingLabelStyles = `
<style>
.input-group {
  position: relative;
}

.input:focus, .input:valid {
  outline: none;
  border: 1.5px solid #f59e0b !important;
}

.input:focus ~ .user-label, .input:valid ~ .user-label {
  transform: translateY(-50%) scale(0.8) !important;
  background-color: #f8fafc !important;
  padding: 0 .2em !important;
  color: #f59e0b !important;
}

/* ===== Flip Card Styles ===== */
.flip-card {
  position: relative;
  width: 100%;
  height: 340px;
  background-color: #FFFCF8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.06);
}

/* Friend card accent */
.flip-card--friend {
  border-top: 3px solid #f59e0b;
}
.flip-card--friend .flip-card__content {
  background-color: #FFFCF8;
  border-top: 3px solid #f59e0b;
}
.flip-card--friend .flip-card__role-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

/* Teacher card accent */
.flip-card--teacher {
  border-top: 3px solid #6366f1;
}
.flip-card--teacher .flip-card__content {
  background-color: #f8f7ff;
  border-top: 3px solid #6366f1;
}
.flip-card--teacher .flip-card__role-badge {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  color: white;
}

.flip-card svg.flip-icon {
  width: 48px;
  fill: #78716c;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.flip-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.flip-card__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #FFFCF8;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow-y: auto;
}

.flip-card:hover .flip-card__content {
  transform: rotateX(0deg);
}

.flip-card__title {
  margin: 0;
  font-size: 20px;
  color: #44403c;
  font-weight: 700;
  font-family: 'Georgia', serif;
}

.flip-card__subtitle {
  margin: 2px 0 0;
  font-size: 13px;
  color: #a8a29e;
  font-style: italic;
  font-family: 'Georgia', serif;
}

.flip-card:hover svg.flip-icon {
  scale: 0;
}

.flip-card__description {
  margin: 10px 0 0;
  font-size: 13px;
  color: #78716c;
  line-height: 1.5;
}

.flip-card__memory {
  margin: 8px 0;
  font-size: 12px;
  color: #92400e;
  font-style: italic;
  padding-left: 10px;
  border-left: 2px solid #fbbf24;
  line-height: 1.4;
}

.flip-card--teacher .flip-card__memory {
  color: #4338ca;
  border-left-color: #818cf8;
}

.flip-card__date {
  margin: 12px 0 0;
  font-size: 11px;
  color: #a8a29e;
  text-align: right;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: 'Georgia', serif;
}

.flip-card__role-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* ===== Role Filter Styles ===== */
.role-filter {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}
.role-filter-btn {
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Georgia', serif;
  background: white;
  color: #78716c;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.role-filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}
.role-filter-btn--active-all {
  background: linear-gradient(135deg, #44403c, #57534e);
  color: white;
  border-color: #44403c;
}
.role-filter-btn--active-friend {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-color: #f59e0b;
}
.role-filter-btn--active-teacher {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border-color: #6366f1;
}

/* ===== 3D Carousel Styles ===== */
.carousel-wrapper {
  width: 100%;
  height: 550px;
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at center, rgba(30,30,40,0.95) 0%, rgba(15,15,20,1) 100%);
  border-radius: 20px;
}

.carousel-inner {
  --w: 150px;
  --h: 210px;
  --translateZ: 320px;
  --rotateX: -12deg;
  --perspective: 1000px;
  position: absolute;
  width: var(--w);
  height: var(--h);
  top: 22%;
  left: calc(50% - (var(--w) / 2));
  z-index: 2;
  transform-style: preserve-3d;
  transform: perspective(var(--perspective));
  animation: carouselRotating 20s linear infinite;
}

@keyframes carouselRotating {
  from {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0);
  }
  to {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn);
  }
}

.carousel-card {
  position: absolute;
  border: 2px solid rgba(var(--color-card), 0.6);
  border-radius: 12px;
  overflow: hidden;
  inset: 0;
  transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: rgba(var(--color-card), 0.08);
}

.carousel-card:hover {
  border-color: rgba(var(--color-card), 1);
  box-shadow: 0 0 30px rgba(var(--color-card), 0.5);
}

.carousel-card .carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-card .carousel-img-placeholder {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      circle,
      rgba(var(--color-card), 0.1) 0%,
      rgba(var(--color-card), 0.3) 60%,
      rgba(var(--color-card), 0.6) 100%
    );
}

/* Reflection glow on floor */
.carousel-wrapper::after {
  content: '';
  position: absolute;
  bottom: 5%;
  left: 15%;
  width: 70%;
  height: 30%;
  background: radial-gradient(ellipse, rgba(200, 200, 255, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

@media (min-width: 640px) {
  .carousel-inner {
    --w: 190px;
    --h: 270px;
    --translateZ: 400px;
  }
  .carousel-wrapper {
    height: 650px;
  }
}

@media (min-width: 1024px) {
  .carousel-inner {
    --w: 230px;
    --h: 330px;
    --translateZ: 480px;
  }
  .carousel-wrapper {
    height: 750px;
  }
}

/* ===== Envelope Letter Styles ===== */
.envelope-container {
  perspective: 1200px;
  cursor: pointer;
  margin: 0 auto;
  max-width: 400px;
}

.envelope {
  position: relative;
  width: 100%;
  height: 280px;
  transition: transform 0.5s ease;
}

.envelope:hover {
  transform: translateY(-4px);
}

.envelope-body {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  z-index: 2;
}

.envelope-body--friend {
  background: linear-gradient(160deg, #fef3c7, #fde68a);
  border: 1px solid #fbbf24;
}

.envelope-body--teacher {
  background: linear-gradient(160deg, #e0e7ff, #c7d2fe);
  border: 1px solid #818cf8;
}

/* Flap */
.envelope-flap {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  height: 0;
  border-left: 200px solid transparent;
  border-right: 200px solid transparent;
  transform-origin: top center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
}

.envelope-flap--friend {
  border-top: 130px solid #fbbf24;
}

.envelope-flap--teacher {
  border-top: 130px solid #818cf8;
}

.envelope--open .envelope-flap {
  transform: rotateX(180deg);
  z-index: 0;
}

/* Letter paper */
.envelope-letter {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  width: 85%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  z-index: 1;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
  max-height: 160px;
  overflow: hidden;
  padding: 0;
  opacity: 0.6;
}

.envelope--open .envelope-letter {
  transform: translateX(-50%) translateY(-180px);
  max-height: 600px;
  padding: 24px;
  opacity: 1;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.envelope-seal {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  z-index: 4;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.6s ease;
}

.envelope-seal--friend {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.envelope-seal--teacher {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.envelope--open .envelope-seal {
  opacity: 0;
  transform: translateX(-50%) scale(0.5);
}

.envelope-label {
  position: absolute;
  bottom: 24px;
  width: 100%;
  text-align: center;
  font-family: 'Georgia', serif;
  font-size: 16px;
  font-weight: 700;
  z-index: 3;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.envelope--open .envelope-label {
  opacity: 0;
}

.envelope-hint {
  text-align: center;
  font-size: 12px;
  color: #a8a29e;
  margin-top: 8px;
  font-family: 'Georgia', serif;
  font-style: italic;
  transition: opacity 0.3s ease;
}
</style>
`;

// ==========================================
// 1. Demo Mode (No Firebase)
// ==========================================
const useDemoMode = true; // Set to false when Firebase is configured

export default function App() {
  // ==========================================
  // State Management
  // ==========================================
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('read'); // Default to read for the nostalgic vibe
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Modal State
  const [selectedImage, setSelectedImage] = useState(null);

  // Role filter State ('all', 'friend', 'teacher')
  const [roleFilter, setRoleFilter] = useState('all');

  // Envelope open state
  const [friendEnvelopeOpen, setFriendEnvelopeOpen] = useState(false);
  const [teacherEnvelopeOpen, setTeacherEnvelopeOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    role: 'friend', // 'friend' or 'teacher'
    memory: '',
    message: '',
  });
  const [imageBase64, setImageBase64] = useState('');
  const fileInputRef = useRef(null);

  // ==========================================
  // Authentication & Data Fetching (Demo Mode)
  // ==========================================
  useEffect(() => {
    if (useDemoMode) {
      // Demo mode - simulate authentication
      setTimeout(() => {
        setUser({ uid: 'demo-user', isAnonymous: true });
      }, 500);
      return;
    }

    // Firebase code would go here when useDemoMode is false
  }, []);

  useEffect(() => {
    if (!user) return;

    if (useDemoMode) {
      // Demo mode - start with empty entries
      setEntries([]);
      return;
    }

    // Firebase code would go here when useDemoMode is false
  }, [user]);

  // ==========================================
  // Form Handlers
  // ==========================================
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // เลื่อนหน้าจอกลับไปด้านบนสุดอย่างนุ่มนวลเมื่อเปลี่ยนแท็บ
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Image Compression and Conversion to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Resize to max 800px to save DB space
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality to stay well under 1MB limit
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setImageBase64(dataUrl);
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('กรุณากรอกชื่อและข้อความถึงเราด้วยนะ!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (useDemoMode) {
        // Demo mode - simulate adding entry
        const newEntry = {
          id: Date.now().toString(),
          name: formData.name,
          nickname: formData.nickname,
          role: formData.role,
          memory: formData.memory,
          message: formData.message,
          image: imageBase64 || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=eaddcf,f4e4d4&textColor=57534e`, // Vintage fallback
          createdAt: Date.now(),
          authorId: user.uid
        };
        
        setEntries(prev => [newEntry, ...prev]);
        
        setSubmitSuccess(true);
        setFormData({ name: '', nickname: '', role: 'friend', memory: '', message: '' });
        setImageBase64('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setTimeout(() => {
          setSubmitSuccess(false);
          setActiveTab('read');
        }, 2000);
        return;
      }

      // Firebase code would go here when useDemoMode is false
    } catch (error) {
      console.error("Error submitting entry:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // Sub-Components / Renderers
  // ==========================================
  const renderTabs = () => {
    const tabs = [
      { id: 'write', emoji: '📝', label: 'เขียน' },
      { id: 'read', emoji: '📖', label: 'อ่าน' },
      { id: 'gallery', emoji: '📸', label: 'รูปภาพ' },
      { id: 'owner', emoji: '💌', label: 'จากเรา' }
    ];

    return (
      <div className="flex justify-center mb-12 relative z-20">
        <div className="hover:scale-x-105 transition-all duration-300 *:transition-all *:duration-300 flex justify-start text-2xl items-center shadow-xl z-10 bg-[#e8e4df]/90 backdrop-blur-md gap-2 p-2 rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`group relative cursor-pointer hover:-translate-y-5 hover:scale-125 rounded-full p-2 px-3 ${
                activeTab === tab.id ? 'bg-white shadow-md -translate-y-3 scale-110' : 'bg-white/50 hover:bg-white'
              }`}
            >
              {/* Tooltip text (ใช้ Span แทน pseudo-element เพื่อให้รองรับภาษาไทยใน React ได้ง่ายขึ้น) */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 flex justify-center items-center h-5 text-[0.65rem] font-bold px-2 bg-stone-800 text-white rounded-md whitespace-nowrap pointer-events-none shadow-sm">
                {tab.label}
              </span>
              <span className="leading-none">{tab.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderWriteForm = () => (
    <div className="max-w-2xl mx-auto bg-[#FFFCF8] p-8 md:p-10 rounded-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-stone-200 relative">
      {/* Decorative tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-md border border-black/5 shadow-sm rotate-1 z-10 mix-blend-multiply"></div>
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-stone-800 flex items-center justify-center gap-3">
          <Sparkles className="text-amber-400" size={20} />
          บันทึกความทรงจำ
          <Sparkles className="text-amber-400" size={20} />
        </h2>
        <p className="text-stone-500 mt-3 font-serif italic text-lg">"เพราะบางเรื่องราว... ควรค่าแก่การจดจำไปตลอดกาล"</p>
        <div className="w-16 h-px bg-amber-300 mx-auto mt-4"></div>
      </div>

      {submitSuccess ? (
        <div className="bg-amber-50/50 border border-amber-100 text-amber-800 p-8 rounded-sm text-center flex flex-col items-center animate-in zoom-in duration-500">
          <Send size={40} className="mb-4 text-amber-500" />
          <h3 className="text-xl font-serif mb-2">บันทึกความทรงจำเรียบร้อยแล้ว</h3>
          <p className="text-stone-600">กำลังนำทางไปยังหน้าหนังสือรุ่น...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center space-x-8 mb-4 border-b border-stone-100 pb-6">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.role === 'friend' ? 'border-amber-500 bg-amber-500' : 'border-stone-300 group-hover:border-amber-400'}`}>
                {formData.role === 'friend' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <input type="radio" name="role" value="friend" checked={formData.role === 'friend'} onChange={handleInputChange} className="hidden" />
              <span className={`font-medium transition-colors ${formData.role === 'friend' ? 'text-amber-800' : 'text-stone-500'}`}>เพื่อน (Friend)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.role === 'teacher' ? 'border-stone-600 bg-stone-600' : 'border-stone-300 group-hover:border-stone-400'}`}>
                {formData.role === 'teacher' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <input type="radio" name="role" value="teacher" checked={formData.role === 'teacher'} onChange={handleInputChange} className="hidden" />
              <span className={`font-medium transition-colors ${formData.role === 'teacher' ? 'text-stone-800' : 'text-stone-500'}`}>คุณครู (Teacher)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="input w-full"
                style={{
                  border: 'solid 1.5px #9e9e9e',
                  borderRadius: '1rem',
                  background: 'none',
                  padding: '1rem',
                  fontSize: '1rem',
                  color: '#374151',
                  transition: 'border 150ms cubic-bezier(0.4,0,0.2,1)'
                }}
              />
              <label className="user-label" style={{
                position: 'absolute',
                left: '15px',
                pointerEvents: 'none',
                transform: formData.name ? 'translateY(-50%) scale(0.8)' : 'translateY(1rem)',
                transition: '150ms cubic-bezier(0.4,0,0.2,1)',
                backgroundColor: formData.name ? '#f8fafc' : 'transparent',
                padding: formData.name ? '0 .2em' : '0',
                color: formData.name ? '#f59e0b' : '#9ca3af'
              }}>
                ชื่อ (Name) *
              </label>
            </div>
            <div className="input-group">
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="input w-full"
                style={{
                  border: 'solid 1.5px #9e9e9e',
                  borderRadius: '1rem',
                  background: 'none',
                  padding: '1rem',
                  fontSize: '1rem',
                  color: '#374151',
                  transition: 'border 150ms cubic-bezier(0.4,0,0.2,1)'
                }}
              />
              <label className="user-label" style={{
                position: 'absolute',
                left: '15px',
                pointerEvents: 'none',
                transform: formData.nickname ? 'translateY(-50%) scale(0.8)' : 'translateY(1rem)',
                transition: '150ms cubic-bezier(0.4,0,0.2,1)',
                backgroundColor: formData.nickname ? '#f8fafc' : 'transparent',
                padding: formData.nickname ? '0 .2em' : '0',
                color: formData.nickname ? '#f59e0b' : '#9ca3af'
              }}>
                ชื่อเล่น (Nickname)
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <div className="input-group">
              <textarea
                name="memory"
                rows="3"
                value={formData.memory}
                onChange={handleInputChange}
                className="input w-full resize-none"
                style={{
                  border: 'solid 1.5px #9e9e9e',
                  borderRadius: '1rem',
                  background: 'none',
                  padding: '1rem',
                  fontSize: '1rem',
                  color: '#374151',
                  transition: 'border 150ms cubic-bezier(0.4,0,0.2,1)',
                  minHeight: '80px'
                }}
              ></textarea>
              <label className="user-label" style={{
                position: 'absolute',
                left: '15px',
                top: '1rem',
                pointerEvents: 'none',
                transform: formData.memory ? 'translateY(-50%) scale(0.8)' : 'translateY(0)',
                transition: '150ms cubic-bezier(0.4,0,0.2,1)',
                backgroundColor: formData.memory ? '#f8fafc' : 'transparent',
                padding: formData.memory ? '0 .2em' : '0',
                color: formData.memory ? '#f59e0b' : '#9ca3af'
              }}>
                เรื่องราวที่อยากจดจำ (Memories)
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <div className="input-group">
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className="input w-full resize-none"
                style={{
                  border: 'solid 1.5px #9e9e9e',
                  borderRadius: '1rem',
                  background: 'none',
                  padding: '1rem',
                  fontSize: '1rem',
                  color: '#374151',
                  transition: 'border 150ms cubic-bezier(0.4,0,0.2,1)',
                  minHeight: '100px'
                }}
              ></textarea>
              <label className="user-label" style={{
                position: 'absolute',
                left: '15px',
                top: '1rem',
                pointerEvents: 'none',
                transform: formData.message ? 'translateY(-50%) scale(0.8)' : 'translateY(0)',
                transition: '150ms cubic-bezier(0.4,0,0.2,1)',
                backgroundColor: formData.message ? '#f8fafc' : 'transparent',
                padding: formData.message ? '0 .2em' : '0',
                color: formData.message ? '#f59e0b' : '#9ca3af'
              }}>
                ความในใจถึงเรา (Message) *
              </label>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">รูปถ่ายความทรงจำ (Photo)</label>
            <div className="flex items-center justify-center w-full">
              <label className="cursor-pointer" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '300px'
              }}>
                {imageBase64 ? (
                  <div className="relative bg-[#FFFCF8] p-4 pb-8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] group">
                    {/* Vintage Tape Element */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/50 backdrop-blur-sm border border-black/5 shadow-sm rotate-1 z-10 mix-blend-overlay"></div>
                    
                    {/* Polaroid Image Area */}
                    <div className="aspect-square overflow-hidden relative bg-stone-100 mb-5 p-2 shadow-inner">
                      <img 
                        src={imageBase64} 
                        alt="Preview" 
                        className="w-full h-full object-cover grayscale-[30%] sepia-[20%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-700"
                      />
                    </div>

                    {/* Content Area */}
                    <div className="px-2">
                      <div className="flex items-baseline justify-between mb-4 border-b border-stone-100 pb-2">
                        <h3 className="text-xl font-bold text-stone-800 font-serif">ตัวอย่างรูปภาพ</h3>
                      </div>
                      
                      <div className="mt-2 text-stone-700 font-medium text-sm leading-relaxed bg-stone-50/50 p-3 rounded-sm">
                        นี่คือรูปภาพที่จะปรากฏในหน้าอ่านข้อความ
                      </div>
                      
                      <div className="mt-6 text-right text-xs text-stone-400 font-serif tracking-widest uppercase">
                        {new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-56 border-2 border-stone-200 border-dashed rounded-sm cursor-pointer bg-[#faf8f5] hover:bg-stone-50 transition-colors overflow-hidden relative group">
                    <Camera className="w-8 h-8 mb-3 opacity-50" />
                    <p className="mb-1 text-sm font-medium text-stone-400">แนบรูปถ่าย</p>
                    <p className="text-xs opacity-70 text-stone-400">คลิกเพื่อเลือกภาพในความทรงจำ</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleImageUpload} 
                />
              </label>
            </div>
            {imageBase64 && (
              <div className="flex justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => { setImageBase64(''); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-xs text-stone-500 hover:text-red-500 transition-colors flex items-center uppercase tracking-wider"
                >
                  <X size={14} className="mr-1" /> ลบรูปภาพ
                </button>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-sm text-white font-serif text-lg tracking-wide transition-all flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-800 hover:bg-amber-800 shadow-md hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? 'กำลังผนึกความทรงจำ...' : 'ส่งมอบความทรงจำ'}
              {!isSubmitting && <Send size={18} />}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // Role filter UI component
  const RoleFilterButtons = () => {
    const friendCount = entries.filter(e => e.role === 'friend').length;
    const teacherCount = entries.filter(e => e.role === 'teacher').length;
    return (
      <div className="role-filter">
        <button
          className={`role-filter-btn ${roleFilter === 'all' ? 'role-filter-btn--active-all' : ''}`}
          onClick={() => setRoleFilter('all')}
        >
          ทั้งหมด ({entries.length})
        </button>
        <button
          className={`role-filter-btn ${roleFilter === 'friend' ? 'role-filter-btn--active-friend' : ''}`}
          onClick={() => setRoleFilter('friend')}
        >
          🎒 เพื่อน ({friendCount})
        </button>
        <button
          className={`role-filter-btn ${roleFilter === 'teacher' ? 'role-filter-btn--active-teacher' : ''}`}
          onClick={() => setRoleFilter('teacher')}
        >
          🎓 คุณครู ({teacherCount})
        </button>
      </div>
    );
  };

  const renderReadEntries = () => {
    const filteredEntries = roleFilter === 'all' ? entries : entries.filter(e => e.role === roleFilter);
    
    return (
      <div className="max-w-6xl mx-auto">
        {entries.length === 0 ? (
          <div className="text-center py-24 bg-[#FFFCF8]/80 rounded-sm backdrop-blur-sm border border-stone-200/50 shadow-sm">
            <BookOpen size={48} className="mx-auto text-stone-300 mb-6" />
            <h3 className="text-2xl font-serif text-stone-600 mb-2">หน้ากระดาษยังว่างเปล่า</h3>
            <p className="text-stone-400 mb-6 font-serif italic">มาร่วมเขียนบรรทัดแรกของความทรงจำนี้กัน</p>
            <button 
              onClick={() => setActiveTab('write')}
              className="px-8 py-2.5 bg-stone-800 text-white font-serif rounded-full hover:bg-amber-800 transition-colors shadow-sm"
            >
              จรดปากกาเขียน
            </button>
          </div>
        ) : (
          <>
            <RoleFilterButtons />
            {filteredEntries.length === 0 ? (
              <div className="text-center py-16 bg-[#FFFCF8]/80 rounded-sm backdrop-blur-sm border border-stone-200/50">
                <p className="text-stone-400 font-serif italic">ยังไม่มีข้อความจาก{roleFilter === 'teacher' ? 'คุณครู' : 'เพื่อน'}เลย</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className={`flip-card ${entry.role === 'teacher' ? 'flip-card--teacher' : 'flip-card--friend'}`}>
                    {/* Front face - Image/Icon */}
                    {entry.image && !entry.image.includes('dicebear') ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img 
                          src={entry.image} 
                          alt={entry.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.97)' }}
                        />
                        {/* Role badge on front */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                          <span className="flip-card__role-badge">
                            {entry.role === 'teacher' ? '🎓 คุณครู' : '🎒 เพื่อน'}
                          </span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '12px', left: '0', width: '100%', textAlign: 'center' }}>
                          <span style={{ 
                            background: 'rgba(255,252,248,0.92)', 
                            padding: '5px 18px', 
                            borderRadius: '20px', 
                            fontSize: '14px', 
                            fontFamily: 'Georgia, serif',
                            color: '#44403c',
                            fontWeight: '600',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }}>
                            {entry.name}{entry.nickname ? ` (${entry.nickname})` : ''}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        {/* Role badge on front when no image */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                          <span className="flip-card__role-badge">
                            {entry.role === 'teacher' ? '🎓 คุณครู' : '🎒 เพื่อน'}
                          </span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="flip-icon" style={{ margin: '0 auto 12px' }}>
                          <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
                        </svg>
                        <p style={{ fontSize: '14px', color: '#78716c', fontFamily: 'Georgia, serif' }}>{entry.name}</p>
                      </div>
                    )}
                    
                    {/* Back face - Content */}
                    <div className="flip-card__content">
                      <span className="flip-card__role-badge">
                        {entry.role === 'teacher' ? '🎓 คุณครู' : '🎒 เพื่อน'}
                      </span>
                      <p className="flip-card__title">{entry.name}</p>
                      {entry.nickname && <p className="flip-card__subtitle">({entry.nickname})</p>}
                      
                      {entry.memory && (
                        <p className="flip-card__memory">{entry.memory}</p>
                      )}
                      
                      <p className="flip-card__description">{entry.message}</p>
                      
                      <p className="flip-card__date">
                        {new Date(entry.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // 3D Carousel Gallery with image cycling
  const CAROUSEL_SLOTS = 10;
  const carouselColors = [
    '142, 249, 252', '142, 252, 204', '142, 252, 157', '215, 252, 142', '252, 252, 142',
    '252, 208, 142', '252, 142, 142', '252, 142, 239', '204, 142, 252', '142, 202, 252'
  ];
  const [carouselPage, setCarouselPage] = useState(0);
  const carouselInnerRef = useRef(null);

  // Listen for animation iteration to cycle images
  useEffect(() => {
    const el = carouselInnerRef.current;
    if (!el) return;
    const handleIteration = () => {
      const imagesWithNames = entries.filter(e => e.image && !e.image.includes('dicebear'));
      if (imagesWithNames.length > CAROUSEL_SLOTS) {
        setCarouselPage(prev => {
          const maxPage = Math.ceil(imagesWithNames.length / CAROUSEL_SLOTS) - 1;
          return prev >= maxPage ? 0 : prev + 1;
        });
      }
    };
    el.addEventListener('animationiteration', handleIteration);
    return () => el.removeEventListener('animationiteration', handleIteration);
  }, [entries]);

  const renderGallery = () => {
    // Filter by role
    const filteredEntries = roleFilter === 'all' ? entries : entries.filter(e => e.role === roleFilter);
    const allImages = filteredEntries.filter(e => e.image && !e.image.includes('dicebear')).map(e => ({ url: e.image, name: e.name, id: e.id, nickname: e.nickname, role: e.role }));
    
    // Get current page of images for carousel
    const startIdx = carouselPage * CAROUSEL_SLOTS;
    const currentPageImages = allImages.slice(startIdx, startIdx + CAROUSEL_SLOTS);
    const totalPages = Math.max(1, Math.ceil(allImages.length / CAROUSEL_SLOTS));
    const slotsToShow = Math.min(allImages.length, CAROUSEL_SLOTS);

    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-stone-800 mb-2">แกลลอรี่ภาพถ่าย</h2>
          <p className="text-stone-500 font-serif italic">"ความทรงจำที่หมุนวนไม่สิ้นสุด"</p>
          {allImages.length > CAROUSEL_SLOTS && (
            <p className="text-xs text-stone-400 mt-2 font-serif">
              รอบที่ {carouselPage + 1} / {totalPages} — รูปจะเปลี่ยนอัตโนมัติทุกรอบการหมุน
            </p>
          )}
        </div>

        {/* Role filter for gallery too */}
        {entries.length > 0 && <RoleFilterButtons />}
        
        {allImages.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFCF8]/80 rounded-sm backdrop-blur-sm border border-stone-200/50">
            <ImageIcon size={48} className="mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500 font-serif">ยังไม่มีรูปถ่าย{roleFilter !== 'all' ? ('จาก' + (roleFilter === 'teacher' ? 'คุณครู' : 'เพื่อน')) : ''}ถูกแปะไว้เลย</p>
          </div>
        ) : (
          <div className="carousel-wrapper" style={{ background: 'radial-gradient(ellipse at center bottom, rgba(245,158,11,0.06) 0%, transparent 70%)' }}>
            <div 
              className="carousel-inner" 
              ref={carouselInnerRef}
              style={{ '--quantity': slotsToShow || CAROUSEL_SLOTS }}
            >
              {Array.from({ length: slotsToShow || CAROUSEL_SLOTS }).map((_, idx) => {
                const item = currentPageImages[idx];
                const color = carouselColors[idx % carouselColors.length];
                return (
                  <div 
                    key={`slot-${idx}-${item?.id || idx}`}
                    className="carousel-card" 
                    style={{ '--index': idx, '--color-card': color }}
                    onClick={() => item && setSelectedImage(item.url)}
                  >
                    {item ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="carousel-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="carousel-img-placeholder"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOwnerMessage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-stone-800 flex items-center justify-center gap-3">
          <Mail className="text-amber-600" size={24} />
          จดหมายฉบับสุดท้าย
          <Mail className="text-amber-600" size={24} />
        </h2>
        <p className="text-stone-500 mt-3 font-serif italic">"คลิกที่ซองจดหมายเพื่อเปิดอ่านข้อความข้างใน"</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* ซองจดหมายถึงเพื่อน */}
        <div>
          <div 
            className="envelope-container" 
            onClick={() => setFriendEnvelopeOpen(!friendEnvelopeOpen)}
          >
            <div className={`envelope ${friendEnvelopeOpen ? 'envelope--open' : ''}`}>
              {/* Letter paper inside */}
              <div className="envelope-letter">
                {friendEnvelopeOpen && (
                  <div className="text-stone-600 leading-relaxed space-y-3 font-serif text-sm">
                    <h3 className="text-lg font-bold text-amber-800 mb-3">ถึงเพื่อนร่วมทาง 🎒</h3>
                    <p>
                      ไม่น่าเชื่อเลยนะว่าเวลา 3 ปี (หรือ 6 ปี) ในรั้วโรงเรียนนี้จะผ่านไปเร็วขนาดนี้ จำวันแรกที่เราเจอกันได้ไหม? จากคนแปลกหน้า กลายมาเป็นคนที่มองตาก็รู้ใจ
                    </p>
                    <p>
                      ขอบคุณสำหรับทุกเสียงหัวเราะ ทุกคาบที่แอบหลับ ทุกงานกลุ่มที่ปั่นไฟลุก และทุกความทรงจำบ้าๆ บอๆ ที่เราสร้างมาด้วยกัน
                    </p>
                    <p>
                      ต่อไปนี้อาจจะไม่ได้เจอกันทุกวันเช้าเย็นแล้ว ขอให้ทุกคนโชคดีในเส้นทางที่เลือกนะ โตเป็นผู้ใหญ่ที่ใจดีกับตัวเองให้มากๆ แล้วอย่าลืมกลับมาอัปเดตชีวิตให้ฟังกันบ้างล่ะ โชคดีนะพวกมึง!
                    </p>
                    <div className="pt-4 text-right">
                      <p className="font-bold text-amber-700 italic">- จากเจ้าของเว็บ</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Flap */}
              <div className="envelope-flap envelope-flap--friend"></div>
              
              {/* Seal */}
              <div className="envelope-seal envelope-seal--friend">❤️</div>
              
              {/* Body */}
              <div className="envelope-body envelope-body--friend">
                <div className="envelope-label" style={{ color: '#92400e' }}>
                  ถึงเพื่อนร่วมทาง 🎒
                </div>
              </div>
            </div>
          </div>
          <p className="envelope-hint">
            {friendEnvelopeOpen ? 'คลิกเพื่อปิดซอง' : 'คลิกเพื่อเปิดอ่านจดหมาย'}
          </p>
        </div>

        {/* ซองจดหมายถึงครู */}
        <div>
          <div 
            className="envelope-container" 
            onClick={() => setTeacherEnvelopeOpen(!teacherEnvelopeOpen)}
          >
            <div className={`envelope ${teacherEnvelopeOpen ? 'envelope--open' : ''}`}>
              {/* Letter paper inside */}
              <div className="envelope-letter">
                {teacherEnvelopeOpen && (
                  <div className="text-stone-600 leading-relaxed space-y-3 font-serif text-sm">
                    <h3 className="text-lg font-bold text-indigo-800 mb-3">กราบเรียน คุณครูที่เคารพ 🎓</h3>
                    <p>
                      หนู/ผม ขอกราบขอบพระคุณคุณครูทุกท่านจากใจจริงค่ะ/ครับ ขอบคุณที่อดทนกับความดื้อรั้น ความซน และเสียงดังโวยวายของพวกเรามาตลอด
                    </p>
                    <p>
                      ทุกคำสอน ทุกการดุเตือน ล้วนมาจากความหวังดีที่อยากเห็นพวกเราได้ดี ขอบคุณที่ไม่เคยปล่อยมือและคอยผลักดันให้พวกเราเดินมาถึงจุดนี้ได้
                    </p>
                    <p>
                      พวกเราสัญญาว่าจะนำวิชาความรู้ และคำสอนเรื่องการใช้ชีวิตที่ครูพร่ำสอน ไปเป็นเข็มทิศนำทางในการเติบโตเป็นคนดีของสังคมค่ะ ขอให้คุณครูทุกท่านสุขภาพแข็งแรง และมีความสุขมากๆ นะคะ/ครับ
                    </p>
                    <div className="pt-4 text-right">
                      <p className="font-bold text-indigo-700 italic">- จากลูกศิษย์ (เจ้าของเว็บ)</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Flap */}
              <div className="envelope-flap envelope-flap--teacher"></div>
              
              {/* Seal */}
              <div className="envelope-seal envelope-seal--teacher">🎓</div>
              
              {/* Body */}
              <div className="envelope-body envelope-body--teacher">
                <div className="envelope-label" style={{ color: '#3730a3' }}>
                  กราบเรียน คุณครู 🎓
                </div>
              </div>
            </div>
          </div>
          <p className="envelope-hint">
            {teacherEnvelopeOpen ? 'คลิกเพื่อปิดซอง' : 'คลิกเพื่อเปิดอ่านจดหมาย'}
          </p>
        </div>
      </div>
    </div>
  );

  // Lightbox Modal Component
  const ImageModal = () => {
    if (!selectedImage) return null;
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedImage(null)}
      >
        <button 
          className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <X size={24} />
        </button>
        <img 
          src={selectedImage} 
          alt="Enlarged gallery view" 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  // ฟังก์ชันคำนวณทิศทางการสไลด์ของแต่ละหน้า
  const getTabStyles = (tabId) => {
    const tabOrder = ['write', 'read', 'gallery', 'owner'];
    const activeIdx = tabOrder.indexOf(activeTab);
    const currentIdx = tabOrder.indexOf(tabId);

    if (currentIdx === activeIdx) {
      return "relative opacity-100 translate-x-0 pointer-events-auto z-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]";
    } else if (currentIdx < activeIdx) {
      return "absolute top-0 left-0 w-full opacity-0 -translate-x-[20%] pointer-events-none z-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]";
    } else {
      return "absolute top-0 left-0 w-full opacity-0 translate-x-[20%] pointer-events-none z-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]";
    }
  };

  // ==========================================
  // Main Render
  // ==========================================
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: floatingLabelStyles }} />
      <div className="min-h-screen bg-[#F9F6F0] font-sans text-stone-800 selection:bg-amber-200 selection:text-amber-900 pb-20 relative overflow-x-hidden">
      {/* Subtle Nostalgic Lighting Effects (Sunlight) */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-300/20 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-200/20 blur-[100px] pointer-events-none" />
      <div className="fixed top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-rose-200/10 blur-[80px] pointer-events-none" />
      
      {/* Paper texture overlay (subtle) */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Header */}
      <header className="pt-20 pb-12 px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-stone-800 tracking-tight drop-shadow-sm mb-4">
          Farewell <span className="text-amber-700 italic font-medium">M.6</span>
        </h1>
        <p className="text-stone-500 font-serif italic text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          " สมุดบันทึกความทรงจำเล่มสุดท้าย...<br className="md:hidden"/>
          ก่อนที่เราจะแยกย้ายกันไปเติบโตในเส้นทางของตัวเอง "
        </p>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 relative z-10">
        {renderTabs()}
        
        {/* เปลี่ยนระบบการสลับหน้าเป็นการใช้เทคนิคจัดวางทับกันแล้วสไลด์เข้าออก */}
        <div className="relative w-full">
          <div className={getTabStyles('write')}>
            {renderWriteForm()}
          </div>
          <div className={getTabStyles('read')}>
            {renderReadEntries()}
          </div>
          <div className={getTabStyles('gallery')}>
            {renderGallery()}
          </div>
          <div className={getTabStyles('owner')}>
            {renderOwnerMessage()}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ImageModal />
    </div>
    </>
  );
}
