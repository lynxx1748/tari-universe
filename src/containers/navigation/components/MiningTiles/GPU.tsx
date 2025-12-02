import { useConfigMiningStore, useConfigPoolsStore, useMiningMetricsStore, useMiningStore } from '@app/store';
import MinerTile from './Miner';
import { useMiningPoolsStore } from '@app/store/useMiningPoolsStore';
import { useEffect, useRef, useMemo } from 'react';
import { setupStoreSelectors } from '@app/store/selectors/setupStoreSelectors';
import { useSetupStore } from '@app/store/useSetupStore';
import { getSelectedMiner } from '@app/store/selectors/minningStoreSelectors';

export default function GPUTile() {
    const gpuPoolStats = useMiningPoolsStore((s) => s.gpuPoolStats);
    const gpuRewards = useMiningPoolsStore((s) => s.gpuRewards);

    const statsRef = useRef(gpuPoolStats);
    const rewardsRef = useRef(gpuRewards);

    const gpuEnabled = useConfigMiningStore((s) => s.gpu_mining_enabled);
    const miningInitiated = useMiningStore((s) => s.isGpuMiningInitiated);
    const gpu_mining_status = useMiningMetricsStore((s) => s.gpu_mining_status);
    const isGpuPoolEnabled = useConfigPoolsStore((s) => s.gpu_pool_enabled);
    const selectedMiner = useMiningStore(getSelectedMiner);
    const { hash_rate, is_mining } = gpu_mining_status;

    useEffect(() => useMiningPoolsStore.subscribe((s) => (statsRef.current = s.gpuPoolStats)), []);
    useEffect(() => useMiningPoolsStore.subscribe((s) => (rewardsRef.current = s.gpuRewards)), []);

    const gpuMiningModuleState = useSetupStore(setupStoreSelectors.selectGpuMiningModule);

    // Infer GPU pool connection status from mining state and pool stats
    // GPU is considered connected if: mining is active with hashrate OR pool stats are being received
    const isGpuPoolConnected = useMemo(() => {
        if (!isGpuPoolEnabled) return undefined;
        // If mining with hashrate, we're connected
        if (is_mining && hash_rate > 0) return true;
        // If we have pool stats with accepted shares, we're connected
        if (statsRef.current && statsRef.current.accepted_shares >= 0) return true;
        // If mining initiated but no hashrate yet, status unknown (still connecting)
        if (miningInitiated && !is_mining) return undefined;
        return false;
    }, [isGpuPoolEnabled, is_mining, hash_rate, miningInitiated]);

    return (
        <MinerTile
            title="GPU"
            mainLabelKey="gpu-power"
            enabled={gpuEnabled}
            isMining={is_mining}
            isMiningInitiated={miningInitiated}
            hashRate={hash_rate}
            isPoolEnabled={isGpuPoolEnabled}
            poolStats={statsRef.current}
            rewardThreshold={statsRef.current?.min_payout || 2000000}
            showTooltip={true}
            progressDiff={rewardsRef.current?.rewardValue}
            unpaidFMT={rewardsRef.current?.unpaidFMT || '-'}
            minerModuleState={gpuMiningModuleState}
            algo={selectedMiner?.supported_algorithms?.[0]}
            isPoolConnected={isGpuPoolConnected}
        />
    );
}
