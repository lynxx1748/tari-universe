import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Achievement Categories
export type AchievementCategory = 'mining' | 'earnings' | 'time' | 'social' | 'special';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    rarity: AchievementRarity;
    icon: string; // emoji or icon name
    requirement: number;
    unlockedAt?: number; // timestamp when unlocked
    progress?: number; // current progress toward requirement
}

export interface MiningStats {
    totalSharesSubmitted: number;
    totalXtmEarned: number;
    totalMiningSeconds: number;
    longestStreakDays: number;
    currentStreakDays: number;
    lastMiningDate?: string; // YYYY-MM-DD
    bestHashrate: number;
    totalBlocksFound: number;
    firstMiningDate?: string;
    sessionsCount: number;
    // Daily tracking
    dailyStats: Record<string, DailyStats>;
}

export interface DailyStats {
    date: string;
    sharesSubmitted: number;
    xtmEarned: number;
    miningSeconds: number;
    avgHashrate: number;
    peakHashrate: number;
}

// Achievement definitions
export const ACHIEVEMENTS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
    // Mining Milestones
    {
        id: 'first_share',
        name: 'First Share',
        description: 'Submit your first mining share',
        category: 'mining',
        rarity: 'common',
        icon: '⛏️',
        requirement: 1,
    },
    {
        id: 'century_club',
        name: 'Century Club',
        description: 'Submit 100 accepted shares',
        category: 'mining',
        rarity: 'common',
        icon: '💯',
        requirement: 100,
    },
    {
        id: 'thousand_shares',
        name: 'Share Master',
        description: 'Submit 1,000 accepted shares',
        category: 'mining',
        rarity: 'uncommon',
        icon: '🎯',
        requirement: 1000,
    },
    {
        id: 'ten_thousand_shares',
        name: 'Share Legend',
        description: 'Submit 10,000 accepted shares',
        category: 'mining',
        rarity: 'rare',
        icon: '🏆',
        requirement: 10000,
    },
    {
        id: 'hundred_thousand_shares',
        name: 'Share God',
        description: 'Submit 100,000 accepted shares',
        category: 'mining',
        rarity: 'epic',
        requirement: 100000,
        icon: '👑',
    },

    // Hashrate Achievements
    {
        id: 'hash_novice',
        name: 'Hash Novice',
        description: 'Reach 1 KH/s hashrate',
        category: 'mining',
        rarity: 'common',
        icon: '🔥',
        requirement: 1000,
    },
    {
        id: 'hash_apprentice',
        name: 'Hash Apprentice',
        description: 'Reach 10 KH/s hashrate',
        category: 'mining',
        rarity: 'uncommon',
        icon: '🔥',
        requirement: 10000,
    },
    {
        id: 'hash_master',
        name: 'Hash Master',
        description: 'Reach 100 KH/s hashrate',
        category: 'mining',
        rarity: 'rare',
        icon: '🔥',
        requirement: 100000,
    },
    {
        id: 'hash_legend',
        name: 'Hash Legend',
        description: 'Reach 1 MH/s hashrate',
        category: 'mining',
        rarity: 'epic',
        icon: '⚡',
        requirement: 1000000,
    },

    // Time-based Achievements
    {
        id: 'first_hour',
        name: 'Getting Started',
        description: 'Mine for 1 hour total',
        category: 'time',
        rarity: 'common',
        icon: '⏰',
        requirement: 3600,
    },
    {
        id: 'day_miner',
        name: 'Day Miner',
        description: 'Mine for 24 hours total',
        category: 'time',
        rarity: 'common',
        icon: '📅',
        requirement: 86400,
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Mine for 168 hours (1 week) total',
        category: 'time',
        rarity: 'uncommon',
        icon: '📆',
        requirement: 604800,
    },
    {
        id: 'month_master',
        name: 'Month Master',
        description: 'Mine for 720 hours (1 month) total',
        category: 'time',
        rarity: 'rare',
        icon: '🗓️',
        requirement: 2592000,
    },
    {
        id: 'streak_3',
        name: 'Consistent Miner',
        description: 'Mine 3 days in a row',
        category: 'time',
        rarity: 'common',
        icon: '🔗',
        requirement: 3,
    },
    {
        id: 'streak_7',
        name: 'Weekly Warrior',
        description: 'Mine 7 days in a row',
        category: 'time',
        rarity: 'uncommon',
        icon: '⛓️',
        requirement: 7,
    },
    {
        id: 'streak_30',
        name: 'Diamond Hands',
        description: 'Mine 30 days in a row',
        category: 'time',
        rarity: 'epic',
        icon: '💎',
        requirement: 30,
    },

    // Earnings Achievements
    {
        id: 'first_xtm',
        name: 'First Earnings',
        description: 'Earn your first XTM',
        category: 'earnings',
        rarity: 'common',
        icon: '💰',
        requirement: 0.000001, // micro XTM
    },
    {
        id: 'ten_xtm',
        name: 'Double Digits',
        description: 'Earn 10 XTM total',
        category: 'earnings',
        rarity: 'common',
        icon: '💵',
        requirement: 10,
    },
    {
        id: 'hundred_xtm',
        name: 'Triple Digits',
        description: 'Earn 100 XTM total',
        category: 'earnings',
        rarity: 'uncommon',
        icon: '💴',
        requirement: 100,
    },
    {
        id: 'thousand_xtm',
        name: 'Thousandaire',
        description: 'Earn 1,000 XTM total',
        category: 'earnings',
        rarity: 'rare',
        icon: '💎',
        requirement: 1000,
    },
    {
        id: 'ten_thousand_xtm',
        name: 'XTM Whale',
        description: 'Earn 10,000 XTM total',
        category: 'earnings',
        rarity: 'epic',
        icon: '🐋',
        requirement: 10000,
    },

    // Special Achievements
    {
        id: 'performance_mode',
        name: 'Efficiency Expert',
        description: 'Enable Performance Mode',
        category: 'special',
        rarity: 'common',
        icon: '⚡',
        requirement: 1,
    },
    {
        id: 'first_session',
        name: 'Welcome Miner',
        description: 'Complete your first mining session',
        category: 'special',
        rarity: 'common',
        icon: '👋',
        requirement: 1,
    },
    {
        id: 'ten_sessions',
        name: 'Regular Miner',
        description: 'Complete 10 mining sessions',
        category: 'special',
        rarity: 'uncommon',
        icon: '🔄',
        requirement: 10,
    },
    {
        id: 'hundred_sessions',
        name: 'Dedicated Miner',
        description: 'Complete 100 mining sessions',
        category: 'special',
        rarity: 'rare',
        icon: '🎖️',
        requirement: 100,
    },
];

