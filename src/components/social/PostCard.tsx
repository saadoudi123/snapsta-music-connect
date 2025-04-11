
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Image, 
  Smile
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface PostCardProps {
  post: {
    id: string;
    user: {
      id: string;
      username: string;
      name: string;
      avatar: string;
    };
    content: string;
    media: string[];
    likes: number;
    comments: number;
    createdAt: string;
    liked: boolean;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // In a real implementation, this would send the comment to the backend
      console.log('Comment submitted:', comment);
      setComment('');
    }
  };

  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <Link to={`/profile/${post.user.username}`} className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.user.name}</p>
              <p className="text-xs text-muted-foreground">@{post.user.username}</p>
            </div>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t('feed.reportPost')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">{t('feed.blockUser')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="whitespace-pre-wrap mb-3">{post.content}</p>
        
        {post.media && post.media.length > 0 && (
          <Carousel className="w-full">
            <CarouselContent>
              {post.media.map((src, index) => (
                <CarouselItem key={index}>
                  <img 
                    src={src} 
                    alt={`Post by ${post.user.name}`} 
                    className="w-full h-auto rounded-md object-cover max-h-96"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {post.media.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        )}
        
        <div className="mt-3 text-xs text-muted-foreground">
          {formatTimeAgo(post.createdAt)}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex justify-between items-center w-full border-t border-b py-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleLike}
          >
            <Heart 
              className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} 
            />
            <span>{likesCount}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Share className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleComment} className="mt-3 w-full flex items-center gap-2">
          <Input
            placeholder={t('feed.writeComment')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon">
            <Image className="h-5 w-5" />
            <span className="sr-only">Add image</span>
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
            <span className="sr-only">Add emoji</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
