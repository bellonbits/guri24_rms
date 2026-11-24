import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share,
  Flag,
  Users,
  Calendar,
  ShoppingBag,
  ShieldCheck,
  Search,
  Plus,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Building,
  MapPin,
  Clock,
  Tag,
  Send,
  MoreHorizontal,
  User,
  Home,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  SolidCheckCircleIcon,
  Camera,
  Trash,
  Phone,
  Wrench,
  Info,
} from './heroicons';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';

export interface SmartResidenceCommunityProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorRole: 'RESIDENT' | 'MANAGEMENT';
  authorLocation: string; // e.g., 'Block A · 2nd Floor'
  authorAvatar?: string;
  timeAgo: string;
  timestamp: number;
  content: string;
  tag?: string;
  mediaUrl?: string;
  isOfficial?: boolean;
  likes: number;
  isLiked?: boolean;
  bookmarks: number;
  isBookmarked?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorLocation: string;
    authorAvatar?: string;
    timeAgo: string;
    content: string;
  }[];
}

// Client-side high-quality image compressor (produces lightweight base64 data URLs)
const compressImageFile = (file: File, maxDim = 1200, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Strictly detect and purge legacy mock / demo posts or any post with emojis
const isMockOrEmojiPost = (p: any): boolean => {
  if (!p || typeof p !== 'object') return true;
  const mockHandles = ['@janem', '@davidk', '@patrik9', '@gerald_hart', '@joey_rev', '@management'];
  const mockNames = ['Jane M.', 'David K.', 'Patrick Hill', 'Gerald Hart', 'Joey Reeves', 'Residence Operations & Management'];
  const mockIds = ['post-1', 'post-2', 'post-3', 'demo-1', 'demo-2'];

  if (
    mockHandles.includes(p.authorHandle) ||
    mockNames.includes(p.authorName) ||
    mockIds.includes(p.id)
  ) {
    return true;
  }

  // Strictly check if content has emoji characters
  if (typeof p.content === 'string' && /\p{Extended_Pictographic}/u.test(p.content)) {
    return true;
  }

  return false;
};

export const SmartResidenceCommunity: React.FC<SmartResidenceCommunityProps> = ({ onBack, showToast }) => {
  const { currentOrg, currentUserSession } = useAuth();
  const { state } = useRms();

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  // Active Bottom Navigation View: 'feed' | 'messages' | 'search' | 'profile'
  const [navTab, setNavTab] = useState<'feed' | 'messages' | 'search' | 'profile'>('feed');

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState<string>('ALL');

  // Local Storage Key strictly scoped to current organization (Zero mock data policy)
  const STORAGE_KEY = `unitflow_residence_posts_${currentOrg?.id || 'live'}`;

  // Real Tenant / Admin Identity
  const residentName = useMemo(() => {
    if (currentUserSession?.name && currentUserSession.name !== 'Resident' && currentUserSession.name !== 'Tenant Resident') {
      return currentUserSession.name;
    }
    return 'Resident Member';
  }, [currentUserSession]);

  const residentHandle = useMemo(() => {
    const raw = residentName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `@${raw || 'resident'}`;
  }, [residentName]);

  const residentLocation = useMemo(() => {
    if (currentUserSession?.role === 'ORGANIZATION_ADMINISTRATOR' || currentUserSession?.role === 'PLATFORM_SUPER_ADMIN') {
      return 'Property Management';
    }
    return 'Verified Residence';
  }, [currentUserSession]);

  // Load Posts from LocalStorage (Production data only - Zero fake mock posts)
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Immediately purge any legacy mock posts or emoji posts
          const cleaned = parsed.filter((p) => !isMockOrEmojiPost(p));
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  // Keep localStorage sanitized and synced
  useEffect(() => {
    try {
      const cleaned = posts.filter((p) => !isMockOrEmojiPost(p));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    } catch {}
  }, [posts, STORAGE_KEY]);

  // Verified Active Residents from Database (No fake people)
  const activeResidents = useMemo(() => {
    const list: { name: string; handle: string; unit: string; initials: string }[] = [];
    (state?.tenants || []).slice(0, 10).forEach((t: any) => {
      const name = t.name || t.fullName || 'Resident';
      const initials = name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      list.push({
        name,
        handle: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        unit: t.unit_number ? `Unit ${t.unit_number}` : 'Verified Unit',
        initials: initials || 'RM',
      });
    });
    return list;
  }, [state?.tenants]);

  // Composer / Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag, setNewPostTag] = useState('General');

  // User Profile Photo & Post Attachment State
  const AVATAR_KEY = `unitflow_resident_avatar_${currentOrg?.id || 'live'}`;
  const profileFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const postFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [residentAvatar, setResidentAvatar] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AVATAR_KEY) || null;
    } catch {
      return null;
    }
  });

  const [selectedPostPhoto, setSelectedPostPhoto] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);

  const handleProfileAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 400, 0.9);
      setResidentAvatar(compressed);
      try {
        localStorage.setItem(AVATAR_KEY, compressed);
      } catch {}
      notify('Profile photo updated successfully.');
    } catch {
      notify('Unable to process photo. Please choose an image file.');
    }
  };

  const handlePostPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingPhoto(true);
    try {
      const compressed = await compressImageFile(file, 1200, 0.85);
      setSelectedPostPhoto(compressed);
      notify('Photo attached. Ready to publish.');
    } catch {
      notify('Could not load photo. Please try a different image.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Comment Box Open State: { [postId]: boolean }
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Report Modal
  const [reportPostId, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate Content');

  // Submit New Post (Strictly zero emojis)
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedPostPhoto) return;

    // Check if user accidentally pasted emojis, strip them cleanly
    const sanitizedText = newPostText.replace(/\p{Extended_Pictographic}/gu, '').trim();
    if (!sanitizedText && !selectedPostPhoto) {
      notify('Please enter post text without emojis.');
      return;
    }

    const isMgmt = currentUserSession?.role === 'ORGANIZATION_ADMINISTRATOR' || currentUserSession?.role === 'PLATFORM_SUPER_ADMIN';

    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: residentName,
      authorHandle: residentHandle,
      authorRole: isMgmt ? 'MANAGEMENT' : 'RESIDENT',
      authorLocation: residentLocation,
      authorAvatar: residentAvatar || undefined,
      timeAgo: 'Just now',
      timestamp: Date.now(),
      content: sanitizedText,
      tag: newPostTag,
      mediaUrl: selectedPostPhoto || undefined,
      isOfficial: isMgmt,
      likes: 0,
      isLiked: false,
      bookmarks: 0,
      isBookmarked: false,
      comments: [],
    };

    setPosts([post, ...posts]);
    setNewPostText('');
    setSelectedPostPhoto(null);
    if (postFileInputRef.current) postFileInputRef.current.value = '';
    setNewPostTag('General');
    setShowCreateModal(false);
    notify('Post published to verified residence feed.');
  };

  // Toggle Like
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const next = !p.isLiked;
        return {
          ...p,
          isLiked: next,
          likes: next ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  };

  // Toggle Bookmark
  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const next = !p.isBookmarked;
        return {
          ...p,
          isBookmarked: next,
          bookmarks: next ? p.bookmarks + 1 : Math.max(0, p.bookmarks - 1),
        };
      })
    );
    notify('Bookmark status updated.');
  };

  // Add Comment (Strictly zero emojis)
  const handleAddComment = (postId: string) => {
    const rawText = (commentInputs[postId] || '').trim();
    if (!rawText) return;

    const sanitized = rawText.replace(/\p{Extended_Pictographic}/gu, '').trim();
    if (!sanitized) {
      notify('Please enter a reply without emojis.');
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              authorName: residentName,
              authorLocation: residentLocation,
              timeAgo: 'Just now',
              content: sanitized,
            },
          ],
        };
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    notify('Reply posted to conversation.');
  };

  // Delete Own Post
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    notify('Post removed from residence feed.');
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.authorHandle.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    if (activeTagFilter !== 'ALL') {
      list = list.filter((p) => p.tag === activeTagFilter);
    }

    list.sort((a, b) => b.timestamp - a.timestamp);
    return list;
  }, [posts, searchQuery, activeTagFilter]);

  // User Authored and Bookmarked Posts
  const myPosts = useMemo(() => {
    return posts.filter((p) => p.authorName === residentName);
  }, [posts, residentName]);

  const bookmarkedPosts = useMemo(() => {
    return posts.filter((p) => p.isBookmarked);
  }, [posts]);

  const [profileSubTab, setProfileSubTab] = useState<'my_posts' | 'bookmarks'>('my_posts');

  // Direct Community Messages State
  const [communityChatRecipient, setCommunityChatRecipient] = useState<string>('Management Desk');
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string; isMe: boolean }[]>([
    {
      id: 'msg-welcome',
      sender: 'Management Desk',
      text: 'Welcome to your verified residence network. You can message building operations or fellow verified residents here.',
      time: '10:00 AM',
      isMe: false,
    },
  ]);
  const [chatInputText, setChatInputText] = useState('');

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    const clean = chatInputText.replace(/\p{Extended_Pictographic}/gu, '').trim();
    if (!clean) {
      notify('Please enter message text without emojis.');
      return;
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: `chat-${Date.now()}`,
        sender: residentName,
        text: clean,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      },
    ]);
    setChatInputText('');
    notify(`Message sent to ${communityChatRecipient}.`);
  };

  // Topic Categories List
  const topicTags = ['ALL', 'General', 'Recommendations', 'Fitness', 'Social', 'Maintenance', 'Marketplace'];

  return (
    <div className="smart-community-wrapper">
      <div className="smart-community-grid">

        {/* ------------------------------------------------------------- */}
        {/* 1. LEFT SIDEBAR: DESKTOP ONLY (≥ 1024px)                      */}
        {/* ------------------------------------------------------------- */}
        <aside className="smart-community-left-col">
          {/* Verified Resident Profile Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Hidden file input for resident profile avatar */}
            <input
              type="file"
              ref={profileFileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfileAvatarChange}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                onClick={() => profileFileInputRef.current?.click()}
                title="Click to change your profile photo"
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  border: '2px solid #e2e8f0',
                }}
              >
                {residentAvatar ? (
                  <img
                    src={residentAvatar}
                    alt={residentName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  residentName.slice(0, 2).toUpperCase()
                )}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {residentName}
                  </span>
                  <SolidCheckCircleIcon size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{residentHandle}</div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '2px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={14} color="#2563eb" />
                <span>{currentOrg?.name || 'Verified Property'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#16a34a" />
                <span>{residentLocation} &bull; Verified Member</span>
              </div>
            </div>
          </div>

          {/* Topic Channels / Navigation Menu */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '18px 14px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px 6px 8px' }}>
              Residence Channels
            </div>

            {topicTags.map((tag) => {
              const active = activeTagFilter === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTagFilter(tag)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: active ? '#0f172a' : 'transparent',
                    color: active ? '#ffffff' : '#334155',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tag === 'ALL' ? 'All Community Feed' : `#${tag}`}</span>
                  {active && <Check size={14} color="#38bdf8" />}
                </button>
              );
            })}
          </div>

          {/* Community Standards & Guidelines */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '18px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#2563eb" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Community Principles</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.5 }}>
              Strictly verified residents only. Respect neighbor privacy, uphold safety standards, and keep conversations constructive.
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------- */}
        {/* 2. CENTER FEED COLUMN: RESPONSIVE FLUID STREAM                */}
        {/* ------------------------------------------------------------- */}
        <main className="smart-community-center-col">
          {/* Top Header Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0 14px 0',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Smart Residence
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <ShieldCheck size={14} color="#2563eb" />
                <span>{currentOrg?.name || 'Verified Community'} &bull; Private Social Network</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  Exit
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '7px 18px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                }}
              >
                <Plus size={15} />
                <span>Post</span>
              </button>
            </div>
          </div>

          {/* TAB 1: HOME FEED */}
          {navTab === 'feed' && (
            <>
              {/* Active Residents Stories Carousel (Image 3 Top Bar) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  overflowX: 'auto',
                  padding: '16px 0 14px 0',
                  borderBottom: '1px solid #f1f5f9',
                  scrollbarWidth: 'none',
                }}
              >
                {/* Add Yours Bubble */}
                <div
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    width: '68px',
                  }}
                >
                  <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '2px dashed #2563eb',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.94rem',
                          overflow: 'hidden',
                        }}
                      >
                        {residentAvatar ? (
                          <img
                            src={residentAvatar}
                            alt={residentName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          residentName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '18px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        background: '#2563eb',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #ffffff',
                      }}
                    >
                      <Plus size={13} />
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', marginTop: '8px', textAlign: 'center' }}>
                    Add Yours
                  </span>
                </div>

                {/* Active Verified Residents from Database */}
                {activeResidents.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(res.name);
                      setNavTab('search');
                      notify(`Filtering feed by ${res.name}`);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      width: '68px',
                    }}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '2px solid #0f172a',
                        padding: '2px',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: '#f1f5f9',
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.86rem',
                        }}
                      >
                        {res.initials}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginTop: '8px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '68px',
                      }}
                    >
                      {res.name.split(' ')[0]}
                    </span>
                  </div>
                ))}

                {activeResidents.length === 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.74rem', padding: '16px 0' }}>
                    <span>Verified residents who register will appear in this community ring.</span>
                  </div>
                )}
              </div>

              {/* Topic Tags Horizontal Pill Bar */}
              <div style={{ display: 'flex', gap: '6px', padding: '12px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {topicTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTagFilter(tag)}
                    style={{
                      background: activeTagFilter === tag ? '#0f172a' : '#f8fafc',
                      color: activeTagFilter === tag ? '#ffffff' : '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tag === 'ALL' ? 'All Posts' : `#${tag}`}
                  </button>
                ))}
              </div>

              {/* Post Feed Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', marginTop: '10px' }}>
                {filteredPosts.length === 0 ? (
                  <div
                    style={{
                      padding: '56px 20px',
                      textAlign: 'center',
                      background: '#ffffff',
                      borderRadius: '20px',
                      border: '1px dashed #e2e8f0',
                      margin: '16px 0',
                    }}
                  >
                    <ChatBubbleLeftRightIcon size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      No community posts yet
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', maxWidth: '340px', margin: '6px auto 18px auto', lineHeight: 1.5 }}>
                      Be the first verified resident in {currentOrg?.name || 'this community'} to share an update, question, or photo with your neighbors.
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '9px 24px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Create First Post
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      {/* Author Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: '#0f172a',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              flexShrink: 0,
                              overflow: 'hidden',
                            }}
                          >
                            {(post.authorAvatar || (post.authorName === residentName ? residentAvatar : undefined)) ? (
                              <img
                                src={post.authorAvatar || (post.authorName === residentName ? residentAvatar! : '')}
                                alt={post.authorName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              post.authorName.slice(0, 2).toUpperCase()
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                              {post.authorName}
                            </span>

                            <SolidCheckCircleIcon size={16} color="#2563eb" />

                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                              {post.authorHandle}
                            </span>

                            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              &bull; {post.timeAgo}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {post.authorName === residentName && (
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              title="Delete Post"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowReportModal(post.id)}
                            title="Options"
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Clean Text (NO emojis) */}
                      <div style={{ fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {post.content}
                      </div>

                      {/* Category Tag */}
                      {post.tag && post.tag !== 'General' && (
                        <div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                            #{post.tag}
                          </span>
                        </div>
                      )}

                      {/* Attached Media Photo (20px Rounded Corners) */}
                      {post.mediaUrl && (
                        <div
                          style={{
                            width: '100%',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            background: '#0f172a',
                            marginTop: '4px',
                          }}
                        >
                          <img
                            src={post.mediaUrl}
                            alt="Community attachment"
                            style={{
                              width: '100%',
                              height: 'auto',
                              maxHeight: '460px',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Action Bar (Heart, Comment, Bookmark, Share) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 4px 0 4px',
                          color: '#64748b',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: post.isLiked ? '#dc2626' : '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                          }}
                        >
                          <Heart size={20} color={post.isLiked ? '#dc2626' : '#64748b'} />
                          {post.likes > 0 && <span>{post.likes}</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: openCommentPostId === post.id ? '#2563eb' : '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                          }}
                        >
                          <ChatBubbleOvalLeftEllipsisIcon size={20} />
                          {post.comments.length > 0 && <span>{post.comments.length}</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: post.isBookmarked ? '#2563eb' : '#64748b',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Bookmark size={20} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            notify('Post link copied to clipboard.');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Share size={20} />
                        </button>
                      </div>

                      {/* Inline Comments Thread */}
                      {openCommentPostId === post.id && (
                        <div
                          style={{
                            background: '#f8fafc',
                            borderRadius: '16px',
                            padding: '14px',
                            marginTop: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                          }}
                        >
                          {post.comments.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {post.comments.map((c) => (
                                <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                  <div
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '50%',
                                      background: '#0f172a',
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      flexShrink: 0,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {(c.authorAvatar || (c.authorName === residentName ? residentAvatar : undefined)) ? (
                                      <img
                                        src={c.authorAvatar || (c.authorName === residentName ? residentAvatar! : '')}
                                        alt={c.authorName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      c.authorName.slice(0, 2).toUpperCase()
                                    )}
                                  </div>
                                  <div style={{ background: '#ffffff', borderRadius: '12px', padding: '8px 12px', flex: 1, border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{c.authorName}</span>
                                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{c.timeAgo}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#1e293b', marginTop: '2px' }}>{c.content}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              placeholder="Write a reply (no emojis)..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '16px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.82rem',
                                outline: 'none',
                                background: '#ffffff',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!(commentInputs[post.id] || '').trim()}
                              style={{
                                background: '#0f172a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '7px 14px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* TAB 2: INTERACTIVE SEARCH VIEW */}
          {navTab === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '8px 14px' }}>
                <Search size={18} color="#2563eb" />
                <input
                  type="text"
                  placeholder="Search community posts, tags, or neighbors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.88rem',
                    flex: 1,
                    color: '#0f172a',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Tag filters */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {topicTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTagFilter(tag)}
                    style={{
                      background: activeTagFilter === tag ? '#0f172a' : '#f8fafc',
                      color: activeTagFilter === tag ? '#ffffff' : '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tag === 'ALL' ? 'All' : `#${tag}`}
                  </button>
                ))}
              </div>

              {/* Search Results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>
                  {filteredPosts.length} result{filteredPosts.length === 1 ? '' : 's'} {searchQuery ? `for "${searchQuery}"` : ''}
                </div>
                {filteredPosts.length === 0 ? (
                  <div style={{ padding: '40px 16px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <Search size={28} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>No matching posts found</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Try searching by resident name, hashtag, or keyword.</div>
                  </div>
                ) : (
                  filteredPosts.map((p) => (
                    <div key={p.id} style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{p.authorName}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.timeAgo}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '6px' }}>{p.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY DIRECT MESSAGES */}
          {navTab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Chat with {communityChatRecipient}
                </div>
                <button
                  type="button"
                  onClick={() => setNavTab('feed')}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '4px 12px', fontSize: '0.74rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
                >
                  Back to Feed
                </button>
              </div>

              {/* Recipient Selector Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {['Management Desk', ...activeResidents.map((r) => r.name)].map((name) => {
                  const isSelected = communityChatRecipient === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setCommunityChatRecipient(name)}
                      style={{
                        background: isSelected ? '#0f172a' : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#334155',
                        border: '1px solid ' + (isSelected ? '#0f172a' : '#e2e8f0'),
                        borderRadius: '16px',
                        padding: '6px 14px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              {/* Message History Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '16px', minHeight: '280px', maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      background: msg.isMe ? '#2563eb' : '#ffffff',
                      color: msg.isMe ? '#ffffff' : '#0f172a',
                      borderRadius: '16px',
                      padding: '10px 14px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      border: msg.isMe ? 'none' : '1px solid #e2e8f0',
                    }}
                  >
                    {!msg.isMe && (
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', marginBottom: '2px' }}>
                        {msg.sender}
                      </div>
                    )}
                    <div style={{ fontSize: '0.84rem', lineHeight: 1.4 }}>{msg.text}</div>
                    <div style={{ fontSize: '0.66rem', color: msg.isMe ? 'rgba(255,255,255,0.7)' : '#94a3b8', textAlign: 'right', marginTop: '4px' }}>
                      {msg.time}
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Message Form */}
              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder={`Send direct message to ${communityChatRecipient}...`}
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '16px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                />
                <button
                  type="submit"
                  disabled={!chatInputText.trim()}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '0 20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: !chatInputText.trim() ? 'not-allowed' : 'pointer',
                    opacity: !chatInputText.trim() ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: RESIDENT PROFILE VIEW */}
          {navTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '16px 0' }}>
              <div style={{ background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    onClick={() => profileFileInputRef.current?.click()}
                    title="Click to change profile photo"
                    style={{
                      position: 'relative',
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      border: '2px solid #e2e8f0',
                      flexShrink: 0,
                    }}
                  >
                    {residentAvatar ? (
                      <img
                        src={residentAvatar}
                        alt={residentName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      residentName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{residentName}</span>
                      <SolidCheckCircleIcon size={18} color="#2563eb" />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{residentHandle}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => profileFileInputRef.current?.click()}
                        style={{
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '12px',
                          padding: '3px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Camera size={13} />
                        <span>{residentAvatar ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                        {residentLocation} &bull; Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{myPosts.length}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>My Posts</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{bookmarkedPosts.length}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Saved Bookmarks</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{activeResidents.length}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Neighbors</div>
                  </div>
                </div>
              </div>

              {/* Profile Subtabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setProfileSubTab('my_posts')}
                  style={{
                    background: profileSubTab === 'my_posts' ? '#0f172a' : 'transparent',
                    color: profileSubTab === 'my_posts' ? '#ffffff' : '#64748b',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '6px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  My Posts ({myPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSubTab('bookmarks')}
                  style={{
                    background: profileSubTab === 'bookmarks' ? '#0f172a' : 'transparent',
                    color: profileSubTab === 'bookmarks' ? '#ffffff' : '#64748b',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '6px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Bookmarks ({bookmarkedPosts.length})
                </button>
              </div>

              {/* Subtab Content */}
              <div>
                {(profileSubTab === 'my_posts' ? myPosts : bookmarkedPosts).length === 0 ? (
                  <div style={{ padding: '36px 16px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      {profileSubTab === 'my_posts' ? 'No posts authored yet' : 'No bookmarked posts'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                      {profileSubTab === 'my_posts' ? 'Your published updates will appear here.' : 'Tap the bookmark icon on any post to save it for later.'}
                    </div>
                  </div>
                ) : (
                  (profileSubTab === 'my_posts' ? myPosts : bookmarkedPosts).map((p) => (
                    <div key={p.id} style={{ background: '#ffffff', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{p.authorName}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.timeAgo}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: '6px' }}>{p.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* ------------------------------------------------------------- */}
        {/* 3. RIGHT SIDEBAR: WIDE DESKTOP ONLY (≥ 1280px)                */}
        {/* ------------------------------------------------------------- */}
        <aside className="smart-community-right-col">
          {/* Official Notices Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Megaphone size={16} color="#2563eb" />
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>Management Notices</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px 12px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Resident Smart Access</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                  Keyless gate and biometric lift access active for all registered tenants.
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px 12px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Facility Maintenance</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                  Generator servicing scheduled for the first Monday of next month.
                </div>
              </div>
            </div>
          </div>

          {/* Active Neighbors Directory */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '18px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Verified Neighbors</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{activeResidents.length} Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeResidents.slice(0, 5).map((neighbor, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                      }}
                    >
                      {neighbor.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{neighbor.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{neighbor.unit}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCommunityChatRecipient(neighbor.name);
                        setNavTab('messages');
                        notify(`Started direct chat with ${neighbor.name}`);
                      }}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '12px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        cursor: 'pointer',
                      }}
                    >
                      Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(neighbor.name);
                        setNavTab('search');
                        notify(`Filtering posts by ${neighbor.name}`);
                      }}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                      }}
                    >
                      Posts
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support & Emergency */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={15} color="#2563eb" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Gate &amp; Security Desk</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
              Main gate security station: Available 24/7 for visitor clearance and resident support.
            </div>
            <button
              type="button"
              onClick={() => {
                setCommunityChatRecipient('Security & Front Desk');
                setNavTab('messages');
                notify('Connected to Front Gate Security station.');
              }}
              style={{
                marginTop: '4px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Phone size={13} color="#2563eb" />
              <span>Contact Security Desk</span>
            </button>
          </div>
        </aside>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. FLOATING BOTTOM NAVIGATION: MOBILE ONLY (< 1024px)         */}
      {/* ------------------------------------------------------------- */}
      <nav className="smart-community-mobile-bottom-nav">
        {/* Nav 1: Home Feed */}
        <button
          type="button"
          onClick={() => {
            setNavTab('feed');
            setActiveTagFilter('ALL');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: navTab === 'feed' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Home Feed"
        >
          <Home size={22} />
        </button>

        {/* Nav 2: Chat */}
        <button
          type="button"
          onClick={() => {
            setNavTab('messages');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: navTab === 'messages' ? '#2563eb' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Community Messages"
        >
          <ChatBubbleOvalLeftEllipsisIcon size={22} />
        </button>

        {/* Nav 3: Center Plus Button */}
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
          }}
          title="Create Post"
        >
          <Plus size={22} />
        </button>

        {/* Nav 4: Search */}
        <button
          type="button"
          onClick={() => {
            setNavTab('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: navTab === 'search' ? '#2563eb' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Search Feed"
        >
          <Search size={22} />
        </button>

        {/* Nav 5: Profile */}
        <button
          type="button"
          onClick={() => {
            setNavTab('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: navTab === 'profile' ? '#2563eb' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Profile"
        >
          <User size={22} />
        </button>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE POST                                            */}
      {/* ------------------------------------------------------------- */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', overflow: 'hidden' }}>
                  {residentAvatar ? (
                    <img
                      src={residentAvatar}
                      alt={residentName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    residentName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{residentName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Verified Residence Member</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <textarea
                rows={4}
                required
                placeholder="What is happening in your residence? Ask a question, share recommendations, or organize an activity..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />

              {/* Photo Attachment: Upload from Device (NOT URLs) */}
              <div>
                <input
                  type="file"
                  ref={postFileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePostPhotoSelect}
                />

                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Attach Photo (Upload from Device)
                </label>

                {!selectedPostPhoto ? (
                  <div
                    onClick={() => postFileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '16px',
                      padding: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#f8fafc',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Camera size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        {isProcessingPhoto ? 'Processing photo...' : 'Upload Photo from Device'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                        Click to select an image from your device (PNG, JPG, WebP)
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img
                      src={selectedPostPhoto}
                      alt="Upload preview"
                      style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPostPhoto(null);
                        if (postFileInputRef.current) postFileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Remove photo"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>

              {/* Category Tag */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Category Channel
                </label>
                <select
                  value={newPostTag}
                  onChange={(e) => setNewPostTag(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                >
                  <option value="General">#General</option>
                  <option value="Recommendations">#Recommendations</option>
                  <option value="Fitness">#Fitness</option>
                  <option value="Social">#Social</option>
                  <option value="Maintenance">#Maintenance</option>
                  <option value="Marketplace">#Marketplace</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: !newPostText.trim() ? 'not-allowed' : 'pointer',
                    opacity: !newPostText.trim() ? 0.5 : 1,
                  }}
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: REPORT POST                                            */}
      {/* ------------------------------------------------------------- */}
      {reportPostId && (
        <div
          onClick={() => setShowReportModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flag size={18} color="#dc2626" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Report Post</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Select a reason for confidential community review:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {[
                'Spam or Unauthorized Solicitation',
                'Harassment or Hate Speech',
                'Exposure of Private Information',
                'Misleading Security Notice',
                'Inappropriate Content',
              ].map((reason) => (
                <label
                  key={reason}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: '#1e293b',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: reportReason === reason ? '#eff6ff' : '#f8fafc',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowReportModal(null)}
                style={{ flex: 1, padding: '9px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(null);
                  notify('Report submitted for confidential moderator review.');
                }}
                style={{ flex: 1, padding: '9px', borderRadius: '10px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
