import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter,
  RefreshCw,
  CheckSquare,
  Square
} from 'lucide-react';
import { commentsAPI } from '../services/api';
import CommentCard from '../components/CommentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Mock data for development - moved outside component to avoid re-creation
const mockComments = [
    {
      id: 1,
      postTitle: "Looking for a project management tool for my startup",
      postContent: "Hey everyone! I'm starting a small tech company and need a good project management solution. We're a team of 8 people working remotely. Budget is around $30-50 per month. Any recommendations?",
      postUrl: "https://reddit.com/r/startups/comments/example1",
      subreddit: "startups",
      generatedComment: "Have you considered TaskMaster Pro? It's specifically designed for small to medium teams and fits perfectly within your budget at $29.99/month. The remote collaboration features are excellent, and you get unlimited projects and team members. They also offer a 14-day free trial so you can test it with your team first.",
      opportunityScore: 87,
      productName: "TaskMaster Pro",
      aiAnalysis: "This is an excellent match because the user is specifically asking for project management tools, mentions their team size (8 people), budget range ($30-50), and remote work setup - all of which align perfectly with TaskMaster Pro's features and pricing.",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      postTitle: "Code reviews are taking forever in our team",
      postContent: "Our development team spends way too much time on code reviews. Manual reviews are slow and we often miss important issues. Looking for ways to streamline this process. Any tools or strategies that have worked for your teams?",
      postUrl: "https://reddit.com/r/programming/comments/example2",
      subreddit: "programming",
      generatedComment: "We had the same issue until we started using CodeReview AI. It's an AI-powered assistant that pre-reviews code and catches common bugs, security issues, and style problems before human review. This reduced our review time by about 60% and improved code quality significantly. The AI learns from your team's coding standards too.",
      opportunityScore: 92,
      productName: "CodeReview AI",
      aiAnalysis: "Perfect opportunity - the user describes exactly the problem CodeReview AI solves (slow manual reviews, missing issues). High engagement potential in r/programming with developers who would appreciate AI assistance.",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      postTitle: "Best practices for small team collaboration?",
      postContent: "We're a 5-person startup and struggling with task organization and communication. Everyone seems to be working on different things and we're missing deadlines. What tools or methods do you recommend for better team coordination?",
      postUrl: "https://reddit.com/r/entrepreneur/comments/example3",
      subreddit: "entrepreneur",
      generatedComment: "For a 5-person team, I'd highly recommend TaskMaster Pro. It's designed exactly for teams your size and excels at task organization and deadline management. The communication features help everyone stay aligned on priorities. At $29.99/month, it's very affordable for startups and includes everything you need without overwhelming complexity.",
      opportunityScore: 78,
      productName: "TaskMaster Pro",
      aiAnalysis: "Good match with clear pain points mentioned (task organization, communication, missing deadlines). The team size and startup context make it relevant, though the opportunity score is slightly lower due to less specific budget/timeline mentions.",
      createdAt: new Date().toISOString(),
    },
  ];

const Dashboard = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComments, setSelectedComments] = useState(new Set());
  const [filters, setFilters] = useState({
    product: '',
    subreddit: '',
    minScore: 0,
  });

  const stats = [
    {
      name: 'Pending Comments',
      value: comments.length.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Approved Today',
      value: '5',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Comments',
      value: '43',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Rejected',
      value: '7',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getPending();
      setComments(response.data || []);
    } catch (error) {
      console.error('Fetch comments error:', error);
      // For development, use mock data
      setComments(mockComments);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchComments();
    setRefreshing(false);
    toast.success('Comments refreshed');
  };

  const handleApprove = async (commentId, editedComment = null) => {
    try {
      await commentsAPI.approve(commentId, editedComment);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setSelectedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      toast.success('Comment approved successfully');
    } catch (error) {
      toast.error('Failed to approve comment');
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (commentId) => {
    try {
      await commentsAPI.reject(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setSelectedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      toast.success('Comment rejected');
    } catch (error) {
      toast.error('Failed to reject comment');
      console.error('Reject error:', error);
    }
  };

  const handleBulkApprove = async () => {
    const selectedIds = Array.from(selectedComments);
    if (selectedIds.length === 0) {
      toast.error('Please select comments to approve');
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => commentsAPI.approve(id)));
      setComments(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedComments(new Set());
      toast.success(`${selectedIds.length} comments approved`);
    } catch (error) {
      toast.error('Failed to approve comments');
      console.error('Bulk approve error:', error);
    }
  };

  const handleBulkReject = async () => {
    const selectedIds = Array.from(selectedComments);
    if (selectedIds.length === 0) {
      toast.error('Please select comments to reject');
      return;
    }

    try {
      await Promise.all(selectedIds.map(id => commentsAPI.reject(id)));
      setComments(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedComments(new Set());
      toast.success(`${selectedIds.length} comments rejected`);
    } catch (error) {
      toast.error('Failed to reject comments');
      console.error('Bulk reject error:', error);
    }
  };

  const handleSelectComment = (commentId) => {
    setSelectedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedComments.size === filteredComments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(filteredComments.map(c => c.id)));
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filters.product && !comment.productName.toLowerCase().includes(filters.product.toLowerCase())) {
      return false;
    }
    if (filters.subreddit && !comment.subreddit.toLowerCase().includes(filters.subreddit.toLowerCase())) {
      return false;
    }
    if (comment.opportunityScore < filters.minScore) {
      return false;
    }
    return true;
  });

  const uniqueProducts = [...new Set(comments.map(c => c.productName))];
  const uniqueSubreddits = [...new Set(comments.map(c => c.subreddit))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading comments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve AI-generated comments for your Reddit outreach.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute ${item.bgColor} rounded-md p-3`}>
                  <Icon className={`w-6 h-6 ${item.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Filters and Bulk Actions */}
      {comments.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filters.product}
                  onChange={(e) => setFilters(prev => ({ ...prev, product: e.target.value }))}
                  className="text-sm border-gray-300 rounded-md focus:ring-reddit-orange focus:border-reddit-orange"
                >
                  <option value="">All Products</option>
                  {uniqueProducts.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>
              
              <select
                value={filters.subreddit}
                onChange={(e) => setFilters(prev => ({ ...prev, subreddit: e.target.value }))}
                className="text-sm border-gray-300 rounded-md focus:ring-reddit-orange focus:border-reddit-orange"
              >
                <option value="">All Subreddits</option>
                {uniqueSubreddits.map(subreddit => (
                  <option key={subreddit} value={subreddit}>r/{subreddit}</option>
                ))}
              </select>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Min Score:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600 w-8">{filters.minScore}</span>
              </div>
            </div>

            {selectedComments.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedComments.size} selected
                </span>
                <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve All
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject All
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments Feed */}
      {filteredComments.length > 0 ? (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-2 px-1">
            <button
              onClick={handleSelectAll}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
            >
              {selectedComments.size === filteredComments.length ? (
                <CheckSquare className="w-4 h-4 text-reddit-orange" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>Select All ({filteredComments.length})</span>
            </button>
          </div>

          {filteredComments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 pt-6">
                <button
                  onClick={() => handleSelectComment(comment.id)}
                  className="text-gray-400 hover:text-reddit-orange"
                >
                  {selectedComments.has(comment.id) ? (
                    <CheckSquare className="w-5 h-5 text-reddit-orange" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex-1">
                <CommentCard
                  comment={comment}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No pending comments
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your AI-generated comments will appear here for approval.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No comments match your filters
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filter criteria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;