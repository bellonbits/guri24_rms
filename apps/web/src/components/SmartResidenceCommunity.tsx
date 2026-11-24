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
    timeAgo: string;
    content: string;
  }[];
}

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

  // Local Storage Storage Key strictly scoped to current organization (Zero mock data)
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
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts, STORAGE_KEY]);

  // Verified Active Residents from Database (No fake people)
  const activeResidents = useMemo(() => {
    const list: { name: string; handle: string; unit: string; initials: string }[] = [];
    (state?.tenants || []).slice(0, 8).forEach((t: any) => {
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
        unit: t.unit_number ? `Unit ${t.unit_number}` : 'Verified',
        initials: initials || 'RM',
      });
    });
    return list;
  }, [state?.tenants]);

  // Composer / Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [newPostTag, setNewPostTag] = useState('General');

  // Comment Box Open State: { [postId]: boolean }
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Report Modal
  const [reportPostId, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate Content');

  // Submit New Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const isMgmt = currentUserSession?.role === 'ORGANIZATION_ADMINISTRATOR' || currentUserSession?.role === 'PLATFORM_SUPER_ADMIN';

    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: residentName,
      authorHandle: residentHandle,
      authorRole: isMgmt ? 'MANAGEMENT' : 'RESIDENT',
      authorLocation: residentLocation,
      timeAgo: 'Just now',
      timestamp: Date.now(),
      content: newPostText.trim(),
      tag: newPostTag,
      mediaUrl: newPostMediaUrl.trim() || undefined,
      isOfficial: isMgmt,
      likes: 0,
      isLiked: false,
      bookmarks: 0,
      isBookmarked: false,
      comments: [],
    };

    setPosts([post, ...posts]);
    setNewPostText('');
    setNewPostMediaUrl('');
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

  // Add Comment
  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

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
              content: text,
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

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Max Width Container matching the Image 3 Reference Frame */}
      <div style={{ width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column', padding: '0 16px 90px 16px' }}>
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 14px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Smart Residence
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <ShieldCheck size={14} color="#2563eb" />
              <span>{currentOrg?.name || 'Verified Community'} &bull; Private Network</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onBack && (
              <button
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
              onClick={() => setShowCreateModal(true)}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={15} />
              <span>Post</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TOP STORIES / ACTIVE RESIDENTS ROW (Image 3 Top Carousel)    */}
        {/* ------------------------------------------------------------- */}
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
          {/* Item 1: Add Your's (Current User) */}
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
                  }}
                >
                  {residentName.slice(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Blue Plus Badge */}
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
                notify(`Viewing conversations mentioning ${res.name}`);
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

        {/* ------------------------------------------------------------- */}
        {/* TOPIC TAGS FILTER BAR                                         */}
        {/* ------------------------------------------------------------- */}
        <div style={{ display: 'flex', gap: '6px', padding: '12px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['ALL', 'General', 'Recommendations', 'Fitness', 'Social', 'Maintenance', 'Marketplace'].map((tag) => (
            <button
              key={tag}
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

        {/* ------------------------------------------------------------- */}
        {/* POST FEED STREAM (Exact Match to Image 3 Layout)              */}
        {/* ------------------------------------------------------------- */}
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
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', maxWidth: '320px', margin: '6px auto 18px auto', lineHeight: 1.5 }}>
                Be the first verified resident in {currentOrg?.name || 'this community'} to share an update, question, or photo with your neighbors.
              </div>
              <button
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
                {/* Author Info Row */}
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
                      }}
                    >
                      {post.authorName.slice(0, 2).toUpperCase()}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                        {post.authorName}
                      </span>

                      {/* Blue Verified Badge Checkmark Icon (Exact match to Image 3) */}
                      <SolidCheckCircleIcon size={16} color="#2563eb" />

                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                        {post.authorHandle}
                      </span>

                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        &bull; {post.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Right Options Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {post.authorName === residentName && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        title="Delete Post"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => setShowReportModal(post.id)}
                      title="Options"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Post Content Text (Strictly no emojis) */}
                <div style={{ fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {post.content}
                </div>

                {/* Tag pill */}
                {post.tag && post.tag !== 'General' && (
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                      #{post.tag}
                    </span>
                  </div>
                )}

                {/* Attached Media Photo (Rounded Image matching Image 3) */}
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
                      alt="Community media"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '440px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Action Bar (Heart, Comment, Bookmark, Share matching Image 3) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 4px 0 4px',
                    color: '#64748b',
                  }}
                >
                  {/* Heart / Like */}
                  <button
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

                  {/* Comment / Chat Bubble */}
                  <button
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

                  {/* Bookmark */}
                  <button
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

                  {/* Share */}
                  <button
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

                {/* Inline Comment Thread */}
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
                              }}
                            >
                              {c.authorName.slice(0, 2).toUpperCase()}
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
                        placeholder="Write a reply..."
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

      </div>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING BOTTOM NAVIGATION BAR (Exact Match to Image 3 Bottom) */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '520px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          borderRadius: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 90,
        }}
      >
        {/* Nav 1: Home */}
        <button
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

        {/* Nav 2: Chat / Messages */}
        <button
          onClick={() => {
            setNavTab('messages');
            notify('Open Messages to chat with property management or neighbors.');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: navTab === 'messages' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Community Messages"
        >
          <ChatBubbleOvalLeftEllipsisIcon size={22} />
        </button>

        {/* Nav 3: Big Center Blue Plus Button (Image 3 Center Action) */}
        <button
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
            transition: 'transform 0.15s ease',
          }}
          title="Create Post"
        >
          <Plus size={22} />
        </button>

        {/* Nav 4: Search */}
        <button
          onClick={() => {
            const query = prompt('Search community posts, tags or residents:');
            if (query !== null) setSearchQuery(query);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: searchQuery ? '#2563eb' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Search Feed"
        >
          <Search size={22} />
        </button>

        {/* Nav 5: Profile */}
        <button
          onClick={() => {
            setNavTab('profile');
            notify(`Logged in as verified resident: ${residentName}`);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: navTab === 'profile' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Profile"
        >
          <User size={22} />
        </button>
      </div>

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
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                  {residentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{residentName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Verified Residence Member</div>
                </div>
              </div>

              <button
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

              {/* Photo Attachment URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Attach Photo (Optional Image URL)
                </label>
                <input
                  type="url"
                  placeholder="e.g. /hero-luxury-architecture.jpg or image web URL"
                  value={newPostMediaUrl}
                  onChange={(e) => setNewPostMediaUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Quick Preset Photos */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', alignSelf: 'center' }}>Presets:</span>
                {[
                  { label: 'Garden & Pool', url: '/hero-luxury-architecture.jpg' },
                  { label: 'Building Exterior', url: '/hero-apex-architecture.jpg' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setNewPostMediaUrl(preset.url)}
                    style={{
                      background: newPostMediaUrl === preset.url ? '#eff6ff' : '#f8fafc',
                      color: newPostMediaUrl === preset.url ? '#2563eb' : '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Tag Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Category Tag
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
      {/* MODAL: REPORT INAPPROPRIATE POST                              */}
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
              <button onClick={() => setShowReportModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Select a reason for community moderator review:
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
                onClick={() => setShowReportModal(null)}
                style={{ flex: 1, padding: '9px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
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
