import { useEffect, useRef } from 'react';
import { useMiningMetricsStore, useConfigUIStore } from '@app/store';
import { useMiningPoolsStore } from '@app/store/useMiningPoolsStore';
import { useAchievementsStore } from '@app/store/useAchievementsStore';

/**
 * Hook that tracks mining activity and updates achievements accordingly.
 * Should be used once at the app level.
 */
export function useAchievementTracker() {
    const initializeAchievements = useAchievementsStore((s) => s.initializeAchievements);
    const initialized = useAchievementsStore((s) => s.initialized);
    const incrementShares = useAchievementsStore((s) => s.incrementShares);
    const addEarnings = useAchievementsStore((s) => s.addEarnings);
    const addMiningTime = useAchievementsStore((s) => s.addMiningTime);
    const updateHashrate = useAchievementsStore((s) => s.updateHashrate);
    const recordSession = useAchievementsStore((s) => s.recordSession);
    const recordDailyStats = useAchievementsStore((s) => s.recordDailyStats);
    const unlockAchievement = useAchievementsStore((s) => s.unlockAchievement);

    const cpuMiningStatus = useMiningMetricsStore((s) => s.cpu_mining_status);
    const gpuMiningStatus = useMiningMetricsStore((s) => s.gpu_mining_status);
    const cpuPoolStats = useMiningPoolsStore((s) => s.cpuPoolStats);
    const gpuPoolStats = useMiningPoolsStore((s) => s.gpuPoolStats);
    const performanceMode = useConfigUIStore((s) => s.performance_mode);

    // Refs to track previous values
    const prevCpuShares = useRef<number>(0);
    const prevGpuShares = useRef<number>(0);
    const prevCpuReward = useRef<number>(0);
    const prevGpuReward = useRef<number>(0);
    const isMiningRef = useRef<boolean>(false);
    const miningIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const sessionRecordedRef = useRef<boolean>(false);

    // Initialize achievements on mount
    useEffect(() => {
        if (!initialized) {
            initializeAchievements();
        }
    }, [initialized, initializeAchievements]);

    // Track performance mode achievement
    useEffect(() => {
        if (performanceMode && initialized) {
            unlockAchievement('performance_mode');
        }
    }, [performanceMode, initialized, unlockAchievement]);

    // Track mining sessions
    useEffect(() => {
        const isMining = cpuMiningStatus.is_mining || gpuMiningStatus.is_mining;

        // Started mining - record session
        if (isMining && !isMiningRef.current && !sessionRecordedRef.current) {
            recordSession();
            sessionRecordedRef.current = true;
        }

        // Stopped mining - reset for next session
        if (!isMining && isMiningRef.current) {
            sessionRecordedRef.current = false;
        }

        isMiningRef.current = isMining;
    }, [cpuMiningStatus.is_mining, gpuMiningStatus.is_mining, recordSession]);

    // Track mining time
    useEffect(() => {
        const isMining = cpuMiningStatus.is_mining || gpuMiningStatus.is_mining;

        if (isMining) {
            // Update mining time every 10 seconds
            miningIntervalRef.current = setInterval(() => {
                addMiningTime(10);
                recordDailyStats({ miningSeconds: 10 });
            }, 10000);
        }

        return () => {
            if (miningIntervalRef.current) {
                clearInterval(miningIntervalRef.current);
                miningIntervalRef.current = null;
            }
        };
    }, [cpuMiningStatus.is_mining, gpuMiningStatus.is_mining, addMiningTime, recordDailyStats]);

    // Track hashrate
    useEffect(() => {
        const totalHashrate = cpuMiningStatus.hash_rate + gpuMiningStatus.hash_rate;
        if (totalHashrate > 0) {
            updateHashrate(totalHashrate);
            recordDailyStats({ peakHashrate: totalHashrate });
        }
    }, [cpuMiningStatus.hash_rate, gpuMiningStatus.hash_rate, updateHashrate, recordDailyStats]);

    // Track CPU pool stats (shares)
    useEffect(() => {
        if (cpuPoolStats?.accepted_shares !== undefined) {
            const currentShares = cpuPoolStats.accepted_shares;
            const newShares = currentShares - prevCpuShares.current;

            if (newShares > 0 && prevCpuShares.current > 0) {
                incrementShares(newShares);
                recordDailyStats({ sharesSubmitted: newShares });
            }

            prevCpuShares.current = currentShares;
        }
    }, [cpuPoolStats?.accepted_shares, incrementShares, recordDailyStats]);

    // Track GPU pool stats (shares)
    useEffect(() => {
        if (gpuPoolStats?.accepted_shares !== undefined) {
            const currentShares = gpuPoolStats.accepted_shares;
            const newShares = currentShares - prevGpuShares.current;

            if (newShares > 0 && prevGpuShares.current > 0) {
                incrementShares(newShares);
                recordDailyStats({ sharesSubmitted: newShares });
            }

            prevGpuShares.current = currentShares;
        }
    }, [gpuPoolStats?.accepted_shares, incrementShares, recordDailyStats]);

    // Track earnings from estimated_earnings
    useEffect(() => {
        const cpuEarnings = cpuMiningStatus.estimated_earnings || 0;
        const gpuEarnings = gpuMiningStatus.estimated_earnings || 0;

        // CPU earnings delta
        if (cpuEarnings > prevCpuReward.current && prevCpuReward.current > 0) {
            const delta = cpuEarnings - prevCpuReward.current;
            // Convert from micro units if needed (adjust based on actual unit)
            const xtmDelta = delta / 1_000_000;
            if (xtmDelta > 0) {
                addEarnings(xtmDelta);
                recordDailyStats({ xtmEarned: xtmDelta });
            }
        }
        prevCpuReward.current = cpuEarnings;

        // GPU earnings delta
        if (gpuEarnings > prevGpuReward.current && prevGpuReward.current > 0) {
            const delta = gpuEarnings - prevGpuReward.current;
            const xtmDelta = delta / 1_000_000;
            if (xtmDelta > 0) {
                addEarnings(xtmDelta);
                recordDailyStats({ xtmEarned: xtmDelta });
            }
        }
        prevGpuReward.current = gpuEarnings;
    }, [cpuMiningStatus.estimated_earnings, gpuMiningStatus.estimated_earnings, addEarnings, recordDailyStats]);
}

export default useAchievementTracker;

