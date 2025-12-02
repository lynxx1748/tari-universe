import CpuMiningMarkup from './CpuMiningMarkup.tsx';
import GpuMiningMarkup from './GpuMiningMarkup.tsx';
import MineOnStartMarkup from './MineOnStartMarkup.tsx';
import GpuDevices from './GpuDevices.tsx';
import GpuEngine from './GpuEngine.tsx';
import GpuMiners from './GpuMiners.tsx';
import PauseOnBatteryModeMarkup from './PauseOnBatteryMode.tsx';
import HardwareStatus from './HardwareStatus.tsx';

export const MiningSettings = () => {
    return (
        <>
            <HardwareStatus />
            <CpuMiningMarkup />
            <GpuMiningMarkup />
            <GpuMiners />
            <GpuEngine />
            <GpuDevices />
            <MineOnStartMarkup />
            <PauseOnBatteryModeMarkup />
        </>
    );
};