interface AchievementsState {
    achievements: Record<string, Achievement>;
    stats: MiningStats;
    recentUnlocks: string[]; // IDs of recently unlocked achievements (for notifications)
    initialized: boolean;
}

interface AchievementsActions {
    initializeAchievements: () => void;
    updateStats: (updates: Partial<MiningStats>) => void;
    incrementShares: (count: number) => void;
    addEarnings: (amount: number) => void;
    addMiningTime: (seconds: number) => void;
    updateHashrate: (hashrate: number) => void;
    recordSession: () => void;
    updateStreak: () => void;
    unlockAchievement: (id: string) => void;
    checkAchievements: () => string[]; // Returns newly unlocked achievement IDs
    clearRecentUnlocks: () => void;
    recordDailyStats: (stats: Partial<DailyStats>) => void;
}

const initialStats: MiningStats = {
    totalSharesSubmitted: 0,
    totalXtmEarned: 0,
    totalMiningSeconds: 0,
    longestStreakDays: 0,
    currentStreakDays: 0,
    bestHashrate: 0,
    totalBlocksFound: 0,
    sessionsCount: 0,
    dailyStats: {},
};

export const useAchievementsStore = create<AchievementsState & AchievementsActions>()(
    persist(
        (set, get) => ({
            achievements: {},
            stats: initialStats,
            recentUnlocks: [],
            initialized: false,

            initializeAchievements: () => {
                const current = get().achievements;
                const updated: Record<string, Achievement> = {};

                ACHIEVEMENTS.forEach((def) => {
                    if (current[def.id]) {
                        // Preserve existing progress and unlock status
                        updated[def.id] = { ...def, ...current[def.id] };
                    } else {
                        updated[def.id] = { ...def, progress: 0 };
                    }
                });

                set({ achievements: updated, initialized: true });
            },

            updateStats: (updates) => {
                set((state) => ({
                    stats: { ...state.stats, ...updates },
                }));
                get().checkAchievements();
            },

            incrementShares: (count) => {
                set((state) => ({
                    stats: {
                        ...state.stats,
                        totalSharesSubmitted: state.stats.totalSharesSubmitted + count,
                    },
                }));
                get().checkAchievements();
            },

            addEarnings: (amount) => {
                set((state) => ({
                    stats: {
                        ...state.stats,
                        totalXtmEarned: state.stats.totalXtmEarned + amount,
                    },
                }));
                get().checkAchievements();
            },

            addMiningTime: (seconds) => {
                set((state) => ({
                    stats: {
                        ...state.stats,
                        totalMiningSeconds: state.stats.totalMiningSeconds + seconds,
                    },
                }));
                get().checkAchievements();
            },

            updateHashrate: (hashrate) => {
                set((state) => ({
                    stats: {
                        ...state.stats,
                        bestHashrate: Math.max(state.stats.bestHashrate, hashrate),
                    },
                }));
                get().checkAchievements();
            },

            recordSession: () => {
                set((state) => ({
                    stats: {
                        ...state.stats,
                        sessionsCount: state.stats.sessionsCount + 1,
                        firstMiningDate: state.stats.firstMiningDate || new Date().toISOString().split('T')[0],
                    },
                }));
                get().updateStreak();
                get().checkAchievements();
            },

            updateStreak: () => {
                const today = new Date().toISOString().split('T')[0];
                const { lastMiningDate, currentStreakDays, longestStreakDays } = get().stats;

                if (!lastMiningDate) {
                    set((state) => ({
                        stats: {
                            ...state.stats,
                            currentStreakDays: 1,
                            longestStreakDays: Math.max(1, longestStreakDays),
                            lastMiningDate: today,
                        },
                    }));
                    return;
                }

                if (lastMiningDate === today) return; // Already recorded today

                const lastDate = new Date(lastMiningDate);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day
                    const newStreak = currentStreakDays + 1;
                    set((state) => ({
                        stats: {
                            ...state.stats,
                            currentStreakDays: newStreak,
                            longestStreakDays: Math.max(newStreak, longestStreakDays),
                            lastMiningDate: today,
                        },
                    }));
                } else {
                    // Streak broken
                    set((state) => ({
                        stats: {
                            ...state.stats,
                            currentStreakDays: 1,
                            lastMiningDate: today,
                        },
                    }));
                }
            },

            unlockAchievement: (id) => {
                const achievement = get().achievements[id];
                if (!achievement || achievement.unlockedAt) return;

                set((state) => ({
                    achievements: {
                        ...state.achievements,
                        [id]: {
                            ...achievement,
                            unlockedAt: Date.now(),
                        },
                    },
                    recentUnlocks: [...state.recentUnlocks, id],
                }));
            },

            checkAchievements: () => {
                const { stats, achievements } = get();
                const newUnlocks: string[] = [];

                // Check share achievements
                const shareAchievements = ['first_share', 'century_club', 'thousand_shares', 'ten_thousand_shares', 'hundred_thousand_shares'];
                shareAchievements.forEach((id) => {
                    const ach = achievements[id];
                    if (ach && !ach.unlockedAt && stats.totalSharesSubmitted >= ach.requirement) {
                        get().unlockAchievement(id);
                        newUnlocks.push(id);
                    }
                });

                // Check hashrate achievements
                const hashAchievements = ['hash_novice', 'hash_apprentice', 'hash_master', 'hash_legend'];
                hashAchievements.forEach((id) => {
                    const ach = achievements[id];
                    if (ach && !ach.unlockedAt && stats.bestHashrate >= ach.requirement) {
                        get().unlockAchievement(id);
                        newUnlocks.push(id);
                    }
                });

                // Check time achievements
                const timeAchievements = ['first_hour', 'day_miner', 'week_warrior', 'month_master'];
                timeAchievements.forEach((id) => {
                    const ach = achievements[id];
                    if (ach && !ach.unlockedAt && stats.totalMiningSeconds >= ach.requirement) {
                        get().unlockAchievement(id);
                        newUnlocks.push(id);
                    }
                });

                // Check streak achievements
                const streakAchievements = ['streak_3', 'streak_7', 'streak_30'];
                streakAchievements.forEach((id) => {
                    const ach = achievements[id];
                    if (ach && !ach.unlockedAt && stats.longestStreakDays >= ach.requirement) {
                        get().unlockAchievement(id);
                        newUnlocks.push(id);
                    }
                });

                // Check earnings achievements
                const earningsAchievements = ['first_xtm', 'ten_xtm', 'hundred_xtm', 'thousand_xtm', 'ten_thousand_xtm'];
                earningsAchievements.forEach((id) => {
                    const ach = achievements[id];
                    if (ach && !ach.unlockedAt && stats.totalXtmEarned >= ach.requirement) {
                        get().unlockAchievement(id);
                        newUnlocks.push(id);
                    }
                });

                // Check session achievements
                const sessionAchievements = ['first_session', 'ten_sessions', 'hundred_sessions'];
                sessionAchievements.forEach((id) => {
                    const ach = achievements[id];
                    if (ach && !ach.unlockedAt && stats.sessionsCount >= ach.requirement) {
                        get().unlockAchievement(id);
                        newUnlocks.push(id);
                    }
                });

                return newUnlocks;
            },

            clearRecentUnlocks: () => {
                set({ recentUnlocks: [] });
            },

            recordDailyStats: (dailyUpdate) => {
                const today = new Date().toISOString().split('T')[0];
                set((state) => {
                    const existing = state.stats.dailyStats[today] || {
                        date: today,
                        sharesSubmitted: 0,
                        xtmEarned: 0,
                        miningSeconds: 0,
                        avgHashrate: 0,
                        peakHashrate: 0,
                    };

                    return {
                        stats: {
                            ...state.stats,
                            dailyStats: {
                                ...state.stats.dailyStats,
                                [today]: {
                                    ...existing,
                                    ...dailyUpdate,
                                    sharesSubmitted: existing.sharesSubmitted + (dailyUpdate.sharesSubmitted || 0),
                                    xtmEarned: existing.xtmEarned + (dailyUpdate.xtmEarned || 0),
                                    miningSeconds: existing.miningSeconds + (dailyUpdate.miningSeconds || 0),
                                    peakHashrate: Math.max(existing.peakHashrate, dailyUpdate.peakHashrate || 0),
                                },
                            },
                        },
                    };
                });
            },
        }),
        {
            name: 'tari-achievements',
            partialize: (state) => ({
                achievements: state.achievements,
                stats: state.stats,
            }),
        }
    )
);

// Selectors
export const selectUnlockedAchievements = (state: AchievementsState) =>
    Object.values(state.achievements).filter((a) => a.unlockedAt);

export const selectLockedAchievements = (state: AchievementsState) =>
    Object.values(state.achievements).filter((a) => !a.unlockedAt);

export const selectAchievementsByCategory = (state: AchievementsState, category: AchievementCategory) =>
    Object.values(state.achievements).filter((a) => a.category === category);

export const selectAchievementProgress = (state: AchievementsState) => {
    const total = Object.keys(state.achievements).length;
    const unlocked = Object.values(state.achievements).filter((a) => a.unlockedAt).length;
    return { total, unlocked, percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0 };
};

