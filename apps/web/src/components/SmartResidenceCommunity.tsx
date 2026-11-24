import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Repeat,
  Bookmark,
  Share,
  Flag,
  Users,
  Calendar,
  ShoppingBag,
  Sparkles,
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
  Eye,
  Tag,
  Paperclip,
  Smile,
  Send,
  MoreHorizontal,
  ChevronDown,
  User,
  Filter,
  DollarSign,
  BanknotesIcon,
  HelpCircle,
  Info,
} from './heroicons';
import { useAuth } from '../context/AuthContext';

export interface SmartResidenceCommunityProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorRole: 'RESIDENT' | 'MANAGEMENT' | 'MODERATOR';
  authorLocation: string; // e.g., 'Block A · 2nd Floor'
  timeAgo: string;
  timestamp: number;
  content: string;
  tags?: string[];
  mediaUrl?: string;
  isOfficial?: boolean;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    userVotedIndex?: number;
    totalVotes: number;
  };
  likes: number;
  isLiked?: boolean;
  reposts: number;
  isReposted?: boolean;
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

export interface CommunityEvent {
  id: string;
  title: string;
  organizer: string;
  organizerRole: 'RESIDENT' | 'MANAGEMENT';
  category: 'Fitness' | 'Social' | 'Meeting' | 'Charity' | 'Kids & Family';
  dateStr: string;
  timeStr: string;
  location: string;
  description: string;
  attendeesCount: number;
  isRsvpd?: boolean;
  isOfficial?: boolean;
}

export interface InterestGroup {
  id: string;
  name: string;
  category: string;
  description: string;
  membersCount: number;
  isJoined?: boolean;
  iconBg: string;
  badgeText: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  priceKes: number;
  isFree?: boolean;
  sellerName: string;
  sellerLocation: string;
  category: 'Furniture' | 'Appliances' | 'Services' | 'Giveaway' | 'Other';
  condition: 'Brand New' | 'Like New' | 'Good' | 'Service';
  description: string;
  timeAgo: string;
  imageUrl?: string;
}

