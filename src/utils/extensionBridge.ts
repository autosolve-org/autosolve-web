// Extension bridge for chrome.storage sync

export interface ExtensionBridge {
  isExtensionPresent(): boolean;
  syncTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

class ChromeExtensionBridge implements ExtensionBridge {
  isExtensionPresent(): boolean {
    // Check if Chrome extension API is available
    return !!(window.chrome?.runtime?.id);
  }

  syncTokens(accessToken: string, refreshToken: string): void {
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
