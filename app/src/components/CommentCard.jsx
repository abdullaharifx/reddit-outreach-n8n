import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Edit3, 
  ExternalLink, 
  MessageSquare,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from 'lucide-react';
import { truncateText } from '../utils/helpers';

const CommentCard = ({ comment, onApprove, onReject, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.generatedComment);
  const [isProcessing, setIsProcessing] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(comment.id, isEditing ? editedComment : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Approve error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(comment.id);
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedComment(comment.generatedComment); // Reset to original
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header with Score and Subreddit */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(comment.opportunityScore)}`} />
            <span className="text-sm font-medium text-gray-700">
              {getScoreText(comment.opportunityScore)} Opportunity
            </span>
            <span className="text-sm text-gray-500">({comment.opportunityScore}/100)</span>
          </div>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm font-medium text-reddit-orange">
            r/{comment.subreddit}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{comment.productName}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Opportunity Score</span>
          <span className="text-xs font-medium text-gray-700">{comment.opportunityScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getScoreColor(comment.opportunityScore)}`}
            style={{ width: `${comment.opportunityScore}%` }}
          />
        </div>
      </div>

      {/* Reddit Post Preview */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
            {comment.postTitle}
          </h4>
          <a
            href={comment.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-reddit-blue hover:text-reddit-orange transition-colors duration-200"
            title="View original post"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <div className="text-sm text-gray-600">
          {isExpanded ? (
            <p>{comment.postContent}</p>
          ) : (
            <p>{truncateText(comment.postContent, 150)}</p>
          )}
          
          {comment.postContent.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 inline-flex items-center text-reddit-orange hover:text-orange-600 text-xs font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Show more
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Analysis */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">AI Analysis</span>
        </div>
        <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
          {comment.aiAnalysis}
        </p>
      </div>

      {/* Generated Comment */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Generated Comment</span>
          </div>
          <button
            onClick={handleEditToggle}
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <Edit3 className="w-3 h-3 mr-1" />
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
        </div>
        
        {isEditing ? (
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-reddit-orange"
            rows={4}
            placeholder="Edit the comment..."
          />
        ) : (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {isEditing ? editedComment : comment.generatedComment}
            </p>
          </div>
        )}
        
        {isEditing && (
          <div className="mt-2 text-xs text-gray-500">
            Character count: {editedComment.length}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-1" />
          Reject
        </button>
        
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Check className="w-4 h-4 mr-1" />
          {isEditing ? 'Approve Edited' : 'Approve'}
        </button>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-reddit-orange mr-2"></div>
            Processing...
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentCard;