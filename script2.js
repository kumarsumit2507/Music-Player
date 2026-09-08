
(() => {
  'use strict';

  
  const state = {
    accessToken: '',
    player: null,
    deviceId: null,
    debounceTimer: null,
    positionInterval: null
  };

  
  const DOM = {};

  /**
   * Caches DOM references and validates critical controls.
   * @returns {boolean} True if essential elements exist.
   */
  const initDOM = () => {
    DOM.timeline = document.getElementById('music-timeline');
    DOM.ctrlBtn = document.getElementById('play-pause');
    DOM.musicImg = document.querySelector('.music-img');
    DOM.searchInput = document.getElementById('search-input');
    DOM.searchResults = document.getElementById('search-results');
    DOM.searchBtn = document.querySelector('.search-box__btn');
    DOM.backwardBtn = document.getElementById('backward');
    DOM.forwardBtn = document.getElementById('forward');
    DOM.title = document.querySelector('.music-card__title') || document.querySelector('h1');
    DOM.artist = document.querySelector('.music-card__artist') || document.querySelector('h3');

    return Boolean(DOM.timeline && DOM.ctrlBtn && DOM.searchInput);
  };

  /**
   * Sets the active Spotify Access Token dynamically.
   * @param {string} token - OAuth token with 'streaming' scope.
   */
  const setAccessToken = (token) => {
    if (typeof token === 'string' && token.trim()) {
      state.accessToken = token.trim();
    }
  };

  /**
   * Centralized HTTP fetch wrapper with response validation.
   * @param {string} url - Target URL.
   * @param {RequestInit} [options={}] - Fetch configuration options.
   * @returns {Promise<any>} Parsed JSON response.
   */
  const fetchSpotifyAPI = async (url, options = {}) => {
    if (!state.accessToken) {
      throw new Error('Spotify Access Token is missing or invalid.');
    }

    const defaultHeaders = {
      'Authorization': `Bearer ${state.accessToken}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP Error ${response.status}: ${response.statusText}`);
    }

    return response.status !== 204 ? response.json() : true;
  };

  /**
   * Initializes the Spotify Web Playback SDK player instance.
   */
  const initSDKPlayer = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      state.player = new Spotify.Player({
        name: 'Web Music Player',
        getOAuthToken: (cb) => cb(state.accessToken),
        volume: 0.8
      });

      // Device registration and active transfer
      state.player.addListener('ready', async ({ device_id }) => {
        state.deviceId = device_id;

        try {
          await fetchSpotifyAPI('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            body: JSON.stringify({ device_ids: [device_id], play: false })
          });
        } catch (err) {
          console.error('Failed to activate device session:', err.message);
        }
      });

      // Player state listener
      state.player.addListener('player_state_changed', handlePlayerStateChange);

      state.player.connect();
    };
  };

  /**
   * Syncs UI metadata and controls on SDK state update.
   * @param {Object|null} playerState - Current SDK state object.
   */
  const handlePlayerStateChange = (playerState) => {
    if (!playerState) return;

    const { current_track: track } = playerState.track_window;
    const isPaused = playerState.paused;

    // Artwork Update
    if (DOM.musicImg && track?.album?.images?.length) {
      DOM.musicImg.style.backgroundImage = `url(${track.album.images[0].url})`;
    }

    // Text Metadata
    if (DOM.title && track) DOM.title.textContent = track.name;
    if (DOM.artist && track) DOM.artist.textContent = track.artists.map((a) => a.name).join(', ');

    // Control Icon & Animation
    if (DOM.ctrlBtn) {
      const iconSpan = DOM.ctrlBtn.querySelector('span');
      if (iconSpan) iconSpan.textContent = isPaused ? 'play_arrow' : 'pause';
    }

    DOM.musicImg?.classList.toggle('is-playing', !isPaused);

    // Timeline Max Updates
    if (DOM.timeline) {
      DOM.timeline.max = playerState.duration;
    }

    if (isPaused) {
      clearInterval(state.positionInterval);
    } else {
      startTimelineSync();
    }
  };

  /**
   * Synchronizes timeline input slider with current playback time.
   */
  const startTimelineSync = () => {
    clearInterval(state.positionInterval);
    state.positionInterval = setInterval(async () => {
      if (!state.player || !DOM.timeline) return;
      const currentState = await state.player.getCurrentState();
      if (currentState && !currentState.paused) {
        DOM.timeline.value = currentState.position;
      }
    }, 500);
  };

  /**
   * Executes unified Spotify search query.
   * @param {string} query - Search term.
   */
  const searchSpotify = async (query) => {
    if (!query) return;

    try {
      const data = await fetchSpotifyAPI(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`
      );
      if (data?.tracks?.items) {
        displaySearchResults(data.tracks.items);
      }
    } catch (err) {
      console.error('Search request failed:', err.message);
    }
  };

  /**
   * Renders search results dropdown with accessibility support.
   * @param {Array} tracks - Array of track objects.
   */
  const displaySearchResults = (tracks) => {
    if (!DOM.searchResults) return;

    DOM.searchResults.innerHTML = '';

    if (!tracks.length) {
      DOM.searchResults.classList.add('search-results--hidden');
      return;
    }

    tracks.forEach((track) => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      const imgUrl = track.album.images.length ? track.album.images[track.album.images.length - 1].url : '';
      const artistNames = track.artists.map((a) => a.name).join(', ');

      item.innerHTML = `
        <img class="search-item__img" src="${imgUrl}" alt="${track.name} album cover">
        <div class="search-item__info">
          <span class="search-item__title">${track.name}</span>
          <span class="search-item__artist">${artistNames}</span>
        </div>
      `;

      const selectTrack = () => {
        playSpotifyUri(track.uri);
        DOM.searchResults.classList.add('search-results--hidden');
        if (DOM.searchInput) DOM.searchInput.value = '';
      };

      item.addEventListener('click', selectTrack);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTrack();
        }
      });

      DOM.searchResults.appendChild(item);
    });

    DOM.searchResults.classList.remove('search-results--hidden');
  };

  /**
   * Sends request to play a track URI on current device.
   * @param {string} spotifyUri - Target track URI.
   */
  const playSpotifyUri = async (spotifyUri) => {
    if (!state.deviceId) {
      console.warn('Playback device not ready yet.');
      return;
    }

    try {
      await fetchSpotifyAPI(`https://api.spotify.com/v1/me/player/play?device_id=${state.deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotifyUri] })
      });
    } catch (err) {
      console.error('Playback trigger failed:', err.message);
    }
  };

  /**
   * Debounces user input events.
   */
  const handleSearchInput = () => {
    clearTimeout(state.debounceTimer);
    const query = DOM.searchInput?.value.trim();

    if (!query) {
      if (DOM.searchResults) {
        DOM.searchResults.innerHTML = '';
        DOM.searchResults.classList.add('search-results--hidden');
      }
      return;
    }

    state.debounceTimer = setTimeout(() => searchSpotify(query), 300);
  };

  /**
   * Binds UI event listeners with defensive checks.
   */
  const bindEvents = () => {
    // Search listeners
    DOM.searchInput?.addEventListener('input', handleSearchInput);
    DOM.searchBtn?.addEventListener('click', () => {
      const query = DOM.searchInput?.value.trim();
      if (query) searchSpotify(query);
    });

    // Playback controls
    DOM.ctrlBtn?.addEventListener('click', () => state.player?.togglePlay());
    DOM.timeline?.addEventListener('input', () => {
      if (state.player && DOM.timeline) {
        state.player.seek(Number(DOM.timeline.value));
      }
    });

    DOM.backwardBtn?.addEventListener('click', async () => {
      if (!state.player) return;
      const playerState = await state.player.getCurrentState();
      if (playerState) {
        state.player.seek(Math.max(0, playerState.position - 10000));
      }
    });

    DOM.forwardBtn?.addEventListener('click', async () => {
      if (!state.player) return;
      const playerState = await state.player.getCurrentState();
      if (playerState) {
        state.player.seek(Math.min(playerState.duration, playerState.position + 10000));
      }
    });

    // Click outside dropdown handler
    document.addEventListener('click', (e) => {
      const searchBox = document.querySelector('.search-box');
      if (DOM.searchResults && searchBox && !searchBox.contains(e.target)) {
        DOM.searchResults.classList.add('search-results--hidden');
      }
    });
  };

  // Public Initialization API Exposed Globally
  window.MusicPlayerApp = {
    init: (token) => {
      if (!initDOM()) {
        console.error('Player initialization aborted: Missing critical DOM elements.');
        return;
      }
      setAccessToken(token);
      initSDKPlayer();
      bindEvents();
    },
    setToken: setAccessToken
  };
})();