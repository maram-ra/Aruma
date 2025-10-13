import React from 'react';
import './RequestCard.css';

const RequestCard = ({ request, onUpdateStatus }) => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'approved': return '#28A745';
      case 'rejected': return '#DC3545';
      case 'completed': return '#6C757D';
      default: return '#6C757D';
    }
  };

  const handleAccept = () => {
    onUpdateStatus(request.id, 'approved');
  };

  const handleReject = () => {
    onUpdateStatus(request.id, 'rejected');
  };

  const handleComplete = () => {
    onUpdateStatus(request.id, 'completed');
  };

  return (
    <div className="request-card">
      <div className="request-header">
        <div className="request-meta">
          <span className="client">Client: {request.client}</span>
          <span className="type">Type: {request.type}</span>
        </div>
      </div>

      <div className="request-body">
        <p className="message-label">Message:</p>
        <p className="message">{request.message}</p>
        <span className="date">Date: {request.date}</span>
      </div>

      <div className="request-actions">
        {request.status === 'pending' && (
          <>
            <button 
              className="btn accept-btn"
              onClick={handleAccept}
            >
              Accept
            </button>
            <button 
              className="btn reject-btn"
              onClick={handleReject}
            >
              Reject
            </button>
          </>
        )}
        {request.status === 'approved' && (
          <button 
            className="btn complete-btn"
            onClick={handleComplete}
          >
            Mark Complete
          </button>
        )}
      </div>

      <div className="request-status">
        <span className="status-label">Status:</span>
        <div className="status-badges">
          <span 
            className={`status-badge ${request.status === 'pending' ? 'active' : ''}`}
            style={{ 
              color: request.status === 'pending' ? getStatusColor('pending') : '#6C757D',
              borderColor: request.status === 'pending' ? getStatusColor('pending') : '#DEE2E6'
            }}
          >
            Pending
          </span>
          <span 
            className={`status-badge ${request.status === 'approved' ? 'active' : ''}`}
            style={{ 
              color: request.status === 'approved' ? getStatusColor('approved') : '#6C757D',
              borderColor: request.status === 'approved' ? getStatusColor('approved') : '#DEE2E6'
            }}
          >
            Approved
          </span>
          <span 
            className={`status-badge ${request.status === 'rejected' ? 'active' : ''}`}
            style={{ 
              color: request.status === 'rejected' ? getStatusColor('rejected') : '#6C757D',
              borderColor: request.status === 'rejected' ? getStatusColor('rejected') : '#DEE2E6'
            }}
          >
            Rejected
          </span>
          <span 
            className={`status-badge ${request.status === 'completed' ? 'active' : ''}`}
            style={{ 
              color: request.status === 'completed' ? getStatusColor('completed') : '#6C757D',
              borderColor: request.status === 'completed' ? getStatusColor('completed') : '#DEE2E6'
            }}
          >
            Completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;