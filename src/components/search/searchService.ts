
import { SearchResult, SearchResultType } from './types';

// Mock function to fetch search results
export const fetchSearchResults = async (searchQuery: string): Promise<SearchResult[]> => {
  // In a real app, this would be an API call
  // For demo, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock results based on the search query
  const mockResults: SearchResult[] = [];
  
  // Users
  if (searchQuery.length > 0) {
    mockResults.push(
      {
        id: 'user1',
        type: 'user' as SearchResultType,
        title: 'John Doe',
        subtitle: '@johndoe',
        image: 'https://i.pravatar.cc/150?u=1',
        url: '/profile/johndoe'
      },
      {
        id: 'user2',
        type: 'user' as SearchResultType,
        title: 'Jane Smith',
        subtitle: '@janesmith',
        image: 'https://i.pravatar.cc/150?u=2',
        url: '/profile/janesmith'
      }
    );
    
    // Music
    mockResults.push(
      {
        id: 'music1',
        type: 'music' as SearchResultType,
        title: 'Shape of You',
        subtitle: 'Ed Sheeran',
        image: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
        url: '/music/shape-of-you'
      },
      {
        id: 'music2',
        type: 'music' as SearchResultType,
        title: 'Blinding Lights',
        subtitle: 'The Weeknd',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        url: '/music/blinding-lights'
      }
    );
    
    // Channels
    mockResults.push(
      {
        id: 'channel1',
        type: 'channel' as SearchResultType,
        title: '#music_lovers',
        subtitle: '3.2k members',
        image: '',
        url: '/channels/music_lovers'
      },
      {
        id: 'channel2',
        type: 'channel' as SearchResultType,
        title: '#travel_adventures',
        subtitle: '1.5k members',
        image: '',
        url: '/channels/travel_adventures'
      }
    );
    
    // Posts
    mockResults.push(
      {
        id: 'post1',
        type: 'post' as SearchResultType,
        title: 'My Summer Holiday Photos',
        subtitle: 'Posted by @johndoe • 2 days ago',
        image: 'https://source.unsplash.com/random/300x200?summer',
        url: '/posts/summer-holiday'
      },
      {
        id: 'post2',
        type: 'post' as SearchResultType,
        title: 'New Music Release Party',
        subtitle: 'Posted by @musiclover • 5 hours ago',
        image: 'https://source.unsplash.com/random/300x200?concert',
        url: '/posts/music-release'
      }
    );
  }
  
  return mockResults.filter(result => 
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
