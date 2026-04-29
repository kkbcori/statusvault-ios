// ═══════════════════════════════════════════════════════════════
// StatusVault — Local Notification System (Updated)
// Fixed: Banner alerts, lock screen visibility, reminder style
// 100% on-device — no push servers, no backend
// ═══════════════════════════════════════════════════════════════

import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import dayjs from 'dayjs';
import { UserDocument } from '../types';

/** Configure notification handler — MUST call on app start */
export const configureNotifications = async () => {
  if (Platform.OS === 'web') return; // No-op on web
  // This makes notifications show as BANNERS when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,   // Show banner/popup
      shouldPlaySound: true,   // Play notification sound
      shouldSetBadge: true,    // Update app badge count
      priority: Notifications.AndroidNotificationPriority.MAX, // Highest priority = heads-up banner
    }),
  });

  // Android notification channels — required for Android 8+
  if (Platform.OS === 'android') {
    // Critical deadlines channel — highest importance = banner + sound
    Notifications.setNotificationChannelAsync('deadlines-critical', {
      name: 'Critical Deadline Alerts',
      description: 'Urgent alerts for deadlines within 7 days',
      importance: Notifications.AndroidImportance.MAX, // Heads-up banner
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#E63946',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });

    // Urgent deadlines channel — high importance
    Notifications.setNotificationChannelAsync('deadlines-urgent', {
      name: 'Urgent Deadline Alerts',
      description: 'Alerts for deadlines within 30 days',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F4A261',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });

    // Reminder channel — default importance
    Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      description: 'Advance reminders for upcoming deadlines',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  // Silently request notification permission on first launch.
  // iOS only shows the system prompt once per install — subsequent launches are no-ops.
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing !== 'granted') {
      await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
          provideAppNotificationSettings: true,
        },
        android: {},
      });
    }
  } catch {
    // Never block app start on permission flow.
  }
};

/** Request notification permissions — returns true if granted */
export const requestPermissions = async (): Promise<boolean> => {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
      provideAppNotificationSettings: true,
    },
    android: {},
  });

  if (status !== 'granted') {
    Alert.alert(
      'Notifications Blocked',
      'StatusVault needs notifications to alert you before deadlines expire. Please enable them in your device settings.',
    );
  }

  return status === 'granted';
};

/**
 * Get the appropriate Android channel based on urgency
 */
const getChannel = (alertDay: number): string => {
  if (alertDay <= 15) return 'deadlines-critical';
  if (alertDay <= 60) return 'deadlines-urgent';
  return 'reminders';
};

/**
 * Schedule notifications for a single document
 * Uses the document's alertDays array (type-specific windows)
 * Returns array of notification IDs for later cancellation
 */
export const scheduleDocumentNotifications = async (
  doc: UserDocument
): Promise<string[]> => {
  if (Platform.OS === 'web') return [];
  const notificationIds: string[] = [];
  const now = dayjs();
  const expiry = dayjs(doc.expiryDate);

  // Track which alert windows have already passed so we only fire ONE
  // catch-up notification (for the most urgent missed window). Otherwise a
  // doc expiring in 5 days would dump 4 notifications (180d, 90d, 60d, 30d
  // all already passed) onto the user at once — too noisy.
  const passedWindows: number[] = [];

  for (const alertDay of doc.alertDays) {
    const triggerDate = expiry.subtract(alertDay, 'day').hour(9).minute(0).second(0);

    if (triggerDate.isAfter(now)) {
      // Future trigger — schedule normally
      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: getNotificationTitle(doc, alertDay),
            body: getNotificationBody(doc, alertDay),
            subtitle: getNotificationSubtitle(alertDay), // iOS subtitle
            data: {
              documentId: doc.id,
              alertDay,
              type: 'deadline_reminder',
            },
            sound: 'default',
            badge: 1,
            // Android-specific: choose channel by urgency
            ...(Platform.OS === 'android' && {
              channelId: getChannel(alertDay),
              color: alertDay <= 15 ? '#E63946' : alertDay <= 60 ? '#F4A261' : '#2E5AAC',
              sticky: alertDay <= 15, // Critical alerts persist in notification tray
            }),
            // iOS-specific: category for action buttons
            ...(Platform.OS === 'ios' && {
              categoryIdentifier: 'deadline_alert',
            }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate.toDate(),
          },
        });
        notificationIds.push(id);
      } catch (error) {
        console.warn(`Failed to schedule notification for ${doc.label} at ${alertDay}d:`, error);
      }
    } else {
      // Past trigger — collect for catch-up below
      passedWindows.push(alertDay);
    }
  }

  // Fire ONE catch-up notification for the most urgent passed window
  // (smallest alertDay = most urgent). Trigger ~5 seconds out so iOS
  // delivers it as a normal notification rather than racing the JS thread.
  if (passedWindows.length > 0) {
    const mostUrgent = Math.min(...passedWindows);
    const daysRemaining = Math.max(0, expiry.diff(now, 'day'));
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: getNotificationTitle(doc, daysRemaining > 0 ? daysRemaining : mostUrgent),
          body: getNotificationBody(doc, daysRemaining > 0 ? daysRemaining : mostUrgent),
          subtitle: getNotificationSubtitle(mostUrgent),
          data: {
            documentId: doc.id,
            alertDay: mostUrgent,
            type: 'deadline_reminder_catchup',
          },
          sound: 'default',
          badge: 1,
          ...(Platform.OS === 'android' && {
            channelId: getChannel(mostUrgent),
            color: mostUrgent <= 15 ? '#E63946' : mostUrgent <= 60 ? '#F4A261' : '#2E5AAC',
            sticky: mostUrgent <= 15,
          }),
          ...(Platform.OS === 'ios' && {
            categoryIdentifier: 'deadline_alert',
          }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });
      notificationIds.push(id);
    } catch (error) {
      console.warn(`Failed to schedule catch-up notification for ${doc.label}:`, error);
    }
  }

  return notificationIds;
};

