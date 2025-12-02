import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@app/components/elements/Typography';
import {
    SettingsGroup,
    SettingsGroupContent,
    SettingsGroupTitle,
    SettingsGroupWrapper,
} from '../../components/SettingsGroup.styles';
import { useMiningMetricsStore } from '@app/store/useMiningMetricsStore.ts';
import { useConfigMiningStore } from '@app/store/useAppConfigStore.ts';
import { useMiningStore } from '@app/store/useMiningStore.ts';
import { formatHashrate } from '@app/utils/formatters';
import { getSelectedMiner } from '@app/store/selectors/minningStoreSelectors';

const StatusGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
`;

const StatusCard = styled.div<{ $isActive?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-radius: 10px;
    background: ${({ theme }) => theme.palette.background.accent};
    border: 1px solid ${({ theme, $isActive }) => 
        $isActive ? 'rgba(49, 238, 170, 0.3)' : theme.palette.divider};
`;

const StatusHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StatusLabel = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const StatusIndicator = styled.span<{ $status: 'active' | 'idle' | 'disabled' }>`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    
    ${({ $status }) => {
        switch ($status) {
            case 'active':
                return `
                    background: rgba(49, 238, 170, 0.15);
                    color: #31eeaa;
                `;
            case 'idle':
                return `
                    background: rgba(243, 193, 28, 0.15);
                    color: #f3c11c;
                `;
            case 'disabled':
                return `
                    background: rgba(239, 68, 68, 0.15);
                    color: #ef4444;
                `;
        }
    }}

    &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
    }
`;

const MetricRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MetricLabel = styled.span`
    font-size: 11px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;

const MetricValue = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.primary};
    font-family: 'IBM Plex Mono', monospace;
`;

const DeviceList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
`;

const DeviceName = styled.span`
    font-size: 11px;
    color: ${({ theme }) => theme.palette.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const MinerBadge = styled.span`
    font-size: 9px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${({ theme }) => theme.palette.divider};
    color: ${({ theme }) => theme.palette.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const HardwareStatus = memo(function HardwareStatus() {
    const { t } = useTranslation(['settings', 'mining-view'], { useSuspense: false });
    
    const gpuDevices = useMiningMetricsStore((s) => s.gpu_devices);
    const gpuMiningStatus = useMiningMetricsStore((s) => s.gpu_mining_status);
    const cpuMiningStatus = useMiningMetricsStore((s) => s.cpu_mining_status);
    
    const cpuEnabled = useConfigMiningStore((s) => s.cpu_mining_enabled);
    const gpuEnabled = useConfigMiningStore((s) => s.gpu_mining_enabled);
    const selectedMiner = useMiningStore(getSelectedMiner);

    const getCpuStatus = () => {
        if (!cpuEnabled) return 'disabled';
        if (cpuMiningStatus.is_mining) return 'active';
        return 'idle';
    };

    const getGpuStatus = () => {
        if (!gpuEnabled) return 'disabled';
        if (gpuMiningStatus.is_mining) return 'active';
        return 'idle';
    };

    const getStatusLabel = (status: 'active' | 'idle' | 'disabled') => {
        switch (status) {
            case 'active': return t('mining', { ns: 'mining-view' });
            case 'idle': return t('idle', 'Idle');
            case 'disabled': return t('disabled', 'Disabled');
        }
    };

    const cpuHashrate = formatHashrate(cpuMiningStatus.hash_rate);
    const gpuHashrate = formatHashrate(gpuMiningStatus.hash_rate);

    return (
        <SettingsGroupWrapper>
            <SettingsGroup>
                <SettingsGroupContent>
                    <SettingsGroupTitle>
                        <Typography variant="h6">{t('hardware-status')}</Typography>
                    </SettingsGroupTitle>
                </SettingsGroupContent>
            </SettingsGroup>
            
            <StatusGrid>
                <StatusCard $isActive={cpuMiningStatus.is_mining}>
                    <StatusHeader>
                        <StatusLabel>CPU</StatusLabel>
                        <StatusIndicator $status={getCpuStatus()}>
                            {getStatusLabel(getCpuStatus())}
                        </StatusIndicator>
                    </StatusHeader>
                    
                    <MetricRow>
                        <MetricLabel>{t('hashrate', 'Hashrate')}</MetricLabel>
                        <MetricValue>
                            {cpuMiningStatus.is_mining ? `${cpuHashrate.value} ${cpuHashrate.unit}` : '-'}
                        </MetricValue>
                    </MetricRow>
                    
                    {cpuMiningStatus.connection && (
                        <MetricRow>
                            <MetricLabel>{t('pool-status', 'Pool')}</MetricLabel>
                            <MetricValue style={{ color: cpuMiningStatus.connection.is_connected ? '#31eeaa' : '#ef4444' }}>
                                {cpuMiningStatus.connection.is_connected ? '● Connected' : '○ Disconnected'}
                            </MetricValue>
                        </MetricRow>
                    )}
                </StatusCard>

                <StatusCard $isActive={gpuMiningStatus.is_mining}>
                    <StatusHeader>
                        <StatusLabel>GPU</StatusLabel>
                        <StatusIndicator $status={getGpuStatus()}>
                            {getStatusLabel(getGpuStatus())}
                        </StatusIndicator>
                    </StatusHeader>
                    
                    <MetricRow>
                        <MetricLabel>{t('hashrate', 'Hashrate')}</MetricLabel>
                        <MetricValue>
                            {gpuMiningStatus.is_mining ? `${gpuHashrate.value} ${gpuHashrate.unit}` : '-'}
                        </MetricValue>
                    </MetricRow>

                    {selectedMiner && (
                        <MetricRow>
                            <MetricLabel>{t('miner', 'Miner')}</MetricLabel>
                            <MetricValue style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {selectedMiner.miner_type}
                                {selectedMiner.supported_algorithms?.map((algo) => (
                                    <MinerBadge key={algo}>{algo}</MinerBadge>
                                ))}
                            </MetricValue>
                        </MetricRow>
                    )}
                    
                    {gpuDevices.length > 0 && (
                        <DeviceList>
                            {gpuDevices.map((device) => (
                                <DeviceName key={device.device_id} title={device.name}>
                                    {device.name}
                                </DeviceName>
                            ))}
                        </DeviceList>
                    )}
                </StatusCard>
            </StatusGrid>
        </SettingsGroupWrapper>
    );
});

export default HardwareStatus;

