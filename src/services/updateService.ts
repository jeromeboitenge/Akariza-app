import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export class UpdateService {
  /**
   * Check for updates and download if available
   * @param silent - If true, don't show alerts to user
   */
  static async checkForUpdates(silent: boolean = false): Promise<boolean> {
    try {
      // Skip in development mode
      if (__DEV__) {
        console.log('Update check skipped in development mode');
        return false;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        if (!silent) {
          Alert.alert(
            'Update Available',
            'A new version is available. Downloading...',
            [{ text: 'OK' }]
          );
        }

        await Updates.fetchUpdateAsync();

        if (!silent) {
          Alert.alert(
            'Update Ready',
            'The update has been downloaded. Restart the app to apply changes.',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Restart Now', onPress: () => Updates.reloadAsync() },
            ]
          );
        } else {
          // Auto-reload in silent mode
          await Updates.reloadAsync();
        }

        return true;
      } else {
        if (!silent) {
          console.log('App is up to date');
        }
        return false;
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      if (!silent) {
        Alert.alert(
          'Update Check Failed',
          'Unable to check for updates. Please try again later.'
        );
      }
      return false;
    }
  }

  /**
   * Get current update information
   */
  static async getUpdateInfo() {
    try {
      const updateId = Updates.updateId;
      const channel = Updates.channel;
      const runtimeVersion = Updates.runtimeVersion;
      const isEmbeddedLaunch = Updates.isEmbeddedLaunch;

      return {
        updateId,
        channel,
        runtimeVersion,
        isEmbeddedLaunch,
      };
    } catch (error) {
      console.error('Error getting update info:', error);
      return null;
    }
  }

  /**
   * Force reload the app
   */
  static async reloadApp() {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error reloading app:', error);
    }
  }
}