/** Cancel all notifications for a document */
export const cancelDocumentNotifications = async (
  notificationIds: string[]
): Promise<void> => {
  if (Platform.OS === 'web') return;
  for (const id of notificationIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (error) {
      // Notification may have already fired
    }
  }
};

/** Cancel ALL scheduled notifications */
export const cancelAllNotifications = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/** Get count of scheduled notifications (for debugging) */
export const getScheduledCount = async (): Promise<number> => {
  if (Platform.OS === 'web') return 0;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
};

/**
 * Schedule a test notification — fires in 3 seconds
 * Useful for verifying notifications work on the device
 */
export const sendTestNotification = async (): Promise<void> => {
  if (Platform.OS === 'web') { console.log('Test notification (web — no-op)'); return; }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🛡️ StatusVault Test',
      body: 'Notifications are working! You will receive deadline alerts like this.',
      subtitle: 'Test Alert',
      sound: 'default',
      badge: 1,
      ...(Platform.OS === 'android' && {
        channelId: 'deadlines-urgent',
        color: '#2E5AAC',
      }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
    },
  });
};

// ─── Notification Copy ───────────────────────────────────────
// Tailored messaging per urgency level

const getNotificationSubtitle = (alertDay: number): string => {
  if (alertDay <= 15) return '⚠️ Critical Alert';
  if (alertDay <= 60) return '🔴 Urgent Reminder';
  if (alertDay <= 90) return '🟡 Upcoming Deadline';
  return '📋 Advance Notice';
};

const getNotificationTitle = (doc: UserDocument, alertDay: number): string => {
  if (alertDay <= 15) return `⚠️ CRITICAL: ${doc.label} — ${alertDay} days left!`;
  if (alertDay <= 30) return `🔴 URGENT: ${doc.label}`;
  if (alertDay <= 60) return `🟡 Reminder: ${doc.label}`;
  return `📋 Heads Up: ${doc.label}`;
};

const getNotificationBody = (doc: UserDocument, alertDay: number): string => {
  const label = doc.label;

  if (alertDay <= 7) {
    return `Your ${label} expires in ${alertDay} days! Take action immediately to protect your immigration status. Do not delay.`;
  }
  if (alertDay <= 15) {
    return `Your ${label} expires in ${alertDay} days. Start the renewal process now — processing times may be longer than expected.`;
  }
  if (alertDay <= 60) {
    return `Your ${label} expires in ${alertDay} days. Begin gathering documents and filing for renewal to avoid any gaps.`;
  }
  if (alertDay <= 90) {
    return `Your ${label} expires in ${alertDay} days. Good time to review requirements and prepare your renewal timeline.`;
  }
  return `Your ${label} expires in ${alertDay} days. Mark this on your calendar and begin planning ahead.`;
};

/**
 * Clear the iOS app icon badge count (the red number on the icon).
 * Called on app foreground and when the user updates a doc — both signal
 * the user has acknowledged any pending alerts.
 *
 * Also dismisses any delivered notifications still sitting in the iOS
 * Notification Center, which is the actual source of the lingering badge.
 *
 * Safe no-op on web; never throws.
 */
export const clearAppBadge = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch {
    // ignore — badge clearing is best-effort
  }
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {
    // ignore
  }
};

