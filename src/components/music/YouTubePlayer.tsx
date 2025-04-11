
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ListMusic } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Import our newly created components
import YouTubeCore from './player/YouTubeCore';
import SearchBar from './player/SearchBar';
import PlayerDisplay from './player/PlayerDisplay';
import ActionButtons from './player/ActionButtons';
import DownloadDialog from './player/DownloadDialog';
import SongList from './player/SongList';
import EmptyQueueDisplay from './player/EmptyQueueDisplay';
import { Song } from './player/types';

const YouTubePlayer: React.FC = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: repeat all, 2: repeat one
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [isBackgroundPlay, setIsBackgroundPlay] = useState(false);
  
  const playerRef = useRef<YT.Player | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  
  // Mock data for trending and recently played
  const trendingSongs: Song[] = [
    { id: '1', title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', duration: '5:26', thumbnail: 'https://i.pravatar.cc/300?img=1', videoId: 'dQw4w9WgXcQ' },
    { id: '2', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', duration: '3:54', thumbnail: 'https://i.pravatar.cc/300?img=2', videoId: 'dQw4w9WgXcQ' },
    { id: '3', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', thumbnail: 'https://i.pravatar.cc/300?img=3', videoId: 'dQw4w9WgXcQ' },
    { id: '4', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', album: 'Uptown Special', duration: '4:30', thumbnail: 'https://i.pravatar.cc/300?img=4', videoId: 'dQw4w9WgXcQ' },
    { id: '5', title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep, Where Do We Go?', duration: '3:14', thumbnail: 'https://i.pravatar.cc/300?img=5', videoId: 'dQw4w9WgXcQ' },
  ];
  
  const recentlyPlayed: Song[] = [
    { id: '6', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', thumbnail: 'https://i.pravatar.cc/300?img=6', videoId: 'dQw4w9WgXcQ' },
    { id: '7', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: '6:30', thumbnail: 'https://i.pravatar.cc/300?img=7', videoId: 'dQw4w9WgXcQ' },
    { id: '8', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', duration: '5:56', thumbnail: 'https://i.pravatar.cc/300?img=8', videoId: 'dQw4w9WgXcQ' },
  ];
  
  // Player event handlers
  const onPlayerReady = (player: YT.Player) => {
    console.log('Player ready');
    playerRef.current = player;
    player.setVolume(volume);
  };
  
  const onPlayerStateChange = (event: YT.PlayerStateEvent) => {
    if (event.data === window.YT?.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTimer();
    } else if (event.data === window.YT?.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressTimer();
    } else if (event.data === window.YT?.PlayerState.ENDED) {
      handleSongEnd();
    }
  };
  
  const onPlayerError = (event: YT.PlayerErrorEvent) => {
    console.error('Player error:', event.data);
    toast({
      title: t('errors.mediaPlaybackError'),
      description: t('errors.tryAgain'),
      variant: 'destructive'
    });
  };
  
  // Progress timer
  const startProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    
    progressTimerRef.current = window.setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        setCurrentTime(currentTime);
        setDuration(duration);
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);
  };
  
  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };
  
  // Handle song end
  const handleSongEnd = () => {
    if (repeatMode === 2) {
      // Repeat current song
      if (playerRef.current && currentSong) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else if (queue.length > 0) {
      // Play next song
      playNextSong();
    } else if (repeatMode === 1) {
      // Repeat all - go back to first trending song
      playSong(trendingSongs[0]);
    } else {
      // Stop playing
      setIsPlaying(false);
    }
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Play song
  const playSong = (song: Song) => {
    if (!playerRef.current || !song.videoId) return;
    
    setCurrentSong(song);
    playerRef.current.loadVideoById(song.videoId);
    playerRef.current.playVideo();
    setIsPlaying(true);
    
    // Update document title and show notification if background play is enabled
    if (isBackgroundPlay) {
      document.title = `${song.title} - ${song.artist}`;
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(t('music.nowPlaying'), {
          body: `${song.title} - ${song.artist}`,
          icon: song.thumbnail
        });
      }
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      if (currentSong) {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } else if (trendingSongs.length > 0) {
        playSong(trendingSongs[0]);
      }
    }
  };
  
  // Play next song
  const playNextSong = () => {
    if (queue.length > 0) {
      // Play from queue
      const nextSong = queue[0];
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      playSong(nextSong);
    } else if (currentSong) {
      // Find current song in trending list and play next
      const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
      if (currentIndex !== -1 && currentIndex < trendingSongs.length - 1) {
        playSong(trendingSongs[currentIndex + 1]);
      } else if (isShuffleOn) {
        // Play random song
        const randomIndex = Math.floor(Math.random() * trendingSongs.length);
        playSong(trendingSongs[randomIndex]);
      } else if (repeatMode === 1 && currentIndex === trendingSongs.length - 1) {
        // Repeat all - go back to first song
        playSong(trendingSongs[0]);
      }
    } else if (trendingSongs.length > 0) {
      // No current song, start playing first trending
      playSong(trendingSongs[0]);
    }
  };
  
  // Play previous song
  const playPreviousSong = () => {
    if (!currentSong) return;
    
    // If current time > 3 seconds, restart song
    if (playerRef.current && playerRef.current.getCurrentTime() > 3) {
      playerRef.current.seekTo(0);
      return;
    }
    
    // Find current song in trending list and play previous
    const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id);
    if (currentIndex > 0) {
      playSong(trendingSongs[currentIndex - 1]);
    } else if (isShuffleOn) {
      // Play random song
      const randomIndex = Math.floor(Math.random() * trendingSongs.length);
      playSong(trendingSongs[randomIndex]);
    } else if (repeatMode === 1 && currentIndex === 0) {
      // Repeat all - go to last song
      playSong(trendingSongs[trendingSongs.length - 1]);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };
  
  // Handle progress change (seek)
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    if (playerRef.current && duration) {
      const seekTime = (newProgress / 100) * duration;
      playerRef.current.seekTo(seekTime, true);
      setProgress(newProgress);
      setCurrentTime(seekTime);
    }
  };
  
  // Handle search
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Mock search results
    const results = [...trendingSongs, ...recentlyPlayed]
      .filter(song => 
        song.title.toLowerCase().includes(q.toLowerCase()) ||
        song.artist.toLowerCase().includes(q.toLowerCase())
      )
      .slice(0, 5);
    
    setSearchResults(results);
  };
  
  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };
  
  // Toggle repeat mode
  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };
  
  // Add to queue
  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
    
    toast({
      title: t('music.addedToQueue'),
      description: `${song.title} - ${song.artist}`,
    });
  };
  
  // Toggle background play
  const toggleBackgroundPlay = () => {
    setIsBackgroundPlay(!isBackgroundPlay);
    
    if (!isBackgroundPlay) {
      // Request notification permission for background play alerts
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
      
      toast({
        title: t('music.backgroundPlayEnabled'),
        description: t('music.playingInBackground'),
      });
    } else {
      document.title = 'Snapsta'; // Reset title
      
      toast({
        title: t('music.backgroundPlayDisabled'),
      });
    }
  };
  
  // Handle download
  const handleDownload = (format: 'mp3' | 'mp4') => {
    if (!currentSong) return;
    
    // In a real app, this would call a backend service to handle the download
    // For now, we'll just show a toast
    toast({
      title: t('music.downloadStarted'),
      description: `${currentSong.title} - ${currentSong.artist} (${format.toUpperCase()})`,
    });
    
    setShowDownloadDialog(false);
    
    // Simulate download completion
    setTimeout(() => {
      toast({
        title: t('music.downloadComplete'),
        description: `${currentSong.title} - ${currentSong.artist}`,
      });
    }, 3000);
  };
  
  useEffect(() => {
    // Cleanup function to clear any timers
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left section - Player and controls */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Search bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            handleSearch={handleSearch}
            playSong={playSong}
          />
          
          {/* Player section */}
          <PlayerDisplay
            currentSong={currentSong}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            playPreviousSong={playPreviousSong}
            playNextSong={playNextSong}
            isShuffleOn={isShuffleOn}
            toggleShuffle={toggleShuffle}
            repeatMode={repeatMode}
            toggleRepeat={toggleRepeat}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            progress={progress}
            duration={duration}
            currentTime={currentTime}
            handleProgressChange={handleProgressChange}
            formatTime={formatTime}
            trendingSongs={trendingSongs}
            playSong={playSong}
          />
          
          {/* YouTube player - hidden */}
          <YouTubeCore
            onPlayerReady={onPlayerReady}
            onPlayerStateChange={onPlayerStateChange}
            onPlayerError={onPlayerError}
          />
          
          {/* Action buttons */}
          {currentSong && (
            <ActionButtons
              currentSong={currentSong}
              isBackgroundPlay={isBackgroundPlay}
              toggleBackgroundPlay={toggleBackgroundPlay}
              setShowDownloadDialog={setShowDownloadDialog}
            />
          )}
        </div>
        
        {/* Right section - Trending, Recent, Queue */}
        <div className="lg:col-span-1 flex flex-col">
          <Tabs defaultValue="trending">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="trending" className="flex-1">
                {t('music.trending')}
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex-1">
                {t('music.recentlyPlayed')}
              </TabsTrigger>
              <TabsTrigger value="queue" className="flex-1">
                <ListMusic className="h-4 w-4 mr-2" />
                {t('music.queue')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="flex-1">
              <SongList
                songs={trendingSongs}
                currentSong={currentSong}
                playSong={playSong}
                addToQueue={addToQueue}
              />
            </TabsContent>
            
            <TabsContent value="recent" className="flex-1">
              <SongList
                songs={recentlyPlayed}
                currentSong={currentSong}
                playSong={playSong}
                addToQueue={addToQueue}
              />
            </TabsContent>
            
            <TabsContent value="queue" className="flex-1">
              {queue.length > 0 ? (
                <SongList
                  songs={queue}
                  currentSong={currentSong}
                  playSong={playSong}
                  isQueue={true}
                />
              ) : (
                <EmptyQueueDisplay />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Download dialog */}
      <DownloadDialog
        showDownloadDialog={showDownloadDialog}
        setShowDownloadDialog={setShowDownloadDialog}
        currentSong={currentSong}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default YouTubePlayer;