export const SmartResidenceCommunity: React.FC<SmartResidenceCommunityProps> = ({ onBack, showToast }) => {
  const { currentOrg, currentUserSession } = useAuth();

  const notify = (msg: string) => {
    if (showToast) showToast(msg);
  };

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events' | 'marketplace' | 'residents' | 'guidelines'>('feed');
  
  // Feed Filter Sub-Tab
  const [feedFilter, setFeedFilter] = useState<'for-you' | 'latest' | 'official' | 'trending'>('for-you');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Local Storage Keys
  const POSTS_KEY = `unitflow_residence_posts_${currentOrg?.id || 'default'}`;
  const EVENTS_KEY = `unitflow_residence_events_${currentOrg?.id || 'default'}`;
  const GROUPS_KEY = `unitflow_residence_groups_${currentOrg?.id || 'default'}`;
  const MARKET_KEY = `unitflow_residence_market_${currentOrg?.id || 'default'}`;

  // Current User Identity
  const residentName = useMemo(() => {
    return currentUserSession?.name && currentUserSession.name !== 'Resident' ? currentUserSession.name : 'Resident Neighbor';
  }, [currentUserSession]);

  const residentLocation = 'Verified Residence Member';

  // Initial Seed Posts (Authentic Resident Conversations as specified by user)
  const defaultPosts: CommunityPost[] = useMemo(() => [
    {
      id: 'post-1',
      authorName: 'Residence Operations & Management',
      authorHandle: '@management',
      authorRole: 'MANAGEMENT',
      authorLocation: 'Property Operations Desk',
      timeAgo: '1 hr ago',
      timestamp: Date.now() - 3600000,
      content: 'Scheduled preventive water filtration servicing will take place tomorrow from 9:00 AM to 11:30 AM across all blocks. Borehole backup tanks will remain operational throughout.',
      tags: ['Official', 'MaintenanceNotice', 'Utilities'],
      isOfficial: true,
      likes: 14,
      reposts: 5,
      bookmarks: 8,
      comments: [
        {
          id: 'c-1',
          authorName: 'David K.',
          authorLocation: 'Block C · 3rd Floor',
          timeAgo: '42 min ago',
          content: 'Thank you for the advance notice! Will the solar water heating pressure be unaffected?',
        },
        {
          id: 'c-2',
          authorName: 'Residence Operations',
          authorLocation: 'Property Management Office',
          timeAgo: '28 min ago',
          content: 'Hi David, solar pressure remains fully pressurized via Booster Pump 2.',
        },
      ],
    },
    {
      id: 'post-2',
      authorName: 'Jane M.',
      authorHandle: '@janem',
      authorRole: 'RESIDENT',
      authorLocation: 'Block A · 2nd Floor',
      timeAgo: '12 min ago',
      timestamp: Date.now() - 720000,
      content: 'Anyone interested in joining a weekend residents\' morning fitness group? We could meet at the garden & track every Saturday at 7:30 AM for stretching and light cardio! 🏃‍♀️🌿',
      tags: ['Fitness', 'WeekendVibes', 'CommunityGarden'],
      poll: {
        question: 'What time works best for Saturday workout?',
        options: [
          { text: '7:00 AM – 8:00 AM', votes: 12 },
          { text: '8:00 AM – 9:00 AM', votes: 19 },
          { text: 'After 9:00 AM', votes: 4 },
        ],
        totalVotes: 35,
      },
      likes: 24,
      reposts: 3,
      bookmarks: 7,
      comments: [
        {
          id: 'c-3',
          authorName: 'Samuel O.',
          authorLocation: 'Block A · 1st Floor',
          timeAgo: '8 min ago',
          content: 'Count me in! 8:00 AM is perfect before the afternoon sun.',
        },
      ],
    },
    {
      id: 'post-3',
      authorName: 'David K.',
      authorHandle: '@davidk',
      authorRole: 'RESIDENT',
      authorLocation: 'Block C · 35 min ago',
      timeAgo: '35 min ago',
      timestamp: Date.now() - 2100000,
      content: 'Has anyone found a reliable laundry / dry cleaner service around the residence that picks up from the gate? Please share your recommendations below.',
      tags: ['Recommendations', 'Laundry', 'Neighborhood'],
      likes: 9,
      reposts: 1,
      bookmarks: 4,
      comments: [
        {
          id: 'c-4',
          authorName: 'Amina W.',
          authorLocation: 'Block B · Penthouse',
          timeAgo: '18 min ago',
          content: 'I highly recommend Pristine Cleaners — they collect daily at 10 AM at Gate 2 and drop off folded clothes within 24 hours.',
        },
      ],
    },
  ], []);

  // Posts State
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(POSTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultPosts;
  });

  // Sync Posts to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts, POSTS_KEY]);

  // Initial Events Seed
  const defaultEvents: CommunityEvent[] = useMemo(() => [
    {
      id: 'ev-1',
      title: 'Saturday Garden Fitness & Yoga Session',
      organizer: 'Jane M.',
      organizerRole: 'RESIDENT',
      category: 'Fitness',
      dateStr: 'This Saturday, Nov 28',
      timeStr: '7:30 AM - 8:45 AM',
      location: 'Central Lawn & Pavilion',
      description: 'Bring a yoga mat and water bottle! Light bodyweight routine and morning mindfulness open to all fitness levels.',
      attendeesCount: 16,
      isRsvpd: true,
    },
    {
      id: 'ev-2',
      title: 'Quarterly Residents\' Town Hall & Security Review',
      organizer: 'Property Operations Desk',
      organizerRole: 'MANAGEMENT',
      category: 'Meeting',
      dateStr: 'Thursday, Dec 3',
      timeStr: '6:30 PM - 8:00 PM',
      location: 'Clubhouse Main Hall & Zoom Hybrid',
      description: 'Discussion of CCTV perimeter upgrades, access gate card integration, and community garden landscaping plans.',
      attendeesCount: 42,
      isOfficial: true,
      isRsvpd: false,
    },
    {
      id: 'ev-3',
      title: 'Rooftop Sundowner & Acoustic Meetup',
      organizer: 'Social Committee',
      organizerRole: 'RESIDENT',
      category: 'Social',
      dateStr: 'Sunday, Dec 6',
      timeStr: '5:00 PM - 7:30 PM',
      location: 'Block B Rooftop Terrace',
      description: 'Meet your neighbors, share snacks and enjoy sunset views across the skyline. Acoustic music by resident musicians.',
      attendeesCount: 28,
      isRsvpd: false,
    },
  ], []);

  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(EVENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultEvents;
  });

  useEffect(() => {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    } catch {}
  }, [events, EVENTS_KEY]);

  // Initial Interest Groups Seed
  const defaultGroups: InterestGroup[] = useMemo(() => [
    {
      id: 'grp-1',
      name: 'Sports, Running & Gym',
      category: 'Sports & Fitness',
      description: 'Residents organizing morning runs, gym buddies, football match screenings, and weekend cycling.',
      membersCount: 38,
      isJoined: true,
      iconBg: '#2563eb',
      badgeText: 'Active Group',
    },
    {
      id: 'grp-2',
      name: 'Social Life & Gatherings',
      category: 'Social',
      description: 'Board games, barbecue evenings, dinner meetups, and welcoming new residents to our neighborhood.',
      membersCount: 54,
      isJoined: true,
      iconBg: '#ff5e13',
      badgeText: '54 Residents',
    },
    {
      id: 'grp-3',
      name: 'Environment & Urban Gardening',
      category: 'Sustainability',
      description: 'Balcony plants, compost sharing, community garden herbs, and eco-friendly waste recycling tips.',
      membersCount: 22,
      isJoined: false,
      iconBg: '#10b981',
      badgeText: 'Green Initiative',
    },
    {
      id: 'grp-4',
      name: 'Business, Careers & Tech',
      category: 'Professional',
      description: 'Networking, co-working sessions at the lounge, freelancing tips, and local business collaborations.',
      membersCount: 46,
      isJoined: false,
      iconBg: '#0f172a',
      badgeText: 'Networking',
    },
    {
      id: 'grp-5',
      name: 'Pet Lovers & Dog Walking',
      category: 'Pets',
      description: 'Pet playdates, veterinary recommendations, pet-friendly walking routes, and pet-sitting help.',
      membersCount: 19,
      isJoined: false,
      iconBg: '#8b5cf6',
      badgeText: 'Pet Friendly',
    },
  ], []);

  const [groups, setGroups] = useState<InterestGroup[]>(() => {
    try {
      const saved = localStorage.getItem(GROUPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultGroups;
  });

  useEffect(() => {
    try {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    } catch {}
  }, [groups, GROUPS_KEY]);

  // Initial Marketplace Seed
  const defaultMarketplace: MarketplaceListing[] = useMemo(() => [
    {
      id: 'mkt-1',
      title: 'Scandi Wooden 3-Tier Bookshelf',
      priceKes: 6500,
      sellerName: 'David K.',
      sellerLocation: 'Block C · 3rd Floor',
      category: 'Furniture',
      condition: 'Like New',
      description: 'Solid oak finish, less than 6 months old. Moving unit and downsizing. Free pick up from Block C.',
      timeAgo: '2 hrs ago',
    },
    {
      id: 'mkt-2',
      title: 'Baby Stroller (Graco Compact Fold)',
      priceKes: 12000,
      sellerName: 'Sarah O.',
      sellerLocation: 'Block A · 1st Floor',
      category: 'Appliances',
      condition: 'Good',
      description: 'Very well maintained, smooth wheels with rain shield included. Ready for collection.',
      timeAgo: 'Yesterday',
    },
    {
      id: 'mkt-3',
      title: 'Indoor Ceramic Potted Ficus Plant',
      priceKes: 0,
      isFree: true,
      sellerName: 'Jane M.',
      sellerLocation: 'Block A · 2nd Floor',
      category: 'Giveaway',
      condition: 'Like New',
      description: 'Healthy ficus tree in white ceramic pot looking for a good home before travel. Free to any neighbor!',
      timeAgo: '1 day ago',
    },
    {
      id: 'mkt-4',
      title: 'Professional House & Window Cleaning Referral',
      priceKes: 2500,
      sellerName: 'Amina W.',
      sellerLocation: 'Block B · Penthouse',
      category: 'Services',
      condition: 'Service',
      description: 'Our reliable housekeeper of 3 years has open slots on Tuesdays and Thursdays. Thorough and vetted.',
      timeAgo: '3 days ago',
    },
  ], []);

  const [marketItems, setMarketItems] = useState<MarketplaceListing[]>(() => {
    try {
      const saved = localStorage.getItem(MARKET_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultMarketplace;
  });

  useEffect(() => {
    try {
      localStorage.setItem(MARKET_KEY, JSON.stringify(marketItems));
    } catch {}
  }, [marketItems, MARKET_KEY]);

  // Composer Form State
  const [postText, setPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('General');
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [audienceScope, setAudienceScope] = useState<'All Residence' | 'My Building'>('All Residence');

  // Comment Input Mapping: { [postId]: string }
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);

  // Modals
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Spam or Solicitation');

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Fitness' | 'Social' | 'Meeting' | 'Charity' | 'Kids & Family'>('Social');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // New Listing Form State
  const [newListingTitle, setNewListingTitle] = useState('');
  const [newListingCategory, setNewListingCategory] = useState<'Furniture' | 'Appliances' | 'Services' | 'Giveaway' | 'Other'>('Furniture');
  const [newListingPrice, setNewListingPrice] = useState('');
  const [newListingIsFree, setNewListingIsFree] = useState(false);
  const [newListingCondition, setNewListingCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Service'>('Like New');
  const [newListingDesc, setNewListingDesc] = useState('');

  // Handler: Submit Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !pollQuestion.trim()) return;

    let pollData: CommunityPost['poll'] | undefined = undefined;
    if (showPollCreator && pollQuestion.trim()) {
      const validOpts = pollOptions.filter((o) => o.trim().length > 0);
      if (validOpts.length >= 2) {
        pollData = {
          question: pollQuestion.trim(),
          options: validOpts.map((opt) => ({ text: opt.trim(), votes: 0 })),
          totalVotes: 0,
        };
      }
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: residentName,
      authorHandle: `@${residentName.toLowerCase().replace(/\s+/g, '')}`,
      authorRole: 'RESIDENT',
      authorLocation: residentLocation,
      timeAgo: 'Just now',
      timestamp: Date.now(),
      content: postText.trim(),
      tags: selectedTag !== 'General' ? [selectedTag] : ['NeighborUpdate'],
      poll: pollData,
      likes: 0,
      reposts: 0,
      bookmarks: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowPollCreator(false);
    notify('Your update was shared with verified residents!');
  };

  // Handler: Like Post
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextIsLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextIsLiked,
          likes: nextIsLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  };

  // Handler: Repost
  const handleToggleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const next = !p.isReposted;
        return {
          ...p,
          isReposted: next,
          reposts: next ? p.reposts + 1 : Math.max(0, p.reposts - 1),
        };
      })
    );
    notify('Post shared to your community followers.');
  };

  // Handler: Bookmark
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

  // Handler: Vote in Poll
  const handleVotePoll = (postId: string, optIndex: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll || p.poll.userVotedIndex !== undefined) return p;
        const newOptions = [...p.poll.options];
        newOptions[optIndex] = {
          ...newOptions[optIndex],
          votes: newOptions[optIndex].votes + 1,
        };
        return {
          ...p,
          poll: {
            ...p.poll,
            options: newOptions,
            totalVotes: p.poll.totalVotes + 1,
            userVotedIndex: optIndex,
          },
        };
      })
    );
    notify('Vote recorded in community poll!');
  };

  // Handler: Add Comment
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

  // Handler: Toggle Group Join
  const handleToggleGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const next = !g.isJoined;
        return {
          ...g,
          isJoined: next,
          membersCount: next ? g.membersCount + 1 : Math.max(1, g.membersCount - 1),
        };
      })
    );
    notify('Community group membership updated!');
  };

  // Handler: Toggle Event RSVP
  const handleToggleRsvp = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const next = !e.isRsvpd;
        return {
          ...e,
          isRsvpd: next,
          attendeesCount: next ? e.attendeesCount + 1 : Math.max(1, e.attendeesCount - 1),
        };
      })
    );
    notify('Your attendance RSVP has been updated!');
  };

  // Handler: Submit Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const ev: CommunityEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      organizer: residentName,
      organizerRole: 'RESIDENT',
      category: newEventCategory,
      dateStr: newEventDate || 'Upcoming Weekend',
      timeStr: newEventTime || '10:00 AM',
      location: newEventLocation || 'Central Garden Pavilion',
      description: newEventDesc.trim(),
      attendeesCount: 1,
      isRsvpd: true,
    };

    setEvents([ev, ...events]);
    setShowCreateEventModal(false);
    setNewEventTitle('');
    setNewEventLocation('');
    setNewEventDesc('');
    notify('New community activity scheduled and published to neighbors!');
  };

  // Handler: Submit Marketplace Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListingTitle.trim()) return;

    const item: MarketplaceListing = {
      id: `mkt-${Date.now()}`,
      title: newListingTitle.trim(),
      priceKes: newListingIsFree ? 0 : Number(newListingPrice) || 0,
      isFree: newListingIsFree,
      sellerName: residentName,
      sellerLocation: residentLocation,
      category: newListingCategory,
      condition: newListingCondition,
      description: newListingDesc.trim(),
      timeAgo: 'Just now',
    };

    setMarketItems([item, ...marketItems]);
    setShowCreateListingModal(false);
    setNewListingTitle('');
    setNewListingPrice('');
    setNewListingDesc('');
    notify('Classified item listed on internal resident marketplace!');
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
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (feedFilter === 'official') {
      list = list.filter((p) => p.isOfficial);
    } else if (feedFilter === 'latest') {
      list.sort((a, b) => b.timestamp - a.timestamp);
    } else if (feedFilter === 'trending') {
      list.sort((a, b) => (b.likes + b.comments.length * 2) - (a.likes + a.comments.length * 2));
    }

    return list;
  }, [posts, searchQuery, feedFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', minHeight: '100%' }}>
      {/* Top Banner / Community Identity */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '24px',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Users size={26} color="#60a5fa" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Smart Residence &bull; Community Network
              </h2>
              <span
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={13} />
                Verified Private Neighborhood
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              Private social network for verified residents of <strong>{currentOrg?.name || 'Vista Horizon Residences'}</strong>. Connect, organize, recommend, and build community.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              &larr; Portfolio Console
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('feed');
              notify('Write a post in the composer below!');
            }}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '9px 20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Pill Bar (Twitter / X Style) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '8px 12px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', flex: 1 }}>
          {[
            { id: 'feed', label: 'Home Feed', icon: MessageSquare, badge: filteredPosts.length },
            { id: 'groups', label: 'Communities & Groups', icon: Users, badge: groups.length },
            { id: 'events', label: 'Events & Activities', icon: Calendar, badge: events.length },
            { id: 'marketplace', label: 'Resident Marketplace', icon: ShoppingBag, badge: marketItems.length },
            { id: 'residents', label: 'Residents Directory', icon: User, badge: 'Verified' },
            { id: 'guidelines', label: 'Guidelines & Safety', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    style={{
                      background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#475569',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      padding: '2px 7px',
                      marginLeft: '2px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search community..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              fontSize: '0.78rem',
              outline: 'none',
              background: '#f8fafc',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HOME FEED (X / Twitter Style Community Wall) */}
      {/* ========================================================================= */}
      {activeTab === 'feed' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '22px' }}>
          {/* Main Feed Column (Left) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Feed Sub-Tabs (For You, Latest, Official Notices, Trending) */}
            <div
              style={{
                display: 'flex',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '4px',
              }}
            >
              {[
                { id: 'for-you', label: 'For You' },
                { id: 'latest', label: 'Latest' },
                { id: 'official', label: 'Official Notices' },
                { id: 'trending', label: 'Trending' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setFeedFilter(sub.id as any)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: feedFilter === sub.id ? '#f1f5f9' : 'transparent',
                    color: feedFilter === sub.id ? '#0f172a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: feedFilter === sub.id ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Post Composer Card (X Style) */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '20px 22px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <form onSubmit={handleCreatePost}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      flexShrink: 0,
                    }}
                  >
                    {residentName.slice(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <textarea
                      rows={3}
                      placeholder="What's happening in your residence? Ask a question, organize a meetup, or share recommendations..."
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '0.94rem',
                        color: '#0f172a',
                        lineHeight: 1.5,
                        fontFamily: 'inherit',
                      }}
                    />

                    {/* Interactive Poll Creator if toggled */}
                    {showPollCreator && (
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: '14px',
                          padding: '14px',
                          border: '1px solid #e2e8f0',
                          marginTop: '10px',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Community Poll</span>
                          <button
                            type="button"
                            onClick={() => setShowPollCreator(false)}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Poll Question (e.g. Which day suits everyone for building BBQ?)"
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.84rem',
                            marginBottom: '8px',
                            outline: 'none',
                          }}
                        />

                        {pollOptions.map((opt, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input
                              type="text"
                              placeholder={`Option ${idx + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const copy = [...pollOptions];
                                copy[idx] = e.target.value;
                                setPollOptions(copy);
                              }}
                              style={{
                                flex: 1,
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.8rem',
                                outline: 'none',
                              }}
                            />
                            {pollOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}

                        {pollOptions.length < 4 && (
                          <button
                            type="button"
                            onClick={() => setPollOptions([...pollOptions, ''])}
                            style={{
                              background: 'transparent',
                              border: '1px dashed #cbd5e1',
                              borderRadius: '8px',
                              padding: '5px 12px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: '#2563eb',
                              cursor: 'pointer',
                              marginTop: '4px',
                            }}
                          >
                            + Add Option
                          </button>
                        )}
                      </div>
                    )}

                    {/* Action Row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '14px',
                        marginTop: '10px',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Topic Tag Selector */}
                        <select
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '20px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#334155',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="General">#General</option>
                          <option value="Fitness">#Fitness</option>
                          <option value="Recommendations">#Recommendations</option>
                          <option value="Question">#Question</option>
                          <option value="Social">#Social</option>
                          <option value="Marketplace">#Marketplace</option>
                          <option value="Security">#Security</option>
                        </select>

                        {/* Audience Scope */}
                        <button
                          type="button"
                          onClick={() => setAudienceScope(audienceScope === 'All Residence' ? 'My Building' : 'All Residence')}
                          style={{
                            background: 'transparent',
                            border: '1px solid #e2e8f0',
                            borderRadius: '20px',
                            padding: '4px 10px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#64748b',
                            cursor: 'pointer',
                          }}
                        >
                          📍 {audienceScope}
                        </button>

                        {/* Poll Toggle Button */}
                        <button
                          type="button"
                          onClick={() => setShowPollCreator(!showPollCreator)}
                          style={{
                            background: showPollCreator ? '#eff6ff' : 'transparent',
                            color: showPollCreator ? '#2563eb' : '#64748b',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          📊 Poll
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={!postText.trim() && !pollQuestion.trim()}
                        style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '7px 20px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: !postText.trim() && !pollQuestion.trim() ? 'not-allowed' : 'pointer',
                          opacity: !postText.trim() && !pollQuestion.trim() ? 0.5 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Feed Stream */}
            {filteredPosts.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}
              >
                <MessageSquare size={36} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  No posts in this view yet
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  Be the first neighbor to post a greeting or question!
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: post.isOfficial ? '#f8fafc' : '#ffffff',
                    borderRadius: '20px',
                    padding: '22px 24px',
                    border: post.isOfficial ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Post Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {post.isOfficial ? (
                        <img
                          src="/logo.png"
                          alt="Management"
                          style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'contain' }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo-256.png';
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: '#0f172a',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.86rem',
                            flexShrink: 0,
                          }}
                        >
                          {post.authorName.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                            {post.authorName}
                          </span>
                          {post.isOfficial ? (
                            <span
                              style={{
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                borderRadius: '12px',
                                padding: '2px 8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <ShieldCheck size={12} />
                              Official Management
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                borderRadius: '12px',
                                padding: '2px 8px',
                              }}
                            >
                              Verified Resident
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          {post.authorLocation} &bull; {post.timeAgo}
                        </div>
                      </div>
                    </div>

                    {/* Report / Moderation Menu */}
                    <button
                      onClick={() => setShowReportModal(post.id)}
                      title="Report Inappropriate Content"
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    >
                      <Flag size={15} />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div style={{ fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </div>

                  {/* Hashtags */}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          onClick={() => setSearchQuery(t)}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#2563eb',
                            background: '#eff6ff',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interactive Poll Component */}
                  {post.poll && (
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid #e2e8f0',
                        marginTop: '4px',
                      }}
                    >
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                        📊 {post.poll.question}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {post.poll.options.map((opt, optIdx) => {
                          const pct =
                            post.poll!.totalVotes > 0
                              ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                              : 0;
                          const hasVoted = post.poll!.userVotedIndex !== undefined;
                          const isMyVote = post.poll!.userVotedIndex === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleVotePoll(post.id, optIdx)}
                              disabled={hasVoted}
                              style={{
                                position: 'relative',
                                background: hasVoted ? '#ffffff' : '#ffffff',
                                border: isMyVote ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                borderRadius: '12px',
                                padding: '10px 14px',
                                textAlign: 'left',
                                cursor: hasVoted ? 'default' : 'pointer',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              {/* Background percentage fill bar */}
                              {hasVoted && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: `${pct}%`,
                                    background: isMyVote ? 'rgba(37, 99, 235, 0.15)' : 'rgba(226, 232, 240, 0.6)',
                                    zIndex: 0,
                                  }}
                                />
                              )}

                              <span style={{ position: 'relative', zIndex: 1, fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                                {opt.text} {isMyVote && '✓'}
                              </span>

                              {hasVoted && (
                                <span style={{ position: 'relative', zIndex: 1, fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                                  {pct}%
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '10px' }}>
                        {post.poll.totalVotes} total votes &bull; {post.poll.userVotedIndex !== undefined ? 'Final verified vote recorded' : 'Vote to see live community results'}
                      </div>
                    </div>
                  )}

                  {/* Post Interaction Bar (X Style) */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '12px',
                      color: '#64748b',
                      fontSize: '0.82rem',
                    }}
                  >
                    {/* Comments Toggle */}
                    <button
                      onClick={() => setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: openCommentPostId === post.id ? '#2563eb' : '#64748b',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments.length}</span>
                    </button>

                    {/* Repost / Share */}
                    <button
                      onClick={() => handleToggleRepost(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: post.isReposted ? '#16a34a' : '#64748b',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <Repeat size={16} />
                      <span>{post.reposts}</span>
                    </button>

                    {/* Like Heart */}
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: post.isLiked ? '#dc2626' : '#64748b',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <Heart size={16} color={post.isLiked ? '#dc2626' : '#64748b'} />
                      <span>{post.likes}</span>
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
                      <Bookmark size={16} />
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        notify('Post link copied to clipboard!');
                      }}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    >
                      <Share size={16} />
                    </button>
                  </div>

                  {/* Expanded Comments Thread */}
                  {openCommentPostId === post.id && (
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: '16px',
                        padding: '16px',
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {/* Existing Comments */}
                      {post.comments.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {post.comments.map((c) => (
                            <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <div
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  background: '#0f172a',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  flexShrink: 0,
                                }}
                              >
                                {c.authorName.slice(0, 2).toUpperCase()}
                              </div>
                              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '10px 14px', flex: 1, border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{c.authorName}</span>
                                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{c.timeAgo}</span>
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '4px' }}>{c.authorLocation}</div>
                                <div style={{ fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.4 }}>{c.content}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Write a neighborly reply..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 14px',
                            borderRadius: '20px',
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
                            borderRadius: '20px',
                            padding: '8px 16px',
                            fontSize: '0.8rem',
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

          {/* Right Sidebar: Trending Topics, Upcoming Activities, Quick Marketplace */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Pinned Management Announcements Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Megaphone size={18} color="#2563eb" />
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Official Notices
                  </h3>
                </div>
                <button
                  onClick={() => setFeedFilter('official')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  View All &rarr;
                </button>
              </div>

              <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '14px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e40af', marginBottom: '4px' }}>
                  Water Filtration Servicing
                </div>
                <p style={{ fontSize: '0.76rem', color: '#3b82f6', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                  Tomorrow from 9:00 AM to 11:30 AM. Backup booster tanks active.
                </p>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Property Management Office &bull; 1 hr ago
                </div>
              </div>
            </div>

            {/* Upcoming Activities Widget */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={18} color="#ff5e13" />
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Upcoming Activities
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('events')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Full Calendar &rarr;
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {events.slice(0, 2).map((ev) => (
                  <div key={ev.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: '#f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ef4444' }}>SAT</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>28</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {ev.timeStr} &bull; {ev.attendeesCount} going
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleRsvp(ev.id)}
                      style={{
                        background: ev.isRsvpd ? '#ecfdf5' : '#0f172a',
                        color: ev.isRsvpd ? '#059669' : '#ffffff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '5px 12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {ev.isRsvpd ? 'Going ✓' : 'RSVP'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interest Communities Widget */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={18} color="#10b981" />
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Interest Groups
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('groups')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Explore &rarr;
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {groups.slice(0, 3).map((grp) => (
                  <div key={grp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{grp.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{grp.membersCount} members</div>
                    </div>

                    <button
                      onClick={() => handleToggleGroup(grp.id)}
                      style={{
                        background: grp.isJoined ? '#f1f5f9' : '#0f172a',
                        color: grp.isJoined ? '#475569' : '#ffffff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {grp.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Safety & Charter Box */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '16px',
                border: '1px dashed #cbd5e1',
                fontSize: '0.74rem',
                color: '#64748b',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                🛡️ Private Community Charter
              </div>
              All members are verified residents of {currentOrg?.name || 'Vista Horizon Residences'}. Keep discussions respectful, supportive, and safe. Never share private lease, financial or security details publicly.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMMUNITIES & INTEREST GROUPS */}
      {/* ========================================================================= */}
      {activeTab === 'groups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Interest-Based Communities
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Join smaller passion groups within your residence to organize meetups, share advice, and connect.
              </p>
            </div>

            <button
              onClick={() => notify('Interest group creation requests are open to all verified residents!')}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Create Group
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {groups.map((grp) => (
              <div
                key={grp.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        background: grp.iconBg,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Users size={22} />
                    </div>
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {grp.badgeText}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                    {grp.name}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700, marginBottom: '8px' }}>
                    {grp.category}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                    {grp.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>
                    {grp.membersCount} Neighbors
                  </span>

                  <button
                    onClick={() => handleToggleGroup(grp.id)}
                    style={{
                      background: grp.isJoined ? '#ecfdf5' : '#0f172a',
                      color: grp.isJoined ? '#059669' : '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '7px 18px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {grp.isJoined ? 'Joined ✓' : 'Join Community'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EVENTS & ACTIVITIES */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Residence Events & Gatherings
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Join sports meetups, rooftop gatherings, garden yoga, and community discussions.
              </p>
            </div>

            <button
              onClick={() => setShowCreateEventModal(true)}
              style={{
                background: '#ff5e13',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '9px 18px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              <span>Organize Event</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '22px 24px',
                  border: ev.isOfficial ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#ff5e13' }}>
                      {ev.dateStr.slice(0, 3).toUpperCase()}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1 }}>
                      28
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {ev.title}
                      </h4>
                      {ev.isOfficial && (
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                          Official
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span>📅 {ev.dateStr}</span>
                      <span>⏰ {ev.timeStr}</span>
                      <span>📍 {ev.location}</span>
                      <span>👤 By {ev.organizer}</span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#334155', margin: '8px 0 0 0', lineHeight: 1.4, maxWidth: '640px' }}>
                      {ev.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                      {ev.attendeesCount}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Neighbors Going</div>
                  </div>

                  <button
                    onClick={() => handleToggleRsvp(ev.id)}
                    style={{
                      background: ev.isRsvpd ? '#ecfdf5' : '#0f172a',
                      color: ev.isRsvpd ? '#059669' : '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 20px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {ev.isRsvpd ? 'Attending ✓' : 'RSVP Going'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RESIDENT MARKETPLACE */}
      {/* ========================================================================= */}
      {activeTab === 'marketplace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Internal Resident Marketplace
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Buy, sell, giveaway furniture, appliances, and recommend trusted services exclusively among neighbors.
              </p>
            </div>

            <button
              onClick={() => setShowCreateListingModal(true)}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '9px 18px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              <span>List an Item</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {marketItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {item.category}
                    </span>

                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {item.timeAgo}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                    {item.title}
                  </h4>

                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: item.isFree ? '#16a34a' : '#0f172a', marginBottom: '8px' }}>
                    {item.isFree ? 'FREE / Giveaway' : `KES ${item.priceKes.toLocaleString()}`}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{item.sellerName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.sellerLocation}</div>
                  </div>

                  <button
                    onClick={() => notify(`Contact request initiated with neighbor ${item.sellerName}!`)}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '6px 14px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RESIDENTS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'residents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Verified Residence Directory
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Only verified residents and management members appear here. Personal phone numbers, leases, and sensitive documents are kept strictly private.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {[
              { name: 'Jane M.', building: 'Block A · 2nd Floor', bio: 'Architect & urban design enthusiast. Loves morning fitness and community gardening.', interests: ['Fitness', 'Architecture', 'Gardening'] },
              { name: 'David K.', building: 'Block C · 3rd Floor', bio: 'Software engineer & tech enthusiast. Always happy to help with smart tech or book recommendations.', interests: ['Tech', 'Books', 'Cycling'] },
              { name: 'Amina W.', building: 'Block B · Penthouse', bio: 'Community representative & home baker. Reach out for neighbourhood events or local recommendations.', interests: ['Baking', 'Social', 'Events'] },
              { name: 'Samuel O.', building: 'Block A · 1st Floor', bio: 'Fitness coach and sports lover. Organizing the weekly weekend cardio running sessions.', interests: ['Running', 'Gym', 'Sports'] },
              { name: 'Sarah O.', building: 'Block A · 1st Floor', bio: 'Parent of two energetic toddlers. Active in our resident parents and kids playgroup.', interests: ['Parenting', 'Crafts', 'Parks'] },
            ].map((res, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#0f172a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.94rem',
                        fontWeight: 800,
                      }}
                    >
                      {res.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>{res.name}</span>
                        <CheckCircle2 size={14} color="#2563eb" />
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{res.building}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                    {res.bio}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {res.interests.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          borderRadius: '10px',
                          padding: '2px 8px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => notify(`Direct chat requested with neighbor ${res.name}.`)}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Send Message
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: COMMUNITY GUIDELINES & SAFETY */}
      {/* ========================================================================= */}
      {activeTab === 'guidelines' && (
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ShieldCheck size={26} color="#2563eb" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Smart Residence Community Charter
            </h3>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
            Unit Flow Smart Residence is designed as a peaceful, private social network that helps neighbors thrive together. By participating, all verified residents agree to these standards:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                title: '1. Verified Membership Only',
                desc: 'Only authorized tenants, residents, and verified property staff have access to this community. Outside commercial spammers and unauthorized accounts are blocked.',
              },
              {
                title: '2. Respect & Neighborliness',
                desc: 'Disagreements must be handled constructively. Hate speech, personal harassment, excessive noise complaints posted publicly, or defamation are strictly prohibited.',
              },
              {
                title: '3. Privacy & Safety Protection',
                desc: 'Never post another resident\'s private phone number, lease documents, ID cards, financial arrears, or exact apartment security access codes.',
              },
              {
                title: '4. Dedicated Marketplace Section',
                desc: 'Personal sales of furniture, electronics, and local recommendations belong in the Resident Marketplace, keeping the main discussion wall focused on social updates.',
              },
              {
                title: '5. Moderation & Audit Accountability',
                desc: 'Residents can flag inappropriate posts. Community moderators and management review reported items transparently with recorded moderation audit logs.',
              },
            ].map((rule, idx) => (
              <div key={idx} style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px 20px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{rule.title}</div>
                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>{rule.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE EVENT */}
      {/* ========================================================================= */}
      {showCreateEventModal && (
        <div
          onClick={() => setShowCreateEventModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Organize Residence Activity
              </h3>
              <button onClick={() => setShowCreateEventModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunday Morning Cycling Group"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value="Social">Social</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Kids & Family">Kids & Family</option>
                    <option value="Charity">Charity</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 7:30 AM"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Location / Meetup Spot</label>
                <input
                  type="text"
                  placeholder="e.g. Central Lawn, Clubhouse, Rooftop"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="What should neighbors bring or know?"
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#ff5e13', color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIST MARKETPLACE ITEM */}
      {/* ========================================================================= */}
      {showCreateListingModal && (
        <div
          onClick={() => setShowCreateListingModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                List Item on Marketplace
              </h3>
              <button onClick={() => setShowCreateListingModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microwave Oven (Panasonic 25L)"
                  value={newListingTitle}
                  onChange={(e) => setNewListingTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Category</label>
                  <select
                    value={newListingCategory}
                    onChange={(e) => setNewListingCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Services">Services</option>
                    <option value="Giveaway">Giveaway / Free</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Condition</label>
                  <select
                    value={newListingCondition}
                    onChange={(e) => setNewListingCondition(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Service">Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Price (KES)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="number"
                    disabled={newListingIsFree}
                    placeholder="e.g. 8000"
                    value={newListingPrice}
                    onChange={(e) => setNewListingPrice(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      outline: 'none',
                      background: newListingIsFree ? '#f1f5f9' : '#ffffff',
                    }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newListingIsFree}
                      onChange={(e) => setNewListingIsFree(e.target.checked)}
                    />
                    Free / Giveaway
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Details, dimensions, or pickup instructions..."
                  value={newListingDesc}
                  onChange={(e) => setNewListingDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateListingModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REPORT INAPPROPRIATE CONTENT */}
      {/* ========================================================================= */}
      {showReportModal && (
        <div
          onClick={() => setShowReportModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
              padding: '28px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flag size={18} color="#dc2626" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Report Post
                </h3>
              </div>
              <button onClick={() => setShowReportModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Help keep our residential community safe and constructive. Reports are audited confidentially by community moderators.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                'Spam, Promotion or Unauthorized Solicitation',
                'Harassment, Hate Speech or Bullying',
                'Exposure of Private / Sensitive Information',
                'False / Misleading Security Notice',
                'Inappropriate Content',
              ].map((reason) => (
                <label
                  key={reason}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.82rem',
                    color: '#1e293b',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: reportReason === reason ? '#eff6ff' : '#f8fafc',
                    border: reportReason === reason ? '1px solid #bfdbfe' : '1px solid transparent',
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
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(null);
                  notify('Report submitted for confidential moderator review.');
                }}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
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
