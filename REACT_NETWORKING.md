# React Networking Guide for Games

Guide to implementing HTTP requests, WebSocket connections, and API integration in React games.

## Table of Contents

- [HTTP Requests](#http-requests)
- [WebSocket Connections](#websocket-connections)
- [Fetch API](#fetch-api)
- [Axios](#axios)
- [Game-Specific Patterns](#game-specific-patterns)

## HTTP Requests

### Fetch API Hook

```jsx
import { useState, useCallback } from 'react';

function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err.message };
    }
  }, []);

  return { fetchData, loading, error };
}
```

### Usage

```jsx
function Game() {
  const { fetchData, loading, error } = useFetch();

  const submitScore = async (score) => {
    const { data, error } = await fetchData('/api/scores', {
      method: 'POST',
      body: JSON.stringify({ score })
    });

    if (error) {
      console.error('Failed to submit score:', error);
    } else {
      console.log('Score submitted:', data);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <button onClick={() => submitScore(100)}>Submit Score</button>
    </div>
  );
}
```

### Custom Hook for API Calls

```jsx
function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err.message };
    }
  };

  const post = async (url, body) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err.message };
    }
  };

  return { get, post, loading, error };
}
```

## WebSocket Connections

### WebSocket Hook

```jsx
import { useEffect, useRef, useState, useCallback } from 'react';

function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (err) {
          setLastMessage(event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        setIsConnected(false);
        
        // Reconnect logic
        if (reconnectAttemptsRef.current < 5) {
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 1000 * reconnectAttemptsRef.current);
        }
      };
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
```

### Usage

```jsx
function MultiplayerGame() {
  const { isConnected, lastMessage, sendMessage } = useWebSocket('wss://game.example.com/ws');

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'player_move':
          handlePlayerMove(lastMessage.data);
          break;
        case 'score_update':
          handleScoreUpdate(lastMessage.data);
          break;
      }
    }
  }, [lastMessage]);

  const sendPlayerPosition = (x, y) => {
    sendMessage({
      type: 'player_move',
      data: { x, y }
    });
  };

  return (
    <div>
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
      <button onClick={() => sendPlayerPosition(10, 20)}>
        Send Position
      </button>
    </div>
  );
}
```

## Fetch API

### GET Request

```jsx
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### POST Request

```jsx
async function submitScore(score) {
  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score })
    });

    if (!response.ok) {
      throw new Error('Failed to submit score');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Error Handling

```jsx
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

## Axios

### Installation

```bash
npm install axios
```

### Axios Hook

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function useAxios(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    axios.get(url)
      .then(response => {
        if (!cancelled) {
          setData(response.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

### Axios Instance

```jsx
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Game-Specific Patterns

### Score Submission

```jsx
function useScoreSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitScore = async (score, playerId) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          playerId,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit score');
      }

      const data = await response.json();
      setSubmitting(false);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
      return { success: false, error: err.message };
    }
  };

  return { submitScore, submitting, error };
}
```

### Leaderboard Fetching

```jsx
function useLeaderboard(limit = 10) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leaderboard?limit=${limit}`);
      const data = await response.json();
      setLeaderboard(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
}
```

### Real-Time Multiplayer

```jsx
function useMultiplayer(gameId) {
  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    `wss://game.example.com/ws/${gameId}`
  );

  const sendPlayerMove = useCallback((position) => {
    sendMessage({
      type: 'player_move',
      position,
      timestamp: Date.now()
    });
  }, [sendMessage]);

  const sendChatMessage = useCallback((message) => {
    sendMessage({
      type: 'chat',
      message,
      timestamp: Date.now()
    });
  }, [sendMessage]);

  return {
    isConnected,
    lastMessage,
    sendPlayerMove,
    sendChatMessage
  };
}
```

---

**References:**
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Axios Documentation](https://axios-http.com/)

