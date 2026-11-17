(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const mobileButtons = [...document.querySelectorAll('.mobile-nav button')];
  const topbar = document.querySelector('.topbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const lightbox = document.getElementById('imageLightbox');
  const lightboxStage = document.getElementById('lightboxStage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const duoCompanions = document.getElementById('duoCompanions');
  let previousFocus = null;

  function showPage(id, updateHash = true) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('page')) return;
    closeLightbox();
    pages.forEach(page => {
      page.classList.toggle('active', page === target);
      page.setAttribute('aria-hidden', page === target ? 'false' : 'true');
    });
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === id));
    mobileButtons.forEach(button => button.classList.toggle('mobile-active', button.dataset.go === id));
    if (updateHash && location.hash !== `#${id}`) history.pushState({page:id}, '', `#${id}`);
    topbar.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    document.title = `${target.dataset.title || 'Our world'} — Pie × Ryf`;
    if (duoCompanions) {
      duoCompanions.classList.remove('is-entering');
      void duoCompanions.offsetWidth;
      duoCompanions.classList.add('is-entering');
    }
  }

  function openLightbox(source) {
    if (!source) return;
    const clone = source.cloneNode(true);
    clone.removeAttribute('tabindex');
    clone.removeAttribute('role');
    clone.removeAttribute('aria-label');
    lightboxStage.replaceChildren(clone);
    const card = source.closest('.memory,.map-card,.style-card');
    const title = card?.querySelector('.memory-caption b,.map-info h2,.style-label b')?.textContent?.trim()
      || source.querySelector('.style-word,.map-tag,.memory-art i')?.textContent?.replace(/\s+/g,' ').trim()
      || 'Our little favorite';
    lightboxTitle.textContent = title;
    previousFocus = document.activeElement;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lightboxStage.replaceChildren();
    if (previousFocus?.focus) previousFocus.focus();
  }

  document.querySelectorAll('.memory-art,.map-visual,.style-art').forEach(item => {
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.setAttribute('aria-label','Enlarge image');
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(item);
      }
    });
  });
  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => showPage(button.dataset.go));
  });
  navLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); showPage(link.dataset.page);
  }));
  document.querySelectorAll('a[href="#home"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); showPage('home');
  }));
  menuToggle.addEventListener('click', () => {
    const opened = topbar.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });
  window.addEventListener('popstate', () => showPage(location.hash.slice(1) || 'home', false));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id && document.getElementById(id)?.classList.contains('page')) showPage(id, false);
  });


  // Our Playlist: add more entries to TRACKS whenever you want to expand the playlist.
  const playlistAudio = document.getElementById('playlistAudio');
  if (playlistAudio) {
    const TRACKS = [
      {
        title: 'Tattooed Heart',
        artist: 'Ariana Grande',
        src: 'assets/music/tattooed-heart.mp3',
        artworkTitle: 'TATTOOED<br><em>HEART</em>',
        artworkArtist: 'ARIANA GRANDE'
      },
      {
        title: 'bye x Circus',
        artist: 'Rigaloony571//Mashup',
        src: 'assets/music/circus.mp3',
        artworkTitle: 'bye<br><em>x Circus</em>',
        artworkArtist: 'Rigaloony571//Mashup'
      },
      {
        title: 'none',
        artist: 'none',
        src: 'assets/music/those-eyes.mp3',
        artworkTitle: 'no<br><em>ne</em>',
        artworkArtist: 'none'
      }
    ];


    let currentTrackIndex = 0;
    const playButton = document.getElementById('musicPlay');
    const playIcon = document.getElementById('musicPlayIcon');
    const progress = document.getElementById('musicProgress');
    const currentTime = document.getElementById('musicCurrent');
    const duration = document.getElementById('musicDuration');
    const status = document.getElementById('musicStatus');
    const previousButton = document.getElementById('musicPrevious');
    const nextButton = document.getElementById('musicNext');
    const trackTitle = document.getElementById('musicTrackTitle');
    const trackArtist = document.getElementById('musicTrackArtist');
    const artworkTitle = document.getElementById('musicArtworkTitle');
    const artworkArtist = document.getElementById('musicArtworkArtist');

    const formatTime = seconds => {
      if (!Number.isFinite(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    };

    const updateTrackButtons = () => {
      const hasMultipleTracks = TRACKS.length > 1;
      previousButton.disabled = !hasMultipleTracks;
      nextButton.disabled = !hasMultipleTracks;
      previousButton.title = hasMultipleTracks ? 'Previous song' : 'Add another song to enable';
      nextButton.title = hasMultipleTracks ? 'Next song' : 'Add another song to enable';
    };

    const loadTrack = (index, autoplay = false) => {
      currentTrackIndex = (index + TRACKS.length) % TRACKS.length;
      const track = TRACKS[currentTrackIndex];
      const wasPlaying = autoplay || !playlistAudio.paused;

      playlistAudio.pause();
      playlistAudio.src = track.src;
      playlistAudio.load();

      trackTitle.innerHTML = track.title;
      trackArtist.textContent = track.artist;
      artworkTitle.innerHTML = track.artworkTitle || track.title.toUpperCase();
      artworkArtist.textContent = track.artworkArtist || track.artist.toUpperCase();
      currentTime.textContent = '0:00';
      duration.textContent = '0:00';
      progress.value = 0;
      playIcon.textContent = '▶';
      playButton.setAttribute('aria-label', 'Play song');
      status.textContent = `Track ${currentTrackIndex + 1} of ${TRACKS.length} · ready when you are ♡`;
      updateTrackButtons();

      if (wasPlaying) {
        playlistAudio.play().then(() => {
          status.textContent = `Playing ${track.title} ♡`;
        }).catch(() => {
          status.textContent = `Add ${track.src} to enable playback ♡`;
        });
      }
    };

    playButton.addEventListener('click', async () => {
      if (playlistAudio.paused) {
        try {
          await playlistAudio.play();
          status.textContent = `Playing ${TRACKS[currentTrackIndex].title} ♡`;
        } catch (error) {
          status.textContent = `Add ${TRACKS[currentTrackIndex].src} to enable playback ♡`;
        }
      } else {
        playlistAudio.pause();
        status.textContent = 'Paused — take your time ♡';
      }
    });

    previousButton.addEventListener('click', () => {
      if (TRACKS.length > 1) loadTrack(currentTrackIndex - 1, true);
    });

    nextButton.addEventListener('click', () => {
      if (TRACKS.length > 1) loadTrack(currentTrackIndex + 1, true);
    });

    playlistAudio.addEventListener('play', () => {
      playIcon.textContent = 'Ⅱ';
      playButton.setAttribute('aria-label', 'Pause song');
    });
    playlistAudio.addEventListener('pause', () => {
      playIcon.textContent = '▶';
      playButton.setAttribute('aria-label', 'Play song');
    });
    playlistAudio.addEventListener('loadedmetadata', () => {
      duration.textContent = formatTime(playlistAudio.duration);
      status.textContent = `Now playing · ${TRACKS[currentTrackIndex].title} ♡`;
    });
    playlistAudio.addEventListener('timeupdate', () => {
      currentTime.textContent = formatTime(playlistAudio.currentTime);
      if (Number.isFinite(playlistAudio.duration) && playlistAudio.duration > 0) {
        progress.value = (playlistAudio.currentTime / playlistAudio.duration) * 100;
      }
    });
    playlistAudio.addEventListener('ended', () => {
      if (TRACKS.length > 1) {
        loadTrack(currentTrackIndex + 1, true);
      } else {
        status.textContent = 'A little song, a little memory. Replay? ♡';
        playIcon.textContent = '▶';
      }
    });
    playlistAudio.addEventListener('error', () => {
      status.textContent = `Audio file not found — add ${TRACKS[currentTrackIndex].src} ♡`;
    });
    progress.addEventListener('input', () => {
      if (Number.isFinite(playlistAudio.duration) && playlistAudio.duration > 0) {
        playlistAudio.currentTime = (Number(progress.value) / 100) * playlistAudio.duration;
      }
    });

    updateTrackButtons();
    loadTrack(0, false);
  }

  document.querySelectorAll('.other-link[data-page]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showPage(link.dataset.page);
    });
  });


  // Our Reviews: submissions stay private until the owner approves them in the Google Sheet.
  const REVIEWS_API_URL = 'https://script.google.com/macros/s/AKfycbw8TEec1JJawgJ-bjDcF2DP_VfIJCT0gC6qrc2n8ayNFwSMw9a41yyFjP_5kyKo5Hmw/exec';
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    const reviewList = document.getElementById('reviewsList');
    const reviewCount = document.getElementById('reviewsCount');
    const reviewStatus = document.getElementById('reviewFormStatus');
    const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[char]);

    function loadReviews() {
      if (REVIEWS_API_URL.startsWith('PASTE_')) {
        reviewList.innerHTML = '<p class="reviews-empty">Connect the reviews service to show approved notes ♡</p>';
        return;
      }
      const callbackName = '__pieRyfReviewsCallback';
      window[callbackName] = payload => {
        const reviews = payload && Array.isArray(payload.reviews) ? payload.reviews : [];
        reviewCount.textContent = `${reviews.length} ${reviews.length === 1 ? 'NOTE' : 'NOTES'}`;
        if (!reviews.length) {
          reviewList.innerHTML = '<p class="reviews-empty">No approved notes yet. Be the first to leave one ♡</p>';
          return;
        }
        reviewList.innerHTML = reviews.map(review => {
          const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
          return `<article class="review-card">
            <div class="review-card-top"><b>${escapeHTML(review.name)}</b><span class="review-stars">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span></div>
            <p>${escapeHTML(review.message)}</p><small>${escapeHTML(review.date || '')}</small>
          </article>`;
        }).join('');
        delete window[callbackName];
        script.remove();
      };
      const script = document.createElement('script');
      script.src = `${REVIEWS_API_URL}?callback=${callbackName}&t=${Date.now()}`;
      script.onerror = () => { reviewList.innerHTML = '<p class="reviews-empty">Could not load notes right now. Please try again later ♡</p>'; };
      document.body.appendChild(script);
    }

    reviewForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (REVIEWS_API_URL.startsWith('PASTE_')) {
        reviewStatus.textContent = 'The reviews service has not been connected yet.';
        return;
      }
      const data = Object.fromEntries(new FormData(reviewForm).entries());
      data.name = String(data.name || '').trim();
      data.message = String(data.message || '').trim();
      if (!data.name || !data.message) return;
      const submit = reviewForm.querySelector('button[type="submit"]');
      submit.disabled = true;
      reviewStatus.textContent = 'Sending your note...';
      try {
        await fetch(REVIEWS_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify(data)
        });
        reviewForm.reset();
        reviewStatus.textContent = 'Thank you! Your note has been submitted and is waiting for approval ♡';
      } catch (error) {
        reviewStatus.textContent = 'Something went wrong. Please try again ♡';
      } finally {
        submit.disabled = false;
      }
    });
    loadReviews();
  }

  const initial = location.hash.slice(1);
  showPage(document.getElementById(initial)?.classList.contains('page') ? initial : 'home', false);
})();