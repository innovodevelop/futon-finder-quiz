import React from 'react';
import { createRoot } from 'react-dom/client';
import { ShopifyQuizWrapper } from './ShopifyQuizWrapper';
import '../index.css';

// Global Shopify configuration interface
declare global {
  interface Window {
    quizConfig: {
      title: string;
      subtitle: string;
      collections: {
        soft: string;
        medium: string;
        hard: string;
        couples: string;
      };
      products: any[];
      shop: {
        domain: string;
        currency: string;
      };
      klaviyo?: {
        publicKey: string;
      };
      reactMode: boolean;
      themeEditorMode: boolean;
      version: 'v1' | 'v2';
    };
    gtag?: (...args: any[]) => void;
    klaviyo?: {
      push: (args: any[]) => void;
    };
    Shopify?: {
      theme?: {
        showToast?: (message: string, type?: string) => void;
      };
    };
  }
}

// Initialize React app when DOM is ready
function initializeQuiz() {
  const container = document.getElementById('futon-quiz-container-v2');
  
  if (!container) {
    console.error('Futon Quiz V2: Container element not found');
    return;
  }

  // Verify we have the required configuration
  if (!window.quizConfig) {
    console.error('Futon Quiz V2: Configuration not found, falling back to V1');
    loadV1Fallback();
    return;
  }

  try {
    const root = createRoot(container);
    root.render(<ShopifyQuizWrapper config={window.quizConfig} />);
    
    // Notify Shopify theme editor of successful load
    if (window.quizConfig.themeEditorMode) {
      document.dispatchEvent(new CustomEvent('futon-quiz-v2-loaded'));
    }
  } catch (error) {
    console.error('Futon Quiz V2: Failed to initialize', error);
    loadV1Fallback();
  }
}

// Fallback to V1 implementation
function loadV1Fallback() {
  console.log('Futon Quiz V2: Loading V1 fallback...');
  
  // Load V1 assets dynamically
  const v1Script = document.createElement('script');
  v1Script.src = `${window.location.origin}/assets/futon-quiz.js`;
  v1Script.onload = () => {
    console.log('Futon Quiz V2: V1 fallback loaded successfully');
  };
  document.head.appendChild(v1Script);
  
  const v1Styles = document.createElement('link');
  v1Styles.rel = 'stylesheet';
  v1Styles.href = `${window.location.origin}/assets/futon-quiz-styles.css`;
  document.head.appendChild(v1Styles);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeQuiz);
} else {
  initializeQuiz();
}

// Handle theme editor changes
if (window.quizConfig?.themeEditorMode) {
  document.addEventListener('shopify:section:load', (event: any) => {
    if (event.detail.sectionId.includes('futon-quiz')) {
      setTimeout(initializeQuiz, 100); // Small delay for DOM updates
    }
  });
}