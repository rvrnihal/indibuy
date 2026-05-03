
var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  spaceBetween: 30,
  centeredSlides: false,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 0,
    modifier: 1,
    slideShadows: false
  },
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  keyboard: {
    enabled: true
  },
  mousewheel: {
    thresholdDelta: 70
  },
  breakpoints: {
    460: {
      slidesPerView: 3
    },
    768: {
      slidesPerView: 3
    },
    1024: {
      slidesPerView: 3
    },
    1600: {
      slidesPerView: 3.6
    }
  }
});

// Error handling and logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  logErrorToServer(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  logErrorToServer(event.reason);
});

/**
 * Log errors to server
 */
function logErrorToServer(error) {
  if (typeof error === 'object' && error.message) {
    fetch('log-error.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: window.location.href
      })
    }).catch(err => console.error('Failed to log error:', err));
  }
}

/**
 * Utility function for making API calls
 */
async function apiCall(url, options = {}) {
  try {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    };

    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    logErrorToServer(error);
    throw error;
  }
}

/**
 * Format currency for Indian Rupee
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

/**
 * Check if user is online
 */
function checkOnlineStatus() {
  const statusElement = document.getElementById('online-status');
  
  if (navigator.onLine) {
    if (statusElement) {
      statusElement.textContent = 'Online';
      statusElement.className = 'badge bg-success';
    }
  } else {
    if (statusElement) {
      statusElement.textContent = 'Offline';
      statusElement.className = 'badge bg-danger';
    }
  }
}

// Check online status on load and when status changes
document.addEventListener('DOMContentLoaded', checkOnlineStatus);
window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);
