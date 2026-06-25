import { Platform, NativeModules } from 'react-native';

let AppleHealthKit: any = null;

const hasHealthKitNativeModule = !!(NativeModules && NativeModules.AppleHealthKit);

if (Platform.OS === 'ios' && hasHealthKitNativeModule) {
  try {
    const healthModule = require('react-native-health');
    AppleHealthKit = healthModule.default || healthModule;
  } catch (error) {
    console.warn('Failed to load react-native-health package:', error);
  }
}

export const getHealthKitPermissionsConfig = () => {
  if (!AppleHealthKit) return null;
  return {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      ],
      write: [],
    },
  };
};

/**
 * Request native HealthKit authorization.
 * Resolves to true if granted/initialized, false or throws if error.
 */
export const requestHealthPermissions = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!AppleHealthKit) {
      console.log('[HealthService] HealthKit not available on this platform. Mocking success.');
      resolve(true);
      return;
    }

    const config = getHealthKitPermissionsConfig();
    if (!config) {
      resolve(false);
      return;
    }

    AppleHealthKit.initHealthKit(config, (error: string) => {
      if (error) {
        console.warn('[HealthService] HealthKit initialization error:', error);
        resolve(false);
      } else {
        console.log('[HealthService] HealthKit successfully initialized.');
        resolve(true);
      }
    });
  });
};

/**
 * Fetch steps for today (start of day to now).
 */
export const getTodaySteps = (): Promise<number> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit) {
      // Mock steps for non-iOS or Simulator testing
      resolve(7420);
      return;
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
      includeManuallyAdded: true,
    };

    AppleHealthKit.getStepCount(options, (err: any, results: any) => {
      if (err) {
        console.warn('[HealthService] Error getting step count:', err);
        resolve(0);
      } else {
        // results.value contains total steps count for the requested period
        resolve(results?.value || 0);
      }
    });
  });
};

/**
 * Fetch active calories burned today (summing samples from start of day to now).
 */
export const getTodayActiveCalories = (): Promise<number> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit) {
      // Mock calories burned for non-iOS or Simulator testing
      resolve(350);
      return;
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    AppleHealthKit.getActiveEnergyBurned(options, (err: any, results: any[]) => {
      if (err) {
        console.warn('[HealthService] Error getting active calories:', err);
        resolve(0);
      } else {
        // results is an array of samples, we must sum their values
        const total = (results || []).reduce((sum, sample) => sum + (sample.value || 0), 0);
        resolve(Math.round(total));
      }
    });
  });
};
