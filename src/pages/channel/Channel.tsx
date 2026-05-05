import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { getUserChannel, subscribeToChannel, getChannelVideos, getChannelPlaylists, getChannelTweets } from "@/services/user.service";
import { apiRequest } from "@/api/apiClient";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// types & helpers
import { type ChannelData, type VideoItem, type PlaylistItem, type TweetItem, type Tab, formatSubs } from "./types/channel.types";
// components
import VideoCard from "./components/VideoCard";
import ShortCard from "./components/ShortCard";
import PlaylistCard from "./components/PlaylistCard";
import PostCard from "./components/PostCard";
import VideoGridSkeleton from "./components/VideoGridSkeleton";
import EmptyState from "./components/EmptyState";
import ScrollRow from "./components/ScrollRow";
import SectionHeader from "./components/SectionHeader";
import BannerEditButton from "./components/BannerEditButton";
import AvatarEditButton from "./components/AvatarEditButton";
import UploadToast from "./components/UploadToast";
import FilterChip from "./components/FilterChip";
import ImageCropModal from "@/components/ImageCropModal";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "videos", label: "Videos" },
  { key: "shorts", label: "Shorts" },
  { key: "playlists", label: "Playlists" },
  { key: "posts", label: "Posts" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Channel() {
  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();
  const currentUser = useUserStore();

  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortFilter, setSortFilter] = useState<"latest" | "popular" | "oldest">("latest");

  // image upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<"avatar" | "cover" | null>(null);
  const [avatarCropSrc, setAvatarCropSrc] = useState<string | null>(null);
  const [coverCropSrc, setCoverCropSrc] = useState<string | null>(null);

  // tab data
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [tweets, setTweets] = useState<TweetItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  // ── Fetch channel ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userid) return;
    setLoading(true);
    getUserChannel(userid)
      .then((res) => {
        if (res?.data) {
          setChannel(res.data);
          setSubscribed(res.data.isSubscribed);
          setSubCount(res.data.subscriberCount);
        } else setError("Channel not found");
      })
      .catch(() => setError("Failed to load channel"))
      .finally(() => setLoading(false));
  }, [userid]);

  // ── Fetch videos ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!channel?._id) return;
    setDataLoading(true);
    getChannelVideos(channel._id)
      .then((res) => setVideos(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setDataLoading(false));
  }, [channel?._id]);

  // ── Fetch playlists ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "playlists" || !channel?._id || playlists.length) return;
    setDataLoading(true);
    getChannelPlaylists(channel._id)
      .then((res) => setPlaylists(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setDataLoading(false));
  }, [activeTab, channel?._id]);

  // ── Fetch tweets ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "posts" || !channel?._id || tweets.length) return;
    setDataLoading(true);
    getChannelTweets(channel._id)
      .then((res: any) => setTweets(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setDataLoading(false));
  }, [activeTab, channel?._id]);

  // ── Subscribe ──────────────────────────────────────────────────────────────
  const handleSubscribe = async () => {
    if (!channel) return;
    setSubLoading(true);
    try {
      await subscribeToChannel(channel._id);
      setSubscribed((prev) => {
        setSubCount((c) => (prev ? c - 1 : c + 1));
        return !prev;
      });
    } catch {}
    setSubLoading(false);
  };

  // ── Image uploads ──────────────────────────────────────────────────────────
  const canEdit = !!(channel?.isOwner || currentUser.role === "admin");
  const showToast = (type: "avatar" | "cover") => {
    setUploadSuccess(type);
    setTimeout(() => setUploadSuccess(null), 2500);
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarCropSrc(URL.createObjectURL(file));
  };

  const uploadAvatar = async (file: File) => {
    if (!channel) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("profilepic", file);
      const res: any = await apiRequest({
        method: "PATCH",
        url: "/user/avatar",
        data: fd,
      });
      if (res?.data?.profilepic) {
        setChannel((p) => (p ? { ...p, profilepic: res.data.profilepic } : p));
        showToast("avatar");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingAvatar(false);
      if (avatarInput.current) avatarInput.current.value = "";
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverCropSrc(URL.createObjectURL(file));
  };

  const uploadCover = async (file: File) => {
    if (!channel) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("coverimage", file);
      const res: any = await apiRequest({
        method: "PATCH",
        url: "/user/cover",
        data: fd,
      });
      if (res?.data?.coverimage) {
        setChannel((p) => (p ? { ...p, coverimage: res.data.coverimage } : p));
        showToast("cover");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingCover(false);
      if (coverInput.current) coverInput.current.value = "";
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const allPublic = videos.filter((v) => v.isPublished && v.privacy === "public");
  const shorts = allPublic.filter((v) => v.duration !== undefined && v.duration <= 60);
  const regularVids = allPublic.filter((v) => !v.duration || v.duration > 60);

  const sortedVideos = [...regularVids].sort((a, b) => {
    if (sortFilter === "popular") return (b.totalViews || 0) - (a.totalViews || 0);
    if (sortFilter === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const searchResults = searchQuery.trim() ? allPublic.filter((v) => (v.title || "").toLowerCase().includes(searchQuery.toLowerCase())) : [];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950">
        <Skeleton className="w-full h-44 rounded-none" />
        <div className="max-w-[1300px] mx-auto px-10 py-6 flex gap-6">
          <Skeleton className="size-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
      </div>
    );

  if (error || !channel)
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-zinc-100">Channel not found</h2>
        <p className="text-zinc-500">{error || "This channel doesn't exist."}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );

  const switchTab = (key: Tab) => {
    setActiveTab(key);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 ml-4">
      {/* Hidden file inputs */}
      <input ref={avatarInput} id="ch-avatar-file-input" type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
      <input ref={coverInput} id="ch-cover-file-input" type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />

      {/* ── Banner ──────────────────────────────────────────────────────────── */}
      <div className="relative w-7xl mx-auto rounded-2xl h-[clamp(100px,15vw,280px)] bg-gradient-to-br  from-violet-950 to-zinc-950 overflow-hidden group/banner">
        {channel.coverimage && <img src={channel.coverimage} alt="banner" className="w-full h-full object-cover" />}
        {canEdit && <BannerEditButton uploading={uploadingCover} onClick={() => coverInput.current?.click()} />}
        {uploadSuccess === "cover" && <UploadToast message="Banner updated!" />}
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-zinc-950 border-b border-white/[0.06] backdrop-blur-sm">
        <div className="max-w-[1300px] mx-auto px-10 pt-6 pb-0 flex items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0 group/avatar">
            <Avatar className="size-24 border-[3px] border-violet-500/50 shadow-lg shadow-violet-900/30 ring-2 ring-zinc-900">
              <AvatarImage src={channel.profilepic || "/profile.jpg"} alt={channel.name} />
              <AvatarFallback className="text-2xl font-bold bg-violet-900 text-violet-200">{channel.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {canEdit && <AvatarEditButton uploading={uploadingAvatar} onClick={() => avatarInput.current?.click()} />}
            {uploadSuccess === "avatar" && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap pointer-events-none animate-in fade-in z-20">
                ✓ Updated!
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pb-5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1.5 bg-gradient-to-r from-zinc-100 to-violet-200 bg-clip-text text-transparent">{channel.name}</h1>
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-400 mb-2.5">
              <span className="text-zinc-300">@{channel.username}</span>
              <span className="text-zinc-600">•</span>
              <span>{formatSubs(subCount)} subscribers</span>
              <span className="text-zinc-600">•</span>
              <span>{videos.length} videos</span>
            </div>
            {channel.bio && (
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mb-3">
                {showFullBio || channel.bio.length <= 120 ? channel.bio : channel.bio.slice(0, 120) + "…"}
                {channel.bio.length > 120 && (
                  <button onClick={() => setShowFullBio((p) => !p)} className="text-violet-400 hover:text-violet-300 ml-1 text-sm font-medium transition-colors">
                    {showFullBio ? "less" : "more"}
                  </button>
                )}
              </p>
            )}
            <div className="flex gap-2.5 flex-wrap">
              {channel.isOwner ? (
                <>
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => navigate("/profile")}>
                    Customize channel
                  </Button>
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => navigate("/studio")}>
                    Manage videos
                  </Button>
                </>
              ) : (
                <button
                  id="ch-subscribe-btn"
                  onClick={handleSubscribe}
                  disabled={subLoading}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    subscribed
                      ? "bg-white/[0.08] border border-white/10 text-zinc-200 hover:bg-white/[0.12]"
                      : "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/30"
                  } disabled:opacity-60`}>
                  {subLoading ? "…" : subscribed ? "🔔 Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1300px] mx-auto px-8 flex items-center border-t border-white/[0.05]">
          <div className="flex flex-1 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                id={`ch-tab-${tab.key}`}
                onClick={() => switchTab(tab.key)}
                className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.key ? "border-violet-500 text-zinc-50 font-semibold" : "border-transparent text-zinc-400 hover:text-zinc-100"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
          <button
            id="ch-search-toggle"
            onClick={() => {
              setSearchOpen((p) => !p);
              setTimeout(() => searchRef.current?.focus(), 100);
            }}
            className="p-2.5 rounded-full text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 transition-colors text-lg"
            title="Search channel">
            🔍
          </button>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="max-w-[1300px] mx-auto px-10 py-3 flex items-center gap-3 border-t border-white/[0.05]">
            <input
              ref={searchRef}
              id="ch-search-input"
              className="flex-1 max-w-lg bg-white/[0.05] border border-white/10 rounded-full px-5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              placeholder={`Search ${channel.name}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-zinc-500 hover:text-zinc-200 text-sm">
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1300px] mx-auto px-10 py-8 space-y-12">
        {/* Search results */}
        {searchOpen && searchQuery && (
          <section>
            <SectionHeader title={`Results for "${searchQuery}"`} />
            {searchResults.length === 0 ? (
              <EmptyState icon="🔍" title="No results" sub="No videos match your search" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((v) => (
                  <VideoCard key={v.videoId} video={v} onClick={() => navigate(`/video/${v.videoId}`)} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* HOME */}
        {!searchOpen && activeTab === "home" && (
          <>
            <section>
              <SectionHeader title="For you" onSeeAll={regularVids.length > 4 ? () => switchTab("videos") : undefined} />
              {dataLoading ? (
                <VideoGridSkeleton />
              ) : regularVids.length === 0 ? (
                <EmptyState icon="🎬" title="No videos yet" sub="This channel hasn't posted any videos" />
              ) : (
                <ScrollRow>
                  {regularVids.slice(0, 12).map((v) => (
                    <div key={v.videoId} className="w-[280px] shrink-0">
                      <VideoCard video={v} onClick={() => navigate(`/video/${v.videoId}`)} />
                    </div>
                  ))}
                </ScrollRow>
              )}
            </section>

            {regularVids.length > 0 && (
              <section>
                <SectionHeader title="Videos" onSeeAll={() => switchTab("videos")} />
                <ScrollRow>
                  {regularVids.slice(0, 8).map((v) => (
                    <div key={v.videoId} className="w-[280px] shrink-0">
                      <VideoCard video={v} onClick={() => navigate(`/video/${v.videoId}`)} />
                    </div>
                  ))}
                </ScrollRow>
              </section>
            )}

            {shorts.length > 0 && (
              <section>
                <SectionHeader title={<span className="flex items-center gap-2">⚡ Shorts</span>} onSeeAll={() => switchTab("shorts")} />
                <ScrollRow>
                  {shorts.slice(0, 8).map((v) => (
                    <div key={v.videoId} className="w-40 shrink-0">
                      <ShortCard video={v} onClick={() => navigate(`/video/${v.videoId}`)} />
                    </div>
                  ))}
                </ScrollRow>
              </section>
            )}
          </>
        )}

        {/* VIDEOS */}
        {!searchOpen && activeTab === "videos" && (
          <section>
            <div className="flex gap-2 mb-6 flex-wrap">
              {(["latest", "popular", "oldest"] as const).map((f) => (
                <FilterChip key={f} active={sortFilter === f} label={f.charAt(0).toUpperCase() + f.slice(1)} onClick={() => setSortFilter(f)} />
              ))}
            </div>
            {dataLoading ? (
              <VideoGridSkeleton />
            ) : sortedVideos.length === 0 ? (
              <EmptyState icon="🎬" title="No videos yet" sub="This channel hasn't posted any videos" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {sortedVideos.map((v) => (
                  <VideoCard key={v.videoId} video={v} onClick={() => navigate(`/video/${v.videoId}`)} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SHORTS */}
        {!searchOpen && activeTab === "shorts" && (
          <section>
            {dataLoading ? (
              <VideoGridSkeleton />
            ) : shorts.length === 0 ? (
              <EmptyState icon="⚡" title="No Shorts yet" sub="This channel hasn't posted any Shorts" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {shorts.map((v) => (
                  <div key={v.videoId} className="w-full">
                    <ShortCard video={{ ...v }} onClick={() => navigate(`/video/${v.videoId}`)} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PLAYLISTS */}
        {!searchOpen && activeTab === "playlists" && (
          <section>
            {dataLoading ? (
              <VideoGridSkeleton />
            ) : playlists.length === 0 ? (
              <EmptyState icon="📋" title="No playlists yet" sub="This channel hasn't created any public playlists" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlists.map((pl) => (
                  <PlaylistCard key={pl._id} pl={pl} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* POSTS */}
        {!searchOpen && activeTab === "posts" && (
          <section className="max-w-2xl">
            {dataLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl" />
                ))}
              </div>
            ) : tweets.length === 0 ? (
              <EmptyState icon="📝" title="No posts yet" sub="This channel hasn't made any community posts" />
            ) : (
              <div className="space-y-4">
                {tweets.map((t) => (
                  <PostCard key={t._id} tweet={t} channel={channel} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {avatarCropSrc && (
        <ImageCropModal
          image={avatarCropSrc}
          aspect={1}
          onCancel={() => {
            setAvatarCropSrc(null);
            if (avatarInput.current) avatarInput.current.value = "";
          }}
          onCropComplete={(file) => {
            setAvatarCropSrc(null);
            uploadAvatar(file);
          }}
        />
      )}
      {coverCropSrc && (
        <ImageCropModal
          image={coverCropSrc}
          aspect={21 / 9}
          onCancel={() => {
            setCoverCropSrc(null);
            if (coverInput.current) coverInput.current.value = "";
          }}
          onCropComplete={(file) => {
            setCoverCropSrc(null);
            uploadCover(file);
          }}
        />
      )}
    </div>
  );
}
