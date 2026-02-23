// Extension bridge for chrome.storage sync
import type { User } from '../services/auth.service';

export interface ExtensionBridge {
  isExtensionPresent(): boolean;
  syncTokens(accessToken: string, refreshToken: string, user?: User | null): void;
  clearTokens(): void;
}

class ChromeExtensionBridge implements ExtensionBridge {
  isExtensionPresent(): boolean {
    // For postMessage method (Content Script bridge), we don't strictly need chrome.runtime.id
    // to be visible in the main window context.
    return true; 
  }

  syncTokens(accessToken: string, refreshToken: string, user: User | null = null): void {
    if (!this.isExtensionPresent()) {
      console.log('Extension not present, skipping token sync');
      return;
    }

    try {
      // Send message to extension via postMessage
      window.postMessage(
        {
          type: 'AUTOSOLVE_AUTH',
          payload: {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: user,
          },
        },
        '*'
      );
      console.log('Tokens synced with extension');
    } catch (error) {
      console.error('Failed to sync tokens with extension:', error);
    }
  }

  clearTokens(): void {
    if (!this.isExtensionPresent()) {
      return;
    }

    try {
      window.postMessage(
        {
          type: 'AUTOSOLVE_LOGOUT',
        },
        '*'
      );
      console.log('Logout synced with extension');
    } catch (error) {
      console.error('Failed to sync logout with extension:', error);
    }
  }
}

export const extensionBridge = new ChromeExtensionBridge();
